import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../models/message.dart';

class ApiService {
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }

  static Future<Map<String, String>> getHeaders() async {
    final token = await getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  static Future<List<MessageModel>> fetchConversation(String userId) async {
    try {
      final headers = await getHeaders();
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/messages/$userId'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final List data = json.decode(response.body);
        return data.map((item) => MessageModel.fromJson(item)).toList();
      }
    } catch (e) {
      print('Fetch messages error: $e');
    }
    return [];
  }

  static Future<MessageModel?> sendMessage(String userId, String text, {Map<String, dynamic>? attachment}) async {
    try {
      final headers = await getHeaders();
      final body = json.encode({
        'text': text,
        if (attachment != null) 'attachment': attachment,
      });

      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/messages/$userId'),
        headers: headers,
        body: body,
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = json.decode(response.body);
        return MessageModel.fromJson(data);
      }
    } catch (e) {
      print('Send message error: $e');
    }
    return null;
  }
}
