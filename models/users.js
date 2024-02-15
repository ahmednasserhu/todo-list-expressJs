const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
// const uniqueValidator = require('mongoose-unique-validator');

const usersSchema = new mongoose.Schema({
  userName: {
    type: String,
    minLength: 8,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 15,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 15,
  },
  dob: {
    type: Date,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
}, [
  {
    timestamps: true,
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        // eslint-disable-next-line no-param-reassign
        ret.password = undefined;
        return ret;
      },
    },
  }]);

// usersSchema.plugin(uniqueValidator);

usersSchema.pre('findOneAndUpdate', function findOneAndUpdate(next) {
  this.options.runValidators = true;
  next();
});

usersSchema.pre('save', async function preSave(next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

usersSchema.methods.verifyPassword = async function verifyPassword(password) {
  const valid = await bcrypt.compare(password, this.password);
  return valid;
};

const User = mongoose.model('User', usersSchema);

module.exports = User;
