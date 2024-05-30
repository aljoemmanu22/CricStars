import React, { useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import axios from 'axios'
function UserRegister() {

  const [formError, setFormError] = useState([])
  const navigate = useNavigate();
  const baseURL='http://127.0.0.1:8000'

 const handleRegisterSubmit = async (event)=>{
  event.preventDefault();
  setFormError([])
  const formData = new FormData();
  formData.append("first_name", event.target.first_name.value);
  formData.append("email", event.target.email.value);
  formData.append("password", event.target.password.value);
  formData.append("phone_number", event.target.phone_number.value);
  
  try {
    const res = await axios.post(baseURL+'/api/accounts/register/', formData)
    if(res.status === 201){
      navigate('/login',
      {
        state:res.data.Message
      })
      return res
    }  
    
  }
  catch (error) {
    
    if (error.response.status===406)
    {
      console.log("error")
      console.log(error.response.data)
      setFormError(error.response.data)
    }
    else
    {
      console.log(error);

    }
  }
 }



////////////////////////////////////////////////////////////////////////////////
const [phoneNumber, setPhoneNumber] = useState('');
const [isNewUser, setIsNewUser] = useState(null);
const [username, setName] = useState('');
const [otpCode, setOtpCode] = useState('');





const handleCheckUser = async (e) => {
  e.preventDefault();
  // dispatch(setLoading(true));
  // dispatch(setError(null));

  try {
    const response = await axios.post(baseURL + 'check-user/', { phone_number: phoneNumber });
    console.log('Check User Response:', response.data); // Add this line
    setIsNewUser(!response.data.user_exists);
    
    // If user exists, send OTP immediately
    if (response.data.user_exists) {
      navigate('/login')
      console.log('user_exists', response.data); // For debugging (remove in production)
    }
  } catch (error) {
    // dispatch(setError('Error checking user.'));
  } finally {
    // dispatch(setLoading(false));
  }
}



  return (
    <>
      <div className='flex justify-between h-full border-t-2 border-neutral-900	'>
        <div className='bg-red-800 flex flex-col items-center justify-center flex-grow'>
          <img className="h-64 w-64" src='images/hBatter.png' alt='Home batter'/>
        </div>
        <div className='bg-stone-50 flex flex-col justify-center items-center w-auto mx-6 mb-32'>
          <img className="h-64 w-64 mt-10" src="images/hBat.png" alt="Baseball Bat" />
          <p1 className='mt-32 font-semibold text-4xl'>Welcome to cricStars</p1>
          <div className='flex items-center mt-8'>
            <hr className="border-t-2 border-gray-400 w-1/2"/>
            <p className='justify-center w-96 text-center'>JOIN OUR FAM</p>
            <hr className="w-1/2 border-t-2 border-gray-400"/>
          </div>
          {/* {error && <p className="error">{error}</p>} */}
          <div className='-ml-40'>
            <form onSubmit={handleCheckUser} className='mt-6'>
              <label className='text-xs mt-3'>Mobile Number</label>
              <div className=''>
                <input
                  className='border-b-2 w-full'
                  type="tel"
                  placeholder="enter number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={`text-xs text-white mt-3 p-1 rounded ${isNewUser ? 'bg-red-500' : (isNewUser === false ? 'bg-green-500' : 'bg-blue-500')}`}>
                Check User
              </button>
            </form>
          </div>
          <div className='-ml-40'>
            {isNewUser && (
              <form onSubmit={''}>
              <label className='text-xs mt-3'>Your Name</label>
              <div className=''>
                <input
                  className='border-b-2 w-full'
                  type="text"
                  placeholder="Name"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <label className='text-xs'>Your Email</label>
              <div className='mt-3'>
                <input
                  className='border-b-2 w-full'
                  type="email"
                  placeholder="first_name"
                  required
                />
              </div>
              <button type="submit">
                Send OTP
              </button>
            </form>
            )}
            <form onSubmit={''}>
              <label className='text-xs mt-3'>Your Name</label>
              <div className=''>
                <input
                  className='border-b-2 w-full'
                  type="text"
                  placeholder="name"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <label className='text-xs mt-3'>Your Email</label>
              <div className=''>
                <input
                  className='border-b-2 w-full'
                  type="email"
                  placeholder="email"
                  required
                />
              </div>
              <label className='text-xs mt-3'>Your Password</label>
              <div className=''>
                <input
                  className='border-b-2 w-full'
                  type="Password"
                  placeholder="password"
                  required
                />
              </div>
              <button type="submit" className='mt-3'>
                Send OTP
              </button>
            </form>
          </div>
          <div className='-ml-40'>
            {(isNewUser === false || username !== '') && (
              <form onSubmit={''}>
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
                <button className='mt-3 p-1 rounded text-xs bg-red-500 text-white' type="submit">
                  Verify OTP
                </button>
              </form>
            )}
          </div>
          <p className='mt-6'>
            By signing in, you agree to our
            <span className='text-emerald-400'> Terms of Service</span> and
            <span className='text-emerald-400'> Privacy</span>
            <span className='flex justify-center items-center'>
              <br /> {/* Add a line break */}
              <span className='text-emerald-400'> Policy</span>
            </span>
          </p>
        </div>
        <div className='bg-red-800 flex items-center justify-center flex-grow'>
          <img className="h-64 w-64" src='images/hBowler.png' alt='home bowler'/>
        </div>
      </div> 
    </>
  )
}

export default UserRegister