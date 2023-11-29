const express = require('express');
const router = express.Router();
const { UserDetails, BlogPost } = require('./database');
const jwt = require('jsonwebtoken');
const authenticate = require('./user');
const cookieParser = require('cookie-parser');
const { getCurrentDateTimeIndia } = require('./database')
const multer = require('multer')
const cors = require('cors')
require('dotenv').config()
const secretkey = process.env.SECRET_KEY
router.use(cookieParser());
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors())

const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
})

router.get('/Post', authenticate, async (req, res) => {
  const category = req.query.category;
  try {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, secretkey);
    const _id = decodedToken.id;
    const profile = await UserDetails.findById(_id).select('-password');
    let content = await BlogPost.find({ AuthorId: profile._id })

    // Update image paths
    content = content.map((post) => {
      if (post.Image) {
        const updatedPath = 'https://blogpost-836g.onrender.com/';
        const newpath = post.Image.replace('images\\', '/');
        post.Image = updatedPath + newpath;
      }
      return post;
    });

    console.log(content);

    if (category) {
      const categoryDetails = content.filter((post) => post.Category === category);
      return res.send({ profile, blogPosts: categoryDetails });
    }

    if (!profile) {
      return res.status(404).json({ error: 'User details not found' });
    }
    console.log({ profile, content })
    res.send({
      profile,
      content,
    });
  } catch (error) {
    console.log('An error occurred: ' + error.message);
    res.send('Please login first');
  }
});



const upload = multer({ storage: Storage });

router.post('/Post', authenticate, upload.single('Image'), async (req, res) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, secretkey);
    const _id = decodedToken.id;

    const { Title, Content, Category } = req.body;
    const imagePath = req.file.path;
    const updated = getCurrentDateTimeIndia(Date.now());

    const details = await UserDetails.findById(_id).select('-password');
    if (!details) {
      return res.status(404).json({ error: 'User details not found' });
    }

    const existingPost = await BlogPost.findOneAndUpdate(
      { Title, Category, AuthorId: details._id },
      { Content, updated, Image: imagePath },
      { upsert: true, new: true }
    );

    const message = existingPost ? 'Successfully updated' : 'Successfully added';
    const response = { message, details };
    res.json(response);
  } catch (error) {
    console.log('An error occurred: ' + error.message);
    res.status(500).json({ error: 'Failed to add/update content' });
  }
});

router.delete('/Post', authenticate, async (req, res) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, secretkey);
    const _id = decodedToken.id;
    const answer = req.body;
    const { id } = answer;
    console.log(id)
    const details = await UserDetails.findById(_id).select('-password');
    if (!details) {
      return res.status(404).json({ error: 'User details not found' });
    }
    // Find the blog post by ID
    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Check if the user is the author of the blog post
    if (blogPost.AuthorId.toString() !== _id.toString()) {
      return res.status(403).json({ error: 'Unauthorized: You are not the author of this blog post' });
    }

    // Remove the blog post
    await BlogPost.findByIdAndRemove(id);

    const message = 'successfully deleted'
    const sendDetails = { message, UserDetails }
    res.json(sendDetails);
  } catch (error) {
    console.log('An error occurred: ' + error.message);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

// router.get('/api/:id', async (req, res) => {
//   try {
//     const id = req.params.id
//     const content = await BlogPost.find({ _id: id })
//     console.log(content)
//     const author = content[0]
//     const details = await UserDetails.find({ AuthorId: content._id }).select('-password')
//     console.log(details)
//     const blog = details[0]
//     //res.send({author,blog})
//     res.render('singlepost', { author, blog })
//   } catch (error) {
//     console.log('error occurred :' + error.message)
//   }
// })


router.post('/api/:id/comment', authenticate, async (req, res) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, secretkey);
    const _id = decodedToken.id;
    const { postId, comment } = req.body;
    console.log(req.body)
    const details = await UserDetails.findById(_id).select('-password');
    if (!details) {
      return res.status(404).json({ error: 'User details not found' });
    }

    const post = await BlogPost.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Add the new comment to the post's Comments array
    post.Comments.push({
      Comment: comment,
      Name: `${details.firstname} ${details.lastname}`,
    });

    await post.save(); // Save the changes to the post

    await details.save();
    console.log("yes");
    res.json(post);

  } catch (error) {
    console.log('An error occurred: ' + error.message);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});


module.exports = router;
