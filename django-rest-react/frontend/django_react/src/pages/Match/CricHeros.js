import React, { useEffect, useState } from 'react';
import axios from 'axios';


function CricHeros({ matchId }) {

  const [awards, setAwards] = useState(null);

  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');

  useEffect(() => {
    axios.get(baseURL + `/api/matches/${matchId}/awards/`, {
        headers: {
            'authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => setAwards(response.data))
    .catch(error => console.error('Error fetching awards:', error));
  }, [matchId]);

  if (!awards) {
    return <div>Loading...</div>;
  }

  const { man_of_the_match, best_batter, best_bowler } = awards;

  return (
    <div className='bg-black-rgba'>
      {console.log(awards)}
      <div className='flex bg-red-700 rounded-lg'>
        <div className='w-4/6'>
          <div className='pl-4'>
            <p className='sm:py-2 lg:py-3 text-white text-2xl sm:text-lg border-b font-semibold'>PLAYER OF THE MATCH</p>
          </div>
          <div className='pl-4'>
            <p className='pt-3 text-white text-lg sm:text-sm font-semibold'>{man_of_the_match ? man_of_the_match.name : 'N/A'}</p>
          </div>
          <div className='pl-4'>
            <p className='py-1 text-white text-sm sm:text-xs'>{man_of_the_match ? man_of_the_match.team_name : 'N/A'}</p>
          </div>

          <div className='pl-4'>
            <p className='pt-3 text-white text-lg sm:text-sm font-semibold'>Batting</p>
          </div>
          <div className='pl-4'>
            <p className='py-1 text-white text-sm sm:text-xs'>{man_of_the_match && `${man_of_the_match.batting_runs_scored}R ${man_of_the_match.batting_balls_faced}B  ${man_of_the_match.batting_sixes}(6S) ${man_of_the_match.batting_fours}(4S) ${man_of_the_match.batting_strikeRate}(SR)`}</p>
          </div>

          <div className='pl-4'>
            <p className='pt-3 text-white text-lg sm:text-sm font-semibold'>Bowling</p>
          </div>
          <div className='pl-4'>
            <p className='py-1 pb-3 text-white text-sm sm:text-xs'>{man_of_the_match && `${man_of_the_match.bowling_overs}Ov ${man_of_the_match.bowling_maiden_overs}M ${man_of_the_match.bowling_runs_conceded}R ${man_of_the_match.bowling_wickets}W ${man_of_the_match.bowling_economy}EC`}</p>
          </div>
        </div>
        <div className='w-2/6'>
          <img className='pl-5 pr-5 pt-3 h-5/6 sm:h-auto w-auto' src='/images/user_profile1.png'/>
        </div>
      </div>

      <div className='flex bg-teal-600 rounded-lg mt-3'>
        <div className='w-4/6'>
          <div className='pl-4'>
            <p className='lg:py-3 sm:py-2 text-white text-2xl sm:text-lg border-b font-semibold'>BEST BATTER</p>
          </div>
          <div className='pl-4'>
            <p className='pt-3 text-white text-lg sm:text-sm font-semibold'>{best_batter ? best_batter.name : 'N/A'}</p>
          </div>
          <div className='pl-4'>
            <p className='py-1 text-white text-sm sm:text-xs'>{best_batter ? best_batter.team_name : 'N/A'}</p>
          </div>

          <div className='pl-4'>
            <p className='pt-3 text-white text-lg sm:text-sm font-semibold'>Batting</p>
          </div>
          <div className='pl-4'>
            <p className='py-1 text-white text-sm sm:text-xs'>{best_batter && `${best_batter.batting_runs_scored}R ${best_batter.batting_balls_faced}B  ${best_batter.batting_sixes}(6S) ${best_batter.batting_fours}(4S) ${best_batter.batting_strikeRate}(SR)`}</p>
          </div>
        </div>
        <div className='w-2/6'>
          <img className='pl-5 pr-5 pt-3 h-5/6 w-auto sm:h-auto' src='/images/user_profile1.png'/>
        </div>
      </div>

      <div className='flex bg-yellow-400 rounded-lg mt-3'>
        <div className='w-4/6'>
          <div className='pl-4'>
            <p className='lg:py-3 sm:py-2 text-white text-2xl sm:text-lg border-b font-semibold'>BEST BOWLER</p>
          </div>
          <div className='pl-4'>
            <p className='pt-3 text-white text-lg sm:text-sm font-semibold'>{best_bowler ? best_bowler.name : 'N/A'}</p>
          </div>
          <div className='pl-4'>
            <p className='py-1 text-white text-sm sm:text-xs'>{best_bowler ? best_bowler.team_name : 'N/A'}</p>
          </div>

          <div className='pl-4'>
            <p className='pt-3 text-white text-lg sm:text-sm font-semibold'>Bowling</p>
          </div>
          <div className='pl-4'>
            <p className='py-1 pb-3 text-white text-sm sm:text-xs'>{best_bowler && `${best_bowler.bowling_overs}Ov ${best_bowler.bowling_maiden_overs}M ${best_bowler.bowling_runs_conceded}R ${best_bowler.bowling_wickets}W ${best_bowler.bowling_economy}EC`}</p>
          </div>
        </div>
        <div className='w-2/6'>
          <img className='pl-5 pr-5 pt-3 h-5/6 w-auto sm:h-auto' src='/images/user_profile1.png'/>
        </div>
      </div>
      
      
    </div>
  )
}

export default CricHeros
