import 'package:socket_io_client/socket_io_client.dart' as IO;
import '../config/api_config.dart';

class SocketService {
  static IO.Socket? socket;

  static void initSocket(String userId) {
    if (socket != null && socket!.connected) return;

    socket = IO.io(
      ApiConfig.socketUrl,
      IO.OptionBuilder()
          .setTransports(['websocket', 'polling'])
          .disableAutoConnect()
          .build(),
    );

    socket!.connect();

    socket!.onConnect((_) {
      print('[Flutter WSS] Connected to Socket.IO Server');
      socket!.emit('join_user_room', userId);
    });

    socket!.onDisconnect((_) {
      print('[Flutter WSS] Disconnected from Socket.IO Server');
    });
  }

  static void emitTyping(String senderId, String receiverId) {
    socket?.emit('typing', {'senderId': senderId, 'receiverId': receiverId});
  }

  static void emitStopTyping(String senderId, String receiverId) {
    socket?.emit('stop_typing', {'senderId': senderId, 'receiverId': receiverId});
  }

  static void disconnect() {
    socket?.disconnect();
    socket = null;
  }
}
