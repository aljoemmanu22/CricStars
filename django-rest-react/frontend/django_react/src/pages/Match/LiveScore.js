import React from 'react'

function LiveScore(setSelectedSection) {
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
                  <p className='pl-4 py-2'>Arjun</p>
                </div>
              </div>
              <div className='flex w-full justify-end pr-3'>
                <p className='text-center w-12'>84</p>
                <p className='text-center w-12'>42</p>
                <p className='text-center w-12'>7</p>
                <p className='text-center w-12'>7</p>
                <p className='text-center w-12'>260</p>
              </div>
            </div>
            <div className='bg-white flex items-center justify-between border-b'>
              <div className='flex w-3/5'>
                <div className='w-2/6'>
                  <p className='pl-4 py-2'>Arjun</p>
                </div>
              </div>
              <div className='flex w-full justify-end pr-3'>
                <p className='text-center w-12'>84</p>
                <p className='text-center w-12'>42</p>
                <p className='text-center w-12'>7</p>
                <p className='text-center w-12'>7</p>
                <p className='text-center w-12'>260</p>
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
                <p className='pl-4 py-2 w-full'>Rahul Venu</p>
              </div>
              <div className='flex justify-end pr-3'>
                <p className='text-center w-12'>4</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>30</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>9.25</p>
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
                <div className='flex items-center justify-center mr-3'>
                  <p className='text-sm bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center'>1</p>
                </div>
                <div className='flex items-center justify-center'>
                  <p className='text-sm bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center'>1</p>
                </div>
              </div>

            </div>
          </div>

          {/* Commentry Part */}


          <div className='mt-3 rounded-lg'>
            <div className='bg-white text-xl pl-4 py-3 rounded-t-lg'>
              <p>Commentary</p>
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

          <div className='border-b pl-3 flex items-center justify-start bg-white'>
            <div>
              <p className='pl-3 py-4 w-12'>0.2</p>
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

          <div className='border-b pl-3 flex items-center justify-start bg-white'>
            <div>
              <p className='pl-4 py-4 w-12'>0.1</p>
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

          <div className='bg-white'>
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

          <div className='border-b pl-3 flex items-center justify-start bg-white'>
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
          <div className='border-b pl-3 flex items-center justify-start bg-white'>
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
          <div className='bg-white text-normal pl-4 py-3 rounded-b-lg flex items-center justify-center'>
            <button onClick={() => setSelectedSection('commentary')}>
              <p className='text-red-700 font-bold'>FULL COMMENTARY</p>
            </button>
          </div>




        </div>


  )
}

export default LiveScore
