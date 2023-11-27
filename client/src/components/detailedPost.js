// DetailedPost.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './detailedPost.css';

export default function DetailedPost() {
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = window.location.href.split("/");
        console.log(id)
        const response = await axios.get(`/api/posts/${id[4]}`);
        console.log(response.data);
        setPost(response.data);
      } catch (error) {
        console.log('Error: ' + error.message);
      }
    };

    fetchData();
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = window.location.href.substring(31);
      const response = await axios.post(`/api/${id}/comment`, { postId: id, comment });
      console.log(response.data);
      // Refresh the post data after submitting the comment
      const updatedPost = await axios.get(`/api/posts/${id}`);
      setPost(updatedPost.data);
      setComment('');
    } catch (error) {
      console.log('Error submitting comment: ' + error.message);
    }
  };

  return (
    <div className='container'>
      {post ? (
        <div key={post._id}>
          <div className='mt-3'><img src={`${post.Image}`} style={{ width: "100%", height: "460px" }} alt='...' /></div>
          <div>
            <div key={post._id} className='container'>
              <div style={{ color: 'black', fontSize: "35px", justifypost: "center", display: "flex", marginTop: "20px", marginBottom: "20px" }}>{post.Title}</div>
              <div style={{ fontSize: "20px", marginBottom: "10px", justifypost: "center", display: "flex" }}> This Blog is based on {post.Category}</div>
              <div style={{ fontSize: "15px", marginBottom: "10px" }}>{post.Content}</div>
              <div style={{ display: "flex", justifypost: "end", fontStyle: "italic" }}>
                ---By {post.AuthorId ? `${post.AuthorId.firstname} ${post.AuthorId.lastname}` : 'Unknown'}
              </div>

              <div style={{ display: "flex", justifypost: "space-between" }}>
                <div style={{ display: 'flex', flexFlow: "column" }}>
                  <div style={{ fontSize: "12px", fontStyle: "italic" }}>Published on {post.published}</div>
                  <div style={{ fontSize: "12px", fontStyle: "italic" }}>Last updated on {post.updated}</div>
                  <div style={{ fontSize: "12px", fontStyle: "oblique", fontWeight: "bold" }}>Views: {post.views.length}</div>
                  <div><i className='fa-fa-thumbs'></i></div>
                </div>
              </div>
            </div>
          </div>

          {/* Comment Section */}
          <div className='mt-4 comment-container'>
            <h3>Comments</h3>
            <div>
              {post.Comments.map((comment, index) => (
                <div key={index} className='comment-item'>
                  <p className='comment-name'>{comment.Name}</p>
                  <p className='comment-text'>{comment.Comment}</p>
                </div>
              ))}
            </div>
            {/* Comment Form */}
            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <label htmlFor="commentInput">
                Add a Comment:
                <input
                  type="text"
                  id="commentInput"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>

        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
