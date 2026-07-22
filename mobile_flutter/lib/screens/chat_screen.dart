import 'package:flutter/material.dart';
import '../models/message.dart';
import '../services/api_service.dart';
import '../services/socket_service.dart';

class FlutterChatScreen extends StatefulWidget {
  final String targetUserId;
  final String targetUserName;
  final String currentUserId;

  const FlutterChatScreen({
    Key? key,
    required this.targetUserId,
    required this.targetUserName,
    required this.currentUserId,
  }) : super(key: key);

  @override
  _FlutterChatScreenState createState() => _FlutterChatScreenState();
}

class _FlutterChatScreenState extends State<FlutterChatScreen> {
  final TextEditingController _textController = TextEditingController();
  List<MessageModel> _messages = [];
  bool _isLoading = true;
  bool _showAttachMenu = false;

  @override
  void initState() {
    super.initState();
    _loadMessages();
    SocketService.initSocket(widget.currentUserId);
  }

  Future<void> _loadMessages() async {
    final msgs = await ApiService.fetchConversation(widget.targetUserId);
    setState(() {
      _messages = msgs;
      _isLoading = false;
    });
  }

  Future<void> _handleSend() async {
    final text = _textController.text.trim();
    if (text.isEmpty) return;

    _textController.clear();
    final newMsg = await ApiService.sendMessage(widget.targetUserId, text);

    if (newMsg != null) {
      setState(() {
        _messages.add(newMsg);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF003366),
        title: Row(
          children: [
            CircleAvatar(
              backgroundColor: Colors.white24,
              child: Text(
                widget.targetUserName.isNotEmpty ? widget.targetUserName[0].toUpperCase() : 'A',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(widget.targetUserName, style: const TextStyle(fontSize: 16, color: Colors.white)),
                const Text('Online', style: TextStyle(fontSize: 12, color: Colors.greenAccent)),
              ],
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _messages.length,
                    itemBuilder: (context, index) {
                      final msg = _messages[index];
                      final isMe = msg.sender == widget.currentUserId;
                      return Align(
                        alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          decoration: BoxDecoration(
                            color: isMe ? const Color(0xFF003366) : Colors.grey[200],
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Text(
                            msg.text,
                            style: TextStyle(color: isMe ? Colors.white : Colors.black87),
                          ),
                        ),
                      );
                    },
                  ),
          ),

          if (_showAttachMenu)
            Container(
              color: Colors.white,
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.description, color: Colors.grey),
                    title: const Text('Send a document'),
                    onTap: () => setState(() => _showAttachMenu = false),
                  ),
                  ListTile(
                    leading: const Icon(Icons.camera_alt, color: Colors.grey),
                    title: const Text('Take a photo or video'),
                    onTap: () => setState(() => _showAttachMenu = false),
                  ),
                  ListTile(
                    leading: const Icon(Icons.photo_library, color: Colors.grey),
                    title: const Text('Select media from library'),
                    onTap: () => setState(() => _showAttachMenu = false),
                  ),
                ],
              ),
            ),

          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
            color: Colors.white,
            child: Row(
              children: [
                IconButton(
                  icon: Icon(_showAttachMenu ? Icons.close : Icons.attach_file, color: Colors.blueGrey),
                  onPressed: () => setState(() => _showAttachMenu = !_showAttachMenu),
                ),
                Expanded(
                  child: TextField(
                    controller: _textController,
                    decoration: InputDecoration(
                      hintText: 'Write a message...',
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      filled: true,
                      fillColor: Colors.grey[100],
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 6),
                IconButton(
                  icon: const Icon(Icons.send, color: Color(0xFF003366)),
                  onPressed: _handleSend,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
