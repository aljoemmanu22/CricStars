import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import userimg from '../../images/user.png'
import useprofileimg from '../../images/user_profile1.png'
import { set_Authentication } from "../../Redux/authentication/authenticationSlice"; 
import { useDispatch ,useSelector} from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { LocationMarkerIcon, CalendarIcon } from '@heroicons/react/solid';
import { useNavigate } from 'react-router-dom';
import MyCricProfilePhone from './MyCricProfilePhone';


const ProfilePage = () => {

  const dispatch = useDispatch();
  const authentication_user = useSelector(state => state.authentication_user)
  const baseURL='http://127.0.0.1:8000'
  const token = localStorage.getItem('access');
  const fetchUserData = async () => {
    try {
        const res = await axios.get(baseURL+'/api/accounts/user/details/',{headers: {
          'authorization': `Bearer ${token}`,
          'Accept' : 'application/json',
          'Content-Type': 'application/json'
      }})
        .then(res => {
            setUserDetails(res.data)
          })
    }
    catch (error) {
      console.log(error);
    }
  };

////////////////////////////////////////////  Image Update begins////////////////////////////////////////////////////////////////////////////

  const [userImageUpdateDetails, setUserImageUpdateDetails] = useState({
    image:null
  })

  const handleImageChange = (e) => {
    setUserImageUpdateDetails({
      image: e.target.files[0]
    })
  };

  const handleImageUpdateSubmit = (e) => {
    e.preventDefault();
    console.log(userImageUpdateDetails);
    let form_data = new FormData();
    form_data.append('profile_pic', userImageUpdateDetails.image, userImageUpdateDetails.image.name);
    let url = baseURL+'/api/accounts/user/imagedetails/update';
    axios.post(url, form_data, {
      headers: {
        'content-type': 'multipart/form-data',
        'authorization': `Bearer ${token}`,
      }
    })
      .then(res => {
        dispatch(
          set_Authentication({
            name: '',
            isAuthenticated: false
          })
        );

      })
      .catch(err => console.log(err))
  }

////////////////////////////////////                Image update end                /////////////////////////////////




////////////////////////////////////           User Profile Details begins          /////////////////////////////////

  const [userDetails, setUserDetails] = useState(null)

  const [location, setLocation] = useState('');
  const [dob, setDob] = useState('');
  const [playingRole, setPlayingRole] = useState('');
  const [battingStyle, setBattingStyle] = useState('');
  const [bowlingStyle, setBowlingStyle] = useState('');
  const [gender, setGender] = useState('');
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (userDetails) {
      setLocation(userDetails.location || ''); 
      setDob(userDetails.date_of_birth || '');
      setPlayingRole(userDetails.role || '');
      setBattingStyle(userDetails.batting_style || '');
      setBowlingStyle(userDetails.bowling_style || '');
      setGender(userDetails.gender || '');
    }
  }, [userDetails]); 

  const formattedDateOfBirth = dob ? new Date(dob).toISOString().split('T')[0] : '';

  const handleProfileUpdateSubmit = (e) => {

      e.preventDefault()
      const data = {
        location,
        date_of_birth: formattedDateOfBirth,
        role: playingRole,
        batting_style: battingStyle,
        bowling_style: bowlingStyle,
        gender,
      }
      
      axios.post(baseURL + '/api/accounts/user/detail/update/', data, {
        headers: {
          'content-type': 'multipart/form-data',
          'authorization': `Bearer ${token}`,
        }
      })
      .then(response => {
        console.log('Profile updated successfully:', response.data);
        // Handle success (e.g., show a success message, redirect, etc.)
      })
      .catch(error => {
        console.error('Error updating profile:', error.response.data);
        // Handle error (e.g., show error messages)
      });
  }



