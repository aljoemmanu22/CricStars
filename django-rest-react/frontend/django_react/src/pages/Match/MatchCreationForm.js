import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const MatchCreationForm = () => {
  const [homeTeam, setHomeTeam] = useState('');
  const [homeTeamName, setHomeTeamName] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  
  const [awayTeamName, setAwayTeamName] = useState('');
  const [date, setDate] = useState('');
  const [groundLocation, setGroundLocation] = useState('home');
  const [umpire1, setUmpire1] = useState('');
  const [umpire2, setUmpire2] = useState('');
  const [weather, setWeather] = useState('1');
  const [overs, setOvers] = useState('');
  const [teamsPlayedFor, setTeamsPlayedFor] = useState([]);
  const [teamsPlayedAgainst, setTeamsPlayedAgainst] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamHomeGround, setNewTeamHomeGround] = useState('');
  const [homeTeamPlayers, setHomeTeamPlayers] = useState([{ firstName: '', phoneNumber: '' }]);
  const [awayTeamPlayers, setAwayTeamPlayers] = useState([{ firstName: '', phoneNumber: '' }]);
  const [showCreateTeamForm, setShowCreateTeamForm] = useState(false);
  const [teamType, setTeamType] = useState('home'); // 'home' or 'away'
  const [matchId, setMatchId] = useState();
  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');

  const [activeTab, setActiveTab] = useState('');
  const [teamNameFocused, setTeamNameFocused] = useState(false);
  const [cityFocused, setCityFocused] = useState(false);
  const [oversFocussed, setOversFocused] = useState(false)
  const [oversPerBowler, setOversPerBowler] = useState('')
  const [oversPerBowlerFocussed, setOversPerBowlerFocused] = useState(false)
  const [umpire1Focused, setumpire1Focused] = useState(false)
  const [umpire2Focused, setumpire2Focused] = useState(false)
  const [newPlayer, setNewPlayer] = useState({ firstName: '', phoneNumber: '' });
  const [errorMessages, setErrorMessages] = useState({ home: [], away: [] });
  const [validationMessage, setValidationMessage] = useState('');
  const [TossWinner, setTossWinner] = useState('');
  
  const [TossElect, setTossElect] = useState('')
  

  const navigate = useNavigate(); // Initialize navigate function

  const validateForm = () => {
    if (!overs || isNaN(overs) || overs <= 0) {
      setValidationMessage('Please enter a valid number of overs.');
      return false;
    }
    if (!oversPerBowler || isNaN(oversPerBowler) || oversPerBowler <= 0 || oversPerBowler > overs) {
      setValidationMessage('Please enter a valid number of overs per bowler (must be less than or equal to total overs).');
      return false;
    }
    setValidationMessage('');
    return true;
  };
  

  useEffect(() => {
    axios.get(baseURL + '/api/match/matches/user-teams/', {
      headers: {
        'authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setTeamsPlayedFor(response.data.teams_played_for);
        setTeamsPlayedAgainst(response.data.teams_played_against);
      })
      .catch(error => {
        console.error('There was an error fetching the teams!', error);
      });
  }, []);

  const handleMatchSubmit = (event) => {
    event.preventDefault();

    // Validation to check if players are added
    if (homeTeamPlayers.length === 0 || awayTeamPlayers.length === 0 || !homeTeamPlayers[0].firstName || !awayTeamPlayers[0].firstName) {
      alert('Please add players to both home and away teams.');
      return;
    }

    // Validate the overs and overs per bowler inputs
    if (!validateForm()) {
      return;
    }

    const matchData = {
      home_team: homeTeam,
      away_team: awayTeam,
      date,
      ground_location: groundLocation,
      umpire_1: umpire1,
      umpire_2: umpire2,
      weather,
      overs,
      overs_per_bowler: oversPerBowler,
      toss_winner: TossWinner,
      elected_to: TossElect
    };

    axios.post(baseURL + '/api/match/matches/', matchData, {
      headers: {
        'authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        const matchId = response.data.id;
        setMatchId(matchId);
        console.log(response.data)
        console.log(matchId)
        addPlayersToMatch(matchId);
      })
      .catch(error => {
        console.error('There was an error creating the match!', error.response.data);
      });
  };

  const addPlayersToMatch = (matchId) => {
    const homePlayersData = homeTeamPlayers
      .filter(player => player.phoneNumber && player.firstName) // Filter out players with empty phone numbers or first names
      .map(player => ({
        phone_number: player.phoneNumber,
        first_name: player.firstName,
        team_id: homeTeam
      }));
    const awayPlayersData = awayTeamPlayers
      .filter(player => player.phoneNumber && player.firstName) // Filter out players with empty phone numbers or first names
      .map(player => ({
        phone_number: player.phoneNumber,
        first_name: player.firstName,
        team_id: awayTeam
      }));
    const playersData = [...homePlayersData, ...awayPlayersData];
  
    axios.post(baseURL + `/api/match/matches/${matchId}/add_players/`, { players: playersData }, {
      headers: {
        'authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Players added successfully:', response.data);
        navigate('/');
      })
      .catch(error => {
        console.error('There was an error adding players to the match!', error);
      });
  };



  // Validation functions
  const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);
  const validatePhoneNumber = (number) => /^\d{10}$/.test(number);

  const handlePlayerChange = (index, type, value, team) => {
    const updatedPlayers = team === 'home' ? [...homeTeamPlayers] : [...awayTeamPlayers];
    updatedPlayers[index][type] = value;
    
    // Perform validation
    let errorMessage = '';
    if (type === 'firstName' && !validateName(value)) {
      errorMessage = 'Invalid name. Only alphabets and spaces are allowed.';
    } else if (type === 'phoneNumber' && !validatePhoneNumber(value)) {
      errorMessage = 'Invalid phone number. Must be 10 digits.';
    }

    const updatedErrorMessages = { ...errorMessages };
    updatedErrorMessages[team][index] = errorMessage;
    setErrorMessages(updatedErrorMessages);

    if (team === 'home') setHomeTeamPlayers(updatedPlayers);
    else setAwayTeamPlayers(updatedPlayers);
  };

  const addPlayerField = (team) => {
    if (team === 'home' && homeTeamPlayers.length < 12) {
      setHomeTeamPlayers([...homeTeamPlayers, { firstName: '', phoneNumber: '' }]);
    } else if (team === 'away' && awayTeamPlayers.length < 12) {
      setAwayTeamPlayers([...awayTeamPlayers, { firstName: '', phoneNumber: '' }]);
    }

    const updatedErrorMessages = { ...errorMessages };
    updatedErrorMessages[team].push('');
    setErrorMessages(updatedErrorMessages);
  };

  const handleTeamSubmit = (event) => {
    event.preventDefault();
    const teamData = {
      team_name: newTeamName,
      home_ground: newTeamHomeGround,
    };

    axios.post(baseURL + '/api/match/teams/', teamData, {
      headers: {
        'authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Team created successfully:', response.data);
        // Show an alert
        alert('Team created successfully!');

        // Update team lists
        axios.get(baseURL + '/api/match/matches/user-teams/', {
          headers: {
            'authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            setTeamsPlayedFor(response.data.teams_played_for);
            setTeamsPlayedAgainst(response.data.teams_played_against);
            // Automatically select the newly created team
            if (teamType === 'home') {
              setHomeTeam(response.data.team.id);
            } else {
              setAwayTeam(response.data.team.id);
            }
            setShowCreateTeamForm(false);
          })
          .catch(error => {
            console.error('There was an error fetching the teams!', error);
          });
      })
      .catch(error => {
        console.error('There was an error creating the team!', error);
      });
  };

  return (
    <div className='flex flex-col'>
      {activeTab === '' &&
        <div className='flex items-center h-12 bg-red-800 pl-32 sm:pl-5 sm:bg-zinc-600'>
          <button onClick={() => setActiveTab('')}>
            <div className="w-6 h-6 bg-red rounded-full flex items-center justify-center border-2 border-white  mr-2">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
              </svg>
            </div>
          </button>
          {activeTab !== 'addPlayersTeam2' && activeTab !== 'addPlayersTeam2' && <p className='text-white'>Select Playing Teams</p>}
        </div>
      }

      {activeTab !== '' && 
      <>  
          <div className='flex items-center h-12 bg-red-800 pl-32 sm:pl-5 sm:bg-zinc-600'>
            <button onClick={() => setActiveTab('')}>
              <div className="w-6 h-6 bg-red rounded-full flex items-center justify-center border-2 border-white  mr-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                </svg>
              </div>
            </button>
            {activeTab === 'addPlayersTeam1' && <p className='text-white'>Add Home Players</p>}
            {activeTab === 'addPlayersTeam2' && <p className='text-white'>Add Away Players</p>}
            {activeTab !== 'addPlayersTeam2' && activeTab !== 'addPlayersTeam1' && <p className='text-white'>Select Playing Teams</p>}
          </div>
          <div className='flex items-center justify-center'>
            <div className='w-2/3 mt-20'>
            {activeTab !== 'addPlayersTeam1' && activeTab !== 'addPlayersTeam2' && 
              <div className='bg-red-600 rounded-t-lg p-2'>
                <nav>
                  <ul className='flex justify-between text-white'>
                    <button onClick={() => setActiveTab('selectTeamA')}>
                      <li className='pl-28'>My Teams</li>
                    </button>
                    <button onClick={() => setActiveTab('selectTeamB')}>
                      <li>Opponents</li>
                    </button>
                    <button onClick={() => setActiveTab('createNewTeam')}>
                      <li className='pr-28'>Add</li>
                    </button>
                  </ul>
                </nav>
              </div>
            }


      {activeTab === 'selectTeamA' &&
          <>
          <div className='bg-white h-80 w-auto'>
          <div className='flex items-center justify-center'>
            <div className='border p-2 mt-1 mx-1 w-full bg-slate-100 flex items-center '>
              <div className='border flex p-2 m-2 w-3/4'>
                <div className='px-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                <div className=''>
                  <p>Quick Search</p>
                </div>
              </div>
              <div className=''>
                <button className='bg-teal-600 flex items-center justify-center p-2 w-max' onClick={() => { setActiveTab('createNewTeam'); setTeamType('home'); }}>
                  <div className=''>
                    <p className='bg-teal-600 border-2 border-white rounded-full text-xs w-4 h-4 text-white flex items-center justify-center'>
                      +
                    </p>
                  </div>
                  <div className='text-white'>
                    <p>ADD TEAM</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* <select value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)}> */}
          {teamsPlayedFor.map((team, index) => (

          
          <div key={index} className='m-1'>
            <button className={`w-full ${homeTeam === team.id ? 'border-blue-500' : 'border-gray-300'} border-2`} 
            onClick={() => [setHomeTeam(team.id), setHomeTeamName(team.team_name)] }
            >
            <div className='h-auto w-full bg-slate-100 rounded-lg flex items-center border py-2'>
              <div className='w-auto pl-4'>
                <img src="/images/AP.png" className="h-16 cursor-pointer rounded-full" alt="Logo"/>
              </div>
                <div className='pl-2.5 flex items-center justify-center' >
                  <div className='w-auto h-1/2'>
                    <option key={team.id} value={team.id} className='font-medium p-1'>{team.team_name}</option>
                    <div className='flex'>
                      <div className='flex w-auto items-center justify-center pt-1 mr-6'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 bg-slate-500 text-slate-200 rounded-full p-0.5 mx-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        <p className='text-sm justify-center'>Thrissur</p>
                      </div>
                      <div className='flex w-auto items-center justify-center pt-1 mr-6'>
                        <div className='bg-slate-500 text-slate-200 rounded-full mx-2 flex w-4 items-center justify-center'>
                          <p className='text-xs'>C</p>
                        </div>
                        <p className='text-sm justify-center'>Sughesh</p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            </button>
          </div>
          ))}
          {/* </select> */}
        </div>
      
        </>
      }

        {activeTab === 'selectTeamB' &&
          <>
          <div className='bg-white h-80 w-auto'>
          <div className='flex items-center justify-center'>
            <div className='border p-2 mt-1 mx-1 w-full bg-slate-100 flex items-center'>
              <div className='border flex p-2 m-2 w-3/4'>
                <div className='px-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                <div className=''>
                  <p>Quick Search</p>
                </div>
              </div>
              <div className=''>
              <button className='bg-teal-600 flex items-center justify-center p-2 w-max' onClick={() => { setActiveTab('createNewTeam'); setTeamType('away'); }}>
                  <div className=''>
                    <p className='bg-teal-600 border-2 border-white rounded-full text-xs w-4 h-4 text-white flex items-center justify-center'>
                      +
                    </p>
                  </div>
                  <div className='text-white'>
                    <p>ADD TEAM</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
          {/* <select value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)}> */}
          {teamsPlayedAgainst.map((team, index) => (
            <div key={index} className='m-1'>
              <button className={`w-full ${awayTeam === team.id ? 'border-blue-500' : 'border-gray-300'} border-2`}
              onClick={() => [setAwayTeam(team.id), setAwayTeamName(team.team_name)] }
              >
              <div className='h-auto w-full bg-slate-100 rounded-lg flex items-center border py-2'>
                <div className='w-auto pl-4'>
                  <img src="/images/AP.png" className="h-16 cursor-pointer rounded-full" alt="Logo"/>
                </div>
                <div className='pl-2.5 flex items-center justify-center' >
                  <div className='w-auto h-1/2'>
                  <option key={team.id} value={team.id} className='font-medium p-1'>{team.team_name}</option>
                    <div className='flex'>
                      <div className='flex w-auto items-center justify-center pt-1 mr-6'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 bg-slate-500 text-slate-200 rounded-full p-0.5 mx-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        <p className='text-sm justify-center'>Thrissur</p>
                      </div>
                      <div className='flex w-auto items-center justify-center pt-1 mr-6'>
                        <div className='bg-slate-500 text-slate-200 rounded-full mx-2 flex w-4 items-center justify-center'>
                          <p className='text-xs'>C</p>
                        </div>
                        <p className='text-sm justify-center'>Sughesh</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </button>
            </div>
            
          ))}
          {/* </select> */}
        </div>
        </>
      }

      {activeTab === 'createNewTeam' &&
      <>
        <div className='flex items-center h-12 bg-red-800 pl-32 sm:pl-5 sm:bg-zinc-600'>
          <div className="w-6 h-6 bg-red rounded-full flex items-center justify-center border-2 border-white  mr-2">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </svg>
          </div>
          <p className='text-white'>Select Team A</p>
        </div>
      

        <div className='bg-white h-96 w-auto'>
          <div className='flex justify-center items-center pt-8'>
            <img src="/images/addTeamLogo.png" className="h-20 cursor-pointer rounded-full border" alt="Logo"/>
          </div>
          <div className='flex justify-center items-center pt-2'>
            <p className='font-bold'>
              Team Logo
            </p>
          </div>

          <form onSubmit={handleTeamSubmit} className='flex flex-col items-center justify-center'>
            <div className='flex flex-col relative mt-8 w-4/5 pt-1'>
              <label 
                className={`absolute left-0 text-gray-500 transition-all duration-200 ${teamNameFocused ? 'text-xs -top-4' : 'text-base top-2'}`}>
                Team Name
              </label>
              <input
                value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} 
                className='border-b border-gray-300 focus:outline-none focus:border-teal-500'
                onFocus={() => setTeamNameFocused(true)}
                onBlur={(e) => setTeamNameFocused(e.target.value !== '')}
              />
            </div>
            <div className='flex flex-col relative mt-8 w-4/5 pt-1'>
              <label 
                className={`absolute left-0 text-gray-500 transition-all duration-200 ${cityFocused ? 'text-xs -top-4' : 'text-base top-2'}`}>
                Home Ground
              </label>
              <input 
                value={newTeamHomeGround} onChange={(e) => setNewTeamHomeGround(e.target.value)}
                className='border-b border-gray-300 focus:outline-none focus:border-teal-500'
                onFocus={() => setCityFocused(true)}
                onBlur={(e) => setCityFocused(e.target.value !== '')}
              />
            </div>
            <div className='flex item-center justify-center my-5'>
              <button type="submit" className='py-1 px-3 bg-teal-500 text-white w-80'>ADD TEAM</button>
            </div>
          </form>

        </div>
        </>  
      }


      {/* {activeTab === 'addPlayersTeam1' && 
          <div className='flex flex-col items-center justify-center'>
          <div className='w-full max-w-md'>
            <h3 className='font-bold text-xl mb-4'>Add Home Team Players</h3>
            <div className='flex space-x-2 mb-4'>
              <input
                type="text"
                placeholder="First Name"
                className="border rounded p-2 flex-1"
                value={homeTeamPlayers[homeTeamPlayers.length - 1]?.firstName}
                onChange={(e) => handlePlayerChange(homeTeamPlayers.length - 1, 'firstName', e.target.value, 'home')}
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="border rounded p-2 flex-1"
                value={homeTeamPlayers[homeTeamPlayers.length - 1]?.phoneNumber}
                onChange={(e) => handlePlayerChange(homeTeamPlayers.length - 1, 'phoneNumber', e.target.value, 'home')}
              />
            </div>
            <button
              className='bg-teal-600 text-white py-2 px-4 rounded'
              onClick={() => addPlayerField('home')}
            >
              Add Home Team Player
            </button>
          </div>
    
          <div className='w-full max-w-md mt-8'>
            <h3 className='font-bold text-xl mb-4'>Home Team Players</h3>
            <div className='flex flex-col space-y-2'>
              {homeTeamPlayers.map((player, index) => (
                <div key={index} className='flex space-x-2'>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="border rounded p-2 flex-1"
                    value={player.firstName}
                    onChange={(e) => handlePlayerChange(index, 'firstName', e.target.value, 'home')}
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="border rounded p-2 flex-1"
                    value={player.phoneNumber}
                    onChange={(e) => handlePlayerChange(index, 'phoneNumber', e.target.value, 'home')}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      }

        {activeTab === 'addPlayersTeam2' && 
          <div className='flex flex-col items-center justify-center'>
          <div className='w-full max-w-md'>
            <h3 className='font-bold text-xl mb-4'>Add away Team Players</h3>
            <div className='flex space-x-2 mb-4'>
              <input
                type="text"
                placeholder="First Name"
                className="border rounded p-2 flex-1"
                value={awayTeamPlayers[awayTeamPlayers.length - 1]?.firstName}
                onChange={(e) => handlePlayerChange(awayTeamPlayers.length - 1, 'firstName', e.target.value, 'away')}
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="border rounded p-2 flex-1"
                value={awayTeamPlayers[awayTeamPlayers.length - 1]?.phoneNumber}
                onChange={(e) => handlePlayerChange(awayTeamPlayers.length - 1, 'phoneNumber', e.target.value, 'away')}
              />
            </div>
            <button
              className='bg-teal-600 text-white py-2 px-4 rounded'
              onClick={() => addPlayerField('away')}
            >
              Add away Team Player
            </button>
          </div>
    
          <div className='w-full max-w-md mt-8'>
            <h3 className='font-bold text-xl mb-4'>Away Team Players</h3>
            <div className='flex flex-col space-y-2'>
              {awayTeamPlayers.map((player, index) => (
                <div key={index} className='flex space-x-2'>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="border rounded p-2 flex-1"
                    value={player.firstName}
                    onChange={(e) => handlePlayerChange(index, 'firstName', e.target.value, 'away')}
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="border rounded p-2 flex-1"
                    value={player.phoneNumber}
                    onChange={(e) => handlePlayerChange(index, 'phoneNumber', e.target.value, 'away')}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      } */}
      {activeTab === 'addPlayersTeam1' &&
        <div className='flex flex-col items-center justify-center'>
          <div className='w-full max-w-md'>
            <h3 className='font-bold text-xl mb-4'>Add Home Team Players</h3>
            {homeTeamPlayers.map((player, index) => (
              <div key={index} className='flex flex-col mb-4'>
                <div className='flex space-x-2'>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="border rounded p-2 flex-1"
                    value={player.firstName}
                    onChange={(e) => handlePlayerChange(index, 'firstName', e.target.value, 'home')}
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="border rounded p-2 flex-1"
                    value={player.phoneNumber}
                    onChange={(e) => handlePlayerChange(index, 'phoneNumber', e.target.value, 'home')}
                  />
                </div>
                {errorMessages.home[index] && <p className="text-red-500">{errorMessages.home[index]}</p>}
              </div>
            ))}
            <button
              className='bg-teal-600 text-white py-2 px-4 rounded'
              onClick={() => addPlayerField('home')}
            >
              Add Home Team Player
            </button>
          </div>
        </div>
      }

      {activeTab === 'addPlayersTeam2' &&
        <div className='flex flex-col items-center justify-center'>
          <div className='w-full max-w-md'>
            <h3 className='font-bold text-xl mb-4'>Add Away Team Players</h3>
            {awayTeamPlayers.map((player, index) => (
              <div key={index} className='flex flex-col mb-4'>
                <div className='flex space-x-2'>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="border rounded p-2 flex-1"
                    value={player.firstName}
                    onChange={(e) => handlePlayerChange(index, 'firstName', e.target.value, 'away')}
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="border rounded p-2 flex-1"
                    value={player.phoneNumber}
                    onChange={(e) => handlePlayerChange(index, 'phoneNumber', e.target.value, 'away')}
                  />
                </div>
                {errorMessages.away[index] && <p className="text-red-500">{errorMessages.away[index]}</p>}
              </div>
            ))}
            <button
              className='bg-teal-600 text-white py-2 px-4 rounded'
              onClick={() => addPlayerField('away')}
            >
              Add Away Team Player
            </button>
          </div>
        </div>
      }

        </div>
        </div>
      </>  
      }




      {activeTab === '' && homeTeam === '' && awayTeam === '' &&
        <div className='flex flex-col items-center justify-center'>
          <div className="w-14 h-14 bg-red rounded-full bg-slate-600 lg:mt-40 sm:mt-20 flex items-center justify-center">
            {homeTeam !== '' ? <img src="/images/AP.png" className="h-auto cursor-pointer rounded-full" alt="Logo"/> : <p className='text-white text-3xl'>+</p>}
          </div>
          <div className='pt-3'>
            <button onClick={() => setActiveTab('selectTeamA')}>
              <p className='text-white bg-teal-500 p-1 text-sm'>SELECT TEAM A</p>
            </button>  
          </div>
          <div className='relative mt-24 flex items-center justify-center'>
            <div className='absolute w-10 h-10 bg-teal-500 rotate-45 flex items-center justify-center'>
              <p className='text-white text-xs -rotate-45'>VS</p>
            </div>
          </div>
          <div className="w-14 h-14 bg-red rounded-full bg-slate-600 mt-24 flex items-center justify-center">
            {awayTeam !== '' ? <img src="/images/AP.png" className="h-auto cursor-pointer rounded-full" alt="Logo"/> : <p className='text-white text-3xl'>+</p>}
          </div>
          <div className='pt-3'>
            <button onClick={() => setActiveTab('selectTeamB')}>
              <p className='text-white bg-teal-500 p-1 text-sm'>SELECT TEAM B</p>
            </button>
          </div>
        </div>
      }

      
      {activeTab === '' && homeTeam !== '' && awayTeam !== '' && 
        <form onSubmit={handleMatchSubmit}>
          <div className='flex flex-col items-center justify-center'>
            {/* Teams and Match Info */}
            <div className='flex flex-row'>
              <div className="w-14 h-14 bg-red rounded-full bg-slate-600 mt-24 flex items-center justify-center mx-10">
                {homeTeam !== '' ? <img src="/images/AP.png" className="h-auto cursor-pointer rounded-full" alt="Logo" /> : <p className='text-white text-3xl'>+</p>}
              </div>
              <div className='relative mt-24 flex items-center justify-center mx-10'>
                <div className='absolute w-10 h-10 bg-teal-500 rotate-45 flex items-center justify-center'>
                  <p className='text-white text-xs -rotate-45'>VS</p>
                </div>
              </div>
              <div className="w-14 h-14 bg-red rounded-full bg-slate-600 mt-24 flex items-center justify-center mx-10">
                {awayTeam !== '' ? <img src="/images/AP.png" className="h-auto cursor-pointer rounded-full" alt="Logo" /> : <p className='text-white text-3xl'>+</p>}
              </div>
            </div>
            <div className='flex flex-row pt-3 font-bold'>
              <div className='mx-20'>{homeTeamName}</div>
              <div className='mx-20'>{awayTeamName}</div>
            </div>
            <div className='flex flex-row'>
              <div className='pt-3 mx-14'>
                <button onClick={() => homeTeam !== '' ? setActiveTab('addPlayersTeam1') : setActiveTab('selectTeamA')}>
                  {homeTeam !== '' ? <p className='text-white bg-teal-500 p-1 text-sm'>SELECT SQUAD</p> : <p className='text-white bg-teal-500 p-1 text-sm'>SELECT TEAM A</p>}
                </button>
              </div>
              <div className='pt-3 mx-14'>
                <button onClick={() => homeTeam !== '' ? setActiveTab('addPlayersTeam2') : setActiveTab('selectTeamB')}>
                  {awayTeam !== '' ? <p className='text-white bg-teal-500 p-1 text-sm'>SELECT SQUAD</p> : <p className='text-white bg-teal-500 p-1 text-sm'>SELECT TEAM B</p>}
                </button>
              </div>
            </div>
            {/* Form Inputs */}
            <div className='flex mt-5'>
              <div className='flex-col relative mt-8 w-4/5 pt-1'>
                <label
                  className={`absolute left-0 text-gray-500 transition-all duration-200 ${oversFocussed ? 'text-xs -top-4' : 'text-base top-2'}`}>
                  Overs
                </label>
                <input
                  value={overs} onChange={(e) => setOvers(e.target.value)}
                  className='border-b border-gray-300 focus:outline-none focus:border-teal-500'
                  onFocus={() => setOversFocused(true)}
                  onBlur={(e) => setOversFocused(e.target.value !== '')}
                />
              </div>
              <div className='flex-col relative mt-8 w-4/5 pt-1 ml-5'>
                <label
                  className={`absolute left-0 text-gray-500 transition-all duration-200 ${oversPerBowlerFocussed ? 'text-xs -top-4' : 'text-base top-2'}`}>
                  Overs Per Bowler
                </label>
                <input
                  value={oversPerBowler} onChange={(e) => setOversPerBowler(e.target.value)}
                  className='border-b border-gray-300 focus:outline-none focus:border-teal-500'
                  onFocus={() => setOversPerBowlerFocused(true)}
                  onBlur={(e) => setOversPerBowlerFocused(e.target.value !== '')}
                />
              </div>
            </div>
            {validationMessage && <p className='text-red-500 mt-2'>{validationMessage}</p>}
            {/* Other Inputs */}
            <div className='flex flex-row mt-8 pr-48'>
              <label>
                Ground Location:
                <select value={groundLocation} onChange={(e) => setGroundLocation(e.target.value)}>
                  <option value="home">Home</option>
                  <option value="away">Away</option>
                </select>
              </label>
            </div>
            <div className='flex flex-row mt-8 pr-52'>
              <label>
                Date:
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
            </div>
            <div className='flex mt-1 pr-48'>
              <div className='flex-col relative mt-6 w-4/5 pt-1'>
                <label
                  className={`absolute left-0 text-gray-500 transition-all duration-200 ${umpire1Focused ? 'text-xs -top-4' : 'text-base top-2'}`}>
                  Umpire 1
                </label>
                <input
                  value={umpire1} onChange={(e) => setUmpire1(e.target.value)}
                  className='border-b border-gray-300 focus:outline-none focus:border-teal-500'
                  onFocus={() => setumpire1Focused(true)}
                  onBlur={(e) => setumpire1Focused(e.target.value !== '')}
                />
              </div>
            </div>
            <div className='flex mt-1 pr-48'>
              <div className='flex-col relative mt-6 w-4/5 pt-1'>
                <label
                  className={`absolute left-0 text-gray-500 transition-all duration-200 ${umpire2Focused ? 'text-xs -top-4' : 'text-base top-2'}`}>
                  Umpire 2
                </label>
                <input
                  value={umpire2} onChange={(e) => setUmpire2(e.target.value)}
                  className='border-b border-gray-300 focus:outline-none focus:border-teal-500'
                  onFocus={() => setumpire2Focused(true)}
                  onBlur={(e) => setumpire2Focused(e.target.value !== '')}
                />
              </div>
            </div>
            <div className='flex mt-6 pr-48'>
              <div className='flex flex-row mt-2 pt-1'>
                <label>
                  Weather:
                  <select value={weather} onChange={(e) => setWeather(e.target.value)}>
                    <option value="1">Sunny</option>
                    <option value="2">Sunny Spells</option>
                    <option value="3">Windy</option>
                    <option value="4">Showers</option>
                    <option value="5">Heavy Rain</option>
                    <option value="6">Rain and Sun</option>
                    <option value="7">Cloudy</option>
                    <option value="8">Overcast</option>
                    <option value="9">Other</option>
                  </select>
                </label>
              </div>
            </div>
            <div className='flex mt-1 items-center justify-center'>
              <div className='flex-col mt-6 pt-1'>
                <label className=''>
                  Who won the tosss
                  <select onChange={(e) => setTossWinner(e.target.value)}>
                    <option value={homeTeamName}>{homeTeamName}</option>
                    <option value={awayTeamName}>{awayTeamName}</option>
                  </select>
                </label>
                <label className='pl-5'>
                  Elected to
                  <select onChange={(e) => setTossElect(e.target.value.toLowerCase())}> {/* Ensure value is lowercase */}
                    <option value='bat'>Bat</option>
                    <option value='bowl'>Bowl</option>
                  </select>
                </label>
              </div>
            </div>
            <div className='mt-8'>
              <button className='bg-teal-500 p-2 text-white' type="submit">Schedule Match</button>
            </div>
          </div>
        </form>
      
      }
      
    </div>
  );
};

export default MatchCreationForm;
