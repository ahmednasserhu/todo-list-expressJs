const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 20,
  },
  status: {
    type: String,
    default: 'to-do',
    enum: ['to-do', 'in progress', 'done'],
  },
  tags: {
    type: [String],
    maxlength: 10,
  },
}, {
  timestamps: true,
});

todoSchema.pre('findOneAndUpdate', function findOneAndUpdate(next) {
  this.options.runValidators = true;
  next();
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
