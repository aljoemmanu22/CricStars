import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MVP({ matchId }) {

  const [players, setPlayers] = useState([]);
  const [rank, setRank] = useState(1); // State to track player rank

  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');

  useEffect(() => {
    axios.get(baseURL + `/api/matches/${matchId}/points/`, {
      headers: {
        'authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => setPlayers(response.data.players))
    .catch(error => console.error('Error fetching player points:', error));
  }, [matchId]);


  return (
    <div>
      <div className='flex items-center py-3 pl-3 border-b'>
        <p className='lg:text-2xl'>MVP (Most Valuable Player)</p>
        <p className='rounded-full bg-slate-400 w-5 flex items-center justify-center text-white font-lg h-5 ml-3'>?</p>
      </div>
      {players.map((player, index) => (
        <div key={player.player_id} className='sm:text-sm flex items-center justify-between  border-b'>
          <div className='flex items-center py-1 pl-3'>
            <div>
              <img className='pl-1 py-3 h-18 w-16' src='/images/user_profile1.png'/>
            </div>
            <div className='pl-3 pb-1'>
              <div>
                <p className='font-bold text-lg sm:text-sm'>{player.name}<span className=' text-base font-normal'>({player.team_name})</span></p>
              </div>
              <div className='flex text-gray-500 -mb-3'>
                <p className='w-20'>Batting</p>
                <p className='w-20'>Bowling</p>
                <p className='w-20'>Total</p>
              </div>
              <div className='flex pl-16 py-0 m-0 font-semibold'>
                <p className='w-20 p-0 m-0'>+</p>
                <p className='w-20 p-0 m-0'>=</p>
              </div>
              <div className='flex text-gray-500 -mt-3 font-semibold'>
                <p className='w-20'>{player.batting_mvp_points.toFixed(2)}</p>
                <p className='w-20'>{player.bowling_mvp_points.toFixed(2)}</p>
                <p className='w-20'>{player.total_mvp_points.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className='pr-7 sm:pr-4'>
            <p className='rounded-full text-xl sm:text-sm bg-orange-300 w-10 h-10 sm:w-7 sm:h-7 flex items-center justify-center bg-opacity-55 border border-orange-700 border-spacing-2'>{rank + index}</p>
          </div>
        </div>
      ))}
      
    </div>
  )
}

export default MVP
