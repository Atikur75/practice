import React from 'react';
import { BsSearch } from 'react-icons/bs';
import { HiDotsVertical } from 'react-icons/hi';

const Search = () => {
    return (
        <>
            <div className='relative'>
                <input className='w-full rounded-lg p-5 shadow-lg pl-[78px]' type='text' placeholder='Search' />
                <BsSearch className='absolute top-[26px] left-[30px]' />
                <HiDotsVertical className='absolute top-[26px] right-[30px] text-button' />
            </div>
        </>
    )
}

export default Search;