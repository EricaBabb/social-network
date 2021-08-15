const router = require('express').Router();
const {
    getAllThought,
    getThoughtById,
    addThought,
    updateThought,
    removeThought,
    addReaction,
    removeReaction
  } = require('../../controllers/thought-controller');

// /api/thoughts
  router
  .route('/')
  .get(getAllThought)
  .post(addThought);

// GET one, PUT, and DELETE
// /api/thoughts/:id
router
  .route('/:id')
  .get(getThoughtById)
  .put(updateThought)
  .delete(removeThought);  


// /api/thoughts/:thoughtId  
router
  .route('/:userId/:thoughtId')
  .put(addReaction)

// /api/thoughts/:userId/:thoughtId/:reactionId
router.route('/:userId/:thoughtId/:reactionId').delete(removeReaction);

module.exports = router;