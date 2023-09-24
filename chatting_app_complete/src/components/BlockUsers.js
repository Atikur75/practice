import React, { useEffect, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { useSelector } from 'react-redux';

const BlockUsers = () => {

    const db = getDatabase();

    let [block, setBlock] = useState([]);

    let data = useSelector((state) => state.userLoginInfo.userInfo);

    useEffect(() => {
        const blockRef = ref(db, 'block/');
        onValue(blockRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid == item.val().blockIdBy) {
                    arr.push({
                        id: item.key,
                        block: item.val().block,
                        blockId: item.val().blockId,
                    })
                } else {
                    arr.push({
                        id: item.key,
                        blockBy: item.val().blockBy,
                        blockIdBy: item.val().blockIdBy,
                    })
                }
            });
            setBlock(arr);
        });
    }, [])

    let handleUnblock =(item)=>{
        set(push(ref(db, 'friends/')), {
            sendername: item.block,
            senderid: item.blockId,
            receivername: data.displayName,
            receiverid: data.uid,
        }).then(()=>{
            remove(ref(db, 'block/'+ item.id)).then(()=>{
                console.log('Alhamdulliah')
            });
        });
    }

    return (
        <div className='w-full bg-white shadow-lg rounded-lg py-3 px-5 mt-11 h-[347px] overflow-y-scroll'>
            <div className='relative'>
                <h3 className='font-nunito font-bold text-xl'>Blocked Users</h3>
                <HiDotsVertical className='absolute top-[6px] right-[6px] text-button' />
            </div>
            {block.map((item) => (
                <div className='flex gap-x-5 items-center border-b border-solid border-button pb-3.5 mt-3.5'>
                    <div>
                        <img className='w-[70px] h-[70px] rounded-full' src='images/list1.png' />
                    </div>
                    <div>
                        <h3 className='font-nunito font-bold text-xl'>
                            {item.blockBy}
                        </h3>
                        <h3 className='font-nunito font-bold text-xl'>
                            {item.block}
                        </h3>
                        
                        <p className='font-nunito font-semibold text-sm'>Wassup!</p>
                    </div>
                    <div>
                        {!item.blockIdBy && <button onClick={()=>handleUnblock(item)} className='font-nunito font-bold text-xl bg-button text-white py-2.5 px-5 rounded'>Unblock</button>}

                    </div>
                </div>
            ))}

        </div>
    )
}

export default BlockUsers;