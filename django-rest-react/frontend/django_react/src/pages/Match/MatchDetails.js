import React, { useState } from 'react';
import SummaryContent from './SummaryContent';
import ScoreCard from './ScoreCard';
import Commentry from './Commentry';
import CricHeros from './CricHeros';
import MVP from './MVP';
import Teams from './Teams'
import LiveScore from './LiveScore'

function MatchDetails() {
  const [selectedSection, setSelectedSection] = useState('summary');

  const renderSection = () => {
    switch (selectedSection) {
      case 'live':
        return <LiveScore />;
      case 'scorecard':
        return <ScoreCard />
      case 'commentary':
        return <Commentry />
      case 'cricheros':
        return <CricHeros />
      case 'mvp':
        return <MVP />
      case 'teams':
        return <Teams />
      default:
        return <div>Summary Content</div>;
    }
  };

  return (
    <>
      <div className='flex items-center h-auto justify-center bg-black-rgba'>
        <div className='flex w-11/12 mt-10 mb-10'>
          <div className='w-3/5 m-1 h-11/12'>
            <div className='bg-white h-auto border rounded-md'>
              <div className='flex flex-row items-center'>
                <p className='mt-5 text-teal-600 pl-4'>Trichur DCA C Division League 2023-24 (League Matches)</p>
                <div className='ml-auto flex items-center mt-5 mr-5'>
                  <span className='h-5 p-2 rounded-2xl bg-black flex items-center justify-center text-white font-extrabold text-xs'>past</span>
                </div>
              </div>
              <p className='mt-1 text-teal-600 pl-4'>Baijus Cricket Ground, 18 Ov., 10-May-24 02:48 PM</p>
              <p className='mt-2 pl-4'>Toss: Baiju's Cricket Academy opt to field</p>
              <div className='flex justify-between items-center mt-3 pl-4'>
                <p className='font-bold'>EXPLORER CRICKET CLUB</p>
                <div className='flex items-center justify-center mr-5'>
                  <p className='font-bold text-2xl mr-1'>149/9</p>
                  <p>(18.0 Ov)</p>
                </div>
              </div>
              <div className='flex justify-between items-center mt-3 pl-4'>
                <p className='font-bold'>BAIJU'S CRICKET ACADEMY</p>
                <div className='flex items-center justify-center mr-5'>
                  <p className='font-bold text-2xl mr-1'>152/9</p>
                  <p>(16.5 Ov)</p>
                </div>
              </div>
              <p className='my-4 pl-4'>Baiju's Cricket Academy won by 1 wickets</p>
              <div className='h-12 w-full bg-slate-200 rounded-b-lg border-t flex justify-center items-center'>
                <nav className='flex justify-around w-full'>
                  <button className={selectedSection === 'live' ? 'text-teal-600' : ''} onClick={() => setSelectedSection('live')}>Live</button>
                  <button className={selectedSection === 'scorecard' ? 'text-teal-600' : ''} onClick={() => setSelectedSection('scorecard')}>Scorecard</button>
                  <button className={selectedSection === 'commentary' ? 'text-teal-600' : ''} onClick={() => setSelectedSection('commentary')}>Commentary</button>
                  <button className={selectedSection === 'cricheros' ? 'text-teal-600' : ''} onClick={() => setSelectedSection('cricheros')}>Cricheros</button>
                  <button className={selectedSection === 'mvp' ? 'text-teal-600' : ''} onClick={() => setSelectedSection('mvp')}>MVP</button>
                  <button className={selectedSection === 'teams' ? 'text-teal-600' : ''} onClick={() => setSelectedSection('teams')}>Teams</button>
                </nav>
              </div>
            </div>
            <div className='mt-4 h-auto bg-white rounded-md'>
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
                <p className='pl-3 font-medium text-lg'>Match Details</p>
              </div>
              <div className='pl-2 py-2'>
                <p className='pl-3 font-medium'>Series Name</p>
                <p className='pl-3 text-teal-600 font-medium'>Trichur DCA C Division League 2023-24</p>
              </div>
              <div className='pl-2 py-2'>
                <p className='pl-3 font-medium'>Match Date</p>
                <p className='pl-3 font-medium'>18/05/2024</p>
              </div>
              <div className='pl-2 py-2'>
                <p className='pl-3 font-medium'>Location</p>
                <p className='pl-3 text-teal-600 font-medium'>NTC Ground, Amballur, Thrissur</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MatchDetails;
