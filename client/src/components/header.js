import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import SearchFiltersContext from '../context/searchContext';

export default function Header(props) {
  const { search, setSearch } = useContext(SearchFiltersContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("you clicked");
    // Add your custom logic for handling the form submission if needed
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{ padding: '0px' }}>
        <div className="container-fluid" style={{ color: 'white', backgroundColor: 'gray', padding: '5px', fontSize: '25px' }}>
          <Link className="navbar-brand" style={{ color: 'white', fontSize: '30px', marginLeft: '24px' }} to="/">Blog</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" style={{ color: 'white' }} to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" style={{ color: 'white' }} to="/register">Signup</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" style={{ color: 'white' }} to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" style={{ color: 'white' }} to="/profile">Profile</Link>
              </li>
            </ul>
            <form className="d-flex align-items-center" role="search" onSubmit={handleSubmit} style={{ marginLeft: 'auto',marginTop:"0.25rem" }}>
              <input
                className="form-control me-2"
                name="category"
                value={search}
                type="search"
                placeholder="search a category"
                aria-label="Search"
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginRight: '5px' }} // Adjust the right margin for spacing
              />
              <button className="btn btn-outline-light" style={{marginBottom:"1.3rem"}} type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
}
