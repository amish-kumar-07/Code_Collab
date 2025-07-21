import React from 'react'


function page() {
  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center'>
        <h1 className='p-10 text-3xl font-mono font-bold'>Join The Room</h1>
      <div className='h-20 [width:60%] flex justify-center items-center gap-2'>

        <div>
          <input type="text" placeholder='  Enter a number' className='mr-2 p-2 border-2 rounded-2xl text-white border-white'/>
          <button className='rounded-2xl bg-blue-400 text-black p-2 hover:bg-blue-500 hover:cursor-pointer'>Join Room</button>
        </div>
      </div>
    </div>
  )
}

export default page
