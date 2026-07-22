class UserModel {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? profilePicture;
  final bool isApproved;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.profilePicture,
    this.isApproved = false,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? 'Alumni Member',
      email: json['email'] ?? '',
      role: json['role'] ?? 'Alumni',
      profilePicture: json['profilePicture'] ?? json['avatar_url'],
      isApproved: json['is_approved'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'name': name,
      'email': email,
      'role': role,
      'profilePicture': profilePicture,
      'is_approved': isApproved,
    };
  }
}
