import React, { useState } from 'react'
import SelectTeams from './SelectTeams';
import SelectPlayers from './SelectPlayers'
import Toss from './Toss'

function StartMatch() {

  const [activeTab, setActiveTab] = useState('');

  const renderContent = () => {
    switch (activeTab) {
      case 'addTeam':
        return <SelectTeams />;
      case 'addPlayers':
        return <SelectPlayers />;
      case 'toss':
        return <Toss />;
    }
  }


  return (
    <div className='bg-slate-100 h-screen'>
      {activeTab === '' && 
        <div className='flex items-center h-12 bg-red-800 pl-32 sm:pl-5 sm:bg-zinc-600'>
        <div className="w-6 h-6 bg-red rounded-full flex items-center justify-center border-2 border-white  mr-2">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
          </svg>
        </div>
        <p className='text-white'>Select Playing Teams</p>
      </div>
      }
      {activeTab === 'addTeam' &&
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
      
      }
      
      {renderContent()}
      {activeTab === '' && 
        <div className='flex flex-col items-center justify-center'>
        <div className="w-14 h-14 bg-red rounded-full bg-slate-600 lg:mt-40 sm:mt-20 flex items-center justify-center">
          <p className='text-white text-3xl'>+</p>
        </div>
        <div className='pt-3'>
          <button onClick={() => setActiveTab('addTeam')}>
            <p className='text-white bg-teal-500 p-1 text-sm'>SELECT TEAM A</p>
          </button>  
        </div>
        <div className='relative mt-24 flex items-center justify-center'>
          <div className='absolute w-10 h-10 bg-teal-500 rotate-45 flex items-center justify-center'>
            <p className='text-white text-xs -rotate-45'>VS</p>
          </div>
        </div>
        <div className="w-14 h-14 bg-red rounded-full bg-slate-600 mt-24 flex items-center justify-center">
          <p className='text-white text-3xl'>+</p>
        </div>
        <div className='pt-3'>
          <p className='text-white bg-teal-500 p-1 text-sm'>SELECT TEAM B</p>
        </div>
      </div>
      }




        {/* <div className='bg-white h-80 w-auto'>
          <div className='flex items-center justify-center'>
            <div className='border p-2 m-2 w-full bg-slate-100 flex items-center '>
              <div className='border flex p-2 m-2 w-3/4'>
                <div className='px-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                <div className=''>
                  <p>Quick Search</p>
                </div>
              </div>
              <div className=''>
                <button className='bg-teal-600 flex items-center justify-center p-2 w-max' onClick={() => setActiveTab('addteam')}>
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
          <div className='m-1'>
            <div className='h-auto w-full bg-slate-100 rounded-lg flex items-center border py-2'>
              <div className='w-auto pl-4'>
                <img src="/images/AP.png" className="h-16 cursor-pointer rounded-full" alt="Logo"/>
              </div>
              <select value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)}>
                {teamsPlayedFor.map(team => (
                  <div className='pl-2.5 flex items-center justify-center' >
                    <div className='w-auto h-1/2'>
                      <option key={team.id} value={team.id} className='font-medium p-1'>{team.team_name}</option>
                      <div className='flex'>
                        <div className='flex w-auto items-center justify-center pt-1 mr-6'>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 bg-slate-500 text-slate-200 rounded-full p-0.5 mx-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
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
                ))}
              </select>
            </div>
          </div>
        </div> */}


        
      


        {/* <label>
          Away Team:
          <select value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)}>
            <option value="">Select Away Team</option>
            {teamsPlayedAgainst.map(team => (
              <option key={team.id} value={team.id}>{team.team_name}</option>
            ))}
          </select>
        </label> */}



      
    </div>
  )
}

export default StartMatch





      