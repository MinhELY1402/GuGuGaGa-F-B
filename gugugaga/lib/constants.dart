import 'package:flutter/foundation.dart'
  show TargetPlatform, defaultTargetPlatform, kIsWeb;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'services/server_config.dart';

class AppConstants {
  static String get mapboxAccessToken => dotenv.env['MAPBOX_ACCESS_TOKEN'] ?? '';
  static String get openCageApiKey => dotenv.env['OPENCAGE_API_KEY'] ?? '';

  /// Ảnh nền bản đồ: dùng Mapbox nếu có token, nếu không thì OpenStreetMap (miễn phí, không cần key).
  static String get mapTileUrl => mapboxAccessToken.isNotEmpty
      ? 'https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=$mapboxAccessToken'
      : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  static String get baseUrl {
    final custom = ServerConfig.override;
    if (custom != null && custom.isNotEmpty) return custom;
    final envUrl = dotenv.env['BASE_URL'];
    if (kIsWeb) {
      if (envUrl != null && envUrl.isNotEmpty && !envUrl.contains('10.0.2.2')) {
        return envUrl;
      }
      return 'http://localhost:5000/api';
    }

    if (envUrl != null && envUrl.isNotEmpty) {
      return envUrl;
    }

    if (defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:5000/api';
    }

    return 'http://localhost:5000/api';
  }

  static String get geminiApiKey => dotenv.env['GEMINI_API_KEY'] ?? '';
}
