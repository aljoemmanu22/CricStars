import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import userimg from '../../images/user.png'
import useprofileimg from '../../images/user_profile1.png'
import { set_Authentication } from "../../Redux/authentication/authenticationSlice"; 
import { useDispatch ,useSelector} from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


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




  return  <div className='h-auto w-5/6 shadow border-slate-100 rounded-b-md px-4 py-3'>
            <div className="container py-5">
              <div className="row d-flex justify-content-center align-items-center ">
                <div className="col-md-12 col-xl-4">
                  <div className="card" style={{borderRadius:'15px'}}>
                    <div className="card-body flex flex-col items-center text-center">
                      <div className="mt-3 mb-4 flex items-center justify-center">
                        <img src={userDetails?userDetails.profile_pic?userDetails.profile_pic:userimg:userimg} className="rounded-full h-24" style={{width: '100px'}} alt='img'/>
                      </div>
                      <h4 className="mb-2 font-bold">{userDetails?.first_name}</h4>
                      <p className="text-muted mb-2">{userDetails?.phone_number}</p>           
                      <form onSubmit={handleImageUpdateSubmit}>
                        <input type="file" id="image" accept="image/png, image/jpeg" className='form-control mb-2'  onChange={handleImageChange} required/>
                        <button type="submit" className="btn btn-primary btn-rounded btn-lg">
                          Update Profile Pic
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <form onSubmit={handleProfileUpdateSubmit}>
              <div className='h-96 w-full bg-white'>
                <div className='w-full text-black border-b border-slate-300 h-1/6 flex flex-col justify-center'>
                  <label className='pl-4 font-semibold' htmlFor='location'>LOCATION</label>
                  <input className='pl-4 w-1/5' placeholder='enter location' type='text' id='location' name='location'
                  value={location} onChange={(e) => setLocation(e.target.value)}/>
                </div>
                <div className='w-full text-black border-b border-slate-300 h-1/6 flex flex-col justify-center'>
                  <label className='pl-4 font-semibold' htmlFor='dob'>DOB</label>
                  <DatePicker
                    className='pl-4 w-1/5'
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
                  <label className='pl-4 font-semibold' htmlFor='playing role'>PLAYING ROLE</label>
                  <input className='pl-4 w-1/5' placeholder='enter playing role' type='text' id='playing role' name='playing role'
                  value={playingRole} onChange={(e) => setPlayingRole(e.target.value)}/>
                </div>
                <div className='w-full text-black border-b border-slate-300 h-1/6 flex flex-col justify-center'>
                  <label className='pl-4 font-semibold' htmlFor='batting style'>BATTING STYLE</label>
                  <input className='pl-4 w-1/5' placeholder='enter batting style' type='text' id='batting style' name='batting style'
                  value={battingStyle} onChange={(e) => setBattingStyle(e.target.value)}/>
                </div>
                <div className='w-full text-black border-b border-slate-300 h-1/6 flex flex-col justify-center'>
                  <label className='pl-4 font-semibold' htmlFor='bowling style'>BOWLING STYLE</label>
                  <input className='pl-4 w-1/5' placeholder='enter bowling style' type='text' id='bowling style' name='bowling style'
                  value={bowlingStyle} onChange={(e) => setBowlingStyle(e.target.value)}/>
                </div>
                <div className='w-full text-black border-b border-slate-300 h-1/6 flex flex-col justify-center'>
                  <label className='pl-4 font-semibold' htmlFor='gender'>GENDER</label>
                  <input className='pl-4 w-1/5' placeholder='Select gender' type='text' id='gender' name='gender'
                  value={gender} onChange={(e) => setGender(e.target.value)}/>
                </div>
              </div>  
              <div className='flex items-center justify-center mt-3'>
                <button type="submit" className="btn btn-primary btn-rounded btn-lg">
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
      // default:
      //   return <ProfilePage />;
    }
  }



  return (
  <div className="h-auto sm:hidden md:hidden lg:block" style={{backgroundColor: '#eee'}}>
    <div className='bg-red-700 py-16 pl-32 h-64'>
      <div className="h-36 flex">
        <img src={useprofileimg} className="img-fluid" alt='img'/>
        <div className='flex-col'>
          <p className='text-orange-500 pl-5 text-2xl'>Hard Hitter</p>
          <p className='text-white pl-5 text-2xl'>Aljo Jose</p>
          <p className='text-orange-500 pl-5 text-2xl'>----------------------------</p>
          <p className='text-white pl-5 text-base'>RHB | Right-Leg Break</p>
        </div>   
        <div className='flex pl-96 text-center justify-between h-auto'>
          <div className='bg-black-rgba text-center mr-4 p-4 h-32 w-32 rounded-lg'>
            <p className='text-4xl text-white font-bold'>38</p>
            <p className='text-xl text-white'>Matches</p>
          </div>
          <div className='bg-black-rgba text-center mr-4 p-4 h-32 w-32 rounded-lg'>
            <p className='text-4xl text-white font-bold'>246</p>
            <p className='text-xl text-white'>Runs</p>
          </div>
          <div className='bg-black-rgba text-center mr-4 p-4 h-32 w-32 rounded-lg'>
            <p className='text-4xl text-white font-bold'>0</p>
            <p className='text-xl text-white'>Wickets</p>
          </div>
        </div>
      </div>
    </div>
    <div className='my-2.5 flex flex-col items-center mx-auto'>
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
      {renderContent()}
    </div>
  </div>
  )
}

export default UserProfile