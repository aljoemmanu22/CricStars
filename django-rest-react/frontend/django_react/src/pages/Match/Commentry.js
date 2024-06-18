import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";

const Commentry = ({ matchId }) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [commentary1, setCommentary1] = useState([])
  const [commentary2, setCommentary2] = useState([])
  const [bats_first, setBattingFirst] = useState('')
  const [bats_second, setBattingSecond] = useState('')

  const navigate = useNavigate();
  const token = localStorage.getItem('access');
  const baseURL = 'http://127.0.0.1:8000';

  useEffect(() => {
    axios.get(`${baseURL}/api/extended-commentary/${matchId}/`, {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if(response.data) {
          console.log(response.data)
          console.log(response.data.com_innings_1)
          setCommentary1(response.data.com_innings_1);
          setCommentary2(response.data.com_innings_2);
          setBattingFirst(response.data.batting_first)
          setBattingSecond(response.data.batting_second)
          setSelectedTeam(response.data.batting_first)
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the commentary!', error);
      });
      }, [matchId, token]);


  const handleArrowClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleTeamSelection = (team) => {
    setSelectedTeam(team);
    setDropdownVisible(false);
  };

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

  return (
    <div>
      {/* Top Header */}
      <div className='flex py-2 pl-3 relative'>
        <div className='py-2 flex items-center justify-between border-b w-1/2 mb-2'>
          <div className='pl-3'>
            <p>{selectedTeam}</p>
          </div>
          <div className='pr-3' onClick={handleArrowClick}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-3 cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
        {/* Dropdown Menu */}
        {dropdownVisible && (
          <div className='absolute top-14 right-1/2 bg-white border shadow-md z-10'>
            <p className='p-2 cursor-pointer hover:bg-gray-100' onClick={() => handleTeamSelection(bats_first)}>{bats_first}</p>
            <p className='p-2 cursor-pointer hover:bg-gray-100' onClick={() => handleTeamSelection(bats_second)}>{bats_second}</p>
          </div>
        )}
      </div>
      
      {/* commentry */}
      <div className=''>
        {selectedTeam === bats_first && (
          <div>
            {/* Ball in Overs */}
            <div>
              {commentary1.map((commend, index) => (
                <div key={index}>
                  {/*  For New Over */}
                  {commend.ball_in_over == '1' && 
                  
                    <div>
                      <div className='border-b pl-3 flex items-center justify-start'>
                        <div className='pl-3 w-14 py-3'>
                          <img className='w-10 rounded-full' src="/images/userlogo.png"/>
                          <p>NEXT</p>
                        </div>
                        <div>
                          <div>
                            <p className='pl-3 font-medium'>{commend.bowler.first_name}</p>
                          </div>
                          <div>
                            <p className='pl-3 text-xs'>{commend.bowler.bowling_style}</p>
                          </div>
                          <div className='flex text-center text-sm'>
                            <p className='pl-3'>MAT: <span className='font-semibold border-r pr-1 border-black'>4</span > WICKETS:<span className='font-semibold border-r pr-1 border-black'>{commend.bowler.bowling_wickets}</span> ECO:<span className='font-semibold border-r pr-1 border-black'>{commend.bowler.bowling_economy}</span> BEST:<span className='font-semibold border-r pr-1 border-black'>4</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  }

                  {(commend.ball_in_over == '1' && commend.over != 0) &&
                    <div>
                    <div className='border-b pl-3 items-center bg-teal-300 py-2'>
                      <div className='pl-4 flex justify-between py-1'>
                        <div className=''>
                          <p className='font-bold'>End of Over {commend.over}</p>
                        </div>
                        <div className='pr-4 font-bold text-2xl'>
                          <p>{commend.total_runs}/{commend.total_wickets}</p>
                        </div>
                      </div>
                      <div className=''>
                        <p className='pl-4'>{`${commend.runs_inover} Runs ${commend.wickets_inover} Wicket`}</p>
                      </div>
                    </div>
                    <div className='border-b pl-3 flex items-center border-t bg-teal-200'>
                      <div className='pl-4 w-1/2 border-r-2 '>
                        <div className='flex justify-between'>
                          <p className='font-bold py-2'>{commend.striker.first_name}</p>
                          <p className='pr-3 py-2'>{commend.striker.batting_runs_scored}({commend.striker.batting_balls_faced})</p>
                        </div>
                        <div className='flex justify-between'>
                          <p className='font-bold pb-2'>{commend.non_striker.first_name}</p>
                        <p className='pr-3 pb-2'>{commend.non_striker.batting_runs_scored}({commend.non_striker.batting_balls_faced})</p>
                        </div>
                      </div>
                      <div className='pl-4 w-1/2 border-r-2 '>
                        <div className='flex justify-between'>
                          <p className='font-bold py-2'>{commend.bowler.first_name}</p>
                          <p className='pr-3 py-2'>{commend.bowler.bowling_overs}-{commend.bowler.bowling_maiden_overs}-{commend.bowler.bowling_runs_conceded}-{commend.bowler.bowling_wickets}</p>
                        </div>
                        <div className='flex justify-between'>
                          <p className='font-bold pb-2'>&nbsp;</p>
                          <p className='pr-3 pb-2'>&nbsp;</p>
                        </div>
                      </div>
                    </div>
                    </div>
                  
                  }

                  {/* For non-wicket commentary */}
                  {(commend.runs !== 0 || commend.runs === 0) && commend.how_out === '' && commend.extras_type === '' && (
                    <div className='border-b pl-3 flex items-center justify-start'>
                      <div>
                        <p className='pl-3 py-4 w-12'>{commend.over}.{commend.ball_in_over}</p>
                      </div>
                      <div className='pl-4 w-14'>
                        <p className={`text-white p-2 rounded-full w-10 flex items-center justify-center ${getRunsBackgroundClass(commend.runs)}`}>{commend.runs}</p>
                      </div>
                      <div className='pl-4'>
                        <div>
                          <p className='font-bold'>{commend.bowler.first_name} to {commend.striker.first_name}, {commend.runs} run{commend.runs !== 1 && 's'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* For no ball, wide and other extras commentary */}
                  {commend.extras_type !== ''  && commend.how_out === '' && (
                    <div className='border-b pl-3 flex items-center justify-start'>
                      <div>
                        <p className='pl-3 py-4 w-12'>{commend.over}.{commend.ball_in_over}</p>
                      </div>
                      <div className='pl-4 w-14'>
                        <p className={`text-white p-2 rounded-full w-10 flex items-center justify-center bg-pink-400`}>{handleExtras(commend.extras_type)}</p>
                      </div>
                      <div className='pl-4'>
                        <div>
                          <p className='font-bold'>{commend.bowler.first_name} to {commend.striker.first_name}, {commend.extras_type} {commend.runs != 0 &&  commend.runs} {commend.runs != 0 && 'run'}{commend.runs > 1 && 's'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* For wicket commentary */}
                  {(commend.how_out !== '' && commend.how_out != 'run-out') && (
                    <div className='border-b pl-3 flex items-center justify-start'>
                      <div>
                        <p className='pl-3 py-4 w-12'>{commend.over}.{commend.ball_in_over}</p>
                      </div>
                      <div className='pl-4 w-14'>
                        <p className='bg-red-500 text-white p-2 rounded-full w-10 flex items-center justify-center'>W</p>
                      </div>
                      <div className='pl-4'>
                        {commend.how_out != 'run_out' && (
                          <div>
                            <p className='font-bold'>{commend.bowler.first_name} to {commend.striker.first_name}, {commend.how_out === 'catch_out' && 'OUT Caught out, Caught by'} {commend.how_out === 'stumped' && 'OUT stumped, he took advance but missed the ball, stumped by'} {commend.how_out === 'LBW' && 'OUT lbw, he miss the line'} {commend.how_out === 'bowled' && 'OUT bolwled, tight yorker'} {commend.people_involved}</p>
                          </div>
                        )}
                        {commend.how_out === 'run_out' && (
                          <div>
                            <p className='font-bold'>{commend.bowler.first_name} to {commend.striker.first_name}, {commend.who_out === commend.onstrike &&  `${commend.striker.first_name} by ${commend.people_involved}`}</p>
                          </div>
                        )}
                        <div>
                          <p>{commend.who_out === commend.onstrike ? commend.striker.first_name : commend.non_striker.first_name}
                            {commend.who_out === commend.onstrike && (<>{commend.striker.batting_runs_scored}r {commend.striker.batting_balls_faced}b {commend.striker.bating_fours}x4s {commend.striker.batting_sixes}x6s SR: {commend.striker.batting_strike_rate}</>)}
                            {commend.who_out === commend.offstrike && (<>{commend.non_striker.batting_runs_scored}r {commend.non_striker.batting_balls_faced}b {commend.non_striker.bating_fours}x4s {commend.non_striker.batting_sixes}x6s SR: {commend.non_striker.batting_strike_rate}</>)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  

                </div>
              ))}
            </div>
          </div>
        )}




        {selectedTeam === bats_second && (
          <div>
          {/* Ball in Overs */}
          <div>
            {commentary2.map((commend, index) => (
              <div key={index}>

                {/*  For New Over */}
                {(commend.ball_in_over === '1' && commend.over === '0' || commend.ball_in_over === '1') && 
                
                  <div>
                    <div className='border-b pl-3 flex items-center justify-start'>
                      <div className='pl-3 w-14 py-3'>
                        <img className='w-10 rounded-full' src="/images/userlogo.png"/>
                        <p>NEXT</p>
                      </div>
                      <div>
                        <div>
                          <p className='pl-3 font-medium'>{commend.bowler.first_name}</p>
                        </div>
                        <div>
                          <p className='pl-3 text-xs'>{commend.bowler.bowling_style}</p>
                        </div>
                        <div className='flex text-center text-sm'>
                          <p className='pl-3'>MAT: <span className='font-semibold border-r pr-1 border-black'>4</span > WICKETS:<span className='font-semibold border-r pr-1 border-black'>{commend.bowler.bowling_wickets}</span> ECO:<span className='font-semibold border-r pr-1 border-black'>{commend.bowler.bowling_economy}</span> BEST:<span className='font-semibold border-r pr-1 border-black'>4</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                }

                {(commend.ball_in_over == '1' && commend.over != 0) &&
                  <div>
                  <div className='border-b pl-3 items-center bg-teal-300 py-2'>
                    <div className='pl-4 flex justify-between py-1'>
                      <div className=''>
                        <p className='font-bold'>End of Over {commend.over}</p>
                      </div>
                      <div className='pr-4 font-bold text-2xl'>
                        <p>{commend.total_runs}/{commend.total_wickets}</p>
                      </div>
                    </div>
                    <div className=''>
                      <p className='pl-4'>{`${commend.runs_inover} Runs ${commend.wickets_inover} Wicket`}</p>
                    </div>
                  </div>
                  <div className='border-b pl-3 flex items-center border-t bg-teal-200'>
                    <div className='pl-4 w-1/2 border-r-2 '>
                      <div className='flex justify-between'>
                        <p className='font-bold py-2'>{commend.striker.first_name}</p>
                        <p className='pr-3 py-2'>{commend.striker.batting_runs_scored}({commend.striker.batting_balls_faced})</p>
                      </div>
                      <div className='flex justify-between'>
                        <p className='font-bold pb-2'>{commend.non_striker.first_name}</p>
                      <p className='pr-3 pb-2'>{commend.non_striker.batting_runs_scored}({commend.non_striker.batting_balls_faced})</p>
                      </div>
                    </div>
                    <div className='pl-4 w-1/2 border-r-2 '>
                      <div className='flex justify-between'>
                        <p className='font-bold py-2'>{commend.bowler.first_name}</p>
                        <p className='pr-3 py-2'>{commend.bowler.bowling_overs}-{commend.bowler.bowling_maiden_overs}-{commend.bowler.bowling_runs_conceded}-{commend.bowler.bowling_wickets}</p>
                      </div>
                      <div className='flex justify-between'>
                        <p className='font-bold pb-2'>&nbsp;</p>
                        <p className='pr-3 pb-2'>&nbsp;</p>
                      </div>
                    </div>
                  </div>
                  </div>
                
                }

                {/* For non-wicket commentary */}
                {(commend.runs !== 0 || commend.runs === 0) && commend.how_out === '' && commend.extras_type === '' && (
                  <div className='border-b pl-3 flex items-center justify-start'>
                    <div>
                      <p className='pl-3 py-4 w-12'>{commend.over}.{commend.ball_in_over}</p>
                    </div>
                    <div className='pl-4 w-14'>
                      <p className={`text-white p-2 rounded-full w-10 flex items-center justify-center ${getRunsBackgroundClass(commend.runs)}`}>{commend.runs}</p>
                    </div>
                    <div className='pl-4'>
                      <div>
                        <p className='font-bold'>{commend.bowler.first_name} to {commend.striker.first_name}, {commend.runs} run{commend.runs !== 1 && 's'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* For no ball, wide and other extras commentary */}
                {commend.extras_type !== ''  && commend.how_out === '' && (
                  <div className='border-b pl-3 flex items-center justify-start'>
                    <div>
                      <p className='pl-3 py-4 w-12'>{commend.over}.{commend.ball_in_over}</p>
                    </div>
                    <div className='pl-4 w-14'>
                      <p className={`text-white p-2 rounded-full w-10 flex items-center justify-center bg-pink-400`}>{handleExtras(commend.extras_type)}</p>
                    </div>
                    <div className='pl-4'>
                      <div>
                        <p className='font-bold'>{commend.bowler.first_name} to {commend.striker.first_name}, {commend.extras_type} {commend.runs != 0 &&  commend.runs} {commend.runs != 0 && 'run'}{commend.runs > 1 && 's'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* For wicket commentary */}
                {(commend.how_out !== '' && commend.how_out != 'run-out') && (
                  <div className='border-b pl-3 flex items-center justify-start'>
                    <div>
                      <p className='pl-3 py-4 w-12'>{commend.over}.{commend.ball_in_over}</p>
                    </div>
                    <div className='pl-4 w-14'>
                      <p className='bg-red-500 text-white p-2 rounded-full w-10 flex items-center justify-center'>W</p>
                    </div>
                    <div className='pl-4'>
                      {commend.how_out != 'run_out' && (
                        <div>
                          <p className='font-bold'>{commend.bowler.first_name} to {commend.striker.first_name}, {commend.how_out === 'catch_out' && 'OUT Caught out, Caught by'} {commend.how_out === 'stumped' && 'OUT stumped, he took advance but missed the ball, stumped by'} {commend.how_out === 'LBW' && 'OUT lbw, he miss the line'} {commend.how_out === 'bowled' && 'OUT bolwled, tight yorker'} {commend.people_involved}</p>
                        </div>
                      )}
                      {commend.how_out === 'run_out' && (
                        <div>
                          <p className='font-bold'>{commend.bowler.first_name} to {commend.striker.first_name}, {commend.who_out === commend.onstrike &&  `${commend.striker.first_name} by ${commend.people_involved}`}</p>
                        </div>
                      )}
                      <div>
                        <p>{commend.who_out === commend.onstrike ? commend.striker.first_name : commend.non_striker.first_name}
                          {commend.who_out === commend.onstrike && (<>{commend.striker.batting_runs_scored}r {commend.striker.batting_balls_faced}b {commend.striker.bating_fours}x4s {commend.striker.batting_sixes}x6s SR: {commend.striker.batting_strike_rate}</>)}
                          {commend.who_out === commend.offstrike && (<>{commend.non_striker.batting_runs_scored}r {commend.non_striker.batting_balls_faced}b {commend.non_striker.bating_fours}x4s {commend.non_striker.batting_sixes}x6s SR: {commend.non_striker.batting_strike_rate}</>)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                

              </div>
            ))}
          </div>
        </div>
        )}



      </div>
    </div>
  )
}

export default Commentry
