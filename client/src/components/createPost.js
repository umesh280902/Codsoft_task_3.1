import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './createPost.css'
export default function CreatePost(props) {
  const location = useLocation();
  const { state } = location;
  console.log(state);

  const [details, setDetails] = useState({
    Title: state?.Title || '',
    Content: state?.Content || '',
    Category: state?.Category || '',
    Image: null, // Add this for image upload
  });

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('Title', details.Title);
      formData.append('Content', details.Content);
      formData.append('Category', details.Category);
      formData.append('Image', details.Image);

      const response = await axios.post('/Post', formData);
      alert(response.data.message);
      setDetails({
        Title: '',
        Content: '',
        Category: '',
        Image: null,
      });
    } catch (error) {
      console.log('Cannot make request: ', error.message);
    }
  };

  const inputChangeHandler = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const fileChangeHandler = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    setDetails((prevDetails) => ({
      ...prevDetails,
      Image: file,
    }));
  };

  return (
    <div >
      <form
        onSubmit={formSubmitHandler}
        encType="multipart/form-data" // Add this line for file uploads
        className="containerForm container mt-3 rounded mb-4 "
        style={{ padding: '24px', paddingBottom: '0px' }}
      >
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Title:
          </label>
          <input
            type="text"
            name="Title"
            value={details.Title}
            onChange={inputChangeHandler}
            className="form-control title"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Content:
          </label>
          <textarea
            name="Content"
            value={details.Content}
            onChange={inputChangeHandler}
            className="form-control content"
            id="exampleInputPassword1"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Category:
          </label>
          <input
            type="text"
            name="Category"
            value={details.Category}
            onChange={inputChangeHandler}
            className="form-control category"
            id="exampleInputPassword1"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="formFile" className="form-label">
            Image:
          </label>
          <input
            className="form-control image"
            type="file"
            name="Image"
            accept="image/*"
            onChange={fileChangeHandler}
          />
        </div>
        <button type="submit" className="btn btn-primary button">
          Submit
        </button>
      </form>
    </div>
  );
}