////////////////////////////////////           User Profile Details ends          //////////////////////////////////




  
  useEffect(() => {
    fetchUserData();

  }, [authentication_user])

  console.log(userDetails)




  return    <div className='h-auto w-full shadow border-slate-100 rounded-b-md'>
                {/* <div className='bg-red-700 relative py-10 pl-10 h-10'>
                    <div className="absolute top-4 flex cursor-pointer">
                        <div className="w-6 h-6 bg-red rounded-full flex items-center justify-center border-2 border-white  mr-2">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>  </svg>
                        </div>
                        <button><p className='text-white text-base'>Edit Profile</p></button>
                    </div>
                </div> */}
        
                <div className="mt-5 mb-5 flex flex-col items-center justify-center relative">
                    <form onSubmit={handleImageUpdateSubmit}>
                        <div className="relative">
                        <img
                            src={userDetails ? (userDetails.profile_pic ? userDetails.profile_pic : userimg) : userimg}
                            className="h-20 w-20 rounded-full border-4 border-white"
                            alt="img"
                        />
                        <div
                            className="absolute bottom-0 right-5 bg-red-600 rounded-full p-1 cursor-pointer"
                            onClick={() => document.getElementById("imageInput").click()}
                        >
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 text-white"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                            </svg>
                        </div>
                        </div>
                        <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        />
                        <button type="submit" className="mt-2">
                            <p className="text-red-700">Change Photo</p>
                        </button>
                    </form>
                </div>
                <form onSubmit={handleProfileUpdateSubmit}>
                    <div className='h-96 w-full bg-white'>
                        <div className='w-full text-black border-b border-slate-300 h-1/6 flex flex-col justify-center'>
                            <label className='pl-4 font-thin text-xs' >Player Name</label>
                            <p className='pl-4 w-full' >{userDetails?.first_name}</p>
                        </div>
                        <div className='w-full text-black border-b border-slate-300 h-1/6 flex flex-col justify-center'>
                            <label className='pl-4 font-thin text-xs' >Phone number</label>
                            <p className='pl-4 w-full' >{userDetails?.phone_number}</p>
                        </div>
                        <div className='w-full text-black border-b border-slate-300 h-1/6 flex flex-col justify-center'>
                            <label className='pl-4 font-thin text-xs' htmlFor='location'>Player Name</label>
                            <input className='pl-4 w-full' placeholder='enter location' type='text' id='location' name='location'
                            value={location} onChange={(e) => setLocation(e.target.value)}/>
                        </div>
                        <div className='w-full text-black border-b border-slate-300 h-1/6 flex flex-col justify-center'>
                            <label className='pl-4 font-thin text-xs' htmlFor='dob'>DOB</label>
                            <DatePicker
                                className='pl-4 w-full'
                                selected={dob}
                                onChange={(date) => setDob(date)}
                                placeholderText='Select Date of Birth'
                                dateFormat='yyyy-MM-dd'
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={15}
                                ref={datePickerRef} // Assign the ref directly
                            />
                        </div>
                        <div className='w-full text-black border-b border-slate-300 h-1/6 flex flex-col justify-center'>
                            <label className='pl-4 font-thin text-xs' htmlFor='playing role'>PLAYING ROLE</label>
                            <input className='pl-4 w-full' placeholder='enter playing role' type='text' id='playing role' name='playing role'
                            value={playingRole} onChange={(e) => setPlayingRole(e.target.value)}/>
                        </div>
                        <div className='w-full text-black border-b border-slate-300 h-1/6 flex flex-col justify-center'>
                            <label className='pl-4 font-thin text-xs' htmlFor='batting style'>BATTING STYLE</label>
                            <input className='pl-4 w-full' placeholder='enter batting style' type='text' id='batting style' name='batting style'
                            value={battingStyle} onChange={(e) => setBattingStyle(e.target.value)}/>
                        </div>
                    </div>  
                    <div className='h-32 bg-white'>
                        <div className='w-full text-black border-b border-slate-300 h-1/2 flex flex-col justify-center'>
                            <label className='pl-4 font-thin text-xs' htmlFor='bowling style'>BOWLING STYLE</label>
                            <input className='pl-4 w-full' placeholder='enter bowling style' type='text' id='bowling style' name='bowling style'
                            value={bowlingStyle} onChange={(e) => setBowlingStyle(e.target.value)}/>
                        </div>
                        <div className='w-full text-black border-b border-slate-300 h-1/2 flex flex-col justify-center'>
                            <label className='pl-4 font-thin text-xs' htmlFor='gender'>GENDER</label>
                            <input className='pl-4 w-full' placeholder='Select gender' type='text' id='gender' name='gender'
                            value={gender} onChange={(e) => setGender(e.target.value)}/>
                        </div>
                    </div>
                    <div className='flex items-center justify-center mt-3'>
                        <button type="submit" className="btn btn-primary bg-teal-500 w-11/12 btn-lg">
                            Update User Profile
                        </button>
                    </div>
                </form>          
            </div>    

};

