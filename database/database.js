const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const DB = process.env.DATABASE;

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((error) => {
        console.error('Unable to connect to MongoDB:', error.message);
    });
const getCurrentDateTimeIndia = (timeStamp) => {
    const currentDate = new Date();
    const localeOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-IN', localeOptions);
    const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    return  formattedDate + " " + formattedTime
}


const userDetailsSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true ,select:false},
    gender: { type: String, required: true }
});

const blogPostSchema = new mongoose.Schema({
    Title: { type: String, required: true },
    AuthorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserDetails',
      required: true
    },
    Image: String,
    Content: { type: String, required: true },
    published: {
      type: String,
      default: () => getCurrentDateTimeIndia(Date.now())
    },
    updated: { type: String },
    Category: { type: String, required: true },
    Likes: Number,
    views: [{
      token: { type: String, required: true },
      lastTimeViewed: { type: Date }
    }],
    Comments: [{
      Comment: { type: String, required: true },
      Name: { type: String, required: true },
    }]
  });

const UserDetails = mongoose.model('UserDetails', userDetailsSchema);
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = {
    UserDetails,
    BlogPost,
    getCurrentDateTimeIndia
};
