import React, { useState, useEffect } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { useSelector } from 'react-redux';

const Grouplists = () => {

    const db = getDatabase();

    let data = useSelector((state) => state.userLoginInfo.userInfo);

    let [show, setShow] = useState(false);
    let [groupName, setGroupName] = useState('');
    let [groupTag, setGroupTag] = useState('');
    let [GroupList, setGroupList] = useState([]);

    let handleGroupButton = () => {
        setShow(!show);
    }

    let handleCreateGroup = () => {
        set(push(ref(db, 'group/')), {
            groupName: groupName,
            groupTagline: groupTag,
            adminId: data.uid,
            adminName: data.displayName,
        }).then(() => {
            setShow(false);
        });
    }

    useEffect(() => {
        const groupRef = ref(db, 'group/');
        onValue(groupRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid != item.val().adminId) {
                    arr.push({ ...item.val(), key: item.key });
                }
            });
            setGroupList(arr);
        });
    }, []);

    let handleGroupRequest = (item) => {
        set(push(ref(db, 'groupjoinrequest/')), {
            groupId: item.key,
            groupName: item.groupName,
            groupTagline: item.groupTagline,
            adminId: item.adminId,
            adminName: item.adminName,
            userId: data.uid,
            userName: data.displayName,
        })
    }

    return (
        <div className='w-full bg-white shadow-lg rounded-lg py-3 px-5 mt-11 h-[347px] overflow-y-scroll'>
            <div className='relative'>
                <h3 className='font-nunito font-bold text-xl'>GroupList</h3>
                <button onClick={handleGroupButton} className='font-nunito font-bold text-xl bg-button text-white py-1 px-2 rounded absolute top-[6px] right-[6px]'>
                    {show ? 'Go Back' : 'Create Group'}
                </button>
            </div>
            {show ? (
                <div className='mt-10'>
                    <input onChange={(e) => setGroupName(e.target.value)} type="email" className='border border-solid rounded-lg border-border-color-res w-full p-3 px-2.5 mb-3' placeholder='Group Name' />
                    <input onChange={(e) => setGroupTag(e.target.value)} type="email" className='border border-solid rounded-lg border-border-color-res w-full p-3 px-2.5 mb-3' placeholder='Group Tagline' />
                    <button onClick={handleCreateGroup} className='w-full bg-button rounded-lg font-nunito font-semibold text-xl text-white py-3 mt-3'>Create</button>
                </div>
            ) : (

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
                            <button onClick={() => handleGroupRequest(item)} className='font-nunito font-bold text-xl bg-button text-white py-2.5 px-5 rounded'>Join</button>
                        </div>
                    </div>
                ))


            )}

        </div>
    )
}

export default Grouplists;