const PlayedMatches = () => {
  return  <div className='h-screen w-5/6'>
  <div className='shadow border-slate-100 rounded-b-md px-4 py-3'>
  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
    <div className='h-44 w-full bg-white rounded-lg'>
      <div className='w-full border-b border-slate-300 h-1/5 flex items-center justify-center'>
        <p className='text-center'>Individual Match</p>
      </div>
      <div className='w-full h-1/5 flex px-3'>
        <div className='flex items-center'>
          <p className='text-sm flex text-center justify-center'>kanakamala, chalakudy, 27-Apr-2024, 4 overs</p>
        </div>
        <div className='ml-auto flex items-center'>
          <span className='h-5 p-2 rounded-2xl bg-black flex items-center justify-center text-white font-extrabold text-xs'>PAST</span>
        </div>
      </div>
      <div className='w-full h-1/5 flex px-3'>
        <div className='flex items-center'>
          <p className='text-lg flex text-center justify-center text-emerald-600 font-extrabold'>Team 1</p>
        </div>
        <div className='ml-auto flex items-center'>
          <span className='text-lg h-5 p-1 flex items-center justify-center text-emerald-600 font-extrabold'>16/0</span><span className='text-xs'>(4/0)</span>
        </div>
      </div>
      <div className='w-full h-1/5 flex px-3'>
        <div className='flex items-center'>
          <p className='text-lg flex text-center justify-center font-extrabold'>Team 2</p>
        </div>
        <div className='ml-auto flex items-center'>
          <span className='text-lg h-5 p-1 flex items-center justify-center font-extrabold'>15/0</span><span className='text-xs'>(4/0)</span>
        </div>
      </div>
      <div className='w-full h-1/5 flex px-3'>
        <div className='flex items-center'>
          <p className='text-sm flex text-center justify-center space-x-1'><span className='font-extrabold'>Yes</span><span>won by</span><span className='font-extrabold'>1 run</span></p>
        </div>
      </div>
    </div>

    <div className='h-44 w-full bg-white rounded-lg'>
      <div className='w-full border-b border-slate-300 h-1/5 flex items-center justify-center'>
        <p className='text-center'>Individual Match</p>
      </div>
      <div className='w-full h-1/5 flex px-3'>
        <div className='flex items-center'>
          <p className='text-sm flex text-center justify-center'>kanakamala, chalakudy, 27-Apr-2024, 4 overs</p>
        </div>
        <div className='ml-auto flex items-center'>
          <span className='h-5 p-2 rounded-2xl bg-black flex items-center justify-center text-white font-extrabold text-xs'>PAST</span>
        </div>
      </div>
      <div className='w-full h-1/5 flex px-3'>
        <div className='flex items-center'>
          <p className='text-lg flex text-center justify-center text-emerald-600 font-extrabold'>Team 1</p>
        </div>
        <div className='ml-auto flex items-center'>
          <span className='text-lg h-5 p-1 flex items-center justify-center text-emerald-600 font-extrabold'>16/0</span><span className='text-xs'>(4/0)</span>
        </div>
      </div>
      <div className='w-full h-1/5 flex px-3'>
        <div className='flex items-center'>
          <p className='text-lg flex text-center justify-center font-extrabold'>Team 2</p>
        </div>
        <div className='ml-auto flex items-center'>
          <span className='text-lg h-5 p-1 flex items-center justify-center font-extrabold'>15/0</span><span className='text-xs'>(4/0)</span>
        </div>
      </div>
      <div className='w-full h-1/5 flex px-3'>
        <div className='flex items-center'>
          <p className='text-sm flex text-center justify-center space-x-1'><span className='font-extrabold'>Yes</span><span>won by</span><span className='font-extrabold'>1 run</span></p>
        </div>
      </div>
    </div>
  </div>
</div> 
</div> 
     
};

