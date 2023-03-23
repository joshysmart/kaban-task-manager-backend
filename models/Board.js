const mongoose = require('mongoose');
const BoardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters']
    },
    columns: [
      {
        name: {
          type: String
        },
        tasks: [{
          title: String,
          description: String,
          status: String,
          subtasks: [{
            title: String,
            isCompleted: Boolean
          }]
        }]
      }
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  })

module.exports = mongoose.model('Board', BoardSchema);
