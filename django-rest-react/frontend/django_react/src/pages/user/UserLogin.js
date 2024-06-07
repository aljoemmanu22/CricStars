import React, { useEffect, useState } from 'react'
import { Link ,useLocation,useNavigate} from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { set_Authentication } from '../../Redux/authentication/authenticationSlice';
import { setLoading} from '../../Redux/slice';
import jwt_decode from "jwt-decode";


// /////////////////////////////////////////////////////////////////////////////////

import { useSelector } from 'react-redux';
import { setUser, setError } from '../../Redux/slice'; // Import actions

function UserLogin() {
  const { state } = useLocation();
  const [message, setmessage] = useState(null)
  const [formError, setFormError] = useState([])
  const [phoneError, setPhoneError] = useState('')
  const [nameError, setNameError] = useState('')
  const [otpError, setOtpError] = useState('')
  const baseURL='http://127.0.0.1:8000'

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if(state){
      setmessage(state)
    }
    
    navigate('', {}); 
    
  }, [state,navigate])


  const handleLoginSubmit = async(event)=> {
    event.preventDefault();
    setFormError([])
    const formData = new FormData();
    formData.append("email", event.target.email.value);
    formData.append("password", event.target.password.value);
    try {
      const res = await axios.post(baseURL+'/api/accounts/login/', formData)
      if(res.status === 200){
        localStorage.setItem('access', res.data.access)
        localStorage.setItem('refresh', res.data.refresh)
        console.log(res.data);
        dispatch(
          set_Authentication({
            name: jwt_decode(res.data.access).first_name,
            isAuthenticated: true,
            isAdmin:res.data.isAdmin
          })
        );
        navigate('/')
        return res
      }  
      
    }

    catch (error) {
      console.log(error);
      if (error.response.status===401)
      {
        setFormError(error.response.data)
      }
      else
      {
        console.log(error);
      }
    }
  }


///////////////////////////////////////////////////////////////////////////////////////////
const [phoneNumber, setPhoneNumber] = useState('');
const [isNewUser, setIsNewUser] = useState(null);
const isLoading = useSelector((state) => state.isLoading);
const [first_name, setName] = useState('');
const [otpCode, setOtpCode] = useState('');




const handleCheckUser = async (e) => {
  e.preventDefault();
  if (!/^\d{10}$/.test(phoneNumber)) {
    setPhoneError('Invalid phone number. Please enter a 10-digit number.');
    return;
  }
  setPhoneError('');
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const response = await axios.post(baseURL + '/api/accounts/check-user/', { phone_number: phoneNumber });
    setIsNewUser(!response.data.user_exists);
    if (response.data.user_exists) {
      await axios.post(baseURL + '/api/accounts/send-otp/', { phone_number: phoneNumber });
    }
  } catch (error) {
    dispatch(setError('Error checking user.'));
  } finally {
    dispatch(setLoading(false));
  }
}


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!first_name.trim()) {
    setNameError('Name cannot be empty or just spaces.');
    return;
  }
  setNameError('');
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const userData = { phone_number: phoneNumber, first_name };
    await axios.post(baseURL + '/api/accounts/send-otp/', userData);
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch(setError(error.response.data.message || 'Error sending OTP.'));
    } else {
      dispatch(setError('Error sending OTP.'));
    }
  } finally {
    dispatch(setLoading(false));
  }
}


