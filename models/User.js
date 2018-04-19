const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /\S+@\S+\.\S+/
  },
  emailConfirmed: {
    type: Boolean,
    required: true,
    default: false
  },
  emailConfirmationToken: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  resetToken: {
    type: String
  },
  resetTokenExp: {
    type: Date
  },
  firstname: {
    type: String,
    match: /^[a-zA-Z]+$/
  },
  lastname: {
    type: String,
    match: /^[a-zA-Z]+$/
  },
  language: {
    type: String,
    enum: ['en', 'de', 'fr', 'it'],
    default: 'en'
  },
  permissions: {
    type: [String],
    enum: ['user', 'admin'],
    default: ['user'],
    required: true
  }
},
{
  timestamps: true
});

UserSchema.plugin(mongooseUniqueValidator);

UserSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, 12);
  next();
});

UserSchema.methods.signToken = function() {
  return jwt.sign({
    _id: this._id,
    permissions: this.permissions
    },
    process.env.SECRET,
  { expiresIn: '1h' });
}

UserSchema.methods.getInfo = function() {
  return {
    language: this.language,
    token: this.signToken()
  }
}

UserSchema.methods.validPassword = function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
}

UserSchema.methods.setEmailConfirmationToken = function() {
  return this.emailConfirmationToken = crypto.randomBytes(36).toString('hex');
}

module.exports = mongoose.model('User', UserSchema);