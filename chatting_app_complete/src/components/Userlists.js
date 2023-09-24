import React, { useEffect, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { getDatabase, ref, onValue, set, push } from "firebase/database";

const Userlists = () => {

    const db = getDatabase();

    let data = useSelector((state) => state.userLoginInfo.userInfo);

    let [userList, setUserList] = useState([]);
    let [friendRequest, setFriendRequest] = useState([]);
    let [friends, setFriends] = useState([]);
    let [filterUserLists, setFilterUserLists] = useState([]);

    useEffect(() => {
        const userRef = ref(db, 'users/');
        onValue(userRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid != item.key) {
                    arr.push({ ...item.val(), userid: item.key });
                }
            });
            setUserList(arr);
        });
    }, []);

    
    let handleFriendRequest = (item) => {
        set(push(ref(db, 'friendRequests/')), {
            sendername: data.displayName,
            senderid: data.uid,
            receivername: item.username,
            receiverid: item.userid,
        });
    }

    useEffect(() => {
        const friendrequestRef = ref(db, 'friendRequests/');
        onValue(friendrequestRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                arr.push(item.val().receiverid + item.val().senderid);
            });
            setFriendRequest(arr);
        });
    }, []);

    useEffect(() => {
        const friendsRef = ref(db, 'friends/');
        onValue(friendsRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                arr.push(item.val().receiverid + item.val().senderid);
            });
            setFriends(arr);
        });
    }, []);

    let handleSearch = (e) => {
        let arr = [];
        if (e.target.value.length == 0) {
            setFilterUserLists([]);
        } else {
            userList.filter((item) => {
                if (item.username.toLowerCase().includes(e.target.value.toLowerCase())) {
                    arr.push(item);
                    setFilterUserLists(arr);
                }
            });
        }
    }

    return (
        <div className='w-full bg-white shadow-lg rounded-lg py-3 px-5 mt-11 h-[347px] overflow-y-scroll'>
            <div className='relative'>
                <h3 className='font-nunito font-bold text-xl'>User List</h3>
                <HiDotsVertical className='absolute top-[6px] right-[6px] text-button' />
                <input onChange={handleSearch} className='w-full rounded-lg p-2.5 shadow-lg pl-[30px]' type='text' placeholder='Search' />
            </div>
            {filterUserLists.length > 0 ? (
                filterUserLists.map((item) => (
                    <div className='flex gap-x-5 items-center border-b border-solid border-button pb-3.5 mt-3.5 '>
                        <div>
                            <img className='w-[70px] h-[70px] rounded-full' src='images/list1.png' />
                        </div>
                        <div>
                            <h3 className='font-nunito font-bold text-xl'>{item.username}</h3>
                            <p className='font-nunito font-semibold text-sm'>guys</p>
                        </div>
                        {friends.includes(item.userid + data.uid) || friends.includes(data.uid + item.userid) ? (
                            <button className='font-nunito font-bold text-xl bg-button text-white py-2.5 px-5 rounded'>F</button>
                        ) : (
                            friendRequest.includes(item.userid + data.uid) || friendRequest.includes(data.uid + item.userid) ? (
                                <button className='font-nunito font-bold text-xl bg-button text-white py-2.5 px-5 rounded'>p</button>
                            ) : (
                                <button onClick={() => handleFriendRequest(item)} className='font-nunito font-bold text-xl bg-button text-white py-2.5 px-5 rounded'>+</button>
                            )
                        )}

                        <div>
                        </div>
                    </div>
                ))
            ) : (
                userList.map((item) => (
                    <div className='flex gap-x-5 items-center border-b border-solid border-button pb-3.5 mt-3.5 '>
                        <div>
                            <img className='w-[70px] h-[70px] rounded-full' src='images/list1.png' />
                        </div>
                        <div>
                            <h3 className='font-nunito font-bold text-xl'>{item.username}</h3>
                            <p className='font-nunito font-semibold text-sm'>Engineer</p>
                        </div>
                        {friends.includes(item.userid + data.uid) || friends.includes(data.uid + item.userid) ? (
                            <button className='font-nunito font-bold text-xl bg-button text-white py-2.5 px-5 rounded'>F</button>
                        ) : (
                            friendRequest.includes(item.userid + data.uid) || friendRequest.includes(data.uid + item.userid) ? (
                                <button className='font-nunito font-bold text-xl bg-button text-white py-2.5 px-5 rounded'>p</button>
                            ) : (
                                <button onClick={() => handleFriendRequest(item)} className='font-nunito font-bold text-xl bg-button text-white py-2.5 px-5 rounded'>+</button>
                            )
                        )}

                        <div>
                        </div>
                    </div>
                ))
            )}




        </div>
    )
}

export default Userlists;