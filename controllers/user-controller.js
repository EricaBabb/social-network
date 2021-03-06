const { User } = require('../models');

const userController = {
    // get all users
    // callback function for the GET /api/users rout
    getAllUser(req, res) {
        // uses the Mongoose .find() method, much like the Sequelize .findAll() method
        User.find({})
        //we dont want to just see the id of the thoughts
        // .populate({
        //   path: 'thoughts',
        //   //tells mongoose we don't care about the __v field on thoughts
        //   select: '-__v'
        // })
        //-__v for field on the user as well
        .select('-__v')
        //Newest user returns first
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },
  
    // get one user by id
    getUserById({ params }, res) {
        //uses the Mongoose .findOne() method to find a single user by its _id
        // Instead of accessing the entire req, we've destructured params out of it
        User.findOne({ _id: params.id })
        //also want to return thoughts when GET
        .populate({
          path: 'thoughts',
          select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },


    // createUser
    //we destructure the body out of the Express.js req object because we don't any previous data
createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },

  addFriend({ params, body }, res) {
    console.log("You're adding a friend"),
    console.log("params", params),
    console.log("body", body),
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: body } },
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


  // update user by id
updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true })
    //Setting new: true we are telling Mongoose to return the new version of the document
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },
  // delete user
deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      //$pull operator to remove the specific reaction from the reactions array where the reactionId matches the value of params.reactionId passed in from the route
      { $pull: { reactions: { reactionId: params.friendId } } },
      { new: true }
    )
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  }
  };

module.exports = userController;