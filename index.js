const dotenv = require('dotenv');
const path=require('path')
const express = require('express');
const app = express();
const portnumber = process.env.PORT || 8800;
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { BlogPost } = require('./database/database');
app.use(cors())
app.use(cookieParser());

// // Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/images', express.static(path.join(__dirname, 'images')));
// Define a route to serve the React app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

//app.set('view engine', 'ejs');
app.listen(portnumber, () => {
  console.log(`Listening to the API http://localhost:${portnumber}`);
});



app.get('/api/posts', async (req, res) => {
  try {
    const category = req.query.Category;
    let blogPosts;
    if (category) {
      blogPosts = await BlogPost.find({ Category: category }).populate('AuthorId').select('-password');
    } else {
      blogPosts = await BlogPost.find().populate('AuthorId').select('-password');
    }
    blogPosts = blogPosts.map((post) => {
      if (post.Image) {
        const updatedPath = 'https://blogpost-836g.onrender.com/';
        post.Image = updatedPath + post.Image.replace('\\','/')
      }
      return post;
    });
    res.send(blogPosts);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    let token = req.cookies.blogViewsToken;

    if (!token) {
      // If the token is not available, set a new one for the user
      token = uuidv4();
      res.cookie('blogViewsToken', token, { secure:true,httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // Max age of 24 hours
    }

    let blogPost = await BlogPost.findById(postId).populate('AuthorId').select('-password');

    if (!blogPost) {
      return res.status(404).send('Blog post not found');
    }

    if (!blogPost.views) {
      blogPost.views = [];
    }

    const viewIndex = blogPost.views.findIndex((view) => view.token === token);

    if (viewIndex !== -1) {
      const currentView = blogPost.views[viewIndex];
      if (!currentView.lastTimeViewed || isViewOutdated(currentView.lastTimeViewed)) {
        currentView.lastTimeViewed = new Date();
        blogPost.views[viewIndex] = currentView;
        await blogPost.save();
      }
    } else {
      // Token not found in the database, adding it to the views array
      blogPost.views.push({ token, lastTimeViewed: new Date() });
      await blogPost.save();
    }

    if (blogPost.Image) {
      const updatedPath = 'https://blogpost-836g.onrender.com/';
      blogPost.Image = updatedPath + blogPost.Image.replace('\\','/')
    }
    res.status(200).send(blogPost);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});



function isViewOutdated(lastTimeViewed) {
  const viewTimeframe = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  return new Date().getTime() - lastTimeViewed.getTime() > viewTimeframe;
}

// Fetch posts created within the last 3 to 4 days
app.get('/api/recent-posts', async (req, res) => {
  try {
    const currentDate = new Date();
    const fromDate = new Date(currentDate);
    fromDate.setDate(currentDate.getDate() - 4); // Adjust the number of days as needed

    const recentPosts = await BlogPost.find({ createdAt: { $gte: fromDate, $lte: currentDate } })
      .populate('AuthorId')
      .select('-password');

    res.send(recentPosts);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});


// Fetch the 5 most viewed posts
app.get('/api/most-viewed-posts', async (req, res) => {
  try {
    let posts = await BlogPost.find().sort({views:-1}).limit(5).populate('AuthorId').select('-password')
    posts = posts.map((post) => {
      if (post.Image) {
        const updatedPath = 'https://blogpost-836g.onrender.com/';
        post.Image = updatedPath + post.Image.replace('\\','/')
      }
      return post;
    });
    console.log(posts)
    res.send(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await BlogPost.distinct('Category');

    res.send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch posts by category
app.get('/api/posts/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const posts = await BlogPost.find({ Category: category }).populate('AuthorId').select('-password');
    res.send(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});


app.use(require('./database/user'))
app.use(require('./database/post'))
// Other routes for CRUD operations (like user and post routes) can be added here