const Teams = () => {
  return    <div className='h-screen w-5/6'>
  <div className='shadow border-slate-100 rounded-b-md px-4 py-3'>
  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
    <div className='h-28 w-full bg-white rounded-lg flex'>
      <div className='w-auto pl-4 pt-3'>
        <img src="/images/AP.png" className="h-20 cursor-pointer" alt="Logo"/>
      </div>
      <div className='pl-2.5 pt-2.5' >
        <div className=' w-72 border-b border-slate-300 h-1/2'>
          <p className='font-medium'>Saranghi Perambra</p>
          <p className='text-sm justify-center'>Since 2/feb/2024</p>
        </div>
        <div className='w-full h-1/2 px-1 flex  items-center'>
          <div className='items-center border-r border-slate-300 pr-2'>
            <p className='text-sm'>Played 1</p>
          </div>
          <div className='items-center border-r border-slate-300 px-2'>
            <p className='text-sm'>Won 1</p>
          </div>
          <div className='items-center border-slate-300 px-2'>
            <p className='text-sm'>Lost 1</p>
          </div>
        </div>
      </div>
    </div>
    <div className='h-28 w-full bg-white rounded-lg flex'>
      <div className='w-auto pl-4 pt-3'>
        <img src="/images/AP.png" className="h-20 cursor-pointer" alt="Logo"/>
      </div>
      <div className='pl-2.5 pt-2.5' >
        <div className=' w-72 border-b border-slate-300 h-1/2'>
          <p className='font-medium'>Saranghi Perambra</p>
          <p className='text-sm justify-center'>Since 2/feb/2024</p>
        </div>
        <div className='w-full h-1/2 px-1 flex  items-center'>
          <div className='items-center border-r border-slate-300 pr-2'>
            <p className='text-sm'>Played 1</p>
          </div>
          <div className='items-center border-r border-slate-300 px-2'>
            <p className='text-sm'>Won 1</p>
          </div>
          <div className='items-center border-slate-300 px-2'>
            <p className='text-sm'>Lost 1</p>
          </div>
        </div>
      </div>
    </div>

    <div className='h-28 w-full bg-white rounded-lg flex'>
      <div className='w-auto pl-4 pt-3'>
        <img src="/images/AP.png" className="h-20 cursor-pointer" alt="Logo"/>
      </div>
      <div className='pl-2.5 pt-2.5' >
        <div className=' w-72 border-b border-slate-300 h-1/2'>
          <p className='font-medium'>Saranghi Perambra</p>
          <p className='text-sm justify-center'>Since 2/feb/2024</p>
        </div>
        <div className='w-full h-1/2 px-1 flex  items-center'>
          <div className='items-center border-r border-slate-300 pr-2'>
            <p className='text-sm'>Played 1</p>
          </div>
          <div className='items-center border-r border-slate-300 px-2'>
            <p className='text-sm'>Won 1</p>
          </div>
          <div className='items-center border-slate-300 px-2'>
            <p className='text-sm'>Lost 1</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>
</div>
};

