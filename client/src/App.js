import './App.css';
import Login from './components/Login';
import Header from './components/header';
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Signup from './components/signup'
import Homepage from './components/homepage';
import { useState } from 'react';
import Post from './components/post'
import DetailedPost from './components/detailedPost';
import CreatePost from './components/createPost';
function App() {
  
  return (
    <>
      <Header  />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/profile' element={<Post />} />
        <Route path='/detailed/:postId' element={<DetailedPost/>}/>
        <Route path='/' element={<Homepage />} />
        <Route path='/post' element={< CreatePost/>} />
      </Routes>
    </>
  );
}

export default App;
