import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ScoreCard( {matchId} ) {

  const [innings1Batters, setInnings1Batters] = useState({});
  const [innings1Bowlers, setInnings1Bowlers] = useState({})
  const [innings2Batters, setInnings2Batters] = useState({});
  const [innings2Bowlers, setInnings2Bowlers] = useState({})
  const [ballsInnings1wickets, setBallsInnings1wickets] = useState([]);
  const [ballsInnings2wickets, setBallsInnings2wickets] = useState([]);
  const [showContent1, setShowContent1] = useState(false);
  const [showContent2, setShowContent2] = useState(false);
  const [match, setMatch] = useState()
  const [matchData, setMatchData] = useState()
  const [batsfirst, setBatsFirst] = useState('')
  const [home_team, setHomeTeam] = useState('')
  const [away_team, setAwayTeam] = useState('')
  const [lastBallInnings1, setLastBallInnnings1] = useState({});
  const [lastBallInnings2, setLastBallInnnings2] = useState({});
  const [innings_1_Not_Batted, setInnings_1_Not_Batted] = useState({})
  const [innings_2_Not_Batted, setInnings_2_Not_Batted] = useState({})
  
  

  const navigate = useNavigate();
  const token = localStorage.getItem('access');
  const baseURL = 'http://127.0.0.1:8000';
  


  useEffect(() => {
    axios.get(`${baseURL}/api/extended-match-scorecard/${matchId}/`, {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        const { innings_1_Not_Batted, innings_2_Not_Batted,  innings_1_batting, innings_1_bowling, innings_2_batting, innings_2_bowling, bal_by_ball_innings1wickets, bal_by_ball_innings2wickets, match, home_team, away_team, last_ball_innings1, last_ball_innings2 } = response.data;
        setInnings1Batters(innings_1_batting)
        setInnings1Bowlers(innings_1_bowling)
        setInnings2Batters(innings_2_batting)
        setInnings2Bowlers(innings_2_bowling)
        setBallsInnings1wickets(bal_by_ball_innings1wickets);
        setBallsInnings2wickets(bal_by_ball_innings2wickets);
        setMatch(match);
        setMatchData(response.data);
        setHomeTeam(home_team);
        setAwayTeam(away_team);
        setLastBallInnnings1(last_ball_innings1);
        setLastBallInnnings2(last_ball_innings2);
        setInnings_1_Not_Batted(innings_1_Not_Batted)
        setInnings_2_Not_Batted(innings_2_Not_Batted)


        if (response.data.match_details?.toss_winner) {
          const { toss_winner, elected_to } = response.data.match_details;
          if (toss_winner === 'home') {
            setBatsFirst(elected_to === 'bat' ? 'home' : 'away');
          } else if (toss_winner === 'away') {
            setBatsFirst(elected_to === 'bat' ? 'away' : 'home');
          }
        }
      })
      .catch(error => {
        console.error("There was an error fetching the match data!", error);
      });
  }, [matchId, token, baseURL]);

  const toggleContent1 = () => {
    setShowContent1(!showContent1);
  };

  const toggleContent2 = () => {
    setShowContent2(!showContent2);
  };


  return (
    <div className='w-full bg-black-rgba rounded-lg'>
      <div className='mt-3 bg-white rounded-lg'>
        <div className='flex justify-between items-center pl-4 p-3'>
          <p className='font-bold'>{batsfirst === 'home' ? home_team.team_name : away_team.team_name}</p>
          <div className='flex items-center justify-center mr-5'>
            <p className='font-bold text-2xl mr-1'>{lastBallInnings1?.total_runs}/{lastBallInnings1?.total_wickets}</p>
            <p>({lastBallInnings1?.ball_in_over === 6 ? lastBallInnings1?.over + 1 : lastBallInnings1?.over}.{lastBallInnings1?.ball_in_over === 6 ? 0 : lastBallInnings1?.ball_in_over})</p>
            <div className='pl-2'>
              <button onClick={toggleContent1}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z" clipRule="evenodd" />
                </svg>
              </button> 
            </div>
          </div>
        </div>

        {showContent1 && (

          <div className='rounded-b-lg'>
            {/* heading for scorecard */}
            <div className='bg-slate-100 flex items-center justify-between border-b font-bold'>
              <div className=''>
                <div>
                  <p className='pl-4 py-2'>Batters</p>
                </div>
              </div>
              <div className='flex'>
                <p className='w-14 sm:w-8'>R</p>
                <p className='w-14 sm:w-8'>B</p>
                <p className='w-14 sm:w-8'>4s</p>
                <p className='w-14 sm:w-8'>6s</p>
                <p className='w-14 sm:w-8'>SR</p>
              </div>
            </div>


            {/* Players Scores */}
            {innings1Batters.map((batter, index) => (
              <div className='bg-white flex items-center justify-between border-b rounded-b-lg' key={index}>
                <div className='flex w-3/5'>
                  <div className='w-2/6'>
                    <p className='pl-4 py-2'>{batter.player.first_name}</p>
                  </div>
                  <div>
                    <p className='pl-4 py-2'>{batter.how_out}</p>
                  </div>
                </div>
                <div className='flex'>
                  <p className='w-14 sm:w-8'>{batter.batting_runs_scored}</p>
                  <p className='w-14 sm:w-8'>{batter.batting_balls_faced}</p>
                  <p className='w-14 sm:w-8'>{batter.batting_fours}</p>
                  <p className='w-14 sm:w-8'>{batter.batting_sixes}</p>
                  <p className='w-14 sm:w-8'>{batter.batting_strike_rate}</p>
                </div>
              </div>
            ))}
           


            {/* Extaras */}
            {/* <div className='bg-white flex items-center justify-between border-b rounded-b-lg sm:hidden'>
              <div className='flex w-3/5'>
                <div className='w-2/6'>
                  <p className='pl-4 py-2 font-semibold'>Extras</p>
                </div>
                <div>
                  <p className='pl-4 py-2'>(wd {lastBallInnings1?.wides}, lb {lastBallInnings1?.legbyes}, b {lastBallInnings1?.byes}, nb {lastBallInnings1?.noBalls})</p>
                </div>
              </div>
              <div className='flex'>
                <p className='mr-64 pr-3'>{lastBallInnings1?.total_extras}</p>
              </div>
            </div> */}

            {/* Extras phone size */}
            {/* <div className='bg-white flex items-center justify-between border-b rounded-b-lg lg:hidden'>
              <div className='flex items-center'>
                <p className='pl-4 py-2 font-semibold'>Extras</p>
                <p className='pl-4 py-2 whitespace-nowrap'>(wd {lastBallInnings1?.wides}, lb {lastBallInnings1?.legbyes}, b {lastBallInnings1?.byes}, nb {lastBallInnings1?.noBalls})</p>
              </div>
              <div className='flex items-center mr-4'>
                <p className='pr-3'>{lastBallInnings1?.total_extras}</p>
              </div>
            </div> */}

            <div className='bg-white'>
              {/* Top part (visible on lg screens and above) */}
              <div className='hidden sm:block md:block lg:hidden'>
                <div className='flex items-center justify-between border-b rounded-b-lg'>
                  <div className='flex items-center'>
                    <p className='pl-4 py-2 font-semibold'>Extras</p>
                    <p className='pl-4 py-2 whitespace-nowrap'>(wd {lastBallInnings1?.wides}, lb {lastBallInnings1?.legbyes}, b {lastBallInnings1?.byes}, nb {lastBallInnings1?.noBalls})</p>
                  </div>
                  <div className='flex items-center mr-4'>
                    <p className='pr-3'>{lastBallInnings1?.total_extras}</p>
                  </div>
                </div>
              </div>

              {/* Bottom part (visible on sm screens and above) */}
              <div className='sm:hidden md:hidden lg:block'>
                {/* Your existing code for the bottom part here */}
                <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
                  <div className='flex items-center'>
                    <div className=''>
                      <p className='pl-4 py-2 font-semibold'>Extras</p>
                    </div>
                    <div>
                      <p className='pl-4 py-2'>(wd {lastBallInnings1?.wides}, lb {lastBallInnings1?.legbyes}, b {lastBallInnings1?.byes}, nb {lastBallInnings1?.noBalls})</p>
                    </div>
                  </div>
                  <div className='flex'>
                    <p className='mr-64 pr-3'>{lastBallInnings1?.total_extras}</p>
                  </div>
                </div>
              </div>
            </div>



            {/* Yet to bat */}
            <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
              <div className='flex'>
                <div className='flex'>
                  <p className='pl-4 py-2 font-semibold text-sm'>Yet to Bat:</p>
                  <p className='pl-2 py-2 text-sm'>
                      {innings_1_Not_Batted.map((batter, index) => (
                        <span key={index}>{batter.player.first_name}, </span>
                      ))}
                      
                 </p>
                </div>
              </div>
            </div>

            {/* Fall of Wickets */}
            <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
              <div className=''>
                <div className='flex'>
                  <p className='pl-4 py-2 font-semibold text-sm'>Fall Of Wickets: {ballsInnings1wickets.map((ball, index) => (
                        <span key={index} className='pl-2 py-2 text-sm font-normal'>{ball.total_runs}-{ball.total_wickets} ({ball.who_out}, {ball.over}.{ball.ball_in_over}), </span>
                      ))}</p>
                  <p className='pl-2 py-2 text-sm'></p>
                </div>
              </div>
            </div>

            {/* Bowlers Heading */}
            <div className='bg-slate-100 flex items-center justify-between border-b font-bold'>
              <div className=''>
                <p className='pl-4 py-2'>Bowlers</p>
              </div>
              <div className='flex w-full justify-end pr-3'>
                <p className='text-center w-12 sm:w-8'>O</p>
                <p className='text-center w-12 sm:w-8'>M</p>
                <p className='text-center w-12 sm:w-8'>R</p>
                <p className='text-center w-12 sm:w-8'>W</p>
                <p className='text-center w-12 sm:w-8'>4s</p>
                <p className='text-center w-12 sm:w-8'>6s</p>
                {/* <p className='text-center w-12 sm:w-8'>WD</p>
                <p className='text-center w-12 sm:w-8'>NB</p> */}
                <p className='text-center w-12 sm:w-8'>EC</p>      
              </div>
            </div>

            {/* Bowlers */}
            {innings1Bowlers.map((bowler, index) => (
              <div className='flex items-center justify-between border-b' key={index}>
                {console.log(bowler)}
                <div className=''>
                  <p className='pl-4 py-2 w-full'>{bowler.player.first_name}</p>
                </div>
                <div className='flex justify-end pr-3'>
                  <p className='text-center w-12 sm:w-8'>{bowler.bowling_overs}</p>
                  <p className='text-center w-12 sm:w-8'>{bowler.bowling_maiden_overs}</p>
                  <p className='text-center w-12 sm:w-8'>{bowler.bowling_runs_conceded}</p>
                  <p className='text-center w-12 sm:w-8'>{bowler.bowling_wickets}</p>
                  <p className='text-center w-12 sm:w-8'>{bowler.bowling_fours}</p>
                  <p className='text-center w-12 sm:w-8'>{bowler.bowling_sixes}</p>
                  {/* <p className='text-center w-12 sm:w-8'>{bowler.bowling_wides}</p>
                  <p className='text-center w-12 sm:w-8'>{bowler.bowling_noballs}</p> */}
                  <p className='text-center w-12 sm:w-8'>{bowler.bowling_economy}</p>
                </div>
              </div>
            ))}
          </div>

        )}

      </div>
      


      <div className='mt-3 bg-white rounded-lg'>
        <div className='flex justify-between items-center pl-4 p-3'>
          <p className='font-bold'>{batsfirst === 'home' ? home_team.team_name : away_team.team_name}</p>
          <div className='flex items-center justify-center mr-5'>
            <p className='font-bold text-2xl mr-1'>{lastBallInnings2?.total_runs}/{lastBallInnings2?.total_wickets}</p>
            <p>({lastBallInnings2?.ball_in_over === 6 ? lastBallInnings2?.over + 1 : lastBallInnings2?.over}.{lastBallInnings2?.ball_in_over === 6 ? 0 : lastBallInnings2?.ball_in_over})</p>
            <div className='pl-2'>
              <button onClick={toggleContent2}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z" clipRule="evenodd" />
                </svg>
              </button> 
            </div>
          </div>
        </div>

        {showContent2 && (

          <div className='rounded-b-lg'>
            {/* heading for scorecard */}
            <div className='bg-slate-100 flex items-center justify-between border-b font-bold'>
              <div className=''>
                <div>
                  <p className='pl-4 py-2'>Batters</p>
                </div>
              </div>
              <div className='flex'>
                <p className='w-14 sm:w-8'>R</p>
                <p className='w-14 sm:w-8'>B</p>
                <p className='w-14 sm:w-8'>4s</p>
                <p className='w-14 sm:w-8'>6s</p>
                <p className='w-14 sm:w-8'>SR</p>
              </div>
            </div>


            {/* Players Scores */}
            {innings2Batters.map((batter, index) => (
              <div className='bg-white flex items-center justify-between border-b rounded-b-lg' key={index}>
                <div className='flex w-3/5'>
                  <div className='w-2/6'>
                    <p className='pl-4 py-2'>{batter.player.first_name}</p>
                  </div>
                  <div>
                    <p className='pl-4 py-2'>{batter.how_out}</p>
                  </div>
                </div>
                <div className='flex'>
                  <p className='w-14 sm:w-8'>{batter.batting_runs_scored}</p>
                  <p className='w-14 sm:w-8'>{batter.batting_balls_faced}</p>
                  <p className='w-14 sm:w-8'>{batter.batting_fours}</p>
                  <p className='w-14 sm:w-8'>{batter.batting_sixes}</p>
                  <p className='w-14 sm:w-8'>{batter.batting_strike_rate}</p>
                </div>
              </div>
            ))}


            {/* Extaras */}
            <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
              <div className='flex w-3/5'>
                <div className='w-2/6'>
                  <p className='pl-4 py-2 font-semibold'>Extras</p>
                </div>
                <div>
                  <p className='pl-4 py-2'>(wd {lastBallInnings2?.wides}, lb {lastBallInnings2?.legbyes}, b {lastBallInnings2?.byes}, nb {lastBallInnings2?.noBalls})</p>
                </div>
              </div>
              <div className='flex'>
                <p className='mr-64 pr-3'>{lastBallInnings2?.total_extras}</p>
              </div>
            </div>

            {/* Yet to bat */}
            <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
              <div className='flex'>
                <div className='flex'>
                  <p className='pl-4 py-2 font-semibold text-sm'>Yet to Bat:</p>
                  <p className='pl-2 py-2 text-sm'>
                      {innings_2_Not_Batted.map((batter, index) => (
                        <span key={index}>{batter.player.first_name}, </span>
                      ))} 
                 </p>
                </div>
              </div>
            </div>

            {/* Fall of Wickets */}
            <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
              <div className=''>
                <div className='flex'>
                  <p className='pl-4 py-2 font-semibold text-sm'>Fall Of Wickets: {ballsInnings2wickets.map((ball, index) => (
                        <span key={index} className='pl-2 py-2 text-sm font-normal'>{ball.total_runs}-{ball.total_wickets} ({ball.who_out}, {ball.over}.{ball.ball_in_over}), </span>
                      ))}</p>
                  <p className='pl-2 py-2 text-sm'></p>
                </div>
              </div>
            </div>

            {/* Bowlers Heading */}
            <div className='bg-slate-100 flex items-center justify-between border-b font-bold'>
              <div className=''>
                <p className='pl-4 py-2'>Bowlers</p>
              </div>
              <div className='flex w-full justify-end pr-3'>
                <p className='text-center w-12 sm:w-8'>O</p>
                <p className='text-center w-12 sm:w-8'>M</p>
                <p className='text-center w-12 sm:w-8'>R</p>
                <p className='text-center w-12 sm:w-8'>W</p>
                <p className='text-center w-12 sm:w-8'>0s</p>
                <p className='text-center w-12 sm:w-8'>4s</p>
                <p className='text-center w-12 sm:w-8'>6s</p>
                {/* <p className='text-center w-12 sm:w-8'>WD</p>
                <p className='text-center w-12 sm:w-8'>NB</p> */}
                <p className='text-center w-12 sm:w-8'>EC</p>      
              </div>
            </div>

            {/* Bowlers */}
            {innings2Bowlers.map((bowler, index) => (
              <div className='flex items-center justify-between border-b' key={index}>
                <div className=''>
                  <p className='pl-4 py-2 w-full'>{bowler.player.first_name}</p>
                </div>
                <div className='flex justify-end pr-3'>
                  <p className='text-center w-12 sm:w-8'>{bowler.bowling_overs}</p>
                  <p className='text-center w-12 sm:w-8'>{bowler.bowling_maiden_overs}</p>
                  <p className='text-center w-12 sm:w-8'>{bowler.bowling_runs_conceded}</p>
                  <p className='text-center w-12 sm:w-8'>{bowler.bowling_wickets}</p>
                  <p className='text-center w-12 sm:w-8'>{bowler.bowling_overs}</p>
                  <p className='text-center w-12 sm:w-8'>{bowler.bowling_fours}</p>
                  <p className='text-center w-12 sm:w-8'>{bowler.bowling_sixes}</p>
                  <p className='text-center w-12 sm:w-8'>{bowler.bowling_wides}</p>
                  <p className='text-center w-12 sm:w-8'>{bowler.bowling_noballs}</p>
                  <p className='text-center w-12 sm:w-8'>{bowler.bowling_economy}</p>
                </div>
              </div>
            ))}

          </div>

        )}
      </div>
    </div>
  )
}

export default ScoreCard
