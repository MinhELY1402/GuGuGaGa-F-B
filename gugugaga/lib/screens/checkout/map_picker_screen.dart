import 'dart:convert';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import '../../constants.dart';

class MapPickerScreen extends StatefulWidget {
  const MapPickerScreen({super.key});

  @override
  State<MapPickerScreen> createState() => _MapPickerScreenState();
}

class _MapPickerScreenState extends State<MapPickerScreen> {
  final MapController _mapController = MapController();
  LatLng _currentCenter = const LatLng(10.762622, 106.660172); // Default: HCMC
  String _address = "Đang tải địa chỉ...";

  Timer? _debounce;
  bool _isLoading = false;
  TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
    _getAddressFromLatLng(_currentCenter);
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return;
    }

    Position position = await Geolocator.getCurrentPosition();
    if (mounted) {
      setState(() {
        _currentCenter = LatLng(position.latitude, position.longitude);
      });
    }
    _mapController.move(_currentCenter, 15);
    _getAddressFromLatLng(_currentCenter);
  }

  // Tra địa chỉ theo thứ tự: OpenCage (nếu có key) → Mapbox (nếu có token) → Nominatim (OpenStreetMap, miễn phí).
  static const _osmHeaders = {
    'User-Agent': 'GuGuGaGa/1.1 (VKU student project; com.example.GuGuGaGa)',
  };

  String _coordsText(LatLng p) =>
      'Vị trí đã chọn (${p.latitude.toStringAsFixed(5)}, ${p.longitude.toStringAsFixed(5)})';

  /// Trả về (địa chỉ, toạ độ) cho một truy vấn tìm kiếm, hoặc null nếu không thấy.
  Future<(String, LatLng)?> _geocode(String query) async {
    final key = AppConstants.openCageApiKey;
    if (key.isNotEmpty) {
      final res = await http
          .get(Uri.parse('https://api.opencagedata.com/geocode/v1/json'
              '?q=${Uri.encodeQueryComponent(query)}&key=$key&language=vi'))
          .timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        final r = json.decode(res.body)['results'];
        if (r != null && r.isNotEmpty) {
          return (
            r[0]['formatted'] as String,
            LatLng((r[0]['geometry']['lat'] as num).toDouble(),
                (r[0]['geometry']['lng'] as num).toDouble())
          );
        }
      }
      return null;
    }
    final mapbox = AppConstants.mapboxAccessToken;
    if (mapbox.isNotEmpty) {
      final res = await http
          .get(Uri.parse('https://api.mapbox.com/search/geocode/v6/forward'
              '?q=${Uri.encodeQueryComponent(query)}&country=vn&language=vi&limit=1'
              '&access_token=$mapbox'))
          .timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        final f = json.decode(res.body)['features'] as List?;
        if (f != null && f.isNotEmpty) {
          final c = f[0]['geometry']['coordinates'];
          return (
            (f[0]['properties']['full_address'] ?? f[0]['properties']['name']) as String,
            LatLng((c[1] as num).toDouble(), (c[0] as num).toDouble())
          );
        }
        return null;
      }
      // Mapbox lỗi (hết hạn mức, token sai...) → thử Nominatim bên dưới
    }
    final res = await http
        .get(
            Uri.parse('https://nominatim.openstreetmap.org/search?format=jsonv2'
                '&limit=1&countrycodes=vn&accept-language=vi'
                '&q=${Uri.encodeQueryComponent(query)}'),
            headers: _osmHeaders)
        .timeout(const Duration(seconds: 10));
    if (res.statusCode == 200) {
      final r = json.decode(res.body) as List;
      if (r.isNotEmpty) {
        return (
          r[0]['display_name'] as String,
          LatLng(double.parse(r[0]['lat']), double.parse(r[0]['lon']))
        );
      }
    }
    return null;
  }

  Future<String?> _reverseGeocode(LatLng p) async {
    final key = AppConstants.openCageApiKey;
    if (key.isNotEmpty) {
      final res = await http
          .get(Uri.parse('https://api.opencagedata.com/geocode/v1/json'
              '?q=${p.latitude}+${p.longitude}&key=$key&language=vi'))
          .timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        final r = json.decode(res.body)['results'];
        if (r != null && r.isNotEmpty) return r[0]['formatted'] as String;
      }
      return null;
    }
    final mapbox = AppConstants.mapboxAccessToken;
    if (mapbox.isNotEmpty) {
      final res = await http
          .get(Uri.parse('https://api.mapbox.com/search/geocode/v6/reverse'
              '?longitude=${p.longitude}&latitude=${p.latitude}&language=vi'
              '&access_token=$mapbox'))
          .timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        final f = json.decode(res.body)['features'] as List?;
        if (f != null && f.isNotEmpty) {
          return (f[0]['properties']['full_address'] ??
              f[0]['properties']['name']) as String?;
        }
        return null;
      }
      // Mapbox lỗi → thử Nominatim bên dưới
    }
    final res = await http
        .get(
            Uri.parse('https://nominatim.openstreetmap.org/reverse?format=jsonv2'
                '&lat=${p.latitude}&lon=${p.longitude}&accept-language=vi'),
            headers: _osmHeaders)
        .timeout(const Duration(seconds: 10));
    if (res.statusCode == 200) {
      return json.decode(res.body)['display_name'] as String?;
    }
    return null;
  }

  Future<void> _getAddressFromLatLng(LatLng point) async {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    // Nominatim giới hạn ~1 request/giây, nên chờ người dùng dừng kéo bản đồ.
    _debounce = Timer(const Duration(milliseconds: 1000), () async {
      if (mounted) setState(() => _isLoading = true);
      String address;
      try {
        address = await _reverseGeocode(point) ?? _coordsText(point);
      } catch (e) {
        debugPrint('Error fetching address: $e');
        address = _coordsText(point);
      }
      if (mounted) {
        setState(() {
          _address = address;
          _isLoading = false;
        });
      }
    });
  }

  Future<void> _searchAddress(String query) async {
    if (query.trim().isEmpty) return;
    if (mounted) setState(() => _isLoading = true);
    try {
      final result = await _geocode(query.trim());
      if (result != null) {
        final (address, newPos) = result;
        if (mounted) {
          setState(() {
            _currentCenter = newPos;
            _address = address;
          });
        }
        _mapController.move(newPos, 15);
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Không tìm thấy địa chỉ, hãy thử từ khoá khác hoặc kéo bản đồ.')),
        );
      }
    } catch (e) {
      debugPrint('Error searching address: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _onMapPositionChanged(MapCamera position, bool hasGesture) {
    if (hasGesture) {
      if (mounted) {
        setState(() {
          _currentCenter = position.center;
        });
      }
      _getAddressFromLatLng(_currentCenter);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Chọn vị trí giao hàng'),
        backgroundColor: Colors.red.shade700,
        foregroundColor: Colors.white,
      ),
      body: Stack(
        children: [
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: _currentCenter,
              initialZoom: 15.0,
              onPositionChanged: _onMapPositionChanged,
            ),
            children: [
              TileLayer(
                urlTemplate: AppConstants.mapTileUrl,
                userAgentPackageName: 'com.example.GuGuGaGa',
              ),
            ],
          ),
          // Center Pin
          const Center(
            child: Padding(
              padding: EdgeInsets.only(bottom: 40),
              child: Icon(
                Icons.location_on,
                size: 50,
                color: Colors.red,
              ),
            ),
          ),
          // Search Bar
          Positioned(
            top: 16,
            left: 16,
            right: 16,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 8,
                  ),
                ],
              ),
              child: TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: 'Tìm kiếm địa chỉ...',
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  suffixIcon: IconButton(
                    icon: const Icon(Icons.search),
                    onPressed: () => _searchAddress(_searchController.text),
                  ),
                ),
                onSubmitted: _searchAddress,
              ),
            ),
          ),
          // Bottom Info Panel
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(16),
                  topRight: Radius.circular(16),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 10,
                    offset: Offset(0, -2),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.location_on_outlined, color: Colors.grey),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _address,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (_isLoading)
                        const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context, {
                        'address': _address,
                        'latitude': _currentCenter.latitude,
                        'longitude': _currentCenter.longitude,
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red.shade700,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Xác nhận vị trí này',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Current Location Button
          Positioned(
            bottom: 180,
            right: 16,
            child: FloatingActionButton(
              onPressed: _getCurrentLocation,
              backgroundColor: Colors.white,
              child: Icon(Icons.my_location, color: Colors.red.shade700),
            ),
          ),
        ],
      ),
    );
  }
}
