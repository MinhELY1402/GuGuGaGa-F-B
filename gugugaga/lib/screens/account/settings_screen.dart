import 'package:flutter/material.dart';
import '../../constants.dart';
import '../../services/server_config.dart';

/// Phiên bản hiển thị trong màn Cài đặt (đồng bộ với `version` trong pubspec.yaml).
const String kAppVersionLabel = '1.1.0 (6)';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  Future<void> _changeServer() async {
    await showServerDialog(context, AppConstants.baseUrl);
    if (mounted) setState(() {}); // hiển thị lại địa chỉ mới
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cài đặt'),
        backgroundColor: Colors.red.shade700,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          const _SectionTitle('Kết nối'),
          ListTile(
            leading: const Icon(Icons.dns_outlined),
            title: const Text('Địa chỉ máy chủ'),
            subtitle: Text(AppConstants.baseUrl, maxLines: 2, overflow: TextOverflow.ellipsis),
            trailing: const Icon(Icons.chevron_right),
            onTap: _changeServer,
          ),
          const Divider(height: 1),
          const _SectionTitle('Thông tin ứng dụng'),
          const ListTile(
            leading: Icon(Icons.info_outline),
            title: Text('Phiên bản'),
            subtitle: Text(kAppVersionLabel),
          ),
          ListTile(
            leading: const Icon(Icons.description_outlined),
            title: const Text('Giấy phép mã nguồn mở'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => showLicensePage(
              context: context,
              applicationName: 'GuGuGaGa',
              applicationVersion: kAppVersionLabel,
            ),
          ),
          const Padding(
            padding: EdgeInsets.all(16),
            child: Text(
              'GuGuGaGa là sản phẩm của đồ án học phần Quản trị dự án phần mềm (VKU). '
              'Ứng dụng đang ở bản thử nghiệm.',
              style: TextStyle(color: Colors.grey),
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String text;
  const _SectionTitle(this.text);

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 4),
        child: Text(text, style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red.shade700)),
      );
}
