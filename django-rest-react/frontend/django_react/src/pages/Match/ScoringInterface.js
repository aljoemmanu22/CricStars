import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import PlayerSelectionOverlay from "./PlayerSelectionOverlay";

function ScoringInterface() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [matchDetails, setMatchDetails] = useState(null);
  const [battingTeamPlayers, setBattingTeamPlayers] = useState([]);
  const [bowlingTeamPlayers, setBowlingTeamPlayers] = useState([]);
  const [striker, setStriker] = useState({ id: '', name: '' });
  const [nonStriker, setNonStriker] = useState({ id: '', name: '' });
  const [selectedBowler, setSelectedBowler] = useState({ id: '', name: '' });
  const [newBowler, setNewBowler] = useState({ id: '', name: '' });
  const [strikerData, setStrikerData] = useState();
  const [nonStrikerData, setNonStrikerData] = useState();
  const [selectedBowlerData, setSelectedBowlerData] = useState();


  const [missingInfo, setMissingInfo] = useState([]);
  const [matchStatus, setMatchStatus] = useState('');
  const [isSelectionDone, setIsSelectionDone] = useState(true);
  const [tossWinner, setTossWinner] = useState('');
  const [tossElected, setTossElected] = useState('');
  const [notification, setNotification] = useState('');
  const [over, setOver] = useState(0);
  const [ballInOver, setBallInOver] = useState(0);
  const [totalRuns, setTotalRuns] = useState(0);
  const [totalWickets, setTotalWickets] = useState(0);
  const [innings, setInnings] = useState(1);
  const [previousScoreUpdates, setPreviousScoreUpdates] = useState([]); // State to keep track of the previous score updates for each over
  const token = localStorage.getItem('access');
  const baseURL = 'http://127.0.0.1:8000';

  const [isWidePopupVisible, setIsWidePopupVisible] = useState(false);
  const [isNoBallPopupVisible, setIsNoBallPopupVisible] = useState(false);
  const [isLbPopupVisible, setIsLbPopupVisible] = useState(false);
  const [isByePopupVisible, setIsByePopupVisible] = useState(false);
  const [runsOnExtra, setRunsOnExtra] = useState(0);
  const [noBallBatterRun, setnoBallBatterRun] = useState(0)

  const [isOutModalVisible, setIsOutModalVisible] = useState(false);
  const [outType, setOutType] = useState('');
  const [peopleInvolved, setPeopleInvolved] = useState([]);
  const [fielderName1, setFielderName1] = useState('');
  const [fielderName2, setFielderName2] = useState('');
  const [whoOut, setWhoOut] = useState('');

  const [isNewBatterPopupVisible, setIsNewBatterPopupVisible] = useState(false);
  const [isNewBowlerPopupVisible, setIsNewBowlerPopupVisible] = useState(false);
  const [strikeChange, setStrikeChange] = useState(false);

  // Function to show notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000); // Hide after 3 seconds
  };

  useEffect(() => {
    axios.get(`${baseURL}/api/match-detail/${matchId}/`, {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      const match = response.data.match;
      setTossWinner(response.data.match.toss_winner);
      setTossElected(response.data.match.elected_to);
      setMatchDetails({
        ...match,
        home_team: response.data.home_team,
        away_team: response.data.away_team
      });
      setMatchStatus(response.data.match.status);
      const homeTeamPlayers = response.data.home_team_players || [];
      const awayTeamPlayers = response.data.away_team_players || [];
      if (match.toss_winner && match.elected_to) {
        const isHomeTeamBattingFirst = (match.batting_first === 'home');
        setBattingTeamPlayers(isHomeTeamBattingFirst ? homeTeamPlayers : awayTeamPlayers);
        setBowlingTeamPlayers(isHomeTeamBattingFirst ? awayTeamPlayers : homeTeamPlayers);
      }
      console.log('latest',response.data)
      setTotalRuns(response.data.last_ball.total_runs)
      setTotalWickets(response.data.last_ball.total_wickets)
      setOver(response.data.last_ball.over)
      setBallInOver(response.data.last_ball.ball_in_over)
      checkForMissingInfo(homeTeamPlayers.concat(awayTeamPlayers));
        if (response.data.current_striker) {
          setStriker({
            id: response.data.current_striker.player_id,
            name: response.data.current_striker.name
          });
          setStrikerData(response.data.current_striker)
        }
        if (response.data.current_non_striker) {
          setNonStriker({
            id: response.data.current_non_striker.player_id,
            name: response.data.current_non_striker.name
          });
          setNonStrikerData(response.data.current_non_striker)
        }
        if (response.data.current_bowler) {
          setSelectedBowler({
            id: response.data.current_bowler.player_id,
            name: response.data.current_bowler.name
          });
          setSelectedBowlerData(response.data.current_bowler)
        }

        if (response.data.current_striker === null) {
          setStriker({ id: '', name: '' });
          setStrikerData()
          setIsSelectionDone(false);
        }
        if (response.data.current_non_striker === null) {
          setNonStriker({ id: '', name: '' });
          setNonStrikerData()
          setIsSelectionDone(false);
        }
        if (response.data.current_bowler === null) {
          setSelectedBowler({ id: '', name: '' });
          setSelectedBowlerData()
          setIsSelectionDone(true);
        }
      }
    )
    .catch((error) => {
      console.error("Error fetching match details:", error);
    });
  }, [strikeChange]);


  useEffect(() => {
    if (ballInOver === 6) {
      setOver((prevOver) => prevOver + 1);
      setBallInOver(0);
    }
  }, [ballInOver, over]); // Add dependencies


  const checkForMissingInfo = (players) => {
    const missing = players.filter(player => !player.role || !player.batting_style || !player.bowling_style);
    setMissingInfo(missing);
  };

  const updatePlayerInfo = (playerId, role, battingStyle, bowlingStyle) => {
    axios.post(`${baseURL}/api/update-player-info/`, {
      user_id: playerId,
      role: role,
      batting_style: battingStyle,
      bowling_style: bowlingStyle
    }, {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      showNotification(response.data.message);
      axios.get(`${baseURL}/api/match-detail/${matchId}/`, {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const match = response.data.match;
        console.log(response.data)
        setMatchDetails({
          ...match,
          home_team: response.data.home_team,
          away_team: response.data.away_team
        });
        const homeTeamPlayers = response.data.home_team_players || [];
        const awayTeamPlayers = response.data.away_team_players || [];
        if (match.toss_winner && match.elected_to) {
          const isHomeTeamBattingFirst = (match.batting_first === 'home');
          setBattingTeamPlayers(isHomeTeamBattingFirst ? homeTeamPlayers : awayTeamPlayers);
          setBowlingTeamPlayers(isHomeTeamBattingFirst ? awayTeamPlayers : homeTeamPlayers);
        }
        checkForMissingInfo(homeTeamPlayers.concat(awayTeamPlayers));
        if (response.data.match.status === 'live') {
          if (response.data.current_striker) {
            setStriker({
              id: response.data.current_striker.player_id.id,
              name: response.data.current_striker.player_id.first_name
            });
            setStrikerData(response.data.current_striker)
          }
          if (response.data.current_non_striker) {
            setNonStriker({
              id: response.data.current_non_striker.player_id.id,
              name: response.data.current_non_striker.player_id.first_name
            });
            setNonStrikerData(response.data.current_non_striker)
          }
          if (response.data.current_bowler) {
            setSelectedBowler({
              id: response.data.current_bowler.player_id.id,
              name: response.data.current_bowler.player_id.first_name
            });
            setSelectedBowlerData(response.data.current_bowler)
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching match details:", error);
      });
    })
    .catch(error => {
      console.error("Error updating player info:", error);
    });
  };

  const handleStartScoring = () => {
    if (!striker || !nonStriker || !selectedBowler) {
      alert("Please select striker, non-striker, and bowler to start scoring.");
      return;
    }
    setIsSelectionDone(true);
  };

  const handleScoreUpdate = (event) => {
    const eventData = {
      match_id: matchId,
      onstrike: striker.id,
      offstrike: nonStriker.id,
      bowler: selectedBowler.id,
      over: over,
      ball_in_over: ballInOver + 1,
      total_runs: totalRuns,
      total_wickets: totalWickets,
      how_out: '',
      people_involved: '',
      runs: 0,
      extras: 0,
      extras_type: '',
      innings: innings
    };

    switch (event) {
      case '0':
        eventData.runs = 0;
        break;
      case '1':
        eventData.runs = 1;
        setTotalRuns(totalRuns + 1);
        break;
      case '2':
        eventData.runs = 2;
        setTotalRuns(totalRuns + 2);
        break;
      case '3':
        eventData.runs = 3;
        setTotalRuns(totalRuns + 3);
        break;
      case '4':
        eventData.runs = 4;
        setTotalRuns(totalRuns + 4);
        break;
      case '6':
        eventData.runs = 6;
        setTotalRuns(totalRuns + 6);
        break;
      case 'wd':
        setIsWidePopupVisible(true);
        break;
      case 'nb':
        setIsNoBallPopupVisible(true);
        break;
      case 'lb':
        setIsLbPopupVisible(true);
        break;
      case 'bye':
        setIsByePopupVisible(true);
        break;
      case 'out':
        handleOutClick();
        return;
      case 'undo':
        // Logic for undo
        if (previousScoreUpdates.length > 0) {
          const lastUpdate = previousScoreUpdates.pop(); // Retrieve the last score update
          setTotalRuns(lastUpdate.totalRuns); // Revert totalRuns to the previous value
          setTotalWickets(lastUpdate.totalWickets); // Revert totalWickets to the previous value
          setOver(lastUpdate.over); // Revert over to the previous value
          setBallInOver(lastUpdate.ballInOver); // Revert ballInOver to the previous value
        }
        break;
      default:
        return;
    }
    console.log("Sending eventData:", eventData);

    if (event !== 'wd' && event !== 'nb' && event !== 'lb' && event !== 'bye') {

      axios.post(`${baseURL}/api/update-score/`, eventData, {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then(response => {
        // Save the current score update in the history
        setPreviousScoreUpdates(prevUpdates => [...prevUpdates, { 
          totalRuns: eventData.total_runs,
          totalWickets: eventData.total_wickets,
          over: eventData.over,
          ballInOver: eventData.ball_in_over 
        }]);
        showNotification(response.data.message);
        setBallInOver(ballInOver + 1);
        if (ballInOver >= 5) {
          setOver(over + 1);
          setBallInOver(0);
        }
        /////////////////////////////////// New Bowler condition after over completed
        if (ballInOver === 5) {
          setIsNewBowlerPopupVisible(true)
        }
      })
      .catch(error => {
        console.error("Error updating score:", error);
      });
    };
  }

  const handleExtraSubmit = (type) => {
    console.log( 'extra' ,runsOnExtra)
    const eventData = {
      match_id: matchId,
      onstrike: striker.id,
      offstrike: nonStriker.id,
      bowler: selectedBowler.id,
      over: over,
      ball_in_over: ballInOver,
      total_runs: totalRuns + runsOnExtra,
      total_wickets: totalWickets,
      how_out: '',
      people_involved: '',
      runs: noBallBatterRun,
      extras: runsOnExtra,
      extras_type: type,
      innings: innings
    };

    if (eventData.extras_type === 'lb' || eventData.extras_type === 'bye') {
      eventData.ball_in_over += 1;
    }

    if (eventData.extras_type === 'nb') {
      eventData.total_runs += noBallBatterRun
    }


    axios.post(`${baseURL}/api/update-score/`, eventData, {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      setPreviousScoreUpdates(prevUpdates => [...prevUpdates, { 
        totalRuns: eventData.total_runs,
        totalWickets: eventData.total_wickets,
        over: eventData.over,
        ballInOver: eventData.ball_in_over 
      }]);
      console.log(eventData.extras, eventData.extras_type)
      if (eventData.extras_type === 'lb' || eventData.extras_type === 'bye') {
        setBallInOver(ballInOver + 1);
        if (ballInOver >= 5) {
          setOver(over + 1);
          setBallInOver(0);
        }
      }  
      ///////////////////////////////// New Bowler condition after over completed
      if (ballInOver === 5) {
        console.log('dig')
        setIsNewBowlerPopupVisible(true)
      }
      setIsWidePopupVisible(false);
      setIsNoBallPopupVisible(false);
      setIsLbPopupVisible(false);
      setIsByePopupVisible(false);
      setRunsOnExtra(0);
    })
    .catch(error => {
      console.error("Error updating score:", error);
    });
  };
    

  const handleOutTypeChange = (e) => {
    setOutType(e.target.value);
  };

  const handleOutSubmit = () => {
    let peopleInvolvedDetail = [];
    const bowlerName = selectedBowler.name;
    switch (outType) {
        case 'bowled':
            peopleInvolvedDetail = [{ player_1: bowlerName }];
            break;
        case 'catch_out':
            peopleInvolvedDetail = [{ player_1: fielderName1, player_2: bowlerName }];
            break;
        case 'LBW':
            peopleInvolvedDetail = [{ player_1: bowlerName }];
            break;
        case 'stumped':
            peopleInvolvedDetail = [{ player_1: fielderName1, player_2: bowlerName }];
            break;
        case 'run_out':
            peopleInvolvedDetail = [{ player_1: fielderName1, player_2: fielderName2 }];
            break;
        default:
            break;
    }

    const eventData = {
        match_id: matchId,
        onstrike: striker.id,
        offstrike: nonStriker.id,
        bowler: selectedBowler.id,
        over: over,
        ball_in_over: ballInOver + 1,
        total_runs: totalRuns,
        total_wickets: totalWickets + 1,
        how_out: outType,
        people_involved: JSON.stringify(peopleInvolvedDetail),
        runs: 0,
        extras: 0,
        extras_type: '',
        innings: innings,
        who_out: whoOut
    };
    console.log('this is' ,whoOut)
    console.log('direct',eventData.who_out)
    axios.post(`${baseURL}/api/update-score/`, eventData, {
        headers: {
            authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
    .then(response => {
        setIsOutModalVisible(false);
        setTotalWickets(totalWickets + 1);
        showNotification(response.data.message);
        setBallInOver(ballInOver + 1);
        if (ballInOver >= 5) {
            setOver(over + 1);
            setBallInOver(0);
        }
      //////////////////////////////// New Bowler condition after over completed
        if (ballInOver === 5) {
          console.log('dig')
          setIsNewBowlerPopupVisible(true)
        }
        setIsSelectionDone(false)
    })
    .catch(error => {
        console.error("Error updating score:", error);
    });
  };

  const handleOutClick = () => {
    setIsOutModalVisible(true);
  };

  const handleNewBatterSelect = (batter) => {
    if (striker.name === whoOut) {
      setStriker(batter);
    } else {
      setNonStriker(batter);
    }
    setIsNewBatterPopupVisible(false);
  };

////////////////////////////////////////// Striker Change /////////////////////////////////////////////

  const handleStrikeChange = () => {
      const userConfirmed = window.confirm('Do you want to change the strike?');
      if (userConfirmed) {
        updateStrikerAndNonStriker(nonStriker.id, striker.id); 
      }
    }

  const updateStrikerAndNonStriker = (strikerId, nonStrikerId) => {
    const data = {
      match_id: matchId,
      striker_id: strikerId,
      non_striker_id: nonStrikerId,
    };
  
    axios.post(`${baseURL}/api/update-striker-nonstriker/`, data, {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      showNotification(response.data.message);
      setStrikeChange(true)
    })
    .catch(error => {
      console.error("Error updating striker and non-striker:", error);
    });
  };

////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////// Bowler Change ////////////////////////////////////////////

  const handleBowlerChange = (newBowler) => {
    console.log('this is', newBowler);
    if (newBowler && newBowler.id) {
      updateBowler(matchId, newBowler.id);
    }
  };
  
  
  const updateBowler = (matchId, newBowlerId) => {
    const data = {
      match_id: matchId,
      new_bowler_id: newBowlerId,
    };
  
    axios.post(`${baseURL}/api/update-bowler/`, data, {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      showNotification(response.data.message);
      setSelectedBowler(newBowler);  // Update the selected bowler state
      setNewBowler({ id: '', name: '' });  // Reset the new bowler state
    })
    .catch(error => {
      console.error("Error updating bowler:", error);
    });
  }
  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////// New Batter Selection //////////////////////////////////////////////

  const handleBatterChange = async (player, isNonStriker = false) => {
    try {
      const response = await axios.post(`${baseURL}/api/new-batter-selection/`, {
        match_id: matchId,
        player_id: player.id,
        is_non_striker: isNonStriker,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      });

      if (response.status === 200) {
        if (isNonStriker) {
          setNonStriker(player);
        } else {
          setStriker(player);
        }
      } else {
        console.error('Failed to update player status');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className='relative bg-[url("images/ScoringBack2.png")] bg-cover bg-center h-screen'>
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      <div className="relative z-20 w-full h-full text-white">
        <div className="flex flex-col items-center pt-32">
          <p className="text-white text-4xl flex items-center">
            {totalRuns}/{totalWickets}<span className="text-lg pl-2">({over}.{ballInOver})</span>
          </p>
          <p className="text-lg pl-2 pt-3">
            <span>{tossWinner}</span> won the toss and elected to <span>{tossElected}</span>
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          {!isSelectionDone && (
            <PlayerSelectionOverlay
              battingTeamPlayers={battingTeamPlayers}
              bowlingTeamPlayers={bowlingTeamPlayers}
              striker={striker}
              setStriker={setStriker}
              nonStriker={nonStriker}
              setNonStriker={setNonStriker}
              selectedBowler={selectedBowler}
              setSelectedBowler={setSelectedBowler}
              handleStartScoring={handleStartScoring}
              missingInfo={missingInfo}
              updatePlayerInfo={updatePlayerInfo}
              handleBatterChange={handleBatterChange}
            />
          )}

          <div className="w-2/6 flex">
            <div className="w-1/2 flex flex-col border pl-4 pt-2 mt-20">
              <div className="flex cursor-pointer" onClick={handleStrikeChange}>
                <img className="bg-green-700 rounded-full h-6 w-6 mr-2" src="/images/BatIcon.png" />
                <p>{striker.name}</p>
              </div>
              <div className="pl-8">
                <p>({strikerData ? strikerData.batting_runs_scored : 0}/{strikerData ? strikerData.batting_balls_faced : 0})</p>
              </div>
            </div>
            <div className="w-1/2 flex flex-col border pl-4 pt-2 mt-20">
              <div className="flex">
                <img className="bg-white rounded-full h-6 w-6 mr-2" src="/images/BatIcon.png" />
                <p>{nonStriker.name}</p>
              </div>
              <div className="pl-8">
                <p>({nonStrikerData ? nonStrikerData.batting_runs_scored : 0}/{nonStrikerData ? nonStrikerData.batting_balls_faced : 0 })</p>
              </div>
            </div>
          </div>

          <div className="w-2/6 flex flex-col pt-3 border">
            <div className="flex justify-between w-full">
              <div className="flex pl-4">
                <img className="bg-white rounded-full h-6 w-6 mr-2" src="/images/BallIcon.png" />
                <p>{selectedBowler.name}</p>
              </div>
              <div className="pr-4">
                <p>{selectedBowlerData ? selectedBowlerData.bowling_overs : 0}.{ballInOver}-{selectedBowlerData ? selectedBowlerData.bowling_maiden_overs : 0}-{selectedBowlerData ? selectedBowlerData.bowling_runs_conceded : 0}-{selectedBowlerData ? selectedBowlerData.bowling_wickets : 0}</p>
              </div>
            </div>
            <div className="flex pl-4 py-3">
              {previousScoreUpdates.map((update, index) => (
                <div key={index} className="w-10 h-10 bg-white rounded-full text-black flex justify-center items-center mr-3">
                  {update.runs !== undefined ? update.runs : 
                  update.extras_type === 'wide' ? 'WD' : 
                  update.extras_type === 'no_ball' ? 'NB' : 
                  update.extras_type === 'bye' ? 'BYE' : 
                  update.how_out ? 'W' : ''}
                </div>
              ))}
            </div>
          </div>

          <div className="w-2/6 flex">
            <div className="flex flex-wrap grid-cols-3 grid-rows-3 w-3/4">
              {['0', '1', '2', '3', '4', '6', 'wd', 'nb', 'bye'].map(event => (
                <div key={event} className="w-1/3 flex items-center justify-center border" onClick={() => handleScoreUpdate(event)}>
                  <p className="text-white p-3">{event.toUpperCase()}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col w-1/4">
              {['undo', 'out', 'lb'].map(event => (
                <div key={event} className="flex w-full items-center justify-center border" onClick={() => handleScoreUpdate(event)}>
                  <p className="text-white p-3">{event.toUpperCase()}</p>
                </div>
              ))}
            </div>
            {isWidePopupVisible && (
              <div className="popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                <div className="bg-white p-4 rounded shadow-md text-black">
                  <h3 className="text-xl mb-2">Wide Ball - Select Runs Scored</h3>
                  <select className="border p-2 w-full mb-2" value={runsOnExtra} onChange={e => setRunsOnExtra(parseInt(e.target.value, 10))}>
                    <option value="">Select Runs</option>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((run, index) => (
                      <option key={index} value={run}>{run}</option>
                    ))}
                  </select>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleExtraSubmit('wd')}>Submit</button>
                </div>
              </div>
            )}
            {isNoBallPopupVisible && (
              <div className="popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                <div className="bg-white p-4 rounded shadow-md text-black">
                  <h3 className="text-xl mb-2">No Ball - Select Runs Scored</h3>
                  <select className="border p-2 w-full mb-2" value={runsOnExtra} onChange={e => setnoBallBatterRun(parseInt(e.target.value, 10))}>
                    <option value="">Select Runs</option>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((run, index) => (
                      <option key={index} value={run}>{run}</option>
                    ))}
                  </select>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleExtraSubmit('nb')}>Submit</button>
                </div>
              </div>
            )}
            {isLbPopupVisible && (
              <div className="popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                <div className="bg-white p-4 rounded shadow-md text-black">
                  <h3 className="text-xl mb-2">Leg Bye - Select Runs Scored</h3>
                  <select className="border p-2 w-full mb-2" value={runsOnExtra} onChange={e => setRunsOnExtra(parseInt(e.target.value, 10))}>
                    <option value="">Select Runs</option>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((run, index) => (
                      <option key={index} value={run}>{run}</option>
                    ))}
                  </select>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleExtraSubmit('lb')}>Submit</button>
                </div>
              </div>
            )}
            {isByePopupVisible && (
              <div className="popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                <div className="bg-white p-4 rounded shadow-md text-black">
                  <h3 className="text-xl mb-2">Bye - Select Runs Scored</h3>
                  <select className="border p-2 w-full mb-2" value={runsOnExtra} onChange={e => setRunsOnExtra(parseInt(e.target.value, 10))}>
                    <option value="">Select Runs</option>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((run, index) => (
                      <option key={index} value={run}>{run}</option>
                    ))}
                  </select>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleExtraSubmit('bye')}>Submit</button>
                </div>
              </div>
            )}

            {isOutModalVisible && (
              <div className="popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                <div className="bg-white p-4 rounded shadow-md text-black">
                  <h3 className="text-xl mb-2">Player Out - Select Out Type and Players Involved</h3>
                  <select className="border p-2 w-full mb-2" value={outType} onChange={handleOutTypeChange}>
                    <option value="">Select Out Type</option>
                    <option value="bowled">Bowled</option>
                    <option value="catch_out">Catch Out</option>
                    <option value="LBW">LBW</option>
                    <option value="stumped">Stumped</option>
                    <option value="run_out">Run Out</option>
                  </select>

                  {(outType === 'catch_out' || outType === 'stumped' || outType === 'run_out') && (
                    <>
                      <label className="block mb-2">Fielder1</label>
                      <select className="mb-4 p-2 rounded bg-gray-700" value={fielderName1} onChange={(e) => setFielderName1(e.target.value)}>
                        <option value="">Select Fielder1</option>
                        {bowlingTeamPlayers.map(player => (
                          <option key={player.id} value={player.name}>{player.name}</option>
                        ))}
                      </select>
                      {outType === 'run_out' && 
                        <>
                        <label className="block mb-2">Fielder2</label><select className="mb-4 p-2 rounded bg-gray-700" value={fielderName2} onChange={(e) => setFielderName2(e.target.value)}>
                          <option value="">Select Fielder2</option>
                          {bowlingTeamPlayers.map(player => (
                            <option key={player.id} value={player.name}>{player.name}</option>
                          ))}
                        </select>
                        <label className="block mb-2">who out</label><select className="mb-4 p-2 rounded bg-gray-700" value={whoOut} onChange={(e) => setWhoOut(e.target.value)}>
                          <option value="">Select Who out</option>
                          <option value={striker.id}>{striker.name}</option>
                          <option value={nonStriker.id}>{nonStriker.name}</option>
                        </select>
                        </>
                      }
                    </>
                  )}
                  <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleOutSubmit}>Submit</button>
                </div>
              </div>
            )}

            {isNewBowlerPopupVisible && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-md text-black">
                  <h3 className="text-lg font-semibold mb-2">New Bowler</h3>
                  <select
                    value={newBowler.id}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      const selectedPlayer = bowlingTeamPlayers.find(player => player.id.toString() === selectedValue);
                      console.log(selectedPlayer)
                      setNewBowler({ id: selectedPlayer ? selectedPlayer.id : '', name: selectedPlayer ? selectedPlayer.name : '' });
                      console.log(selectedBowler)
                    }}
                    className="border rounded-md p-1 ml-2"
                  >
                    <option value="">Select a bowler</option>
                    {bowlingTeamPlayers.map(player => (
                      <option key={player.id} value={player.id}>{player.name}</option>
                    ))}
                  </select>
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-500 text-black rounded-md ml-2"
                      onClick={() => {
                        handleBowlerChange(newBowler);  // Pass newBowler directly
                        setIsNewBowlerPopupVisible(false);
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isNewBatterPopupVisible && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                <div className="bg-white p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">New Batter</h3>
                  <select onChange={(e) => handleNewBatterSelect(JSON.parse(e.target.value))} className="border rounded-md p-1 ml-2">
                    {battingTeamPlayers.map(player => (
                      <option key={player.id} value={JSON.stringify(player)}>{player.name}</option>
                    ))}
                  </select>
                  <div className="flex justify-end mt-4">
                    <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded-md ml-2" onClick={() => setIsNewBatterPopupVisible(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>

      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded">
          {notification}
        </div>
      )}
    </div>

  );
}

export default ScoringInterface;

