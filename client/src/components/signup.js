import React from "react";
import axios from "axios";
import { useState } from "react";
import {useNavigate} from "react-router-dom";
export default function Login() {
  const [details, setDetails] = useState({
    firstname:"",
    lastname:"",
    email: "",
    password: "",
    gender:""
  });
  const navigate=useNavigate()
  const formSubmitHandler = async(event) => {
    event.preventDefault();
    const {firstname,lastname,email,password,gender}=details
    try {
      console.log("Email: "+email,"password: "+password,"Gender: "+gender,"Lastname: "+lastname,"Firstname: "+firstname)
      const response=await axios.post('/register',details)
        setDetails({email:'',password:'',firstname:'',lastname:'',gender:''})
        if(response.data==='successfully signed up'){
          navigate('/')
        }else if(response.data==='user already exists'){
             alert(response.data)
            navigate('/Login')  
        }
        else{
          alert(response.data)
          navigate('/register')
        }
    }catch(error){
      console.log(error)
    }
    
  };
  const inputChangeHandler=(event)=>{
    const {name,value}=event.target
    setDetails((prevDetails)=>({
        ...prevDetails,
        [name]:value
    }))
  }
  return (
    <div>
      <form
        action="/register"
        method="post"
        className="containerForm mt-5 container rounded p-4  "
      >
        <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
            Firstname
          </label>
          <input
            type="text"
            name="firstname"
            value={details.firstname}
            onChange={inputChangeHandler}
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
            <label htmlFor="exampleInputEmail1" className="form-label">
            Lastname
          </label>
          <input
            type="text"
            name="lastname"
            value={details.lastname}
            onChange={inputChangeHandler}
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
            <label htmlFor="exampleInputEmail1" className="form-label">
            Gender
          </label>
          <input
            type="text"
            name="gender"
            value={details.gender}
            onChange={inputChangeHandler}
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={details.email}
            onChange={inputChangeHandler}
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={details.password}
            onChange={inputChangeHandler}
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={formSubmitHandler}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
