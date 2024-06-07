import React from 'react'

function CricHeros() {
  return (
    <div className='bg-black-rgba'>
      <div className='flex bg-red-700 rounded-lg'>
        <div className='w-4/6'>
          <div className='pl-4'>
            <p className='py-3 text-white text-2xl border-b font-semibold'>PLAYER OF THE MATCH</p>
          </div>
          <div className='pl-4'>
            <p className='pt-3 text-white text-lg font-semibold'>Krishnaraj P S</p>
          </div>
          <div className='pl-4'>
            <p className='py-1 text-white text-sm'>Explorer Cricket Club</p>
          </div>

          <div className='pl-4'>
            <p className='pt-3 text-white text-lg font-semibold'>Batting</p>
          </div>
          <div className='pl-4'>
            <p className='py-1 text-white text-sm'>58 R37 B7 (4S)3 (6S)156.76 (SR)</p>
          </div>

          <div className='pl-4'>
            <p className='pt-3 text-white text-lg font-semibold'>Bowling</p>
          </div>
          <div className='pl-4'>
            <p className='py-1 pb-3 text-white text-sm'>0.5 Ov.0 M6 R2 W7.20 ECO.</p>
          </div>
        </div>
        <div className='w-2/6'>
          <img className='pl-5 pr-5 pt-3 h-5/6 w-auto' src='/images/user_profile1.png'/>
        </div>
      </div>

      <div className='flex bg-teal-600 rounded-lg mt-3'>
        <div className='w-4/6'>
          <div className='pl-4'>
            <p className='py-3 text-white text-2xl border-b font-semibold'>BEST BATTER</p>
          </div>
          <div className='pl-4'>
            <p className='pt-3 text-white text-lg font-semibold'>Nandakrishna K S</p>
          </div>
          <div className='pl-4'>
            <p className='py-1 text-white text-sm'>Explorer Cricket Club</p>
          </div>

          <div className='pl-4'>
            <p className='pt-3 text-white text-lg font-semibold'>Batting</p>
          </div>
          <div className='pl-4'>
            <p className='py-1 text-white text-sm'>84 R42 B7 (4S)7 (6S)200.00 (SR)</p>
          </div>
        </div>
        <div className='w-2/6'>
          <img className='pl-5 pr-5 pt-3 h-5/6 w-auto' src='/images/user_profile1.png'/>
        </div>
      </div>

      <div className='flex bg-yellow-400 rounded-lg mt-3'>
        <div className='w-4/6'>
          <div className='pl-4'>
            <p className='py-3 text-white text-2xl border-b font-semibold'>BEST BOWLER</p>
          </div>
          <div className='pl-4'>
            <p className='pt-3 text-white text-lg font-semibold'>Akshay Nair</p>
          </div>
          <div className='pl-4'>
            <p className='py-1 text-white text-sm'>Intralife Cricket Academy</p>
          </div>

          <div className='pl-4'>
            <p className='pt-3 text-white text-lg font-semibold'>Bowling</p>
          </div>
          <div className='pl-4'>
            <p className='py-1 pb-3 text-white text-sm'>4.0 Ov.0 M32 R4 W8.00 ECO.</p>
          </div>
        </div>
        <div className='w-2/6'>
          <img className='pl-5 pr-5 pt-3 h-5/6 w-auto' src='/images/user_profile1.png'/>
        </div>
      </div>
      
      
    </div>
  )
}

export default CricHeros
