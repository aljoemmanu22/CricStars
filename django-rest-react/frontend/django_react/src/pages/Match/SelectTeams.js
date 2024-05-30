import React, {useState, useEffect} from 'react'
import axios from 'axios';




function SelectTeams() {
  const [activeTab, setActiveTab] = useState('');

  const renderContent = () => {
    switch (activeTab) {
      case 'myteam':
        return <MyTeams setActiveTab={setActiveTab} />;
      case 'opponents':
        return <OpponentTeam setActiveTab={setActiveTab} />;
      case 'addteam':
        return <AddTeam />;
      default:
        return <MyTeams setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className='flex items-center justify-center'>
      <div className='w-2/3 mt-20'>
        <div className='bg-red-600 rounded-t-lg p-2'>
          <nav>
            <ul className='flex justify-between text-white'>
              <button onClick={() => setActiveTab('myteam')}>
                <li className='pl-28'>My Teams</li>
              </button>
              <button onClick={() => setActiveTab('opponents')}>
                <li>Opponents</li>
              </button>
              <button onClick={() => setActiveTab('addteam')}>
                <li className='pr-28'>Add</li>
              </button>
            </ul>
          </nav>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default SelectTeams;


const MyTeams = ({ setActiveTab }) => {


  return  <div className='bg-white h-80 w-auto'>
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
      <div className='pl-2.5 flex items-center justify-center' >
        <div className='w-auto h-1/2'>
          <p className='font-medium p-1'>Saranghi Perambra</p>
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
    </div>
  </div>
</div>
  
}


const AddTeam = () => {

    const [teamNameFocused, setTeamNameFocused] = useState(false);
    const [cityFocused, setCityFocused] = useState(false);
    
    return  <div className='bg-white h-96 w-auto'>
    <div className='flex justify-center items-center pt-8'>
      <img src="/images/addTeamLogo.png" className="h-20 cursor-pointer rounded-full border" alt="Logo"/>
    </div>
    <div className='flex justify-center items-center pt-2'>
      <p className='font-bold'>
        Team Logo
      </p>
    </div>
    <form className='flex flex-col items-center justify-center'>
      <div className='flex flex-col relative mt-8 w-4/5 pt-1'>
        <label 
          className={`absolute left-0 text-gray-500 transition-all duration-200 ${teamNameFocused ? 'text-xs -top-4' : 'text-base top-2'}`}>
          Team Name
        </label>
        <input 
          className='border-b border-gray-300 focus:outline-none focus:border-teal-500'
          onFocus={() => setTeamNameFocused(true)}
          onBlur={(e) => setTeamNameFocused(e.target.value !== '')}
        />
      </div>
      <div className='flex flex-col relative mt-8 w-4/5 pt-1'>
        <label 
          className={`absolute left-0 text-gray-500 transition-all duration-200 ${cityFocused ? 'text-xs -top-4' : 'text-base top-2'}`}>
          City / Town
        </label>
        <input 
          className='border-b border-gray-300 focus:outline-none focus:border-teal-500'
          onFocus={() => setCityFocused(true)}
          onBlur={(e) => setCityFocused(e.target.value !== '')}
        />
      </div>
      <div className='flex item-center justify-center my-5'>
        <button className='py-1 px-3 bg-teal-500 text-white w-80'>ADD TEAM</button>
      </div>
    </form>
  </div>
}


const OpponentTeam = ({ setActiveTab }) => {

    return  <div className='bg-white h-80 w-auto'>
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
        <div className='pl-2.5 flex items-center justify-center' >
          <div className='w-auto h-1/2'>
            <p className='font-medium p-1'>Saranghi Perambra</p>
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
      </div>
    </div>
  </div>
}