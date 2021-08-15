const { Schema, model, Types } = require('mongoose');

// const FriendSchema = new Schema(
//   {
//     // set custom id to avoid confusion with the parent, user, _id field
//     friendId: {
//       type: Schema.Types.ObjectId,
//       default: () => new Types.ObjectId()
//     }
//   }
// );

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: 'Username is required!',
      $trim: true
    },

    email: {
        type: String,
        unique: true,
        required: 'Email must exist',
        match: [/.+@.+\..+/, 'Please enter a valid email!']
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
    // use FriendSchema to validate data for a reply
//     friends: [FriendSchema]
  },
  {
    toJSON: {
      virtuals: true
    },
    id: false
  }
);

UserSchema.virtual('friendCount').get(function() {
  return this.replies.length;
});

const User = model('User', UserSchema);

module.exports = User;