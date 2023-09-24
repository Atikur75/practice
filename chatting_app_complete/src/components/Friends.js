import React, { useEffect, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { useSelector, useDispatch } from 'react-redux';
import { activeChat } from '../slices/activeChatSlice';

const Friends = () => {

    const db = getDatabase();
    const dispatch = useDispatch();

    let data = useSelector((state) => state.userLoginInfo.userInfo);

    let [friends, setFriends] = useState([]);

    useEffect(() => {
        const freindsRef = ref(db, 'friends/');
        onValue(freindsRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (item.val().receiverid == data.uid || item.val().senderid == data.uid) {
                    arr.push({ ...item.val(), key: item.key });
                }
            });
            setFriends(arr);
        });
    }, []);

    let handleBlock = (item) => {
        console.log(item)
        if (data.uid == item.senderid) {
            set(push(ref(db, 'block/')), {
                block: item.receivername,
                blockId: item.receiverid,
                blockBy: item.sendername,
                blockIdBy: item.senderid,
            }).then(() => {
                remove(ref(db, 'friends/' + item.key));
            });
        } else {
            set(push(ref(db, 'block/')), {
                block: item.sendername,
                blockId: item.senderid,
                blockBy: item.receivername,
                blockIdBy: item.receiverid,
            }).then(() => {
                remove(ref(db, 'friends/' + item.key));
            });
        }

    }

    let handleActiveFriends = (item) => {
        if (data.uid == item.receiverid) {
            dispatch(activeChat({ status: 'single', id: item.senderid, name: item.sendername }));
            localStorage.setItem('activeChat', JSON.stringify({ status: 'single', id: item.senderid, name: item.sendername }));
        } else {
            dispatch(activeChat({ status: 'single', id: item.receiverid, name: item.receivername }));
            localStorage.setItem('activeChat', JSON.stringify({ status: 'single', id: item.receiverid, name: item.receivername }));
        }
    }

    return (
        <div className='w-full bg-white shadow-lg rounded-lg py-3 px-5 mt-11 h-[347px] overflow-y-scroll'>
            <div className='relative'>
                <h3 className='font-nunito font-bold text-xl'>Friends</h3>
                <HiDotsVertical className='absolute top-[6px] right-[6px] text-button' />
            </div>
            {friends.map((item) => (
                <div onClick={() => handleActiveFriends(item)} className='flex gap-x-5 items-center border-b border-solid border-button pb-3.5 mt-3.5'>
                    <div>
                        <img className='w-[70px] h-[70px] rounded-full' src='images/list1.png' />
                    </div>
                    <div>
                        <h3 className='font-nunito font-bold text-xl'>
                            {data.uid == item.receiverid ? item.sendername : item.receivername}
                        </h3>
                        <p className='font-nunito font-semibold text-sm'>Wassup!</p>
                    </div>
                    <div>
                        <button onClick={() => handleBlock(item)} className='font-nunito font-bold text-xl bg-button text-white py-2.5 px-5 rounded'>Block</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Friends;