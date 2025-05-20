const express = require('express');
const router = express.Router();
const { saveDraft, publishBlog, getAllBlogs, getBlogById, updateBlog } = require('../controllers/blogController');
const { protect } = require('../middleware/auth');


router.get('/', getAllBlogs);
router.get('/:id', getBlogById);


router.post('/save-draft', protect, saveDraft);
router.post('/publish', protect, publishBlog);
router.put('/:id', protect, updateBlog);

module.exports = router; 