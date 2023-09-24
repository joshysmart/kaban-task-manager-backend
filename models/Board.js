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
    slug: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    columns: [
      {
        name: {
          type: String,
          unique: true,
        },
        tasks: [{
          title: {
            type: String,
            required: [true, 'Please add a title'],
            trim: true,
            unique: true
          },
          description: String,
          status: String,
          subtasks: [{
            title: String,
            isCompleted: Boolean
          }]
        }]
      }
    ]
  })

module.exports = BoardSchema;
module.exports = mongoose.model('Board', BoardSchema);
