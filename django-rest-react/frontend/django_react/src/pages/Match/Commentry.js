import React, {useState} from 'react'

function Commentry() {



  return (
    <div>

      {/* Top Header */}
      <div className='flex py-2 pl-3'>
        <div className='py-2 flex items-center justify-between border-b w-1/2 mb-2'>
          <div className='pl-3'>
            <p>Explorer Cricket Club</p>
          </div>
          <div className='pr-3'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* commentry */}
      <div className=''>

        <div className='border-b pl-3 flex items-center justify-start'>
          <div>
            <p className='pl-3 py-3'>14.5</p>
          </div>
          <div>
            <p className='bg-red-900'>W</p>
          </div>
        </div>

        <div className='border-b pl-3'>
          <div>
            <p className='pl-3 py-3'>14.5</p>
          </div>
          <div>
            
          </div>
        </div>

        <div className='border-b pl-3'>
          <div>
            <p className='pl-3 py-3'>14.5</p>
          </div>
          <div>
            
          </div>
        </div>

      </div>



    </div>
  )
}

export default Commentry
