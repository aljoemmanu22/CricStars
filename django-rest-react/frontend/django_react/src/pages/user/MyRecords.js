import React from 'react'

function MyRecords() {

  const baseURL='http://127.0.0.1:8000'
  const token = localStorage.getItem('access');
  const fetchUserData = async () => {
    try {
        const res = await axios.get(baseURL+'/api/accounts/user/details/',{headers: {
          'authorization': `Bearer ${token}`,
          'Accept' : 'application/json',
          'Content-Type': 'application/json'
      }})
        .then(res => {
            setUserDetails(res.data)
          })
    }
    catch (error) {
      console.log(error);
      
    }

  };

  const [activeTab, setActiveTab] = useState('');

  const renderContent = () => {
    switch (activeTab) {
      case 'bowling':
        return <Bowling />;
      case 'batting':
        return <Batting />;
      default:
        return <Batting />;
    }
  }

  const [userDetails, setUserDetails] = useState(null)
  useEffect(() => {
    fetchUserData();
  
  }, [authentication_user])


  return (
  <div className="h-auto sm:hidden md:hidden lg:block" style={{backgroundColor: '#eee'}}>
    <div className='bg-red-700 py-16 pl-32 h-64'>
      <div className="h-36 flex">
        <img src={useprofileimg} className="img-fluid" alt='img'/>
        <div className='flex-col'>
          <p className='text-orange-500 pl-5 text-2xl'>Hard Hitter</p>
          <p className='text-white pl-5 text-2xl'>{userDetails && userDetails.first_name}</p>
          <p className='text-orange-500 pl-5 text-2xl'>----------------------------</p>
          <p className='text-white pl-5 text-base'>{userDetails && userDetails.batting_style} | {userDetails && userDetails.bowling_style}</p>
        </div>   
        <div className='flex pl-96 text-center justify-between h-auto'>
          <div className='bg-black-rgba text-center mr-4 p-4 h-32 w-32 rounded-lg'>
            <p className='text-4xl text-white font-bold'>{userDetails && userDetails.batting_inning}</p>
            <p className='text-xl text-white'>Matches</p>
          </div>
          <div className='bg-black-rgba text-center mr-4 p-4 h-32 w-32 rounded-lg'>
            <p className='text-4xl text-white font-bold'>{userDetails && userDetails.batting_total_runs_scored}</p>
            <p className='text-xl text-white'>Runs</p>
          </div>
          <div className='bg-black-rgba text-center mr-4 p-4 h-32 w-32 rounded-lg'>
            <p className='text-4xl text-white font-bold'>{userDetails && userDetails.bowling_wickets}</p>
            <p className='text-xl text-white'>Wickets</p>
          </div>
        </div>
      </div>
    </div>
    <div className='my-2.5 flex flex-col items-center mx-auto'>
      <div className='bg-red-700 h-12 w-5/6 rounded-t-md text-white flex items-center justify-center'>
        <div className="tabs flex space-x-40 text-center">
          <button
            className={`tab ${activeTab === 'profile' ? 'font-bold' : ''}`}
            onClick={() => setActiveTab('batting')}
          >
            Batting
          </button>
          <button
            className={`tab ${activeTab === 'matches' ? 'font-bold' : ''}`}
            onClick={() => setActiveTab('bowling')}
          >
            Bowling
          </button>
        </div>
      </div>
      {renderContent()}
    </div>
  </div>
  )
}
export default MyRecords