const handleVerify = async (e) => {
  e.preventDefault();
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const res = await axios.post(baseURL + '/api/accounts/verify-otp/', { phone_number: phoneNumber, otp_code: otpCode });
    if (res.status === 200) {
      localStorage.setItem('access', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)
      dispatch(
        set_Authentication({
          name: jwt_decode(res.data.access).first_name,
          isAuthenticated: true,
          isAdmin: res.data.isAdmin
        })
      );
      navigate('/')
      return res
    }
  } catch (error) {
    if (error.response.status === 401) {
      setOtpError('Invalid OTP code.');
      setFormError(error.response.data);
    } else {
      setOtpError('Error verifying OTP.');
    }
  } finally {
    dispatch(setLoading(false));
  }
}




  return (
    <>
      <div className='relative h-screen'>
  <video autoPlay loop muted className='absolute top-0 left-0 w-full h-full object-cover'>
    <source src="images/MainBackground.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  <div className='relative flex flex-col lg:flex-row items-center justify-center h-full border-t-2 border-neutral-900'>
    {/* <div className='sm:hidden lg:flex flex-col items-center justify-center flex-grow'>
      <img className="h-64 w-64" src='images/hBatter.png' alt='Home batter' />
    </div> */}

    <div className='bg-null flex flex-col justify-center items-center w-full lg:w-auto lg:mx-6 mb-32'>
      <img className="h-64 w-64 mt-10 sm:hidden" src="images/hBat.png" alt="Baseball Bat" />
      <p className='mt-32 font-semibold text-2xl lg:text-4xl text-center text-white'>Welcome to cricStars</p>
      <div className='flex items-center mt-8 w-full'>
        <hr className="border-t-2 border-gray-400 w-1/4 lg:w-1/2" />
        <p className='text-center w-1/2 lg:w-96 text-white'>CONTINUE WITH</p>
        <hr className="border-t-2 border-gray-400 w-1/4 lg:w-1/2" />
      </div>
      <div className='w-full px-6'>
        <form onSubmit={handleCheckUser} className='mt-6'>
          <label className='text-xs text-white'>Mobile Number</label>
          <div className='mt-3'>
            <input
              className='border-b-2 w-full'
              type="tel"
              placeholder="Enter Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          {formError && <p className="error text-red-500">{formError}</p>}
          {phoneError && <p className="error text-red-500">{phoneError}</p>}
          <button type="submit" disabled={isLoading} className={`text-xs text-white mt-3 p-1 rounded ${isNewUser ? 'bg-red-500' : (isNewUser === false ? 'bg-green-500' : 'bg-blue-500')}`}>
            Check User
          </button>
        </form>
      </div>
      <div className='w-full lg:w-1/2 px-6'>
        {isNewUser && (
          <form onSubmit={handleSubmit}>
            <label className='text-xs text-white'>Your Name</label>
            <div className='mt-3'>
              <input
                className='border-b-2 w-full'
                type="text"
                placeholder="Name"
                value={first_name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            {nameError && <p className="error text-red-500">{nameError}</p>}
            <button type="submit" disabled={isLoading} className="mt-3 p-1 rounded bg-red-500 text-white">
              Send OTP
            </button>
          </form>
        )}
      </div>
      <div className='w-full lg:w-1/2 px-6'>
        {(isNewUser === false || first_name !== '') && (
          <form onSubmit={handleVerify}>
            <label className='text-xs'>Enter OTP</label>
            <div className='mt-3'>
              <input
                className='border-b-2 w-full'
                type="tel"
                placeholder="Enter OTP Code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
              />
            </div>
            {otpError && <p className="error text-red-500">{otpError}</p>}
            <button className='mt-3 p-1 rounded text-xs bg-red-500 text-white' type="submit" disabled={isLoading}>
              Verify OTP
            </button>
          </form>
        )}
      </div>
      <p className='mt-6 text-center text-sm text-white sm:mt-10'>
        By signing in, you agree to our
        <span className='text-emerald-400'> Terms of Service</span> and
        <span className='text-emerald-400'> Privacy</span>
        <br />
        <span className='text-emerald-400'> Policy</span>
      </p>
    </div>

    {/* <div className='lg:flex flex items-center justify-center flex-grow sm:hidden md:hidden'>
      <img className="h-64 w-64" src='images/hBowler.png' alt='home bowler' />
    </div> */}
  </div>
</div>

    </>
  )
}

export default UserLogin