import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function PastMatches() {

  const navigate = useNavigate()
  const baseURL = 'http://127.0.0.1:8000'
  const token = localStorage.getItem('access');
  const [PastMatchess, setPastMatchess] = useState([])


  useEffect(() => {
    axios.get(baseURL + '/api/matches/scorecard-past/', {
      headers: {
        'authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log(response.data)
        setPastMatchess(response.data.past_matches);
        console.log(response.data)
      })
      .catch(error => {
        console.error('There was an error fetching the matches!', error);
      });
  }, []);


  return (
    <div className='sm:my-0 h-auto md:my-10 lg:my-0 flex flex-col items-center mx-auto bg-slate-100'>
      <div className='sm:w-full h-auto md:w-4/6 w-3/6 shadow border-slate-100 rounded-b-md px-4 py-3 my-4 bg-black-rgba'>
        


          <div>
            <h2 className='font-bold text-2xl mb-3'>Past Matches</h2>
            <div className='grid grid-cols-1 2xl:grid-cols-2 gap-4'>
              {PastMatchess.length === 0 ? (
                <p>No past matches available.</p>
              ) : (
                PastMatchess.map(match => (
                  <div key={match.match.id} className='p-4 border cursor-pointer' onClick={() => navigate(`/match-details/${match.match.id}`)}>
                    <div className='h-44 w-full bg-white rounded-lg'>
                      <div className='w-full border-b border-slate-300 h-1/5 flex items-center justify-center'>
                        <p className='text-center'>{match.match.home_team.team_name} vs {match.match.away_team.team_name}</p>
                      </div>
                      <div className='w-full h-1/5 flex px-3'>
                        <div className='flex items-center'>
                          <p className='text-sm flex text-center justify-center'>
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
                          <span className='text-lg h-5 p-1 flex items-center justify-center text-emerald-600 font-extrabold'>{match.last_ball_innings1.total_runs}/{match.last_ball_innings1.total_wickets}</span><span className='text-xs'>({match.last_ball_innings1.balls === 6 ? match.last_ball_innings1.overs + 1 : match.last_ball_innings1.overs}/{match.last_ball_innings1.balls === 6 ? 0 : match.last_ball_innings1.balls})</span>
                        </div>
                      </div>
                      <div className='w-full h-1/5 flex px-3'>
                        <div className='flex items-center'>
                          <p className='text-lg flex text-center justify-center font-extrabold'>{match.match.away_team.team_name}</p>
                        </div>
                        <div className='ml-auto flex items-center'>
                          <span className='text-lg h-5 p-1 flex items-center justify-center font-extrabold'>{match.last_ball_innings2.total_runs}/{match.last_ball_innings2.total_wickets}</span><span className='text-xs'>({match.last_ball_innings2.balls === 6 ? match.last_ball_innings2.overs + 1 : match.last_ball_innings2.overs}/{match.last_ball_innings2.balls === 6 ? 0 : match.last_ball_innings2.balls})</span>
                        </div>
                      </div>
                      <div className='w-full h-1/5 flex px-3 border-t border-slate-300'>
                        <div className='flex items-center'>
                          <p className='text-sm flex text-center justify-center space-x-1'>
                            {match.match.result}
                            {/* <span className='font-extrabold'>{match.match.toss_winner}</span>
                            <span>won the toss and elected to</span>
                            <span className='font-extrabold'>{match.match.elected_to}</span>
                            <span>first</span> */}
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
    </div>
  )
}

export default PastMatches