function UserProfile() {

  const dispatch = useDispatch();
  const authentication_user = useSelector(state => state.authentication_user)

  const baseURL='http://127.0.0.1:8000'
  const token = localStorage.getItem('access');
  const fetchUserData = async () => {
    try {
        const res = await axios.get(baseURL+'/api/accounts/user/details/',{headers: {
          'authorization': `Bearer ${token}`,
          'Accept' : 'application/json',
          'Content-Type': 'application/json'
      }})
        .then(res => {
            setUserDetails(res.data)
          })
    }
    catch (error) {
      console.log(error);
      
    }

  };

  const [userUpdateDetails, setUserUpdateDetails] = useState({
    image:null
  })

  const handleImageChange = (e) => {
    setUserUpdateDetails({
      image: e.target.files[0]
    })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(userUpdateDetails);
    let form_data = new FormData();
    form_data.append('profile_pic', userUpdateDetails.image, userUpdateDetails.image.name);
    let url = baseURL+'/api/accounts/user/details/update';
    axios.post(url, form_data, {
      headers: {
        'content-type': 'multipart/form-data',
        'authorization': `Bearer ${token}`,
      }
    })
        .then(res => {
          dispatch(
            set_Authentication({
              name: '',
              isAuthenticated: false
            })
          );

        })
        .catch(err => console.log(err))
  }




  const [userDetails, setUserDetails] = useState(null)
  const [location, setLocation] = useState('');
  const [dob, setDob] = useState('');
  const [playingRole, setPlayingRole] = useState('');
  const [battingStyle, setBattingStyle] = useState('');
  const [bowlingStyle, setBowlingStyle] = useState('');
  const [gender, setGender] = useState('');
  const [phone_number, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (userDetails) {
      setLocation(userDetails.location || ''); 
      setDob(userDetails.date_of_birth || '');
      setPlayingRole(userDetails.role || 'Batsman');
      setBattingStyle(userDetails.batting_style || 'RHB');
      setBowlingStyle(userDetails.bowling_style || 'Right arm orthodox');
      setGender(userDetails.gender || 'Male');
      setPhoneNumber(userDetails.phone_number || '')
      setEmail(userDetails.email || 'aljoemmanu22@gmail.com')
    }
  }, [userDetails]);


  useEffect(() => {
    fetchUserData();
  
  }, [authentication_user])
  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [activeTab, setActiveTab] = useState('');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfilePage />;
      case 'matches':
        return <PlayedMatches />;
      case 'teams':
        return <Teams />;
      case 'phoneCricprofile':
        return <MyCricProfilePhone />
    }
  }

