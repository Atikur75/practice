import React, { useEffect, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";

const FriendRequest = () => {

    const db = getDatabase();

    let data = useSelector((state) => state.userLoginInfo.userInfo);

    let [friendRequest, setFriendRequest] = useState([]);

    useEffect(() => {
        const friendrequestRef = ref(db, 'friendRequests/');
        onValue(friendrequestRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if(item.val().receiverid == data.uid){
                    arr.push({...item.val(), id: item.key})
                }
            });
            setFriendRequest(arr);
        });
    }, []);

    let handleAcceptFriendRequest = (item)=>{
        set(push(ref(db, 'friends')), {
            ...item,
          }).then(()=>{
            remove(ref(db, 'friendRequests/'+ item.id));
          });
    }

    return (
        <div className='w-full bg-white shadow-lg rounded-lg py-3 px-5 mt-11 h-[347px] overflow-y-scroll'>
            <div className='relative'>
                <h3 className='font-nunito font-bold text-xl'>Friend  Request</h3>
                <HiDotsVertical className='absolute top-[6px] right-[6px] text-button' />
            </div>
            {friendRequest.map((item) => (
                <div className='flex gap-x-5 items-center border-b border-solid border-button pb-3.5 mt-3.5'>
                    <div>
                        <img className='w-[70px] h-[70px] rounded-full' src='images/list1.png' />
                    </div>
                    <div>
                        <h3 className='font-nunito font-bold text-xl'>{item.sendername}</h3>
                        <p className='font-nunito font-semibold text-sm'>Hi Guys, Wassup!</p>
                    </div>
                    <div>
                        <button onClick={()=>handleAcceptFriendRequest(item)} className='font-nunito font-bold text-xl bg-button text-white py-2.5 px-5 rounded'>Accept</button>
                    </div>
                </div>
            ))}

        </div>
    )
}

export default FriendRequest;