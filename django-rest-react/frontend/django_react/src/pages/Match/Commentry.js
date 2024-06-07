import React, { useState } from 'react';

const Commentry = () => {
  const [selectedTeam, setSelectedTeam] = useState('Explorer Cricket Club');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleArrowClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleTeamSelection = (team) => {
    setSelectedTeam(team);
    setDropdownVisible(false);
  };
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
            <p className='p-2 cursor-pointer hover:bg-gray-100' onClick={() => handleTeamSelection('Explorer Cricket Club')}>Explorer Cricket Club</p>
            <p className='p-2 cursor-pointer hover:bg-gray-100' onClick={() => handleTeamSelection('BCA')}>BCA</p>
          </div>
        )}
      </div>
      
      {/* commentry */}
      <div className=''>
        {selectedTeam === 'Explorer Cricket Club' && (
          <div>
            {/* Ball in Overs */}
            <div>
              <div className='border-b pl-3 flex items-center justify-start'>
                <div>
                  <p className='pl-3 py-4 w-12'>14.5</p>
                </div>
                <div className='pl-4 w-14'>
                  <p className='bg-red-900 text-white p-2 rounded-full w-10 flex items-center justify-center'>W</p>
                </div>
                <div className='pl-4'>
                  <div>
                    <p className='font-bold'>Krishnaraj ps to ANOOP, OUT Caught out, Caught by Anoop AA</p>
                  </div>
                  <div>
                    <p>ANOOP c Anoop AA b Krishnaraj ps (4r 3b 1x4s 0x6s SR: 133.33)</p>
                  </div>
                </div>
              </div>

              <div className='border-b pl-3 flex items-center justify-start'>
                <div>
                  <p className='pl-3 py-4 w-12'>14.5</p>
                </div>
                <div className='pl-4 w-14'>
                  <p className=' bg-pink-300 text-white p-2 rounded-full w-10 flex items-center justify-center'>WD</p>
                </div>
                <div className='pl-4'>
                  <div>
                    <p className='font-bold'>Krishnaraj ps to ANOOP, OUT Caught out, Caught by Anoop AA</p>
                  </div>
                  <div>
                    <p>ANOOP c Anoop AA b Krishnaraj ps (4r 3b 1x4s 0x6s SR: 133.33)</p>
                  </div>
                </div>
              </div>

              <div className='border-b pl-3 flex items-center justify-start'>
                <div>
                  <p className='pl-4 py-4 w-12'>14.4</p>
                </div>
                <div className='pl-4 w-14'>
                  <p className=' bg-amber-400 text-white p-2 rounded-full w-10 flex items-center justify-center'>4</p>
                </div>
                <div className='pl-4'>
                  <div>
                    <p className='font-bold'>Krishnaraj ps to ANOOP, OUT Caught out, Caught by Anoop AA</p>
                  </div>
                  <div>
                    <p>ANOOP c Anoop AA b Krishnaraj ps (4r 3b 1x4s 0x6s SR: 133.33)</p>
                  </div>
                </div>
              </div>

              <div>
                <div className='border-b pl-3 flex items-center justify-start'>
                  <div>
                    <p className='pl-3 py-4 w-12'>14.3</p>
                  </div>
                  <div className='pl-4 w-14'>
                    <p className=' bg-slate-200 text-white p-2 rounded-full w-10 flex items-center justify-center'>0</p>
                  </div>
                  <div className='pl-4'>
                    <div>
                      <p className='font-bold'>Krishnaraj ps to ANOOP, OUT Caught out, Caught by Anoop AA</p>
                    </div>
                    <div>
                      <p>ANOOP c Anoop AA b Krishnaraj ps (4r 3b 1x4s 0x6s SR: 133.33)</p>
                    </div>
                  </div>
                </div>
                <div className='border-b pl-3 flex items-center justify-start'>
                  <div className='pl-3 w-14 py-3'>
                    <p className=' bg-slate-200 text-white p-2 rounded-full w-10 flex items-center justify-center'>0</p>
                    <p>NEXT</p>
                  </div>
                  <div>
                    <div>
                      <p className='pl-3 w-12 font-medium'>Anoop</p>
                    </div>
                    <div>
                      <p className='pl-3 w-12 text-xs'>RHD</p>
                    </div>
                    <div className='flex text-center text-sm'>
                      <p className='pl-3'>MAT: <span className='font-semibold border-r pr-1 border-black'>4</span > RUNS:<span className='font-semibold border-r pr-1 border-black'>4</span> AVG:<span className='font-semibold border-r pr-1 border-black'>4</span> SR:<span className='font-semibold border-r pr-1 border-black'>4</span></p>
                    </div>
                  </div>
                </div>
              </div>
              

              <div className='border-b pl-3 flex items-center justify-start'>
                <div>
                  <p className='pl-3 py-4 w-12'>14.2</p>
                </div>
                <div className='pl-4 w-14'>
                  <p className='bg-red-900 text-white p-2 rounded-full w-10 flex items-center justify-center'>W</p>
                </div>
                <div className='pl-4'>
                  <div>
                    <p className='font-bold'>Krishnaraj ps to ANOOP, OUT Caught out, Caught by Anoop AA</p>
                  </div>
                  <div>
                    <p>ANOOP c Anoop AA b Krishnaraj ps (4r 3b 1x4s 0x6s SR: 133.33)</p>
                  </div>
                </div>
              </div>

              <div className='border-b pl-3 flex items-center justify-start'>
                <div>
                  <p className='pl-4 py-4 w-12'>14.1</p>
                </div>
                <div className='pl-4 w-14'>
                  <p className=' bg-slate-200 text-white p-2 rounded-full w-10 flex items-center justify-center'>0</p>
                </div>
                <div className='pl-4'>
                  <div>
                    <p className='font-bold'>Krishnaraj ps to ANOOP, OUT Caught out, Caught by Anoop AA</p>
                  </div>
                  <div>
                    <p>ANOOP c Anoop AA b Krishnaraj ps (4r 3b 1x4s 0x6s SR: 133.33)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Over Start */}
            <div>
              <div className='border-b pl-3 flex items-center justify-start'>
                <div className='pl-3 w-14 py-3'>
                  <p className=' bg-slate-200 text-white p-2 rounded-full w-10 flex items-center justify-center'>0</p>
                  <p>NEXT</p>
                </div>
                <div>
                  <div>
                    <p className='pl-3 font-medium'>Krishnaraj P S</p>
                  </div>
                  <div>
                    <p className='pl-3 text-xs'>Right-arm fast</p>
                  </div>
                  <div className='flex text-center text-sm'>
                    <p className='pl-3'>MAT: <span className='font-semibold border-r pr-1 border-black'>4</span > WICKETS:<span className='font-semibold border-r pr-1 border-black'>4</span> ECO:<span className='font-semibold border-r pr-1 border-black'>4</span> BEST:<span className='font-semibold border-r pr-1 border-black'>4</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className='border-b pl-3 items-center bg-teal-300 py-2'>
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
            </div>
          </div>
        )}




        {selectedTeam === 'BCA' && (
          <div>
            {/* Ball in Overs */}
            <div>
              <div className='border-b pl-3 flex items-center justify-start'>
                <div>
                  <p className='pl-3 py-4 w-12'>14.5</p>
                </div>
                <div className='pl-4 w-14'>
                  <p className='bg-red-900 text-white p-2 rounded-full w-10 flex items-center justify-center'>W</p>
                </div>
                <div className='pl-4'>
                  <div>
                    <p className='font-bold'>Krishnaraj ps to ANOOP, OUT Caught out, Caught by Anoop AA</p>
                  </div>
                  <div>
                    <p>ANOOP c Anoop AA b Krishnaraj ps (4r 3b 1x4s 0x6s SR: 133.33)</p>
                  </div>
                </div>
              </div>

              <div className='border-b pl-3 flex items-center justify-start'>
                <div>
                  <p className='pl-3 py-4 w-12'>14.5</p>
                </div>
                <div className='pl-4 w-14'>
                  <p className=' bg-pink-300 text-white p-2 rounded-full w-10 flex items-center justify-center'>WD</p>
                </div>
                <div className='pl-4'>
                  <div>
                    <p className='font-bold'>Krishnaraj ps to ANOOP, OUT Caught out, Caught by Anoop AA</p>
                  </div>
                  <div>
                    <p>ANOOP c Anoop AA b Krishnaraj ps (4r 3b 1x4s 0x6s SR: 133.33)</p>
                  </div>
                </div>
              </div>

              <div className='border-b pl-3 flex items-center justify-start'>
                <div>
                  <p className='pl-4 py-4 w-12'>14.4</p>
                </div>
                <div className='pl-4 w-14'>
                  <p className=' bg-amber-400 text-white p-2 rounded-full w-10 flex items-center justify-center'>4</p>
                </div>
                <div className='pl-4'>
                  <div>
                    <p className='font-bold'>Krishnaraj ps to ANOOP, OUT Caught out, Caught by Anoop AA</p>
                  </div>
                  <div>
                    <p>ANOOP c Anoop AA b Krishnaraj ps (4r 3b 1x4s 0x6s SR: 133.33)</p>
                  </div>
                </div>
              </div>

              <div>
                <div className='border-b pl-3 flex items-center justify-start'>
                  <div>
                    <p className='pl-3 py-4 w-12'>14.3</p>
                  </div>
                  <div className='pl-4 w-14'>
                    <p className=' bg-slate-200 text-white p-2 rounded-full w-10 flex items-center justify-center'>0</p>
                  </div>
                  <div className='pl-4'>
                    <div>
                      <p className='font-bold'>Krishnaraj ps to ANOOP, OUT Caught out, Caught by Anoop AA</p>
                    </div>
                    <div>
                      <p>ANOOP c Anoop AA b Krishnaraj ps (4r 3b 1x4s 0x6s SR: 133.33)</p>
                    </div>
                  </div>
                </div>
                <div className='border-b pl-3 flex items-center justify-start'>
                  <div className='pl-3 w-14 py-3'>
                    <p className=' bg-slate-200 text-white p-2 rounded-full w-10 flex items-center justify-center'>0</p>
                    <p>NEXT</p>
                  </div>
                  <div>
                    <div>
                      <p className='pl-3 w-12 font-medium'>Anoop</p>
                    </div>
                    <div>
                      <p className='pl-3 w-12 text-xs'>RHD</p>
                    </div>
                    <div className='flex text-center text-sm'>
                      <p className='pl-3'>MAT: <span className='font-semibold border-r pr-1 border-black'>4</span > RUNS:<span className='font-semibold border-r pr-1 border-black'>4</span> AVG:<span className='font-semibold border-r pr-1 border-black'>4</span> SR:<span className='font-semibold border-r pr-1 border-black'>4</span></p>
                    </div>
                  </div>
                </div>
              </div>
              

              <div className='border-b pl-3 flex items-center justify-start'>
                <div>
                  <p className='pl-3 py-4 w-12'>14.2</p>
                </div>
                <div className='pl-4 w-14'>
                  <p className='bg-red-900 text-white p-2 rounded-full w-10 flex items-center justify-center'>W</p>
                </div>
                <div className='pl-4'>
                  <div>
                    <p className='font-bold'>Krishnaraj ps to ANOOP, OUT Caught out, Caught by Anoop AA</p>
                  </div>
                  <div>
                    <p>ANOOP c Anoop AA b Krishnaraj ps (4r 3b 1x4s 0x6s SR: 133.33)</p>
                  </div>
                </div>
              </div>

              <div className='border-b pl-3 flex items-center justify-start'>
                <div>
                  <p className='pl-4 py-4 w-12'>14.1</p>
                </div>
                <div className='pl-4 w-14'>
                  <p className=' bg-slate-200 text-white p-2 rounded-full w-10 flex items-center justify-center'>0</p>
                </div>
                <div className='pl-4'>
                  <div>
                    <p className='font-bold'>Krishnaraj ps to ANOOP, OUT Caught out, Caught by Anoop AA</p>
                  </div>
                  <div>
                    <p>ANOOP c Anoop AA b Krishnaraj ps (4r 3b 1x4s 0x6s SR: 133.33)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Over Start */}
            <div>
              <div className='border-b pl-3 flex items-center justify-start'>
                <div className='pl-3 w-14 py-3'>
                  <p className=' bg-slate-200 text-white p-2 rounded-full w-10 flex items-center justify-center'>0</p>
                  <p>NEXT</p>
                </div>
                <div>
                  <div>
                    <p className='pl-3 font-medium'>Krishnaraj P S</p>
                  </div>
                  <div>
                    <p className='pl-3 text-xs'>Right-arm fast</p>
                  </div>
                  <div className='flex text-center text-sm'>
                    <p className='pl-3'>MAT: <span className='font-semibold border-r pr-1 border-black'>4</span > WICKETS:<span className='font-semibold border-r pr-1 border-black'>4</span> ECO:<span className='font-semibold border-r pr-1 border-black'>4</span> BEST:<span className='font-semibold border-r pr-1 border-black'>4</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className='border-b pl-3 items-center bg-teal-300 py-2'>
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
            </div>
          </div>
        )}



      </div>
    </div>
  )
}

export default Commentry
