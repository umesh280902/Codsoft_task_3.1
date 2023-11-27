import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./linkSetter.css";
import '../context/searchContext'
import SearchFiltersContext from "../context/searchContext";
// ... (your imports and context)

export default function Post(props) {
  //const [data, setData] = useState([]);
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const { search } = useContext(SearchFiltersContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchQuery = {
          search: search,
        };
        const response = await axios.get("/Post", {
          params: searchQuery,
        });
        console.log(response.data);
        if (response.data === "Please login first") {
          alert(response.data);
          return;
        }
        setProfile(response.data.profile);
        setPosts(response.data.content);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [search]);

  const deletePostHandler = async (contentId) => {
    try {
      const response = await axios.delete("/Post", { data: { id: contentId } });
      setLoading(true);
      setPosts(response.data.newDetails.content);
      setLoading(false);
    } catch (error) {
      console.log("An error occurred", error);
    }
  };

  const editPostHandler = (Title, Content, Category) => {
    const content = { Title, Content, Category };
    navigate("/post", { state: content });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container">
        <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className="container"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexFlow: "column",
              marginRight: "75px",
            }}
            className="container profile-details"
          >
            <h1
              className="mt-2"
              style={{
                fontSize: "36px",
                color: "blue",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Profile Details
            </h1>
            <img
              style={{
                borderRadius: "260px",
                backgroundColor: "gray",
                marginTop: "20px",
                marginBottom: "20px",
              }}
              src={
                profile.gender.toLowerCase() === "male"
                  ? "maleProfile.png"
                  : "femaleProfile.png"
              }
              alt=""
            />
            <div style={{ fontSize: "32px", fontWeight: "bold" }}>
              Name:{" "}
              {profile.firstname &&
                profile.firstname.slice(0, 1).toUpperCase() +
                  profile.firstname.slice(1)}{" "}
              {profile.lastname &&
                profile.lastname.slice(0, 1).toUpperCase() +
                  profile.lastname.slice(1)}
            </div>
            <div style={{ fontStyle: "italic" }}>Email: {profile.email}</div>
            <div style={{ fontStyle: "italic" }}>Gender: {profile.gender}</div>
          </div>
          <div className="container content-section">
            <h1
              style={{
                marginTop: "8px",
                marginBottom: "10px",
                justifyContent: "center",
                display: "flex",
              }}
            >
              Contents
            </h1>
            <div className="p-3 container grid content-section">
              {Array.isArray(posts) && posts.length > 0 ? (
                posts.map((content) => (
                  <div
                    className="border border-secondary-subtle rounded mb-3 p-4 bg-secondary-subtle"
                    key={content._id}
                  >
                    <div>
                      <Link
                        to={`/detailed/${content._id}`}
                        className="SetTitle"
                      >
                        {content.Title}
                      </Link>
                    </div>
                    <div>
                      {content.Content && content.Content.slice(0, 50)}...
                    </div>
                    <div>{content.Category}</div>
                    <div style={{ fontStyle: "italic", fontSize: "15px" }}>
                      published on {content.published}
                    </div>
                    <div style={{ fontStyle: "italic", fontSize: "15px" }}>
                      last updated on {content.updated}
                    </div>
                    <div style={{ display: "flex" }}>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => deletePostHandler(content._id)}
                        style={{ marginRight: "10px" }}
                      >
                        Delete
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() =>
                          editPostHandler(
                            content.Title,
                            content.Content,
                            content.Category
                          )
                        }
                        style={{ marginRight: "10px" }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div>No posts found</div>
              )}
            </div>
            <button className="btn btn-primary" style={{ marginLeft: "16px" }}>
              <Link to="/post" className="RemoveLink">
                Add a Post
              </Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
