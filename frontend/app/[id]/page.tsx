'use client';

import React from 'react';
import { useParams } from 'next/navigation';

function Page() {
  const { id } = useParams();

  return (
    <div className='h-screen flex justify-center items-center text-white bg-black'>
      <h1 className='text-2xl'>You joined room: <span className='text-green-500'>{id}</span></h1>
    </div>
  );
}

export default Page;
