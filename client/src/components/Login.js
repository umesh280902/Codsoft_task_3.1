import React from "react";
import axios from "axios";
import { useState } from "react";
import {useNavigate} from "react-router-dom";
export default function Login() {
  const [details, setDetails] = useState({
    email: "",
    password: "",
  });
  const navigate=useNavigate()
  const formSubmitHandler = async(event) => {
    event.preventDefault()
    const {email,password}=details
    try {
      console.log("Email: "+email,"password: "+password)
      const response=await axios.post('/Login',details)
        setDetails({email:'',password:''})
        if(response.data==='logged in'){
          alert(response.data)
          navigate('/')
        }else{
          console.log(response.data)
          alert(response.data.message)
          navigate('/Login')
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
        action="/Login"
        method="post"
        className="containerForm mt-5 container rounded p-4 "
      >
        <div className="mb-3">
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
