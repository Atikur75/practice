import React, { useEffect, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { getDatabase, ref, onValue, remove, set, push } from "firebase/database";
import { useSelector } from 'react-redux';

const Mygroups = () => {

    const db = getDatabase();

    let data = useSelector((state) => state.userLoginInfo.userInfo);

    let [GroupList, setGroupList] = useState([]);
    let [GroupRequestList, setGroupRequestList] = useState([]);
    let [groupinfomember, setGroupinfomember] = useState([]);
    let [show, setShow] = useState(false);
    let [showgroupmembers, setShowgroupmembers] = useState(false);

    useEffect(() => {
        const groupRef = ref(db, 'group/');
        onValue(groupRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid == item.val().adminId) {
                    arr.push({ ...item.val(), key: item.key });
                }
            });
            setGroupRequestList(arr);
        });
    }, []);

    let handleGroupJoinRequest = (joinitem) => {
        setShow(true);
        const groupRef = ref(db, 'groupjoinrequest/');
        onValue(groupRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid == item.val().adminId && item.val().groupId == joinitem.key) {
                    arr.push({ ...item.val(), key: item.key });
                }
            });
            setGroupList(arr);
        });
    }

    let handleGroupDelete = (item) => {
        remove(ref(db, 'group/' + item.key));
    }

    let handleGroupRequestReject = (item) => {
        remove(ref(db, 'groupjoinrequest/' + item.key)).then(() => {
            setShow(false);
        });
    }

    let handleGroupRequestAccept = (item) => {
        set(push(ref(db, 'groupmembers/')), {
            adminId: item.adminId,
            groupdId: item.groupId,
            userId: item.userId,
            adminname: item.adminName,
            groupname: item.groupName,
            username: item.userName,
        }).then(() => {
            remove(ref(db, 'groupjoinrequest/' + item.key));
        });
    }

    let handleGroupInfo = (itemg) => {
        setShowgroupmembers(true);
        const groupmembersRef = ref(db, 'groupmembers/');
        onValue(groupmembersRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if(data.uid == itemg.adminId && itemg.key == item.val().groupdId){
                    arr.push({ ...item.val(), key: item.key })
                }
            });
            setGroupinfomember(arr);
        });
    }

    return (
        <div className='w-full bg-white shadow-lg rounded-lg py-3 px-5 mt-11 h-[347px] overflow-y-scroll'>
            <div className='relative'>
                <h3 className='font-nunito font-bold text-xl'>My Groups</h3>
                {show && (
                    <button onClick={() => setShow(false)} className='font-nunito font-bold text-md bg-button text-white py-1 px-2 rounded absolute top-[6px] right-[6px]'>
                        Go Back
                    </button>
                )}

                {showgroupmembers && (
                    <button onClick={() => setShowgroupmembers(false)} className='font-nunito font-bold text-md bg-button text-white py-1 px-2 rounded absolute top-[6px] right-[6px]'>
                        Go Back
                    </button>
                )}

            </div>
            {GroupRequestList.length == 0 ?
                <p className='font-nunito font-bold text-xl mt-10 bg-red-400 py-2.5 text-center'>No Group Available</p>
                : show ? (
                    GroupList.map((item) => (
                        <div className='flex gap-x-5 items-center border-b border-solid border-button pb-3.5 mt-3.5'>
                            <div>
                                <img className='w-[70px] h-[70px] rounded-full' src='images/list1.png' />
                            </div>
                            <div>
                                <h3 className='font-nunito font-bold text-xl'>{item.userName}</h3>
                            </div>
                            <div>
                                <button onClick={() => handleGroupRequestAccept(item)} className='font-nunito font-bold text-sm bg-button text-white py-2 px-2 rounded'>Accept</button>
                                <br />
                                <button onClick={() => handleGroupRequestReject(item)} className='font-nunito font-bold text-sm bg-red-500 text-white py-2 px-2 mt-2.5 rounded'>Reject</button>
                            </div>
                        </div>
                    ))
                ) : showgroupmembers ? (
                    groupinfomember.map((item) => (
                        <div className='flex gap-x-5 items-center border-b border-solid border-button pb-3.5 mt-3.5'>
                            <div>
                                <img className='w-[70px] h-[70px] rounded-full' src='images/list1.png' />
                            </div>
                            <div>
                                <h3 className='font-nunito font-bold text-xl'>{item.username}</h3>
                            </div>
                            <div>
                                <button onClick={() => handleGroupRequestReject(item)} className='font-nunito font-bold text-sm bg-red-500 text-white py-2 px-2 mt-2.5 rounded'>Remove</button>
                            </div>
                        </div>
                    ))
                ) : (
                    GroupRequestList.map((item) => (
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
                                <button onClick={() => handleGroupInfo(item)} className='font-nunito font-bold text-sm bg-button text-white py-2 px-2 rounded'>Info</button>
                                <br />
                                <button onClick={() => handleGroupDelete(item)} className='font-nunito font-bold text-sm bg-button text-white py-2 px-2 mt-2.5 rounded'>Delete</button>
                                <br />
                                <button onClick={() => handleGroupJoinRequest(item)} className='font-nunito font-bold text-sm bg-button text-white py-2 px-2 mt-2.5 rounded'>Request</button>
                            </div>
                        </div>
                    )

                    ))
            }

        </div>
    )
}

export default Mygroups;