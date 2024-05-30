import React from 'react'

function UserFooter() {
  return (
    <nav className='px-3 bg-slate-800 sm:hidden md:hidden'>
      <div className="items-center justify-between">
        <ul className=" text-center">
          <li className="px-1 py-2"><a href="#" className="px-2 text-sm text-slate-400 font-bold">ABOUT</a><a href="#" className="px-2  font-bold text-sm text-slate-400">TERMS OF SERVICE</a></li>
          <hr className='border-slate-600 border w-1/2 mx-auto'></hr>
          <li className="px-1 py-2"><a href="#" className="px-2 font-semibold  text-xs text-slate-400">© CricStars Pvt Ltd. All rights reserved. CIN U72901GJ2016PTC92938</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default UserFooter