const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    profileImage: { type: String, default: "" },
    phone: { type: String, unique: true, sparse: true },
    isVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    role: { type: String, enum: ['user', 'admin'], default: 'user'}
    
  },
  { timestamps: true }
);

// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// UserSchema.methods.comparePassword = async function (enteredPassword) {
//   return bcrypt.compare(enteredPassword, this.password);
// };

UserSchema.methods.generateEmailToken = function () {
  this.emailVerificationToken = crypto.randomBytes(32).toString("hex");
};

UserSchema.methods.generatePasswordResetToken = function () {
  this.resetPasswordToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000;
};

module.exports = mongoose.model("User", UserSchema);
