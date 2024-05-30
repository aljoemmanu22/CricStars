import React, { useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { set_Authentication } from '../../Redux/authentication/authenticationSlice';
import jwt_decode from "jwt-decode"

const AdminLogin = () => {
const {state}=useLocation()
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const [message,setMessage]=useState(null)
  const [phoneError, setPhoneError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loginError, setLoginError] = useState('')
  const baseURL='http://127.0.0.1:8000'


  useEffect(() => {
    if (state) {
      setMessage(state)
    }
    // navigate('/', {})
  }, [state, navigate])
  
  const handleLoginSubmit = async (event) => {
    event.preventDefault()
      setPhoneError('')
      setPasswordError('')
      setLoginError('')

      const phone_number = event.target.phone_number.value
      const password = event.target.password.value

      if (!phone_number.trim()) {
        setPhoneError('phone number is required')
      }
  
      if (!password.trim()) {
        setPasswordError('Password is required');
      }


    const formData = new FormData();
    formData.append('phone_number', event.target.phone_number.value);
    formData.append('password', event.target.password.value);
  
    try {
      const res = await axios.post(baseURL+'/api/accounts/admin/admin_login/', formData);
      console.log('Response',res)
      if (res.status === 200) {
        localStorage.setItem('access', res.data.access_token);
        localStorage.setItem('refresh', res.data.refresh_token);


        console.log('logined', res.data);
        console.log('Access Token:', res.data.access_token);
        console.log('Access Token:', res.data.refresh_token);

          
  
        dispatch(
          set_Authentication({
            name: jwt_decode(res.data.access_token).username,
            isAuthenticated: true,
            isAdmin: res.data.isAdmin,
            isTeacher:res.data.isTeacher
          })
        );
        navigate('/admin');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError('Invalid Credentials')
      if (error.response) {
        console.error('Response data:', error.response.data);
        setLoginError('Invalid Credentials')
      }
    }
  };
  return (
    <div className="antialiased bg-gradient-to-br from-green-100 to-white">
      <div className="container px-6 mx-auto">
        <div className="flex flex-col text-center md:text-left md:flex-row h-screen justify-evenly md:items-center">
          <div className="flex flex-col w-full">
            <div>
              <svg
                className="w-20 h-20 mx-auto md:float-left fill-stroke text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
              <h1 className="text-5xl text-gray-800 font-bold">Admin Area</h1>
            </div>
            <p className="w-5/12 mx-auto md:mx-0 text-gray-500">
                Control and monitorize your website data from dashboard.
            </p>
          </div>
          <div className="w-full md:w-full lg:w-9/12 mx-auto md:mx-0">
            <div className="bg-white p-10 flex flex-col w-full shadow-xl rounded-xl">
              <h2 className="text-3xl font-bold text-black-800 text-left mb-5">
                Sign In
              </h2>
              <form onSubmit={handleLoginSubmit} method='post' className="w-full">
                <div id="input" className="flex flex-col w-full my-5">
                  <label htmlFor="username" className="text-black-500 mb-2 self-start">
                    Phone Number
                  </label>
                  <input
                    type="phone_number"
                    id="phone_number"
                    placeholder="Please insert your phone number"
                    className="appearance-none border-2 border-black-900 rounded-lg px-4 py-3 placeholder-black-900 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:shadow-lg"
                  />
                </div>
                {phoneError && <span className="text-md text-red-800 mt-1 ">{phoneError}</span>}
                <div id="input" className="flex flex-col w-full my-5">
                  <label htmlFor="password" className="text-black-500 mb-2 self-start">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Please insert your password"
                    className="appearance-none border-2 border-black-500 rounded-lg px-4 py-3 placeholder-black-900 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:shadow-lg"
                  />
                </div>
                {passwordError ? (<>
                  {passwordError && <span className="text-md text-red-800 " >{passwordError}</span>}
                    </>):(<>
                  {loginError && <span className="text-md text-red-800 " >{loginError}</span>}
                </>)}
                <div id="button" className="flex flex-col w-full my-5">
                  <button type="submit" className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2">Login</button>   
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
