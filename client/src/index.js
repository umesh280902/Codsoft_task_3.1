import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { SearchFiltersProvider } from './context/searchContext';

ReactDOM.render(
  <React.StrictMode>
    <SearchFiltersProvider>
    <Router>
      <App/> {/* Pass the axios instance as a prop */}
    </Router>
    </SearchFiltersProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
