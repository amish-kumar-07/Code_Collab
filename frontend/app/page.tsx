'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function Page() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const handleJoin = () => {
    if (roomId.trim()) {
      router.push(`/${roomId}`); 
    }
  };

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center text-white'>
      <h1 className='p-10 text-3xl font-mono font-bold'>Join The Room</h1>
      <div className='h-20 w-[60%] flex justify-center items-center gap-2'>
        <input
          type="text"
          placeholder='Enter a room ID'
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className='mr-2 p-2 border-2 rounded-2xl text-white border-white bg-transparent placeholder-white w-60'
        />
        <button
          onClick={handleJoin}
          className='rounded-2xl bg-blue-400 text-black p-2 hover:bg-blue-500 hover:cursor-pointer'
        >
          Join Room
        </button>
      </div>
    </div>
  );
}

export default Page;
