import 'package:flutter/material.dart';
import 'screens/chat_screen.dart';

void main() {
  runApp(const AlumniFlutterApp());
}

class AlumniFlutterApp extends StatelessWidget {
  const AlumniFlutterApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RVITM Alumni Network',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF003366),
        useMaterial3: true,
      ),
      home: const FlutterChatScreen(
        targetUserId: 'demo_user_1',
        targetUserName: 'Alumni Network Member',
        currentUserId: 'demo_current_user',
      ),
    );
  }
}
