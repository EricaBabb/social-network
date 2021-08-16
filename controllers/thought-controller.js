const { Thought, User } = require('../models');

const thoughtController = {

    getAllThought(req, res) {
        Thought.find({})


        //we dont want to just see the id of the users
        // .populate({
        //   path: 'users',
        //   //tells mongoose we don't care about the __v field on thoughts
        //   select: '-__v'
        // })


        .select('-__v')
        .sort({ _id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },
  
    // get one thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        //also want to return users when GET
        .populate({
          path: 'users',
          select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => {
          if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
          }
          res.json(dbThoughtData);
        })
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },

  // add thought to a user
  addThought({body }, res) {
    console.log(body);
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          //the push method works just like in JS; it pushes data to an array
          //Allows addition of specific thought to the user
          { $push: { thoughts: _id } },
          //allows thought to go through onto the user
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true }
    )
    .then(dbUserData => {
      // if (!dbUserData) {
      //   res.status(404).json({ message: 'No user found with this id!' });
      //   return;
      // }
      res.json(dbUserData);
    })
    .catch(err => {
      //this prints the entire error in your backend terminal.
      //much better for debugging than just res.json(err)
      console.log(err)

      res.json(err) //this tells the frontend to say "there's an error!" but... few details.
    });
},

   // update thought by id
updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
    //Setting new: true we are telling Mongoose to return the new version of the document
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },


     removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  }, 

  // remove reaction
removeReaction({ params }, res) {
  Thought.findOneAndUpdate(
    { _id: params.thoughtId },
    //$pull operator to remove the specific reaction from the reactions array where the reactionId matches the value of params.reactionId passed in from the route
    { $pull: { reactions: { reactionId: params.reactionId } } },
    { new: true }
  )
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.json(err));
}
};



module.exports = thoughtController;