const navigate = useNavigate()

  const logout=()=>{
    localStorage.clear()
    dispatch(
      set_Authentication({
        name:null,
        isAuthenticated:null,
        isAdmin:false,
      })
    )
    navigate('/')
  }

  const hadndleUserPhoneProfileClick = () => { navigate('phoneprofile')}


  return (
    <div className="h-auto lg:hidden w-auto" style={{backgroundColor: '#eee'}}>
        {activeTab == '' && 
        
        <div>
            <div className='bg-red-700 relative py-10 pl-32 h-10'>
                <div className="absolute top-4 right-4 flex items-center cursor-pointer">
                    <button onClick={() => setActiveTab('phoneCricprofile')}><p className='text-white text-base mr-2'>My Cricket Profile</p></button>
                    <div className="w-6 h-6 bg-red rounded-full flex items-center justify-center border-2 border-white">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/></svg>                </svg>
                    </div>
                </div>
                <div className="absolute -bottom-16 left-4">
                    <img src={userDetails?userDetails.profile_pic?userDetails.profile_pic:userimg:userimg} className="h-20 w-20 rounded-full border-4 border-white" alt='img'/>
                </div>
            </div>
            <div className='flex flex-col items-center text-center w-full'>
                <div className='w-full flex justify-center pt-2 pl-16'>
                    <div className='w-1/2 text-left'>
                    <p className='text-black text-xl font-bold'>Aljo Jose</p>
                    </div>
                </div>
                <div className='w-full flex justify-center items-center pt-2 pl-16'>
                    <div className='w-1/2 flex items-center text-left'>
                    <LocationMarkerIcon className='h-5 w-5 text-teal-500 mr-2' />
                    <p className='text-black text-sm font-normal'>Chalakudy</p>
                    </div>
                </div>
                <div className='w-full flex justify-center items-center pt-2 pb-2 pl-16'>
                    <div className='w-1/2 flex items-center text-left'>
                    <CalendarIcon className='h-5 w-5 text-teal-500 mr-2' />
                    <p className='text-black text-sm font-normal'>Since 06-Oct-2022</p>
                    </div>
                </div>
            </div>
            <div className=' bg-teal-500 h-6'>

            </div>
            <div className='h-auto w-full bg-white mb-4'>
                <div className='flex w-full'>
                    <div className="pt-4 pl-4 flex items-center">
                        <p className='text-black text-lg font-bold mr-2'>My Profile</p>
                    </div>
                    <div className="flex-grow"></div>
                    <div className="pt-4 flex justify-end">
                        <button onClick={() => setActiveTab('profile')}><p className='text-teal-500 text-lg font-bold mr-4'>EDIT</p></button>
                    </div>
                </div>
                <div className='w-full pt-4 text-gray-400 h-1/6 flex'>
                    <div className='w-1/2'>
                        <p className='font-normal text-xs pl-4'>MOBILE NUMBER</p>
                        <p className='pl-4 w-1/5 pt-1 text-black'>{phone_number}</p>
                    </div>
                    <div className=''>
                        <p className='font-normal text-xs'>GENDER</p>
                        <p className='w-1/5 pt-1 text-black'>{gender}</p>
                    </div>
                </div>
                <div className='w-full pt-4 text-gray-400 h-1/6 flex'>
                    <div className='w-1/2'>
                        <p className='font-normal text-xs pl-4'>PLAYING ROLE</p>
                        <p className='pl-4 w-1/5 pt-1 text-black'>{playingRole}</p>
                    </div>
                    <div className=''>
                        <p className='font-normal text-xs'>BATTING STYLE</p>
                        <p className='w-1/5 pt-1 text-black'>{battingStyle}</p>
                    </div>
                </div>
                <div className='w-full pt-4 text-gray-400 h-1/6 flex'>
                    <div className='w-1/2'>
                        <p className='font-normal text-xs pl-4'>BOWLING STYLE</p>
                        <p className='pl-4 w-auto pt-1 text-black'>{bowlingStyle}</p>
                    </div>
                    <div className=''>
                        <p className='font-normal text-xs text-justify'>DATE OF BIRTH</p>
                        <p className='w-auto pt-1 text-black'>{dob}</p>
                    </div>
                </div>
                <div className='w-full pt-4 text-gray-400 h-1/6 flex pb-4'>
                    <div className='w-1/2'>
                        <p className='font-normal text-xs pl-4'>Email</p>
                        <p className='pl-4 w-1/5 pt-1 text-black'>{email}</p>
                    </div>
                </div>
            </div>  
            <div className='flex items-center justify-center pb-4'>
                <button onClick={logout} type="submit" className="btn btn-primary btn-lg bg-gray-400">
                    LOGOUT
                </button>
            </div>
        </div>
}
        {activeTab == 'profile' &&  
            <div className='bg-red-700 relative py-10 pl-10 h-10'>
                <div className="absolute top-4 flex cursor-pointer">
                    <div className="w-6 h-6 bg-red rounded-full flex items-center justify-center border-2 border-white  mr-2">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                        </svg>
                    </div>
                    <button onClick={() => setActiveTab('')}><p className='text-white text-base'>Edit Profile</p></button>
                </div>
            </div>
            }
            
        <div className='flex mb-2 w-full justify-center'>
            {renderContent()}
        </div>
        {/* <div className='my-2.5 flex items-center mx-auto'>
            <div className='bg-red-700 h-12 w-5/6 rounded-t-md text-white flex items-center justify-center'>
                <div className="tabs flex space-x-40 text-center">
                <button
                    className={`tab ${activeTab === 'profile' ? 'font-bold' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    User Profile
                </button>
                <button
                    className={`tab ${activeTab === 'matches' ? 'font-bold' : ''}`}
                    onClick={() => setActiveTab('matches')}
                >
                    Played Matches
                </button>
                <button
                    className={`tab ${activeTab === 'teams' ? 'font-bold' : ''}`}
                    onClick={() => setActiveTab('teams')}
                >
                    Teams
                </button>
                </div>
            </div>
        </div> */}
  </div>
  )
}

export default UserProfile