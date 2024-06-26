import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { set_Authentication } from "../../Redux/authentication/authenticationSlice";
import { useDispatch, useSelector } from 'react-redux';

function UserHome() {

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const authentication_user = useSelector(state => state.authentication_user)
  const [userDetails, setUserDetails] = useState(null)
  const [liveMatches, setLiveMatches] = useState([]);
  const [scheduledMatches, setScheduledMatches] = useState([]);

  const baseURL = 'http://127.0.0.1:8000'
  const token = localStorage.getItem('access');
  const fetchUserData = async () => {
    try {
      const res = await axios.get(baseURL + '/api/accounts/user/details/', {
        headers: {
          'authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          setUserDetails(res.data)
        })
    }
    catch (error) {
      console.log(error);
    }
  };

  const handleStartMatch = () => {
    navigate('start-match')
  }

  useEffect(() => {
    axios.get(baseURL + '/api/matches/live-scheduled/', {
      headers: {
        'authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setLiveMatches(response.data.live_matches);
        setScheduledMatches(response.data.scheduled_matches);
        console.log(response.data)
      })
      .catch(error => {
        console.error('There was an error fetching the matches!', error);
      });
  }, []);

  useEffect(() => {
    fetchUserData();

  }, [authentication_user])

  console.log(userDetails)

  return (
    <div className='sm:my-0 h-auto md:my-10 lg:my-0 flex flex-col items-center mx-auto bg-slate-100'>
      {userDetails &&
        <div className='bg-black font-medium text-sm w-1/3 flex flex-row my-4 p-2 rounded-lg sm:w-11/12'>
          <div>
            <p className='text-white'>
              Want to start a match ?
            </p>
          </div>
          <div className='flex-grow'></div>
          <div>
            <button onClick={handleStartMatch}>
              <p className='text-emerald-600'>
                START A MATCH
              </p>
            </button>
          </div>
        </div>
      }

      {userDetails == null &&
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow bg-slate-200 sm:hidden lg:block">
            <img src='/images/Home.png' alt="Home" />
          </main>
          <main className="flex-grow bg-slate-200 lg:hidden">
            <img src='/images/phoneHome.png' alt="Home" />
          </main>
        </div>}


      {userDetails &&

        <div className='sm:w-full h-auto md:w-4/6 w-3/6 shadow border-slate-100 rounded-b-md px-3 lg:px4 py-3 lg:bg-black-rgba sm:bg-slate-50'>
          <div className='grid grid-cols-1 2xl:grid-cols-2 gap-4'>

            <div>
              <h2 className='font-bold text-2xl mb-3'>Live Matches</h2>
              {liveMatches.length === 0 ? (
                <p>No live matches available.</p>
              ) : (
                liveMatches.map(match => (
                  <div key={match.match.id} className='lg:p-4 border cursor-pointer' onClick={() => navigate(`/match-details/${match.match.id}`)}>
                    <div className='h-44 w-full bg-white rounded-lg'>
                      <div className='w-full border-b border-slate-300 h-1/5 flex items-center justify-center'>
                        <p className='text-center sm:text-sm'>{match.match.home_team.team_name} vs {match.match.away_team.team_name}</p>
                      </div>
                      <div className='w-full h-1/5 flex px-3'>
                        <div className='flex items-center'>
                          <p className='sm:text-xs text-sm flex text-center justify-center'>
                            created by, {match.match.created_by.first_name} {match.match.created_by.last_name}, {match.match.date}, {match.match.overs} overs
                          </p>
                        </div>
                        <div className='ml-auto flex items-center'>
                          <span className='h-5 p-2 rounded-2xl bg-black flex items-center justify-center text-white font-extrabold text-xs'>{match.match.status}</span>
                        </div>
                      </div>
                      <div className='w-full h-1/5 flex px-3'>
                        <div className='flex items-center'>
                          <p className='text-lg flex text-center justify-center text-emerald-600 font-extrabold'>{match.match.home_team.team_name}</p>
                        </div>
                        <div className='ml-auto flex items-center'>
                        <span className='text-lg h-5 p-1 flex items-center justify-center text-emerald-600 font-extrabold'>{match.last_ball_innings1 ? `${match.last_ball_innings1.total_runs}/${match.last_ball_innings1.total_wickets}` : '0/0'}</span><span className='text-xs'>({match.last_ball_innings1 ? `${match.last_ball_innings1.overs}/${match.last_ball_innings1.balls}` : `${match.match.overs}/0`})</span>
                        </div>
                      </div>
                      <div className='w-full h-1/5 flex px-3'>
                        <div className='flex items-center'>
                          <p className='text-lg flex text-center justify-center font-extrabold'>{match.match.away_team.team_name}</p>
                        </div>
                        <div className='ml-auto flex items-center'>
                        <span className='text-lg h-5 p-1 flex items-center justify-center text-emerald-600 font-extrabold'>{match.last_ball_innings2 ? `${match.last_ball_innings2.total_runs}/${match.last_ball_innings2.total_wickets}` : '0/0'}</span><span className='text-xs'>({match.last_ball_innings2 ? `${match.last_ball_innings2.overs}/${match.last_ball_innings2.balls}` : `${match.match.overs}/0`})</span>
                        </div>
                      </div>
                      <div className='w-full h-1/5 flex px-3 border-t border-slate-300'>
                          <div className='flex items-center'>
                            <p className='text-sm lg:flex lg:text-center lg:justify-center space-x-1'>
                              <span className='font-extrabold'>{match.match.toss_winner}</span>
                              <span>won the toss and elected to</span>
                              <span className='font-extrabold'>{match.match.elected_to}</span>
                              <span>first</span>
                            </p>
                          </div>
                        </div>
                    </div>
                  </div>
                ))
              )}
            </div>


            <div>
              <h2 className='font-bold text-2xl mb-3'>Scheduled Matches</h2>
              <div>
                {scheduledMatches.length === 0 ? (
                  <p>No scheduled matches available.</p>
                ) : (
                  scheduledMatches.map(match => (
                    <div key={match.id} className='p-4 border'>
                      <div className='h-44 w-full bg-white rounded-lg'>
                        <div className='w-full border-b border-slate-300 h-1/5 flex items-center justify-center'>
                          <p className='text-center'>{match.home_team.team_name} vs {match.away_team.team_name}</p>
                        </div>
                        <div className='w-full h-1/5 flex px-3'>
                          <div className='flex items-center'>
                            <p className='text-sm flex text-center justify-center'>
                              created by, {match.created_by.first_name} {match.created_by.last_name}, {match.date}, {match.overs} overs
                            </p>
                          </div>
                          <div className='ml-auto flex items-center'>
                            <span className='h-5 p-2 rounded-2xl bg-black flex items-center justify-center text-white font-extrabold text-xs'>{match.status}</span>
                          </div>
                        </div>
                        <div className='w-full h-1/5 flex px-3'>
                          <div className='flex items-center'>
                            <p className='text-lg flex text-center justify-center text-emerald-600 font-extrabold'>{match.home_team.team_name}</p>
                          </div>
                          <div className='ml-auto flex items-center'>
                            <span className='text-lg h-5 p-1 flex items-center justify-center text-emerald-600 font-extrabold'>0/0</span><span className='text-xs'>({match.overs}/0)</span>
                          </div>
                        </div>
                        <div className='w-full h-1/5 flex px-3'>
                          <div className='flex items-center'>
                            <p className='text-lg flex text-center justify-center font-extrabold'>{match.away_team.team_name}</p>
                          </div>
                          <div className='ml-auto flex items-center'>
                            <span className='text-lg h-5 p-1 flex items-center justify-center font-extrabold'>0/0</span><span className='text-xs'>({match.overs}/0)</span>
                          </div>
                        </div>
                        <div className='w-full h-1/5 flex px-3 border-t border-slate-300'>
                          <div className='flex items-center'>
                            <p className='text-sm flex text-center justify-center space-x-1'>
                              <span className='font-extrabold'>{match.toss_winner}</span>
                              <span>won the toss and elected to</span>
                              <span className='font-extrabold'>{match.elected_to}</span>
                              <span>first</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>}
    </div>
  )
}

export default UserHome
