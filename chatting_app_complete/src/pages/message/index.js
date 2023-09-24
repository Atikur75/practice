import React from 'react';
import Chat from '../../components/Chat';
import Friends from '../../components/Friends';
import MessageGroup from '../../components/MessageGroup';
import Search from '../../components/Search';
import Sidebar from '../../components/Sidebar';

const Message = () => {
    return (
        <div className='flex gap-x-6'>
            <div className='w-[186px] pl-2.5'>
                <Sidebar active='message' />
            </div>
            <div className='w-[427px]'>
                <Search />
                <MessageGroup />
                <Friends />
            </div>
            <div className='w-[680px]'>
                <Chat />
            </div>
        </div>
    )
}

export default Message;