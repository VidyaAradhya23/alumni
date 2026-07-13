const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    institution: { type: String },
    password: { type: String },
    branch: { type: String },
    department: { type: String },
    batchYear: { type: String },
    joiningYear: { type: String },
    company: { type: String },
    designation: { type: String },
    location: { type: String },
    profilePicture: { type: String },
    bio: { type: String },
    linkedin: { type: String },
    avatar_url: { type: String },
    role: { type: String, enum: ['Alumni', 'Admin', 'Super Admin'], default: 'Alumni' },
    is_approved: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    authProvider: { type: String, default: 'local' },
    providerId: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    if (!this.password) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate password reset token
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    return resetToken;
};

module.exports = mongoose.model('User', userSchema);
