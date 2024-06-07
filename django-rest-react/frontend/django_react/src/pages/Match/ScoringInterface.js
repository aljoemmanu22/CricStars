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
  const [strikerData, setStrikerData] = useState();
  const [nonStrikerData, setNonStrikerData] = useState();
  const [selectedBowlerData, setSelectedBowlerData] = useState();


  const [missingInfo, setMissingInfo] = useState([]);
  const [matchStatus, setMatchStatus] = useState('');
  const [isSelectionDone, setIsSelectionDone] = useState(false);
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
      console.log(response.data)
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
      console.log(response.data.last_ball)
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
          setIsSelectionDone(true);
        }
      }
    )
    .catch((error) => {
      console.error("Error fetching match details:", error);
    });
  }, []);

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
      ball_in_over: ballInOver,
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
        eventData.extras = 1;
        eventData.extras_type = 'wide';
        break;
      case 'nb':
        eventData.extras = 1;
        eventData.extras_type = 'no_ball';
        break;
      case 'bye':
        eventData.extras = 1;
        eventData.extras_type = 'bye';
        break;
      case 'lb':
        eventData.extras = 1;
        eventData.extras_type = 'leg_bye';
        break;
      case 'out':
        eventData.how_out = 'caught'; // This should be dynamic based on how the player got out
        setTotalWickets(totalWickets + 1);
        break;
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
      // Update ball count and over
      setBallInOver(ballInOver + 1);
      if (ballInOver === 5) {
        setOver(over + 1);
        setBallInOver(0);
      }
    })
    .catch(error => {
      console.error("Error updating score:", error);
    });
  };

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
            />
          )}
  
          <div className="w-2/6 flex">
            <div className="w-1/2 flex flex-col border pl-4 pt-2 mt-20">
              <div className="flex">
                <img className="bg-white rounded-full h-6 w-6 mr-2" src="/images/BatIcon.png" />
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

