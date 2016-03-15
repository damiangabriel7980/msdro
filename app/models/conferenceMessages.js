var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  conferenceId: {
    type: String,
    index: true,
    required: true
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  text: String,
  timestamp: Number,
  hidden: {
    type: String,
    default: '0'
  },
  fromSystem: {
    type: String,
    default: '0'
  }
});

module.exports = mongoose.model('conferenceMessages', MessageSchema, 'conferenceMessages');