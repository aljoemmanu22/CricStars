import axios from 'axios';
import React, { useEffect, useState } from 'react';


function LiveScore({ setSelectedSection, matchId, setLiveMatchData }) {

  const [matchData, setMatchData] = useState(null);
  const [webSocket, setWebSocket] = useState(null);

  const getRunsBackgroundClass = (runs) => {
    if (runs === 4) return 'bg-orange-500';
    if (runs === 6) return 'bg-green-500';
    return 'bg-slate-200';
  };

  const handleExtras = (extras_type) => {
    if (extras_type === 'wd') return 'Wd';
    if (extras_type === 'bye')  return 'BY';
    if (extras_type === 'lb') return 'LB'
    if (extras_type === 'nb') return 'NB'
  }

  const token = localStorage.getItem('access');
  const baseURL = 'http://127.0.0.1:8000';

  useEffect(() => {
    if (!matchId) return;


    axios.get(`${baseURL}/api/scorecard-match-live-detail/${matchId}/`, {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        setMatchData(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error('There was an error fetching the match details!', error);
      });

  
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/livematch/${matchId}/`);
    setWebSocket(ws);
  
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    console.log('WebSocket object:', ws); // Check if WebSocket object is created
  
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
  
    console.log('WebSocket readyState:', ws.readyState);
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMatchData(data.match_data);
      setLiveMatchData(data.match_data)
      console.log('Received match data:', data.match_data); // Check if data is received correctly
    };
  
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) { // Close only if open
        ws.close();
      }
    };
  
  }, [matchId]);
  

  if (!matchData) {
    return <div>Loading...</div>;
  }

  const { home_team, away_team, current_striker, current_non_striker, current_bowler, last_ball, current_over } = matchData;

  return (
        <div className='bg-black-rgba rounded-lg'>

      
          <div className='rounded-lg'>
            {/* heading for scorecard */}
            <div className='bg-slate-100 flex items-center justify-between border-b font-bold rounded-t-lg'>
              <div className=''>
                <div>
                  <p className='pl-4 py-2'>Batters</p>
                </div>
              </div>
              <div className='flex w-full justify-end pr-3'>
                <p className='text-center w-12'>R</p>
                <p className='text-center w-12'>B</p>
                <p className='text-center w-12'>4s</p>
                <p className='text-center w-12'>6s</p>
                <p className='text-center w-12'>SR</p>
              </div>
            </div>


            {/* Players Scores */}
            <div className='bg-white flex items-center justify-between border-b'>
              <div className='flex w-3/5'>
                <div className='w-2/6'>
                  <p className='pl-4 py-2'>{matchData.current_striker && matchData.current_striker.first_name}</p>
                </div>
              </div>
              <div className='flex w-full justify-end pr-3'>
                <p className='text-center w-12'>{matchData.current_striker && matchData.current_striker.batting_runs_scored}</p>
                <p className='text-center w-12'>{matchData.current_striker && matchData.current_striker.batting_balls_faced}</p>
                <p className='text-center w-12'>{matchData.current_striker && matchData.current_striker.batting_fours}</p>
                <p className='text-center w-12'>{matchData.current_striker && matchData.current_striker.batting_sixes}</p>
                <p className='text-center w-12'>{matchData.current_striker && matchData.current_striker.batting_strike_rate}</p>
              </div>
            </div>
            <div className='bg-white flex items-center justify-between border-b'>
              <div className='flex w-3/5'>
                <div className='w-2/6'>
                  <p className='pl-4 py-2'>{matchData.current_non_striker && matchData.current_non_striker.first_name}</p>
                </div>
              </div>
              <div className='flex w-full justify-end pr-3'>
              <p className='text-center w-12'>{matchData.current_non_striker && matchData.current_non_striker.batting_runs_scored}</p>
                <p className='text-center w-12'>{matchData.current_non_striker && matchData.current_non_striker.batting_balls_faced}</p>
                <p className='text-center w-12'>{matchData.current_non_striker && matchData.current_non_striker.batting_fours}</p>
                <p className='text-center w-12'>{matchData.current_non_striker && matchData.current_non_striker.batting_sixes}</p>
                <p className='text-center w-12'>{matchData.current_non_striker && matchData.current_non_striker.batting_strike_rate}</p>
              </div>
            </div>  

            {/* Bowlers Heading */}
            <div className='bg-slate-100 flex items-center justify-between border-b font-bold'>
              <div className=''>
                <div>
                  <p className='pl-4 py-2'>Bowler</p>
                </div>
              </div>
              <div className='flex w-full justify-end pr-3'>
                <p className='text-center w-12'>O</p>
                <p className='text-center w-12'>M</p>
                <p className='text-center w-12'>R</p>
                <p className='text-center w-12'>W</p>
                <p className='text-center w-12'>EC</p>      
              </div>
            </div>

            {/* Bowlers */}
            <div className='flex items-center justify-between border-b bg-white'>
              <div className=''>
                <p className='pl-4 py-2 w-full'>{matchData.current_bowler && matchData.current_bowler.first_name}</p>
              </div>
              <div className='flex justify-end pr-3'>
              <p className='text-center w-12'>{matchData.current_bowler && matchData.current_bowler.bowling_overs}</p>
                <p className='text-center w-12'>{matchData.current_bowler && matchData.current_bowler.bowling_maiden_overs}</p>
                <p className='text-center w-12'>{matchData.current_bowler && matchData.current_bowler.bowling_runs_conceded}</p>
                <p className='text-center w-12'>{matchData.current_bowler && matchData.current_bowler.bowling_wickets}</p>
                <p className='text-center w-12'>{matchData.current_bowler && matchData.current_bowler.bowling_economy}</p>
              </div>
            </div>

            {/* current Partnership */}
            <div className='flex items-center justify-between border-b bg-slate-100'>
              <p className='pl-4 text-sm py-1'>Current Partnership: 6(2)</p>
            </div>
            


            {/* Extaras */}
            <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
              <div className='flex w-3/5'>
                <div className='mr-3'>
                  <p className='pl-4 py-2 font-semibold'>Recent :</p>
                </div>
                {matchData.current_over && matchData.current_over.map((ball, index) => (
                  <div key={index} className='flex items-center justify-center lg:mr-3 sm:mr-1'>
                    <p className='text-sm bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center'>
                      {ball.extras_type != ''? 
                        (ball.extras_type === 'wd' ? 'wd' :
                        ball.extras_type === 'nb' ? 'nb' :
                        ball.extras_type === 'bye' ? 'by' :
                        ball.extras_type === 'lb' ? 'lb' :
                        ball.runs) :
                        ball.runs}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Commentry Part */}


          <div className='lg:mt-3 rounded-lg'>
            <div className='bg-white text-xl pl-4 py-3 rounded-t-lg'>
              <p>Commentary</p>
            </div>
            {/* <div className='border-b pl-3 items-center bg-teal-300 py-2'>
              <div className='pl-4 flex justify-between py-1'>
                <div className=''>
                  <p className='font-bold'>End of Over 13</p>
                </div>
                <div className='pr-4 font-bold text-2xl'>
                  <p>80/8</p>
                </div>
              </div>
              <div className=''>
                <p className='pl-4'>7 Runs 1 Wicket</p>
              </div>
            </div>
            <div className='border-b pl-3 flex items-center border-t bg-teal-200'>
              <div className='pl-4 w-1/2 border-r-2 '>
                <div className='flex justify-between'>
                  <p className='font-bold py-2'>Mahesh</p>
                  <p className='pr-3 py-2'>6(5)</p>
                </div>
                <div className='flex justify-between'>
                  <p className='font-bold pb-2'>Dinil Raj</p>
                  <p className='pr-3 pb-2'>6(5)</p>
                </div>
              </div>
              <div className='pl-4 w-1/2 border-r-2 '>
                <div className='flex justify-between'>
                  <p className='font-bold py-2'>Mahesh</p>
                  <p className='pr-3 py-2'>6(5)</p>
                </div>
                <div className='flex justify-between'>
                  <p className='font-bold pb-2'>&nbsp;</p>
                  <p className='pr-3 pb-2'>&nbsp;</p>
                </div>
              </div>
            </div> */}
          </div>
          {matchData.current_over && matchData.current_over.map((ball, index) => (
        <div key={index}>

          {/* for first ball */}
          {ball.ball_in_over == '1' &&        
            <div>
              <div className='border-b pl-3 flex items-center justify-start bg-white'>
                <div className='pl-3 w-14 py-3'>
                  <img className='w-10 rounded-full' src="/images/userlogo.png"/>
                  <p>bowler</p>
                </div>
                <div>
                  <div>
                    <p className='pl-3 font-medium'>{ball.bowler.first_name}</p>
                  </div>
                  <div>
                    <p className='pl-3 text-xs'>{ball.bowler.bowling_style}</p>
                  </div>
                  <div className='flex text-center text-sm'>
                    <p className='pl-3'>MAT: <span className='font-semibold border-r pr-1 border-black'>4</span > WICKETS:<span className='font-semibold border-r pr-1 border-black'>{ball.bowler.bowling_wickets}</span> ECO:<span className='font-semibold border-r pr-1 border-black'>{ball.bowler.bowling_economy}</span> BEST:<span className='font-semibold border-r pr-1 border-black'>4</span></p>
                  </div>
                </div>
              </div>
            </div>
          }

          {/* For non-wicket commentary */}
          {(ball.runs !== 0 || ball.runs === 0) && ball.how_out === '' && ball.extras_type === '' && (
            <div className='border-b pl-3 flex items-center justify-start bg-white'>
              <div>
                <p className='pl-3 py-4 w-12'>{ball.over}.{ball.ball_in_over}</p>
              </div>
              <div className='pl-4 w-14'>
                <p className={`text-white p-2 rounded-full w-10 flex items-center justify-center ${getRunsBackgroundClass(ball.runs)}`}>{ball.runs}</p>
              </div>
              <div className='pl-4'>
                <div>
                  <p className='font-bold'>{ball.bowler.first_name} to {ball.striker.first_name}, {ball.runs} run{ball.runs !== 1 && 's'}</p>
                </div>
              </div>
            </div>
          )}

          {/* For no ball, wide and other extras commentary */}
          {ball.extras_type !== ''  && ball.how_out === '' && (
            <div className='border-b pl-3 flex items-center justify-start bg-white'>
              <div>
                <p className='pl-3 py-4 w-12'>{ball.over}.{ball.ball_in_over}</p>
              </div>
              <div className='pl-4 w-14'>
                <p className={`text-white p-2 rounded-full w-10 flex items-center justify-center bg-pink-400`}>{handleExtras(ball.extras_type)}</p>
              </div>
              <div className='pl-4'>
                <div>
                  <p className='font-bold'>{ball.bowler.first_name} to {ball.striker.first_name}, {ball.extras_type} {ball.runs != 0 &&  ball.runs} {ball.runs != 0 && 'run'}{ball.runs > 1 && 's'}</p>
                </div>
              </div>
            </div>
          )}

          {/* For wicket commentary */}
          {(ball.how_out !== '' && ball.how_out != 'run-out') && (
            <div className='border-b pl-3 flex items-center justify-start'>
              <div>
                <p className='pl-3 py-4 w-12'>{ball.over}.{ball.ball_in_over}</p>
              </div>
              <div className='pl-4 w-14'>
                <p className='bg-red-500 text-white p-2 rounded-full w-10 flex items-center justify-center'>W</p>
              </div>
              <div className='pl-4'>
                {ball.how_out != 'run_out' && (
                  <div>
                    <p className='font-bold'>{ball.bowler.first_name} to {ball.striker.first_name}, {ball.how_out === 'catch_out' && 'OUT Caught out, Caught by'} {ball.how_out === 'stumped' && 'OUT stumped, he took advance but missed the ball, stumped by'} {ball.how_out === 'LBW' && 'OUT lbw, he miss the line'} {ball.how_out === 'bowled' && 'OUT bolwled, tight yorker'} {ball.people_involved}</p>
                  </div>
                )}
                {ball.how_out === 'run_out' && (
                  <div>
                    <p className='font-bold'>{ball.bowler.first_name} to {ball.striker.first_name}, {ball.who_out === ball.onstrike &&  `${ball.striker.first_name} by ${ball.people_involved}`} {ball.who_out === ball.offstrike &&  `${ball.non_striker.first_name} by ${ball.people_involved}`}</p>
                  </div>
                )}
                <div>
                  <p>{ball.who_out === matchData.current_striker ? matchData.current_striker.first_name : matchData.current_non_striker.first_name}
                    {ball.who_out === matchData.current_striker && (<>{matchData.current_striker.batting_runs_scored}r {matchData.current_striker.batting_balls_faced}b {matchData.current_striker.bating_fours}x4s {matchData.current_striker.batting_sixes}x6s SR: {matchData.current_striker.batting_strike_rate}</>)}
                    {ball.who_out === matchData.current_non_striker && (<>{matchData.current_non_striker.batting_runs_scored}r {matchData.current_non_striker.batting_balls_faced}b {matchData.current_non_striker.bating_fours}x4s {matchData.current_non_striker.batting_sixes}x6s SR: {matchData.current_non_striker.batting_strike_rate}</>)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
          ))}
          <div className='bg-white text-normal pl-4 py-3 rounded-b-lg flex items-center justify-center'>
            <button onClick={() => setSelectedSection('commentary')}>
              <p className='text-red-700 font-bold'>FULL COMMENTARY</p>
            </button>
          </div>




        </div>


  )
}

export default LiveScore
