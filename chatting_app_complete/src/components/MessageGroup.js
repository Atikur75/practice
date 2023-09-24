import React, { useState, useEffect } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { useSelector, useDispatch } from 'react-redux';

const MessageGroup = () => {

    const db = getDatabase();

    let data = useSelector((state) => state.userLoginInfo.userInfo);

    let [GroupList, setGroupList] = useState([]);

    useEffect(() => {
        const groupRef = ref(db, 'group/');
        onValue(groupRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                arr.push({ ...item.val(), key: item.key });
            });
            setGroupList(arr);
        });
    }, []);


    return (
        <div className='w-full bg-white shadow-lg rounded-lg py-3 px-5 mt-11 h-[347px] overflow-y-scroll'>
            <div className='relative'>
                <h3 className='font-nunito font-bold text-xl'>GroupList</h3>
            </div>
            {
                GroupList.map((item) => (
                    <div className='flex gap-x-5 items-center border-b border-solid border-button pb-3.5 mt-3.5'>
                        <div>
                            <img className='w-[70px] h-[70px] rounded-full' src='images/list1.png' />
                        </div>
                        <div>
                            <p className='font-nunito font-semibold text-sm'>Admin:{item.adminName}</p>
                            <h3 className='font-nunito font-bold text-xl'>{item.groupName}</h3>
                            <p className='font-nunito font-semibold text-sm'>{item.groupTagline}</p>
                        </div>
                        <div>
                            <button className='font-nunito font-bold text-xl bg-button text-white py-2.5 px-5 rounded'>Message</button>
                        </div>
                    </div>
                ))


            }

        </div>
    )
}

export default MessageGroup;