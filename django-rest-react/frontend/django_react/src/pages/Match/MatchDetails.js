import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SummaryContent from './SummaryContent';
import ScoreCard from './ScoreCard';
import Commentry from './Commentry';
import CricHeros from './CricHeros';
import MVP from './MVP';
import Teams from './Teams'
import LiveScore from './LiveScore'
import LiveStream from './LiveStream';

function MatchDetails() {
  const [selectedSection, setSelectedSection] = useState('');
  const { matchId } = useParams();
  const token = localStorage.getItem('access');
  const baseURL = 'http://127.0.0.1:8000';
  const [matchData, setMatchData] = useState(null);
  const [batsfirst, setBatsFirst] = useState('')
  const [liveMatchData, setLiveMatchData] = useState(null); // New state for live match data
  const [isStreaming, setIsStreaming] = useState(false);
  const [channelName, setChannelName] = useState('');


  useEffect(() => {
    axios.get(`${baseURL}/api/scorecard-match-detail/${matchId}/`, {
      headers: {
        authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        setMatchData(response.data);
        setIsStreaming(response.data.match_details.is_streaming);
        setChannelName(`match_${matchId}`);
        if (response.data.match_details.toss_winner) {
          const { toss_winner, elected_to } = response.data.match_details;
          if (toss_winner === 'home') {
            setBatsFirst(elected_to === 'bat' ? 'home' : 'away');
          } else if (toss_winner === 'away') {
            setBatsFirst(elected_to === 'bat' ? 'away' : 'home');
          }
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the match details!', error);
      });
      }, [matchId, token, liveMatchData]);

  if (!matchData) {
    return <div>Loading...</div>;
  }


  const { match_details, home_team, away_team, last_ball_innings1, last_ball_innings2 } = matchData;

  const renderSection = () => {
    switch (selectedSection) {
      case 'live':
        return <LiveScore matchId={matchId} setSelectedSection={setSelectedSection} liveMatchData={liveMatchData} setLiveMatchData={setLiveMatchData} />;
      case 'summary':
        return <SummaryContent matchId={matchId}/>
      case 'scorecard':
        return <ScoreCard matchId={matchId}/>
      case 'commentary':
        return <Commentry matchId={matchId}/>
      case 'cricheros':
        return <CricHeros matchId={matchId}/>
      case 'mvp':
        return <MVP matchId={matchId}/>
      case 'teams':
        return <Teams matchId={matchId}/>
        default:
          if (match_details.status === 'live') {
            return <LiveScore matchId={matchId} setSelectedSection={setSelectedSection} liveMatchData={liveMatchData} setLiveMatchData={setLiveMatchData} />;
          } else if (match_details.status === 'past') {
            return <SummaryContent matchId={matchId} />;
          } 
    }
  };



  return (
    <>
      <div className='flex items-center h-auto justify-center bg-black-rgba sm:hidden md:flex'>
        <div className='flex w-11/12 mt-10 mb-10'>
          <div className='w-3/5 m-1 h-11/12'>
            <div className='bg-white h-auto border rounded-md'>
              <div className='flex flex-row items-center'>
                <p className='mt-5 text-teal-600 pl-4 text-xl font-bold'>{home_team.team_name} vs {away_team.team_name}</p>
                <div className='ml-auto flex items-center mt-5 mr-5'>
                <span className='h-5 p-2 rounded-2xl bg-black flex items-center justify-center text-white font-extrabold text-xs'>{match_details.status}</span>
                </div>
              </div>

              <p className='mt-1 text-teal-600 pl-4'>Ground : {match_details.ground_location == 'home' ? home_team.home_ground : away_team.home_ground}, {match_details.overs} overs match , {match_details.date}</p>
              <p className='mt-2 pl-4'>Toss: {match_details.batting_first === 'home' && 
                match_details.elected_to === 'bat'
                  ? `${home_team.team_name} opt to bat`
                  : `${home_team.team_name} opt to field`}

                {match_details.batting_first === 'away' && match_details.elected_to === 'bat'
                  ? `${away_team.team_name} opt to bat`
                  : `${away_team.team_name} opt to field`}
              </p>

              <div className='flex justify-between items-center mt-3 pl-4'>
                <p className='font-bold'>{batsfirst === 'home' ? home_team.team_name : away_team.team_name}</p>
                <div className='flex items-center justify-center mr-5'>
                  <p className='font-bold text-2xl mr-1'>{matchData.last_ball_innings1 ? `${matchData.last_ball_innings1.total_runs}/${matchData.last_ball_innings1.total_wickets}` : '0/0'}</p>
                  <p>({matchData.last_ball_innings1 ? matchData.last_ball_innings1.balls === 6 ? matchData.last_ball_innings1.overs + 1 : matchData.last_ball_innings1.overs : match_details.overs}.{matchData.last_ball_innings1 ? matchData.last_ball_innings1.balls === 6 ? 0 : matchData.last_ball_innings1.balls : '0'})</p>
                </div>
              </div>

              <div className='flex justify-between items-center mt-3 pl-4'>
                <p className='font-bold'>{batsfirst === 'home' ? away_team.team_name : home_team.team_name}</p>
                <div className='flex items-center justify-center mr-5'>
                <p className='font-bold text-2xl mr-1'>{matchData.last_ball_innings2 ? `${matchData.last_ball_innings2.total_runs}/${matchData.last_ball_innings2.total_wickets}` : '0/0'}</p>
                  <p>({matchData.last_ball_innings2 ? matchData.last_ball_innings2.balls === 6 ? matchData.last_ball_innings2.overs + 1 : matchData.last_ball_innings2.overs : match_details.overs}.{matchData.last_ball_innings2 ? matchData.last_ball_innings2.balls === 6 ? 0 : matchData.last_ball_innings2.balls : '0'})</p>
                </div>
              </div>

              <p className='my-4 pl-4'>{match_details.result}</p>
              <div className='h-12 w-full bg-slate-200 rounded-b-lg border-t flex justify-center items-center'>
                <nav className='flex justify-around w-full'>
                  {match_details.status === 'past' && (
                    <button
                      className={selectedSection === 'summary' ? 'text-teal-600' : ''}
                      onClick={() => setSelectedSection('summary')}
                    >
                      Summary
                    </button>
                  )}
                  {match_details.status === 'live' && (
                    <button
                      className={selectedSection === 'live' ? 'text-teal-600' : ''}
                      onClick={() => setSelectedSection('live')}
                    >
                      Live
                    </button>
                  )}
                  <button className={selectedSection === 'scorecard' ? 'text-teal-600' : ''} onClick={() => setSelectedSection('scorecard')}>Scorecard</button>
                  <button className={selectedSection === 'commentary' ? 'text-teal-600' : ''} onClick={() => setSelectedSection('commentary')}>Commentary</button>
                  <button className={selectedSection === 'cricheros' ? 'text-teal-600' : ''} onClick={() => setSelectedSection('cricheros')}>Cricheros</button>
                  <button className={selectedSection === 'mvp' ? 'text-teal-600' : ''} onClick={() => setSelectedSection('mvp')}>MVP</button>
                  <button className={selectedSection === 'teams' ? 'text-teal-600' : ''} onClick={() => setSelectedSection('teams')}>Teams</button>
                </nav>
              </div>
            </div>
            <div className='h-auto bg-white rounded-md lg:mt-3'>
              {renderSection()}
            </div>
          </div>

          <div className='w-2/5 m-1 h-11/12 rounded-md'>
            <div className='bg-white rounded-md p-2'>
              <p className='pl-3'>Player of the Match</p>
              <p className='pl-3'>Salvin(Team Byjus)</p>
            </div>
            <div className='bg-white rounded-md mt-4'>
              <div className='border-b p-2'>
                <p className='pl-3 font-medium text-lg'>Match Name</p>
              </div>
              <div className='pl-2 py-2'>
                <p className='pl-3 font-medium'>{home_team.team_name} vs {away_team.team_name}</p>
                <p className='pl-3 text-teal-600 font-medium'>Friendly Match</p>
              </div>
              <div className='pl-2 py-2'>
                <p className='pl-3 font-medium'>Match Date</p>
                <p className='pl-3 font-medium'>{match_details.date}</p>
              </div>
              <div className='pl-2 py-2'>
                <p className='pl-3 font-medium'>Location</p>
                <p className='pl-3 text-teal-600 font-medium'>{match_details.ground_location == 'home' ? home_team.home_ground : away_team.home_ground}</p>
              </div>
            </div>
            <div className='w-2/5 m-1 h-11/12 rounded-md'>
                {isStreaming ? (
                    <LiveStream channelName={channelName} isStreaming={true} onStreamingEnd={() => setIsStreaming(false)} />
                  ) : (
                    <p>Streaming not available</p>
                )}
            </div>
          </div>
        </div>
      </div>




{/* ////////////////////////////////////////////////////////////////////  responsive  ////////////////////////////////////////////////////////////// */}


<div className="flex items-center h-auto justify-center  bg-opacity-50 lg:hidden">
      <div className="flex w-full mt-1 mb-10 flex-col items-center">
        <div className="w-11/12 m-1 h-11/12">
          <div className="bg-white h-auto border rounded-md">
            <div className="flex flex-row items-center">
              <p className="mt-1 text-teal-600 pl-2 text-xl font-bold">{home_team.team_name} vs {away_team.team_name}</p>
              <div className="ml-auto flex items-center mt-2 mr-5">
                <span className="h-5 p-2 rounded-2xl bg-black flex items-center justify-center text-white font-extrabold text-xs">{match_details.status}</span>
              </div>
            </div>
            <p className="mt-1 text-teal-600 pl-2">Ground: {match_details.ground_location === 'home' ? home_team.home_ground : away_team.home_ground}, {match_details.overs} overs match, {match_details.date}</p>
            <p className="mt-2 pl-2">
              Toss: {match_details.batting_first === 'home' && match_details.elected_to === 'bat' ? `${home_team.team_name} opt to bat` : `${home_team.team_name} opt to field`}
              {match_details.batting_first === 'away' && match_details.elected_to === 'bat' ? `${away_team.team_name} opt to bat` : `${away_team.team_name} opt to field`}
            </p>
            <div className="flex justify-between items-center mt-2 pl-2">
              <p className="font-bold">{match_details.batting_first === 'home' ? home_team.team_name : away_team.team_name}</p>
              <div className="flex items-center justify-center mr-5">
                <p className="font-bold text-2xl mr-1">{matchData.last_ball_innings1 ? `${matchData.last_ball_innings1.total_runs}/${matchData.last_ball_innings1.total_wickets}` : '0/0'}</p>
                <p>({matchData.last_ball_innings1 ? matchData.last_ball_innings1.balls === 6 ? matchData.last_ball_innings1.overs + 1 : matchData.last_ball_innings1.overs : match_details.overs}.{matchData.last_ball_innings1 ? matchData.last_ball_innings1.balls === 6 ? 0 : matchData.last_ball_innings1.balls : '0'})</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2 pl-2">
              <p className="font-bold">{match_details.batting_first === 'home' ? away_team.team_name : home_team.team_name}</p>
              <div className="flex items-center justify-center mr-5">
                <p className="font-bold text-2xl mr-1">{matchData.last_ball_innings2 ? `${matchData.last_ball_innings2.total_runs}/${matchData.last_ball_innings2.total_wickets}` : '0/0'}</p>
                <p>({matchData.last_ball_innings2 ? matchData.last_ball_innings2.balls === 6 ? matchData.last_ball_innings2.overs + 1 : matchData.last_ball_innings2.overs : match_details.overs}.{matchData.last_ball_innings2 ? matchData.last_ball_innings2.balls === 6 ? 0 : matchData.last_ball_innings2.balls : '0'})</p>
              </div>
            </div>
            <p className="my-4 pl-2">{match_details.result}</p>
            <div className="h-12 w-full bg-slate-200 rounded-b-lg border-t flex justify-center items-center">
            <nav className="flex justify-around w-full overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
              {match_details.status === 'past' && (
                <button
                  className={`border border-gray-300 rounded-md px-4 py-2 ${selectedSection === 'summary' ? 'text-teal-600' : 'text-gray-700'} hover:bg-gray-100 focus:outline-none focus:bg-gray-100`}
                  onClick={() => setSelectedSection('summary')}
                >
                  Summary
                </button>
              )}
              {match_details.status === 'live' && (
                <button
                  className={`border border-gray-300 rounded-md px-4 py-2 ${selectedSection === 'live' ? 'text-teal-600' : 'text-gray-700'} hover:bg-gray-100 focus:outline-none focus:bg-gray-100`}
                  onClick={() => setSelectedSection('live')}
                >
                  Live
                </button>
              )}
              <button
                className={`border border-gray-300 rounded-md px-4 py-2 ${selectedSection === 'scorecard' ? 'text-teal-600' : 'text-gray-700'} hover:bg-gray-100 focus:outline-none focus:bg-gray-100`}
                onClick={() => setSelectedSection('scorecard')}
              >
                Scorecard
              </button>
              <button
                className={`border border-gray-300 rounded-md px-4 py-2 ${selectedSection === 'commentary' ? 'text-teal-600' : 'text-gray-700'} hover:bg-gray-100 focus:outline-none focus:bg-gray-100`}
                onClick={() => setSelectedSection('commentary')}
              >
                Commentary
              </button>
              <button
                className={`border border-gray-300 rounded-md px-4 py-2 ${selectedSection === 'cricheros' ? 'text-teal-600' : 'text-gray-700'} hover:bg-gray-100 focus:outline-none focus:bg-gray-100`}
                onClick={() => setSelectedSection('cricheros')}
              >
                Cricheros
              </button>
              <button
                className={`border border-gray-300 rounded-md px-4 py-2 ${selectedSection === 'mvp' ? 'text-teal-600' : 'text-gray-700'} hover:bg-gray-100 focus:outline-none focus:bg-gray-100`}
                onClick={() => setSelectedSection('mvp')}
              >
                MVP
              </button>
              <button
                className={`border border-gray-300 rounded-md px-4 py-2 ${selectedSection === 'teams' ? 'text-teal-600' : 'text-gray-700'} hover:bg-gray-100 focus:outline-none focus:bg-gray-100`}
                onClick={() => setSelectedSection('teams')}
              >
                Teams
              </button>
            </nav>


            </div>
          </div>
          <div className="mt-4 h-auto bg-white rounded-md">
            {renderSection()}
          </div>
        </div>
        <div className="w-11/12 m-1 h-11/12 rounded-md justify-center items-center">
          <div className="w-full m-1 h-11/12 rounded-md">
            {isStreaming ? (
              <LiveStream channelName={channelName} isStreaming={true} onStreamingEnd={() => setIsStreaming(false)} />
            ) : (
              <p>Streaming not available</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default MatchDetails;


