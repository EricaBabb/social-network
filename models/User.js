const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: 'Username is required!',
      $trim: true
    },

    email: {
        type: String,
        unique: true,
        required: 'Email must exist',
        // match: [/.+@.+\..+/, 'Please enter a valid email!']
      },
      thoughts: [
        {
          type: Schema.Types.ObjectId,
          //ref tells User model which documents to search for the right thought
          ref: 'Thought'
        }
      ],  
      friends: [
        {
          type: Schema.Types.ObjectId,
          //ref tells User model to self-reference
          ref: 'User'
        }
      ],  
  
  },
  {
    toJSON: {
      virtuals: true
    },
    id: false
  }
);

UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;