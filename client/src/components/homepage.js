// Import necessary dependencies and stylesheets
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./linkSetter.css";
import "./homepage.css";
import { useContext } from "react";
import SearchFiltersContext from "../context/searchContext";

export default function Homepage(props) {
  const [posts, setPosts] = useState([]);
  const [mostViewedPosts, setMostViewedPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { search,setSearch } = useContext(SearchFiltersContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts by search category
        const searchQuery = {
          Category: search,
        };
         
        const response = await axios.get("/api/posts", {
          params: searchQuery,
        });
        setPosts(response.data);

        // Fetch most viewed posts
        const mostViewedResponse = await axios.get("/api/most-viewed-posts");
        setMostViewedPosts(mostViewedResponse.data);

        // Fetch categories
        const categoriesResponse = await axios.get("/api/categories");
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [search]);

  return (
    <div className="container" style={{ marginTop: "48px" }}>
      <div className="row">
        <div className="col-md-8">
          <h2>Posts</h2>
          <div className="other-posts">
            {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="card mb-3">
                  <img
                    src={post.Image}
                    className="card-img-top"
                    alt={post.Title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/detailed/${post._id}`} className="SetTitle">
                        {post.Title}
                      </Link>
                    </h5>
                    <p className="card-text">{post.Content.slice(0, 50)}....</p>
                    <p>{post.Category}</p>
                    <p className="card-text">
                      <small className="text-body-secondary">
                        Last updated {post.updated}
                      </small>
                    </p>
                    <div>
                      ---By {post.AuthorId.firstname} {post.AuthorId.lastname}
                    </div>
                    <div>Views: {post.views.length}</div>
                  </div>
                </div>
              ))
            ) : (
              <div>No posts found.</div>
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="row">
            <div className="col-md-12">
              <h2>Most Viewed Posts</h2>
              <div className="most-viewed-posts">
                {Array.isArray(mostViewedPosts) && mostViewedPosts.length > 0 ? (
                  mostViewedPosts.map((post) => (
                    <div key={post._id} className="card mb-3" style={{display:"flex",flexFlow:"row"}}>
                      <img
                    src={post.Image}
                    className="card-img-top"
                    alt={post.Title}
                    style={{ width: "40%", height: "auto" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/detailed/${post._id}`} className="SetTitle">
                        {post.Title}
                      </Link>
                    </h5>
                    <p className="card-text">
                      <small className="text-body-secondary">
                        Last updated {post.updated}
                      </small>
                    </p>
                    <div>
                      ---By {post.AuthorId.firstname} {post.AuthorId.lastname}
                    </div>
                  </div>
                    </div>
                  ))
                ) : (
                  <div>No most viewed posts found.</div>
                )}
              </div>
            </div>
            <div className="col-md-12">
              <h2>Categories</h2>
              <div className="categories">
                <ul>
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((category) => (
                      <li key={category}>
                        <Link to={'/'} onClick={()=>setSearch(category)}>{category}</Link>
                      </li>
                    ))
                  ) : (
                    <div>No categories found.</div>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
