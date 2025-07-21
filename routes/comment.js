// routes/comments.js

const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController');
const { isAuthenticated } = require('../middlewares/auth');
const { validateComment } = require('../middlewares/validation');

router.post('/',
    isAuthenticated,
    validateComment,
    commentController.createComment
);
router.put('/:id',
    isAuthenticated,
    validateComment,
    commentController.updateComment
);
router.delete('/:id',
    isAuthenticated,
    commentController.deleteComment
);


module.exports = router;