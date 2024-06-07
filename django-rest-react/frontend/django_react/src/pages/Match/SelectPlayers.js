import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ScoringInterface() {
  const { matchId } = useParams();
    const navigate = useNavigate();
    const [matchDetails, setMatchDetails] = useState(null);
    const [battingTeamPlayers, setBattingTeamPlayers] = useState([]);
    const [bowlingTeamPlayers, setBowlingTeamPlayers] = useState([]);
    const [striker, setStriker] = useState('');
    const [nonStriker, setNonStriker] = useState('');
    const [selectedBowler, setSelectedBowler] = useState('');
    const [missingInfo, setMissingInfo] = useState([]);
    const [matchStatus, setMatchStatus] = useState('');
    const token = localStorage.getItem('access');
    const baseURL = 'http://127.0.0.1:8000';

    useEffect(() => {
      axios
        .get(baseURL + `/api/match-detail/${matchId}/`, {
          headers: {
            authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const match = response.data.match;
          console.log(response.data.match)
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

          checkForMissingInfo(homeTeamPlayers.concat(awayTeamPlayers));
        })
        .catch((error) => {
          console.error("Error fetching match details:", error);
        });
  }, [matchId]);

  const checkForMissingInfo = (players) => {
      const missing = players.filter(player => !player.role || !player.batting_style || !player.bowling_style);
      setMissingInfo(missing);
  };

  const updatePlayerInfo = (playerId, role, battingStyle, bowlingStyle) => {
      axios
        .post(
          baseURL + '/api/update-player-info/', 
          {
            user_id: playerId,
            role: role,
            batting_style: battingStyle,
            bowling_style: bowlingStyle
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
        .then(response => {
          alert(response.data.message);
          axios
            .get(baseURL + `/api/match-detail/${matchId}/`, {
              headers: {
                authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              const match = response.data.match;
              console.log(response.data.match)
              setMatchDetails({
                  ...match,
                  home_team: response.data.home_team,
                  away_team: response.data.away_team
              });
              console.log(matchDetails.home_team.name)
              setMatchStatus(response.data.match.status);

              const homeTeamPlayers = response.data.home_team_players || [];
              const awayTeamPlayers = response.data.away_team_players || [];

              if (match.toss_winner && match.elected_to) {
                  const isHomeTeamBattingFirst = (match.batting_first === 'home');
                  setBattingTeamPlayers(isHomeTeamBattingFirst ? homeTeamPlayers : awayTeamPlayers);
                  setBowlingTeamPlayers(isHomeTeamBattingFirst ? awayTeamPlayers : homeTeamPlayers);
              }

              checkForMissingInfo(homeTeamPlayers.concat(awayTeamPlayers));
            })
            .catch((error) => {
              console.error("Error fetching match details:", error);
            });
        })
        .catch(error => {
          console.error('Error updating player info:', error);
          alert('Failed to update player information.');
        });
  };

  const handleStartScoring = () => {
      if (missingInfo && missingInfo.length > 0) {
          alert('Some players are missing role or style information. Please update before starting the match.');
      } else {
          navigate(`/scoring-interface/${matchId}`);
      }
  };

  const BATTING_STYLE_CHOICES = [
      ['Right-handed', 'Right-handed'],
      ['Left-handed', 'Left-handed'],
      // Add more options as needed
  ];

  const BOWLING_STYLE_CHOICES = [
      ['Right-arm fast', 'Right-arm fast'],
      ['Right-arm medium', 'Right-arm medium'],
      ['Left-arm fast', 'Left-arm fast'],
      ['Left-arm medium', 'Left-arm medium'],
      // Add more options as needed
  ];

  const ROLE_CHOICES = [
      ['Batsman', 'Batsman'],
      ['Bowler', 'Bowler'],
      ['All-Rounder', 'All-Rounder'],
      ['Wicketkeeper', 'Wicketkeeper'],
  ]


  return (
    <div className='relative bg-[url("images/ScoringBack2.png")] bg-cover bg-center h-screen'>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

      {/* Content */}
      <div className="relative z-20 w-full h-full text-white">
        <div className="flex flex-col items-center pt-32">
          <p className="text-white text-4xl flex items-center">
            6/0<span className="text-lg pl-2">(0.2)</span>
          </p>
          <p className="text-lg pl-2 pt-3">
            PK won the toss and elected to bat
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          {/* ///////////////////////////////////////    striker non striker selection /////////////////////////////////////////////// */}

          <div>
            {matchDetails && (
              <div className="text-black">
                <h1 className="text-white">Match Details</h1>
                <p className="text-white">Home Team: {matchDetails.home_team.name}</p>
                <p className="text-white">Away Team: {matchDetails.away_team.name}</p>
                <select value={striker} onChange={e => setStriker(e.target.value)}>
                    <option value="">Select Striker Batsman</option>
                    {battingTeamPlayers.map(player => (
                        <option key={player.id} value={player.id}>{player.name}</option>
                    ))}
                </select>
                <select value={nonStriker} onChange={e => setNonStriker(e.target.value)}>
                    <option value="">Select Non-Striker Batsman</option>
                    {battingTeamPlayers.map(player => (
                        <option key={player.id} value={player.id}>{player.name}</option>
                    ))}
                </select>
                <select value={selectedBowler} onChange={e => setSelectedBowler(e.target.value)}>
                    <option value="">Select Bowler</option>
                    {bowlingTeamPlayers.map(player => (
                        <option key={player.id} value={player.id}>{player.name}</option>
                    ))}
                </select>
                {missingInfo && missingInfo.length > 0 && (
                  <div className="text-black">
                    <h2 className="text-white">Update Player Information</h2>
                    {missingInfo.map(player => (
                      <div key={player.id}>
                        <p className="text-white">{player.name}</p>
                        <select 
                          value={player.role} 
                          onChange={e => updatePlayerInfo(player.id, e.target.value, player.batting_style, player.bowling_style)} 
                        >
                          <option value="">Select Role</option>
                          {ROLE_CHOICES.map(role => (
                              <option key={role[0]} value={role[0]}>{role[1]}</option>
                          ))}
                        </select>
                        <select 
                          value={player.batting_style} 
                          onChange={e => updatePlayerInfo(player.id, player.role, e.target.value,player.bowling_style)} 
                        >
                          <option value="">Select Batting Style</option>
                          {BATTING_STYLE_CHOICES.map(style => (
                              <option key={style[0]} value={style[0]}>{style[1]}</option>
                          ))}
                        </select>
                        <select 
                          value={player.bowling_style} 
                          onChange={e => updatePlayerInfo(player.id, player.role, player.batting_style, e.target.value)} 
                        >
                          <option value="">Select Bowling Style</option>
                          {BOWLING_STYLE_CHOICES.map(style => (
                              <option key={style[0]} value={style[0]}>{style[1]}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={handleStartScoring}>Start Scoring</button>
              </div>
            )}
          </div>
          {/* ///////////////////////////////////////    striker non striker selection end  /////////////////////////////////////////////// */}

          {/* Batting player's names */}
          <div className="w-2/6 flex">
            <div className="w-1/2 flex flex-col border pl-4 pt-2 mt-20">
              <div className="flex">
                <img
                  className="bg-white rounded-full h-6 w-6 mr-2"
                  src="/images/BatIcon.png"
                />
                <p>Aljo Jose</p>
              </div>
              <div className="pl-8">
                <p>6(2)</p>
              </div>
            </div>
            <div className="w-1/2 flex flex-col border pl-4 pt-2 mt-20">
              <div className="flex">
                <img
                  className="bg-white rounded-full h-6 w-6 mr-2"
                  src="/images/BatIcon.png"
                />
                <p>Aljo Jose</p>
              </div>
              <div className="pl-8">
                <p>6(2)</p>
              </div>
            </div>
          </div>

          {/* over updates */}
          <div className="w-2/6 flex flex-col pt-3 border">
            <div className="flex justify-between w-full">
              <div className="flex pl-4">
                <img
                  className="bg-white rounded-full h-6 w-6 mr-2"
                  src="/images/BallIcon.png"
                />
                <p>Emmanuel Jose</p>
              </div>
              <div className="pr-4">
                <p>0.2-0-6-0</p>
              </div>
            </div>
            <div className="flex pl-4 py-3">
              <p className="w-10 h-10 bg-white rounded-full text-black flex justify-center items-center mr-3">
                0
              </p>
              <p className="w-10 h-10 bg-rose-500 rounded-full text-black flex justify-center items-center mr-3">
                4
              </p>
              <p className="w-10 h-10 bg-lime-400 rounded-full text-black flex justify-center items-center mr-3">
                6
              </p>
            </div>
          </div>

          {/* Scoring update Keys */}
          <div className="w-2/6 flex">
            <div className="flex flex-wrap grid-cols-3 grid-rows-3 w-3/4">
              <div className="w-1/3 flex items-center justify-center border">
                <p className="text-white p-3">0</p>
              </div>
              <div className="w-1/3 flex items-center justify-center border">
                <p className="text-white p-3">1</p>
              </div>
              <div className="w-1/3 flex items-center justify-center border">
                <p className="text-white p-3">2</p>
              </div>
              <div className="w-1/3 flex items-center justify-center border">
                <p className="text-white p-3">3</p>
              </div>
              <div className="w-1/3 flex flex-col items-center justify-center border">
                <p className="text-white px-3">4</p>
                <p className="text-white px-3">Four</p>
              </div>
              <div className="w-1/3 flex flex-col items-center justify-center border">
                <p className="text-white px-3">6</p>
                <p className="text-white px-3">Six</p>
              </div>
              <div className="w-1/3 flex items-center justify-center border">
                <p className="text-white p-3">WD</p>
              </div>
              <div className="w-1/3 flex items-center justify-center border">
                <p className="text-white p-3">NB</p>
              </div>
              <div className="w-1/3 flex items-center justify-center border">
                <p className="text-white p-3">BYE</p>
              </div>
            </div>
            <div className="flex flex-col w-1/4">
              <div className="flex w-full items-center justify-center border">
                <p className="text-white p-3">UNDO</p>
              </div>
              <div className="flex w-full items-center justify-center border">
                <p className="text-white p-3">OUT</p>
              </div>
              <div className="flex w-full items-center justify-center border">
                <p className="text-white p-3">LB</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScoringInterface;
