const router = require('express').Router();
const {
    //Instead of importing the entire object and having to do userController.getAllUser(), we can simply destructure the method names out of the imported object and use those names directly.
    getAllUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  } = require('../../controllers/user-controller');

// GET all and POST at /api/users
// /api/users
router
  .route('/')
  .get(getAllUser)
  .post(createUser);
  //We set up the callback functions to accept req and res as parameters; that way we can just use the controller method name of the callback function

// GET one, PUT, and DELETE at /api/users/:id
// /api/users/:id
router
  .route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// // /api/users/:friendId  
// router
// .route('/:userId/:thoughtId')
// .put(addFriend);


// // /api/users/:userId/friends/:friendId
// router.route('/:userId/friends/:friendId').delete(removeFriend);

module.exports = router;