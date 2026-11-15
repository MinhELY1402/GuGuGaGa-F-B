import 'dart:async';
import 'dart:io' show Platform;

import 'package:flutter/foundation.dart' show kIsWeb;

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

/// Địa chỉ backend có thể đổi lúc chạy (dùng cho bản thử nghiệm qua Cloudflare Quick Tunnel,
/// URL *.trycloudflare.com thay đổi mỗi lần bật lại tunnel).
/// Giá trị lưu ở SharedPreferences được ưu tiên hơn BASE_URL trong .env.
class ServerConfig {
  static const _prefsKey = 'serverBaseUrl';
  static String? override;

  static Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString(_prefsKey);
    override = (saved != null && saved.isNotEmpty) ? saved : null;
  }

  /// Chuẩn hoá: bỏ khoảng trắng và dấu "/" cuối, thêm https:// và hậu tố /api nếu thiếu.
  static String normalize(String input) {
    var url = input.trim();
    while (url.endsWith('/')) {
      url = url.substring(0, url.length - 1);
    }
    if (url.isEmpty) return url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://$url';
    }
    if (!url.endsWith('/api')) url = '$url/api';
    return url;
  }

  static Future<void> save(String baseUrl) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefsKey, baseUrl);
    override = baseUrl;
  }

  static Future<void> reset() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_prefsKey);
    override = null;
  }

  /// Gọi GET <server>/health; true nếu server trả 200.
  static Future<bool> ping(String baseUrl) async {
    try {
      final root = baseUrl.endsWith('/api')
          ? baseUrl.substring(0, baseUrl.length - 4)
          : baseUrl;
      final res = await http
          .get(Uri.parse('$root/health'))
          .timeout(const Duration(seconds: 8));
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }
}

/// Hộp thoại nhập địa chỉ server.
Future<void> showServerDialog(BuildContext context, String currentUrl,
    {String? message}) {
  final controller = TextEditingController(text: currentUrl);
  String? status = message;
  bool busy = false;

  return showDialog<void>(
    context: context,
    builder: (ctx) => StatefulBuilder(
      builder: (ctx, setState) => AlertDialog(
        title: const Text('Địa chỉ server'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Dán URL backend do nhóm phát triển cung cấp, '
              'ví dụ: https://abc-xyz.trycloudflare.com',
              style: TextStyle(fontSize: 13),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: controller,
              keyboardType: TextInputType.url,
              autocorrect: false,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'https://....trycloudflare.com',
              ),
            ),
            if (status != null) ...[
              const SizedBox(height: 10),
              Text(status!, style: const TextStyle(fontSize: 13)),
            ],
          ],
        ),
        actions: [
          TextButton(
            onPressed: busy ? null : () => Navigator.of(ctx).pop(),
            child: const Text('Đóng'),
          ),
          FilledButton(
            onPressed: busy
                ? null
                : () async {
                    final url = ServerConfig.normalize(controller.text);
                    if (url.isEmpty) return;
                    setState(() {
                      busy = true;
                      status = 'Đang kiểm tra kết nối...';
                    });
                    final ok = await ServerConfig.ping(url);
                    if (ok) {
                      await ServerConfig.save(url);
                      if (ctx.mounted) Navigator.of(ctx).pop();
                    } else {
                      setState(() {
                        busy = false;
                        status = '❌ Không kết nối được tới $url. '
                            'Kiểm tra lại URL hoặc server đã bật chưa.';
                      });
                    }
                  },
            child: const Text('Lưu'),
          ),
        ],
      ),
    ),
  );
}

/// Bọc màn hình đầu tiên: nếu không kết nối được server thì hỏi URL mới,
/// sau đó dựng lại [builder] để các màn hình tải dữ liệu từ địa chỉ mới.
class ServerGate extends StatefulWidget {
  final String Function() currentUrl;
  final WidgetBuilder builder;
  const ServerGate({super.key, required this.currentUrl, required this.builder});

  @override
  State<ServerGate> createState() => _ServerGateState();
}

class _ServerGateState extends State<ServerGate> {
  int _generation = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _check());
  }

  Future<void> _check() async {
    // Không kiểm tra khi chạy widget test (mạng bị chặn trong flutter test).
    if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) return;
    final url = widget.currentUrl();
    if (await ServerConfig.ping(url)) return;
    if (!mounted) return;
    await showServerDialog(context, url,
        message: '⚠️ Không kết nối được server hiện tại ($url).');
    if (mounted) setState(() => _generation++);
  }

  @override
  Widget build(BuildContext context) =>
      KeyedSubtree(key: ValueKey(_generation), child: widget.builder(context));
}
