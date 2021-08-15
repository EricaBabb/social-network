const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

//MAKE SURE YOU DO THE REQUIRMENTS
const ReactionSchema = new Schema(
    {
      // set custom id to avoid confusion with parent comment's _id field
      reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
      },
      reactionBody: {
        type: String,
        required: 'You must type a reaction!',
        maxlength: 280
      },
      username: {
        type: String,
        required: 'You must have a username!'
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
      }
    },
    {
      toJSON: {
        getters: true
      }
    }
  );

const ThoughtSchema = new Schema({
    thoughtText: {
      type: String,
      //Probably a better way for length
      minlength: 1,
      maxlength: 128,
      required: 'Your text must be between 1-128 characters',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    },
    username: {
        type: String,
        required: 'A username is required!'
      },

    reactions: [ReactionSchema]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    // prevents virtuals from creating duplicate of _id as `id`
    id: false
  }
);

// Virtual property created
ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
  });


// create the Thought model using the ThoughtSchema
const Thought = model('Thought', ThoughtSchema);

// export the Thought model
module.exports = Thought;