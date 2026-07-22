class MessageModel {
  final String id;
  final String sender;
  final String receiver;
  final String text;
  final String? attachmentUrl;
  final String? attachmentType;
  final String? attachmentName;
  final bool read;
  final DateTime createdAt;

  MessageModel({
    required this.id,
    required this.sender,
    required this.receiver,
    required this.text,
    this.attachmentUrl,
    this.attachmentType,
    this.attachmentName,
    this.read = false,
    required this.createdAt,
  });

  factory MessageModel.fromJson(Map<String, dynamic> json) {
    String senderId = '';
    if (json['sender'] is Map) {
      senderId = json['sender']['_id'] ?? json['sender']['id'] ?? '';
    } else {
      senderId = json['sender']?.toString() ?? '';
    }

    String receiverId = '';
    if (json['receiver'] is Map) {
      receiverId = json['receiver']['_id'] ?? json['receiver']['id'] ?? '';
    } else {
      receiverId = json['receiver']?.toString() ?? '';
    }

    Map<String, dynamic>? attach = json['attachment'] is Map ? json['attachment'] : null;

    return MessageModel(
      id: json['_id'] ?? json['id'] ?? '',
      sender: senderId,
      receiver: receiverId,
      text: json['text'] ?? '',
      attachmentUrl: attach?['url'],
      attachmentType: attach?['type'],
      attachmentName: attach?['name'],
      read: json['read'] ?? false,
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
    );
  }
}
