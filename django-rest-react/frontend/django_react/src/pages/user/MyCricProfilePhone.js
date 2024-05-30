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


function MyCricProfilePhone() {

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

  const [userDetails, setUserDetails] = useState(null)

  useEffect(() => {
    fetchUserData();

  }, [authentication_user])

  console.log(userDetails)

  const [currentView, setCurrentView] = useState('matches');

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const navigate = useNavigate()

  return (
    <div className='w-full'>
      <div className='bg-black h-auto w-full'>
        <div className="flex pl-4 pt-3">
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center border-2 border-white">
            <a href='profile'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            </a>
          </div>
        </div>
        <div className='relative'>
          <div className='pt-4 pl-10 absolute'>
            <img src={userDetails ? (userDetails.profile_pic ? userDetails.profile_pic : userimg) : userimg} className="h-16 w-16 rounded-full border-4 border-white" alt="img" />
          </div>
          <div className='flex flex-col items-center text-center w-full pt-1'>
            <div className='w-full flex justify-center pt-2'>
              <div className='w-3/4 text-left pl-20'>
                <p className='text-white text-xl font-bold'>Aljo Jose</p>
              </div>
            </div>
            <div className='w-full flex justify-center items-center pt-2'>
              <div className='w-3/4 flex items-center text-left pl-20'>
                <LocationMarkerIcon className='h-5 w-5 text-teal-500 mr-2' />
                <p className='text-white text-sm font-normal'>Chalakudy</p>
              </div>
            </div>
            <div className='w-full flex justify-center items-center pt-2 pb-2'>
              <div className='w-3/4 flex items-center text-left pl-20'>
                <CalendarIcon className='h-5 w-5 text-teal-500 mr-2' />
                <p className='text-white text-sm font-normal'>Since 06-Oct-2022</p>
              </div>
            </div>
          </div>
        </div>
        <nav className='w-full bg-gray-800 mt-10'>
          <div className='flex justify-around'>
            <button
              className={`py-2 px-4 w-full text-center ${currentView === 'matches' ? 'text-teal-500' : 'text-white'}`}
              onClick={() => handleViewChange('matches')}
              >
              Matches
            </button>
            <button
                className={`py-2 px-4 w-full text-center ${currentView === 'teams' ? 'text-teal-500' : 'text-white'}`}
                onClick={() => handleViewChange('teams')}
              >
              Teams
            </button>
          </div>
        </nav>
      </div>
      <div className='pt-2'>
        {currentView === 'matches' && (
          <div className='h-screen w-full'>
            <div className='shadow border-slate-100 rounded-b-md py-0'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
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
        )}
        {currentView === 'teams' && (
          <div className='h-screen w-full'>
            <div className='shadow border-slate-100 rounded-b-md py-1'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='h-28 w-full bg-white rounded-lg flex'>
                  <div className='w-auto pl-4 pt-3'>
                    <img src="/images/AP.png" className="h-20 cursor-pointer" alt="Logo"/>
                  </div>
                  <div className='pl-2.5 pt-2.5' >
                    <div className='w-auto border-b border-slate-300 h-1/2'>
                      <p className='font-medium'>Saranghi Perambra</p>
                      <p className='text-sm justify-center'>Since 2/feb/2024</p>
                    </div>
                    <div className='w-auto h-1/2 px-1 flex items-center'>
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
                    <div className='w-auto border-b border-slate-300 h-1/2'>
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
                    <div className='w-auto border-b border-slate-300 h-1/2'>
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
        )}
      </div>
    </div>
    
  )
}

export default MyCricProfilePhone
