import React, { useState } from 'react'

function ScoreCard() {

  const [showContent1, setShowContent1] = useState(false);
  const [showContent2, setShowContent2] = useState(false);

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
          <p className='font-bold'>EXPLORER CRICKET CLUB</p>
          <div className='flex items-center justify-center mr-5'>
            <p className='font-bold text-2xl mr-1'>149/9</p>
            <p>(18.0 Ov)</p>
            <div className='pl-2'>
              <button onClick={toggleContent1}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                  <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z" clip-rule="evenodd" />
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
                <p className=''>R</p>
                <p className='pl-12'>B</p>
                <p className='pl-12'>4s</p>
                <p className='pl-12'>6s</p>
                <p className='pl-12 pr-3'>SR</p>
              </div>
            </div>


            {/* Players Scores */}
            <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
              <div className='flex w-3/5'>
                <div className='w-2/6'>
                  <p className='pl-4 py-2'>Arjun</p>
                </div>
                <div>
                  <p className='pl-4 py-2'>c Dhinil Raj b Akshay Nair</p>
                </div>
              </div>
              <div className='flex'>
                <p className=''>84</p>
                <p className='pl-12'>42</p>
                <p className='pl-12'>7</p>
                <p className='pl-12'>7</p>
                <p className='pl-12 pr-3'>260</p>
              </div>
            </div>
            <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
              <div className='flex w-3/5'>
                <div className='w-2/6'>
                  <p className='pl-4 py-2'>Arjun</p>
                </div>
                <div>
                  <p className='pl-4 py-2'>c Dhinil Raj b Akshay Nair</p>
                </div>
              </div>
              <div className='flex'>
                <p className=''>84</p>
                <p className='pl-12'>42</p>
                <p className='pl-12'>7</p>
                <p className='pl-12'>7</p>
                <p className='pl-12 pr-3'>260</p>
              </div>
            </div>  
            <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
              <div className='flex w-3/5'>
                <div className='w-2/6'>
                  <p className='pl-4 py-2'>Arjun</p>
                </div>
                <div>
                  <p className='pl-4 py-2'>c Dhinil Raj b Akshay Nair</p>
                </div>
              </div>
              <div className='flex'>
                <p className=''>84</p>
                <p className='pl-12'>42</p>
                <p className='pl-12'>7</p>
                <p className='pl-12'>7</p>
                <p className='pl-12 pr-3'>260</p>
              </div>
            </div>


            {/* Extaras */}
            <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
              <div className='flex w-3/5'>
                <div className='w-2/6'>
                  <p className='pl-4 py-2 font-semibold'>Extras</p>
                </div>
                <div>
                  <p className='pl-4 py-2'>(wd 6, lb 2, b 1, nb 1)</p>
                </div>
              </div>
              <div className='flex'>
                <p className='mr-64 pr-3'>10</p>
              </div>
            </div>

            {/* Yet to bat */}
            <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
              <div className='flex'>
                <div className='flex'>
                  <p className='pl-4 py-2 font-semibold text-sm'>Yet to Bat:</p>
                  <p className='pl-2 py-2 text-sm'>Haneesh T K, Abin Babu</p>
                </div>
              </div>
            </div>

            {/* Fall of Wickets */}
            <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
              <div className=''>
                <div className='flex'>
                  <p className='pl-4 py-2 font-semibold text-sm'>Fall Of Wickets: <span className='pl-2 py-2 text-sm font-normal'>6-1 (Sujith V R, 1.1 ov), 8-2 (Anil Kumar Pk, 1.2 ov), 125-3 (Krishnaraj ps, 12.4 ov), 174-4 (Nandakrishna K S, 16.1 ov), 177-5 (Akhil Sankar, 16.4 ov), 178-6 (Vibin Koodammattil, 16.5 ov), 204-7 (Anoop AA, 19.1 ov), 209-8 (Dhanesh Devaky, 20 ov)</span></p>
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
                <p className='text-center w-12'>O</p>
                <p className='text-center w-12'>M</p>
                <p className='text-center w-12'>R</p>
                <p className='text-center w-12'>W</p>
                <p className='text-center w-12'>0s</p>
                <p className='text-center w-12'>4s</p>
                <p className='text-center w-12'>6s</p>
                <p className='text-center w-12'>WD</p>
                <p className='text-center w-12'>NB</p>
                <p className='text-center w-12'>EC</p>      
              </div>
            </div>

            {/* Bowlers */}
            <div className='flex items-center justify-between border-b'>
              <div className=''>
                <p className='pl-4 py-2 w-full'>Rahul Venu</p>
              </div>
              <div className='flex justify-end pr-3'>
                <p className='text-center w-12'>4</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>30</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>2</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>2</p>
                <p className='text-center w-12'>0</p>
                <p className='text-center w-12'>9.25</p>
              </div>
            </div>
            <div className='flex items-center justify-between border-b'>
              <div className=''>
                <p className='pl-4 py-2 w-full'>Rahul Venu</p>
              </div>
              <div className='flex justify-end pr-3'>
                <p className='text-center w-12'>4</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>30</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>2</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>2</p>
                <p className='text-center w-12'>0</p>
                <p className='text-center w-12'>9.25</p>
              </div>
            </div>
            <div className='flex items-center justify-between border-b'>
              <div className=''>
                <p className='pl-4 py-2 w-full'>Rahul Venu</p>
              </div>
              <div className='flex justify-end pr-3'>
                <p className='text-center w-12'>4</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>30</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>2</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>2</p>
                <p className='text-center w-12'>0</p>
                <p className='text-center w-12'>9.25</p>
              </div>
            </div>
          </div>

        )}

      </div>
      


      <div className='mt-3 bg-white rounded-lg'>
        <div className='flex justify-between items-center pl-4 p-3'>
          <p className='font-bold'>EXPLORER CRICKET CLUB</p>
          <div className='flex items-center justify-center mr-5'>
            <p className='font-bold text-2xl mr-1'>149/9</p>
            <p>(18.0 Ov)</p>
            <div className='pl-2'>
              <button onClick={toggleContent2}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                  <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z" clip-rule="evenodd" />
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
                <p className=''>R</p>
                <p className='pl-12'>B</p>
                <p className='pl-12'>4s</p>
                <p className='pl-12'>6s</p>
                <p className='pl-12 pr-3'>SR</p>
              </div>
            </div>


            {/* Players Scores */}
            <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
              <div className='flex w-3/5'>
                <div className='w-2/6'>
                  <p className='pl-4 py-2'>Arjun</p>
                </div>
                <div>
                  <p className='pl-4 py-2'>c Dhinil Raj b Akshay Nair</p>
                </div>
              </div>
              <div className='flex'>
                <p className=''>84</p>
                <p className='pl-12'>42</p>
                <p className='pl-12'>7</p>
                <p className='pl-12'>7</p>
                <p className='pl-12 pr-3'>260</p>
              </div>
            </div>
            <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
              <div className='flex w-3/5'>
                <div className='w-2/6'>
                  <p className='pl-4 py-2'>Arjun</p>
                </div>
                <div>
                  <p className='pl-4 py-2'>c Dhinil Raj b Akshay Nair</p>
                </div>
              </div>
              <div className='flex'>
                <p className=''>84</p>
                <p className='pl-12'>42</p>
                <p className='pl-12'>7</p>
                <p className='pl-12'>7</p>
                <p className='pl-12 pr-3'>260</p>
              </div>
            </div>  
            <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
              <div className='flex w-3/5'>
                <div className='w-2/6'>
                  <p className='pl-4 py-2'>Arjun</p>
                </div>
                <div>
                  <p className='pl-4 py-2'>c Dhinil Raj b Akshay Nair</p>
                </div>
              </div>
              <div className='flex'>
                <p className=''>84</p>
                <p className='pl-12'>42</p>
                <p className='pl-12'>7</p>
                <p className='pl-12'>7</p>
                <p className='pl-12 pr-3'>260</p>
              </div>
            </div>


            {/* Extaras */}
            <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
              <div className='flex w-3/5'>
                <div className='w-2/6'>
                  <p className='pl-4 py-2 font-semibold'>Extras</p>
                </div>
                <div>
                  <p className='pl-4 py-2'>(wd 6, lb 2, b 1, nb 1)</p>
                </div>
              </div>
              <div className='flex'>
                <p className='mr-64 pr-3'>10</p>
              </div>
            </div>

            {/* Yet to bat */}
            <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
              <div className='flex'>
                <div className='flex'>
                  <p className='pl-4 py-2 font-semibold text-sm'>Yet to Bat:</p>
                  <p className='pl-2 py-2 text-sm'>Haneesh T K, Abin Babu</p>
                </div>
              </div>
            </div>

            {/* Fall of Wickets */}
            <div className='bg-white flex items-center justify-between border-b rounded-b-lg'>
              <div className=''>
                <div className='flex'>
                  <p className='pl-4 py-2 font-semibold text-sm'>Fall Of Wickets: <span className='pl-2 py-2 text-sm font-normal'>6-1 (Sujith V R, 1.1 ov), 8-2 (Anil Kumar Pk, 1.2 ov), 125-3 (Krishnaraj ps, 12.4 ov), 174-4 (Nandakrishna K S, 16.1 ov), 177-5 (Akhil Sankar, 16.4 ov), 178-6 (Vibin Koodammattil, 16.5 ov), 204-7 (Anoop AA, 19.1 ov), 209-8 (Dhanesh Devaky, 20 ov)</span></p>
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
                <p className='text-center w-12'>O</p>
                <p className='text-center w-12'>M</p>
                <p className='text-center w-12'>R</p>
                <p className='text-center w-12'>W</p>
                <p className='text-center w-12'>0s</p>
                <p className='text-center w-12'>4s</p>
                <p className='text-center w-12'>6s</p>
                <p className='text-center w-12'>WD</p>
                <p className='text-center w-12'>NB</p>
                <p className='text-center w-12'>EC</p>      
              </div>
            </div>

            {/* Bowlers */}
            <div className='flex items-center justify-between border-b'>
              <div className=''>
                <p className='pl-4 py-2 w-full'>Rahul Venu</p>
              </div>
              <div className='flex justify-end pr-3'>
                <p className='text-center w-12'>4</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>30</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>2</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>2</p>
                <p className='text-center w-12'>0</p>
                <p className='text-center w-12'>9.25</p>
              </div>
            </div>
            <div className='flex items-center justify-between border-b'>
              <div className=''>
                <p className='pl-4 py-2 w-full'>Rahul Venu</p>
              </div>
              <div className='flex justify-end pr-3'>
                <p className='text-center w-12'>4</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>30</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>2</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>2</p>
                <p className='text-center w-12'>0</p>
                <p className='text-center w-12'>9.25</p>
              </div>
            </div>
            <div className='flex items-center justify-between border-b'>
              <div className=''>
                <p className='pl-4 py-2 w-full'>Rahul Venu</p>
              </div>
              <div className='flex justify-end pr-3'>
                <p className='text-center w-12'>4</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>30</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>2</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>1</p>
                <p className='text-center w-12'>2</p>
                <p className='text-center w-12'>0</p>
                <p className='text-center w-12'>9.25</p>
              </div>
            </div>
          </div>

        )}
      </div>
    </div>
  )
}

export default ScoreCard
