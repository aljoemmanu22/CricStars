import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import PlayerSelectionOverlay from "./PlayerSelectionOverlay";
import ResultModel from "./ResultModel";

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
  const [home_team, setHomeTeam] = useState({ id: '', name: '' })
  const [away_team, setAwayTeam] = useState({ id: '', name: '' })


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

  const [previousBowler, setPreviousBowler] = useState('')
  const [currentOverEvents, setCurrentOverEvents] = useState([]);
  const [result, setResult] = useState('')
  const [first_innings_last_ball, setFirst_innings_last_ball] = useState()
  const [first_innings_total, set_first_innings_total] = useState(0)

  const [wides, setWides] = useState(0);
  const [noBalls, setNoBalls] = useState(0);
  const [legbyes, setLegbyes] = useState(0);
  const [byes, setByes] = useState(0);
  const [total_extras, setTotalExtras] = useState(0);
  const [runs_inover, setRunsInOver] = useState(0);
  const [wickets_inover, setWicketsInOver] = useState(0);

  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [isInningsEndModalVisible, setInningsEndModalVisible] = useState(false) 
  const [lastBall, setLastBall] = useState()
  const [isStreaming, setIsStreaming] = useState(false);

  // Function to show notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000); // Hide after 3 seconds
  };

  const handleStartMatch = async () => {
    try {
      const response = await axios.post(baseURL+'/api/start-match/', { match_id: matchId }, {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log(response.data.message);
      setIsSelectionDone(false)
    } catch (error) {
      console.error('Error starting match:', error);
    }
  };

  const handleInningsChange = async () => {
    try {
      const response = await axios.post(baseURL+'/api/innings-change/', { match_id: matchId },{
        headers: {
          authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log(response.data.message);
      setIsNewBowlerPopupVisible(false)
      setIsSelectionDone(true)
      window.location.reload();
    } catch (error) {
      console.error('Error changing innings:', error);
    }
  };

  const handleEndMatch = async (result) => {
    try {
      const response = await axios.post(baseURL+'/api/end-match/', { match_id: matchId, result }, {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log(response.data.message);
      setResult(result);
      // fetchMatchDetails(
      //   matchId, 
      //   token, 
      //   setMatchDetails, 
      //   setTossWinner, 
      //   setTossElected, 
      //   setMatchStatus, 
      //   setBattingTeamPlayers, 
      //   setBowlingTeamPlayers, 
      //   setTotalRuns, 
      //   setTotalWickets, 
      //   setOver, 
      //   setBallInOver, 
      //   setStriker, 
      //   setStrikerData, 
      //   setNonStriker, 
      //   setNonStrikerData, 
      //   setSelectedBowler, 
      //   setSelectedBowlerData, 
      //   setIsSelectionDone, 
      //   checkForMissingInfo, 
      //   setWides, setNoBalls, setLegbyes, setByes, setTotalExtras, setRunsInOver, setWicketsInOver
      // );
      setIsSelectionDone(true)
      setIsNewBowlerPopupVisible(false)
      setIsResultModalVisible(true); 
    } catch (error) {
      console.error('Error ending match:', error);
    }
  };
  
///////////////////////////////////////////////////// experiment ///////////////////////////////////////////////////////


  const fetchMatchDetails = async (matchId, token, setMatchDetails, setTossWinner, setTossElected, setMatchStatus, setBattingTeamPlayers, setBowlingTeamPlayers, setTotalRuns, setTotalWickets, setOver, setBallInOver, setStriker, setStrikerData, setNonStriker, setNonStrikerData, setSelectedBowler, setSelectedBowlerData, setIsSelectionDone, checkForMissingInfo, setWides, setNoBalls, setLegbyes, setByes, setTotalExtras, setRunsInOver, setWicketsInOver) => {
    try {
      const response = await axios.get(`${baseURL}/api/match-detail/${matchId}/`, {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.data.match.status !== 'past') {
      if (response.data.match.innings === 2) {
        setFirst_innings_last_ball(response.data.first_innings_last_ball)
        set_first_innings_total(response.data.first_innings_total)
      }

      const match = response.data.match;
      setTossWinner(match.toss_winner);
      setTossElected(match.elected_to);
      setInnings(response.data.match.innings)
      setMatchDetails({
        match: response.data.match,
      });
      setHomeTeam(response.data.home_team)
      setAwayTeam(response.data.away_team)
      setMatchStatus(match.status);

      const homeTeamPlayers = response.data.home_team_players || [];
      const awayTeamPlayers = response.data.away_team_players || [];

      if (match.toss_winner && match.elected_to) {
        const isHomeTeamBattingFirst = (match.batting_first === 'home');
        if (response.data.match.innings === 1) {
          setBattingTeamPlayers(isHomeTeamBattingFirst ? homeTeamPlayers : awayTeamPlayers);
          setBowlingTeamPlayers(isHomeTeamBattingFirst ? awayTeamPlayers : homeTeamPlayers);
        } else {
          setBattingTeamPlayers(isHomeTeamBattingFirst ? awayTeamPlayers : homeTeamPlayers);
          setBowlingTeamPlayers(isHomeTeamBattingFirst ? homeTeamPlayers : awayTeamPlayers);
        }
      }

      // console.log('latest', response.data);

      if (response.data.last_ball) {
        setTotalRuns(response.data.last_ball.total_runs);
        setTotalWickets(response.data.last_ball.total_wickets);
        setOver(response.data.last_ball.over);
        setBallInOver(response.data.last_ball.ball_in_over);
        setWides(response.data.last_ball.wides)
        setNoBalls(response.data.last_ball.noBalls)
        setLegbyes(response.data.last_ball.legbyes)
        setByes(response.data.last_ball.byes)
        setTotalExtras(response.data.last_ball.total_extras)
        setRunsInOver(response.data.last_ball.runs_inover)
        setWicketsInOver(response.data.last_ball.wickets_inover)
        setLastBall(response.data.lastBall)
        
        if (response.data.last_ball.ball_in_over == 6) {
          if (response.data.last_ball.bowler == response.data.current_bowler.player_id) {
            setIsNewBowlerPopupVisible(true)
          }
        }
        
      
//////////////// handling striker change //////////////////
        if (response.data.last_ball.ball_in_over === 6 && response.data.last_ball.extras_type === '') {
          const runss = response.data.last_ball.runs
          const striking = response.data.last_ball.onstrike
          const offstrike = response.data.last_ball.offstrike

          if (runss % 2 !== 0) {
            updateStrikerAndNonStriker(striking, offstrike);
          }
        }

        // if (response.data.last_ball.ball_in_over === 6 && response.last_ball.how_out === 'run_out') {
        //   const runss = response.data.last_ball.runs
        //   const striking = response.data.last_ball.onstrike
        //   const offstrike = response.data.last_ball.offstrike
        //   if(response.last_ball.how_out != ''){
        //     if(response.last_ball.how_out === 'run_out' && runss % 2 != 0){
        //       const strikeC = true
        //     } else {
        //     const strikeC = false
        //     }
        //   }
        // }
///////////////////////////////////////////////////////////

        setPreviousBowler(response.data.last_ball.bowler)
        if (response.data.last_ball.ballInOver === 6 && response.data.last_ball.extras_type === '') {
          handleStrikeChangeRuns()
        }
      }

      checkForMissingInfo(homeTeamPlayers.concat(awayTeamPlayers));
      setMatchStatus(response.data.match.status)

      if (response.data.current_striker) {
        setStriker({
          id: response.data.current_striker.player_id,
          name: response.data.current_striker.name
        });
        setStrikerData(response.data.current_striker);
      } else {
        setStriker({ id: '', name: '' });
        setStrikerData();
        setIsSelectionDone(false);
      }

      if (response.data.current_non_striker) {
        setNonStriker({
          id: response.data.current_non_striker.player_id,
          name: response.data.current_non_striker.name
        });
        setNonStrikerData(response.data.current_non_striker);
      } else {
        setNonStriker({ id: '', name: '' });
        setNonStrikerData();
        setIsSelectionDone(false);
      }

      if (response.data.current_bowler) {
        setSelectedBowler({
          id: response.data.current_bowler.player_id,
          name: response.data.current_bowler.name
        });
        setSelectedBowlerData(response.data.current_bowler);
      } else {
        setSelectedBowler({ id: '', name: '' });
        setSelectedBowlerData();
        setIsSelectionDone(false);
      }

      setCurrentOverEvents([])
      setCurrentOverEvents(response.data.current_over);
    }
    } catch (error) {
      console.error("Error fetching match details:", error);
    }
  };

///////////////////////////////////////////////// useeffects ///////////////////////////////////////////////////////

  useEffect(() => {
    if (matchStatus === 'scheduled') {
      handleStartMatch()
      console.log('done')
    }
  }, [matchStatus]);

  useEffect(() => {
    if (matchDetails && innings == 1) {
      const totalPlayers = battingTeamPlayers.length;
      if (over >= matchDetails.match.overs || totalWickets >= battingTeamPlayers.length - 1) {
        setInningsEndModalVisible(true)
      }
    }
  }, [totalRuns, totalWickets, over, ballInOver])

  useEffect(() => {
    if (first_innings_last_ball && first_innings_total != 0 && matchStatus === 'live') {
      if (matchDetails && innings == 2) {
        const targetScore = first_innings_total + 1;
        const totalPlayers = battingTeamPlayers.length - 1; // Total number of players in the team

        // Check if second batting team has crossed the winning run
        if (totalRuns >= targetScore) {
          const winningTeam = matchDetails.match.batting_first === 'home' ? away_team.name : home_team.name;
          const result = `${winningTeam} won by ${totalPlayers - totalWickets} wickets`;
          handleEndMatch(result);
        }
        // Check if second batting team is all out before reaching the target score
        else if (totalWickets >= totalPlayers) {
          const winningTeam = matchDetails.match.batting_first === 'home' ? home_team.name : away_team.name;
          const result = `${winningTeam} won by ${targetScore - totalRuns} runs`;
          handleEndMatch(result);
        }
        // Check if second innings overs reach the maximum
        else if (over >= matchDetails.match.overs) {
          if (totalRuns > first_innings_total) {
            const winningTeam = matchDetails.match.batting_first === 'home' ? away_team.name : home_team.name;
            const result = `${winningTeam} won by ${totalPlayers - totalWickets} wickets`;
            handleEndMatch(result);
          } else if (totalRuns === first_innings_total) {
            const result = 'Match drawn';
            handleEndMatch(result);
          } else {
            const winningTeam = matchDetails.match.batting_first === 'home' ? home_team.name : away_team.name;
            const result = `${winningTeam} won by ${first_innings_total - totalRuns} runs`;
            handleEndMatch(result);
          }
        }
      }
    }
  }, [totalRuns, totalWickets, over, ballInOver]);

  useEffect(() => {
    fetchMatchDetails(
      matchId, 
      token, 
      setMatchDetails, 
      setTossWinner, 
      setTossElected, 
      setMatchStatus, 
      setBattingTeamPlayers, 
      setBowlingTeamPlayers, 
      setTotalRuns, 
      setTotalWickets, 
      setOver, 
      setBallInOver, 
      setStriker, 
      setStrikerData, 
      setNonStriker, 
      setNonStrikerData, 
      setSelectedBowler, 
      setSelectedBowlerData, 
      setIsSelectionDone, 
      checkForMissingInfo,
      setWides, setNoBalls, setLegbyes, setByes, setTotalExtras, setRunsInOver, setWicketsInOver
    );
  }, [strikeChange, innings]);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
          if (innings === 1) {
            setBattingTeamPlayers(isHomeTeamBattingFirst ? homeTeamPlayers : awayTeamPlayers);
            setBowlingTeamPlayers(isHomeTeamBattingFirst ? awayTeamPlayers : homeTeamPlayers);
          } else {
            setBattingTeamPlayers(isHomeTeamBattingFirst ? awayTeamPlayers : homeTeamPlayers);
            setBowlingTeamPlayers(isHomeTeamBattingFirst ? homeTeamPlayers : awayTeamPlayers);
          }
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
      innings: innings,
      who_out : whoOut,
      wides : wides,
      noBalls : noBalls,
      legbyes : legbyes,
      byes : byes,
      total_extras : total_extras,
      runs_inover : runs_inover,
      wickets_inover : wickets_inover
    };

    switch (event) {
      case '0':
        eventData.runs = 0;
        break;
      case '1':
        eventData.runs = 1;
        eventData.total_runs = totalRuns + 1
        break;
      case '2':
        eventData.runs = 2;
        eventData.total_runs = totalRuns + 2
        break;
      case '3':
        eventData.runs = 3;
        eventData.total_runs = totalRuns + 3
        break;
      case '4':
        eventData.runs = 4;
        eventData.total_runs = totalRuns + 4
        break;
      case '6':
        eventData.runs = 6;
        eventData.total_runs = totalRuns + 6
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
    // console.log("Sending eventData:", eventData);

    if (event !== 'wd' && event !== 'nb' && event !== 'lb' && event !== 'bye') {

      axios.post(`${baseURL}/api/update-score/`, eventData, {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then(response => {
        // Save the current score update in the history////////////////////   undo current   /////////////////////////////////////////////////////
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

        if (eventData.runs == 1 || eventData.runs == 3) {
          handleStrikeChangeRuns()
        }

        fetchMatchDetails(
          matchId, 
          token, 
          setMatchDetails, 
          setTossWinner, 
          setTossElected, 
          setMatchStatus, 
          setBattingTeamPlayers, 
          setBowlingTeamPlayers, 
          setTotalRuns, 
          setTotalWickets, 
          setOver, 
          setBallInOver, 
          setStriker, 
          setStrikerData, 
          setNonStriker, 
          setNonStrikerData, 
          setSelectedBowler, 
          setSelectedBowlerData, 
          setIsSelectionDone, 
          checkForMissingInfo,
          setWides, setNoBalls, setLegbyes, setByes, setTotalExtras, setRunsInOver, setWicketsInOver
        );
      })
      .catch(error => {
        console.error("Error updating score:", error);
      });
    };
  }

  const handleExtraSubmit = (type) => {
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
      extras: runsOnExtra + 1,
      extras_type: type,
      innings: innings,
      who_out : whoOut,
      wides : wides,
      noBalls : noBalls,
      legbyes : legbyes,
      byes : byes,
      total_extras : total_extras,
      runs_inover : runs_inover,
      wickets_inover : wickets_inover
    };

    if (eventData.extras_type === 'lb') {
      eventData.ball_in_over += 1;
      eventData.legbyes += 1
    }

    if (eventData.extras_type === 'bye') {
      eventData.ball_in_over += 0;
      eventData.byes += runsOnExtra
    }

    if (eventData.extras_type === 'nb') {
      eventData.total_runs += noBallBatterRun + 1
      eventData.noBalls += 1
    }

    if (eventData.extras_type === 'wd') {
      eventData.total_runs += 1
      eventData.wides += 1
    }

    axios.post(`${baseURL}/api/update-score/`, eventData, {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then(response => {
  // Save the current score update in the history////////////////////   undo current   /////////////////////////////////////////////////////
      setPreviousScoreUpdates(prevUpdates => [...prevUpdates, { 
        totalRuns: eventData.total_runs,
        totalWickets: eventData.total_wickets,
        over: eventData.over,
        ballInOver: eventData.ball_in_over 
      }]);
      console.log(eventData.extras, eventData.extras_type)
      if (eventData.extras_type === 'lb') {
        setBallInOver(ballInOver + 1);
        if (ballInOver >= 5) {
          setOver(over + 1);
          setBallInOver(0);
        }
      }  
      ///////////////////////////////// New Bowler condition after over completed
      if (ballInOver === 5 && eventData.extras_type != 'wd' && eventData.extras_type != 'nb' && eventData.extras_type != 'bye') {
        console.log('dig')
        setIsNewBowlerPopupVisible(true)
      }
      setIsWidePopupVisible(false);
      setIsNoBallPopupVisible(false);
      setIsLbPopupVisible(false);
      setIsByePopupVisible(false);
      
      if (runsOnExtra == 1 || runsOnExtra == 3) {
        handleStrikeChangeRuns()
      }
      if (eventData.runs > 0 && eventData.runs % 2 != 0) {
        handleStrikeChangeRuns()
      }


      setRunsOnExtra(0);

      fetchMatchDetails(
        matchId, 
        token, 
        setMatchDetails, 
        setTossWinner, 
        setTossElected, 
        setMatchStatus, 
        setBattingTeamPlayers, 
        setBowlingTeamPlayers, 
        setTotalRuns, 
        setTotalWickets, 
        setOver, 
        setBallInOver, 
        setStriker, 
        setStrikerData, 
        setNonStriker, 
        setNonStrikerData, 
        setSelectedBowler, 
        setSelectedBowlerData, 
        setIsSelectionDone, 
        checkForMissingInfo, 
        setWides, setNoBalls, setLegbyes, setByes, setTotalExtras, setRunsInOver, setWicketsInOver
      );
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
            peopleInvolvedDetail = [{ player_1: `b ${bowlerName}` }];
            break;
        case 'catch_out':
            peopleInvolvedDetail = [{ player_1: `c ${fielderName1}`, player_2: `b ${bowlerName}` }];
            break;
        case 'LBW':
            peopleInvolvedDetail = [{ player_1: `b ${bowlerName}` }];
            break;
        case 'stumped':
            peopleInvolvedDetail = [{ player_1: `c ${fielderName1}`, player_2: `b ${bowlerName}` }];
            break;
        case 'run_out':
            peopleInvolvedDetail = [{ player_1: `c ${fielderName1}`, player_2: `b ${fielderName2}` }];
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
        who_out: whoOut,
        wides : wides,
        noBalls : noBalls,
        legbyes : legbyes,
        byes : byes,
        total_extras : total_extras,
        runs_inover : runs_inover,
        wickets_inover : wickets_inover
    };

    if (outType != 'run_out') {
      eventData.who_out = striker.id
    }

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

        if (eventData.how_out != 'run_out') {
          setStriker({ id: '', name: '' })
        }

        if (eventData.how_out === 'run_out') {
          if (striker.id === whoOut) {
            setStriker({ id: '', name: '' });
          } else if (nonStriker.id === whoOut) {
            setNonStriker({ id: '', name: '' });
          }
        }      

        setIsSelectionDone(false)

        fetchMatchDetails(
          matchId, 
          token, 
          setMatchDetails, 
          setTossWinner, 
          setTossElected, 
          setMatchStatus, 
          setBattingTeamPlayers, 
          setBowlingTeamPlayers, 
          setTotalRuns, 
          setTotalWickets, 
          setOver, 
          setBallInOver, 
          setStriker, 
          setStrikerData, 
          setNonStriker, 
          setNonStrikerData, 
          setSelectedBowler, 
          setSelectedBowlerData, 
          setIsSelectionDone, 
          checkForMissingInfo,
          setWides, setNoBalls, setLegbyes, setByes, setTotalExtras, setRunsInOver, setWicketsInOver
        );
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


  const handleStrikeChangeRuns = () => {
    updateStrikerAndNonStriker(nonStriker.id, striker.id)
  }

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
      console.log('yesman')
      setNewBowler({ id: '', name: '' });  // Reset the new bowler state
      fetchMatchDetails(
        matchId, 
        token, 
        setMatchDetails, 
        setTossWinner, 
        setTossElected, 
        setMatchStatus, 
        setBattingTeamPlayers, 
        setBowlingTeamPlayers, 
        setTotalRuns, 
        setTotalWickets, 
        setOver, 
        setBallInOver, 
        setStriker, 
        setStrikerData, 
        setNonStriker, 
        setNonStrikerData, 
        setSelectedBowler, 
        setSelectedBowlerData, 
        setIsSelectionDone, 
        checkForMissingInfo, 
        setWides, setNoBalls, setLegbyes, setByes, setTotalExtras, setRunsInOver, setWicketsInOver
      );
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

        fetchMatchDetails(
          matchId, 
          token, 
          setMatchDetails, 
          setTossWinner, 
          setTossElected, 
          setMatchStatus, 
          setBattingTeamPlayers, 
          setBowlingTeamPlayers, 
          setTotalRuns, 
          setTotalWickets, 
          setOver, 
          setBallInOver, 
          setStriker, 
          setStrikerData, 
          setNonStriker, 
          setNonStrikerData, 
          setSelectedBowler, 
          setSelectedBowlerData, 
          setIsSelectionDone, 
          checkForMissingInfo, 
          setWides, setNoBalls, setLegbyes, setByes, setTotalExtras, setRunsInOver, setWicketsInOver
        );

      } else {
        console.error('Failed to update player status');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleinningsendSubmit = () =>{
    handleInningsChange();
    setIsSelectionDone(false)
    setInningsEndModalVisible(false)
  }

/////////////////////////////////////////////// live streaming part //////////////////////////////////////////

const handleStartStream = async () => {
  try {
    await axios.get(`http://127.0.0.1:8000/api/start-stream/${matchId}/`);
    setIsStreaming(true);
  } catch (error) {
    console.error('Failed to start streaming', error);
  }
};

const handleStopStream = async () => {
  try {
    await axios.get(`http://127.0.0.1:8000/api/stop-stream/${matchId}/`);
    setIsStreaming(false);
  } catch (error) {
    console.error('Failed to stop streaming', error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className='relative bg-[url("images/ScoringBack2.png")] bg-cover bg-center h-screen'>
      {/* {console.log('striker', {strikerData} , {nonStrikerData}, {selectedBowlerData}, 'over', {over})} */}
      {isResultModalVisible && 
        <ResultModel result={result} onClose={() => setIsResultModalVisible(false)} />
      }
      {isInningsEndModalVisible &&
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white text-black p-8 rounded-lg shadow-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4">First Innings End</h2>
            <p className="text-lg mb-6">{totalRuns}/{totalWickets}<span className="text-lg pl-2">({over}.{ballInOver})</span></p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleinningsendSubmit}
            >
              Start Second Innings
            </button>
          </div>
        </div>
      }
      
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      <div className="relative z-20 w-full h-full text-white">
        <div className="flex flex-col items-center pt-32 md:pt-10 sm:pt-10">
          <p className="text-white text-4xl flex items-center">
            {totalRuns}/{totalWickets}<span className="text-lg pl-2">({over}.{ballInOver})</span>
          </p>
          <p className="text-lg pl-2 pt-3">
            <span>{tossWinner}</span> won the toss and elected to <span>{tossElected}</span>
          </p>
          {innings !=1 &&  
            <p className="text-lg pl-2 pt-3">
              <span>{away_team.name} </span>need <span>{first_innings_total - totalRuns + 1} </span>{}<span>runs to win</span>
            </p>
          }
          
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
              setNewBowler={setNewBowler}
              handleBowlerChange={handleBowlerChange}
            />
          )}

          <div className="lg:w-2/6 flex md:w-5/6 sm:w-5/6">
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

          <div className="lg:w-2/6 md:w-5/6 sm:w-5/6 flex flex-col pt-3 border">
            <div className="flex justify-between w-full">
              <div className="flex pl-4">
                <img className="bg-white rounded-full h-6 w-6 mr-2" src="/images/BallIcon.png" />
                <p>{selectedBowler.name}</p>
              </div>
              <div className="pr-4">
                <p>{selectedBowlerData ? selectedBowlerData.bowling_overs : 0}-{selectedBowlerData ? selectedBowlerData.bowling_maiden_overs : 0}-{selectedBowlerData ? selectedBowlerData.bowling_runs_conceded : 0}-{selectedBowlerData ? selectedBowlerData.bowling_wickets : 0}</p>
              </div>
            </div>
            <div className="flex flex-wrap">
              {currentOverEvents.map((event, index) => (
                <div key={index} className="flex pl-2 py-3">
                  <p className="w-10 h-10 bg-white rounded-full text-black flex justify-center items-center mr-3 md:mr-1 sm:mr-1">
                    {event.extras_type ? event.extras_type.toUpperCase() : (event.how_out ? 'OUT' : event.runs)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-2/6 md:w-5/6 sm:w-5/6 flex">
            <div className="flex flex-wrap grid-cols-3 grid-rows-3 w-3/4">
              {['0', '1', '2', '3', '4', '6', 'wd', 'nb', 'bye'].map(event => (
                <div key={event} className="w-1/3 flex items-center justify-center border" onClick={() => handleScoreUpdate(event)}>
                  <p className="text-white p-3">{event.toUpperCase()}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col w-1/4">
              {['out', 'lb'].map(event => (
                <div key={event} className="flex w-full items-center justify-center border" onClick={() => handleScoreUpdate(event)}>
                  <p className="text-white p-3">{event.toUpperCase()}</p>
                </div>
              ))}
            </div>
            {/* <div className="flex flex-col w-1/4">
              {['undo', 'out', 'lb'].map(event => (
                <div key={event} className="flex w-full items-center justify-center border" onClick={() => handleScoreUpdate(event)}>
                  <p className="text-white p-3">{event.toUpperCase()}</p>
                </div>
              ))}
            </div> */}
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
                  <select className="border p-2 w-full mb-2" value={noBallBatterRun} onChange={e => setnoBallBatterRun(parseInt(e.target.value, 10))}>
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
                      setNewBowler({ id: selectedPlayer ? selectedPlayer.id : '', name: selectedPlayer ? selectedPlayer.name : '' });
                    }}
                    className="border rounded-md p-1 ml-2"
                  >
                    <option value="">Select a bowler</option>
                    {bowlingTeamPlayers
                      .filter(player => player.id !== previousBowler) // Filter out the previous bowler
                      .map(player => (
                        <option key={player.id} value={player.id}>{player.name}</option>
                      ))}
                  </select>
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-500 text-black rounded-md ml-2"
                      onClick={() => {
                        handleBowlerChange(newBowler); // Pass newBowler directly
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
            <div>
              <button className="p-2 mt-2 bg-green-600" onClick={handleStartStream} disabled={isStreaming}>Start Streaming</button>
            </div>
            <div>
              <button className="p-2 mt-2 bg-red-600" onClick={handleStopStream} disabled={!isStreaming}>Stop Streaming</button>
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

