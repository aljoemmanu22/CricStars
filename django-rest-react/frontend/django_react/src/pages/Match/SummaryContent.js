import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SummaryContent({ matchId }) {

  const [extendedScorecard, setExtendedScorecard] = useState(null);
  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');

  useEffect(() => {
    axios.get(`${baseURL}/api/summary/${matchId}/summary-card/`, {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      setExtendedScorecard(response.data);
    })
    .catch((error) => {
      console.error('There was an error fetching the extended scorecard!', error);
    });
  }, [matchId, token]);

  return (
    <div className=''>
      <div className=''>
        <p className='font-bold text-lg py-2 border-b pl-4'>Best Performances</p>
      </div>
      <div className='bg-slate-100 flex items-center justify-between border-b'>
        <div>
          <p className='pl-4 py-2'>Batters</p>
        </div>
        <div className='flex'>
          <p className='w-10'>R</p>
          <p className='w-10 '>B</p>
          <p className='w-10'>4s</p>
          <p className='w-10 '>6s</p>
          <p className='w-10 '>SR</p>
        </div>
      </div>
      {extendedScorecard && extendedScorecard.top_batters.map((batter, index) => (
        <div key={index} className='bg-white flex items-center justify-between border-b'>
          <div>
            <p className='pl-4 py-2'>{batter.player_name}</p>
          </div>
          <div className='flex'>
            <p className='w-10'>{batter.batting_runs_scored}</p>
            <p className='w-10'>{batter.batting_balls_faced}</p>
            <p className='w-10'>{batter.batting_fours}</p>
            <p className='w-10'>{batter.batting_sixes}</p>
            <p className='w-10'>{batter.batting_strike_rate}</p>
          </div>
        </div>
      ))}
      
      <div className='bg-slate-100 flex items-center justify-between border-b'>
        <div>
          <p className='pl-4 py-2'>Bowlers</p>
        </div>
        <div className='flex'>
          <p className='w-10'>R</p>
          <p className='w-10'>M</p>
          <p className='w-10'>O</p>
          <p className='w-10'>W</p>
          <p className='w-10'>EC</p>
        </div>
      </div>
      {extendedScorecard && extendedScorecard.top_bowlers.map((bowler, index) => (
        <div key={index} className='bg-white flex items-center justify-between border-b'>
          <div>
            <p className='pl-4 py-2'>{bowler.player_name}</p>
          </div>
          <div className='flex'>
            <p className='w-10'>{bowler.bowling_overs}</p>
            <p className='w-10'>{bowler.bowling_maiden_overs}</p>
            <p className='w-10'>{bowler.bowling_runs_conceded}</p>
            <p className='w-10'>{bowler.bowling_wickets}</p>
            <p className='w-10'>{bowler.economy}</p>
          </div>
        </div>
      ))}
    </div>
    
  )
}

export default SummaryContent
