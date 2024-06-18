import React, { useEffect, useState } from 'react';
import axios from 'axios';


function Teams({ matchId }) {

  const [homeTeamPlayers, setHomeTeamPlayers] = useState([]);
  const [awayTeamPlayers, setAwayTeamPlayers] = useState([]);
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')

  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');

  useEffect(() => {
    axios.get(`${baseURL}/api/matches/${matchId}/teams/players/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      setHomeTeamPlayers(response.data.home_team_players);
      setAwayTeamPlayers(response.data.away_team_players);

      if (response.data.home_team_players.length > 0) {
        setHomeTeam(response.data.home_team_players[0].team_name);
      }
      if (response.data.away_team_players.length > 0) {
        setAwayTeam(response.data.away_team_players[0].team_name);
      }
    })
    .catch(error => console.error('Error fetching team players:', error));
  }, [matchId, token]);


  return (

    <div className='bg-black-rgba rounded-lg'>
      {console.log(homeTeamPlayers)}
      <div className='bg-white rounded-lg'>
        <div className='flex items-center border-b'>
          <div className='p-3'>
            <img src="/images/AP.png" className='h-10'/>
          </div>
          <div>
            <p className='text-xl text-black'>{homeTeam}</p>
          </div>
        </div>
        <div className='flex flex-wrap p-3'>
          {homeTeamPlayers.map((player, index) => (
            <div key={index} className='w-1/4 p-2'>
              <div className='flex items-center justify-center'>
                <img src='/images/user_profile1.png' className='rounded-t-lg'/>
              </div>  
              <div className='flex items-center justify-center bg-black-rgba rounded-b-lg'>
                <p className='py-1'>{player.player_name}</p>
              </div>
            </div>
          ))}
          
        </div>
      </div>

      <div className='mt-4 bg-white rounded-lg'>
        <div className='flex items-center border-b'>
          <div className='p-3'>
            <img src="/images/AP.png" className='h-10'/>
          </div>
          <div>
            <p className='text-xl text-black'>{awayTeam}</p>
          </div>
        </div>
        <div className='flex flex-wrap p-3'>
          {awayTeamPlayers.map((player, index) => (
            <div key={index} className='w-1/4 p-2'>
              <div className='flex items-center justify-center'>
                <img src='/images/user_profile1.png' className='rounded-t-lg'/>
              </div>  
              <div className='flex items-center justify-center bg-black-rgba rounded-b-lg'>
                <p className='py-1'>{player.player_name}</p>
              </div>
            </div>
          ))}
          
        </div>
      </div>

    </div>
    
    
  )
}

export default Teams
