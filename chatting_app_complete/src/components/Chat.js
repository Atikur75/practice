import React, { useEffect, useState } from 'react';
import { BsFillTriangleFill, BsFillCameraFill, BsFillMicFill } from 'react-icons/bs';
import { GrSend, GrGallery } from 'react-icons/gr';
import { AiFillCloseCircle } from 'react-icons/ai';
import { RiDeleteBin5Line, RiSendPlaneFill } from 'react-icons/ri';
import { BsEmojiSmile } from 'react-icons/bs';
import ModalImage from "react-modal-image";
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useSelector } from 'react-redux';
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { getStorage, ref as sref, uploadBytesResumable, getDownloadURL, uploadString, uploadBytes } from "firebase/storage";
import moment from 'moment/moment';
import { AudioRecorder } from 'react-audio-voice-recorder';
import EmojiPicker from 'emoji-picker-react';

const Chat = () => {

    const db = getDatabase();
    const storage = getStorage();
    let [check, setCheck] = useState(false);
    let [captureImage, setCaptureImage] = useState('');
    let [message, setMessage] = useState('');
    let [messageList, setMessageList] = useState([]);
    let [audiourl, setAudiourl] = useState('');
    let [blob, setBlob] = useState('');
    let [showemoji, setShowemoji] = useState(false);

    let data = useSelector((state) => state.userLoginInfo.userInfo);
    let activeFriendsName = useSelector((state) => state.activeChat.active);

    function handleTakePhoto(dataUri) {
        setCaptureImage(dataUri);
        console.log('takePhoto');
        const storageRef = sref(storage, 'caputeImage');
        uploadString(storageRef, dataUri, 'data_url').then((snapshot) => {
            getDownloadURL(storageRef).then((downloadURL) => {
                set(push(ref(db, 'single')), {
                    whosendid: data.uid,
                    whosendname: data.displayName,
                    whoreceiveid: activeFriendsName.id,
                    whoreceivename: activeFriendsName.name,
                    image: downloadURL,
                    date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}: ${new Date().getMinutes()}`
                }).then(() => {
                    setCheck(false);
                });
            });
        });
    }

    let handleMessageSend = () => {
        if (activeFriendsName.status == 'single') {
            set(push(ref(db, 'single')), {
                whosendid: data.uid,
                whosendname: data.displayName,
                whoreceiveid: activeFriendsName.id,
                whoreceivename: activeFriendsName.name,
                message: message,
                date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}: ${new Date().getMinutes()}`
            })
            setMessage('');
            setShowemoji(false);
        } else {
            console.log('Double')
        }
    }

    useEffect(() => {

        onValue(ref(db, 'single'), (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if ((item.val().whosendid == data.uid && item.val().whoreceiveid == activeFriendsName.id) || (item.val().whoreceiveid == data.uid && item.val().whosendid == activeFriendsName.id)) {
                    arr.push(item.val());
                }

            });
            setMessageList(arr);
        });
    }, [activeFriendsName.id]);

    let handleImageUpload = (e) => {
        console.log(e.target.files[0])
        const storageRef = sref(storage, e.target.files[0].name);

        const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);


        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                console.log(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    set(push(ref(db, 'single')), {
                        whosendid: data.uid,
                        whosendname: data.displayName,
                        whoreceiveid: activeFriendsName.id,
                        whoreceivename: activeFriendsName.name,
                        image: downloadURL,
                        date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}: ${new Date().getMinutes()}`
                    })
                });
            }
        );
    }

    const addAudioElement = (blob) => {
        console.log(blob)
        const url = URL.createObjectURL(blob);
        setAudiourl(url);
        setBlob(blob);
    };

    let handleAudioUpload = () => {
        const audiostorageRef = sref(storage, audiourl);
        uploadBytes(audiostorageRef, blob).then((snapshot) => {
            getDownloadURL(audiostorageRef).then((downloadURL) => {
                set(push(ref(db, 'single')), {
                    whosendid: data.uid,
                    whosendname: data.displayName,
                    whoreceiveid: activeFriendsName.id,
                    whoreceivename: activeFriendsName.name,
                    audio: downloadURL,
                    date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}: ${new Date().getMinutes()}`
                }).then(() => {
                    setAudiourl('');
                });
            });
        });
    }

    let handleEmoji = (emoji) => {
        setMessage(message + emoji.emoji);
    }

    return (
        <div className='bg-white shadow-lg rounded-xl py-4 px-8'>
            <div className='flex items-center gap-x-8 border-b border-solid border-[rgba(0,0,0,.25)] pb-6 mb-14'>
                <div className='w-[75px] h-[75px] rounded-full shadow-lg relative'>
                    <img src='images/profile.png' />
                    <div className='w-[14px] h-[14px] rounded-full bg-green-500 border border-solid border-white absolute bottom-[11px] right-0'></div>
                </div>
                <div>
                    <h3 className='font-open font-semibold text-2xl'>{activeFriendsName.name}</h3>
                    <p className='font-open font-regular text-sm'>Online</p>
                </div>
            </div>
            <div>
                <div className='overflow-y-scroll h-[350px] border-b border-solid border-[#f1f1f1]'>
                    {activeFriendsName.status == 'single' ? (
                        messageList.map((item) => (
                            item.whosendid == data.uid ? (
                                item.message ?
                                    <div className='mb-8 text-right'>
                                        <div className='bg-button inline-block rounded-md py-3 px-12 relative mr-5'>
                                            <p className='font-open font-medium text-base text-white text-left'>{item.message}</p>
                                            <BsFillTriangleFill className='text-2xl absolute bottom-[-2px] right-[-7px] text-button' />
                                        </div>
                                        <p className='font-open font-medium text-sm text-[rgba(0,0,0,.25)] ml-5'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                                    </div>
                                    : item.image ?
                                        <div className='mb-8 text-right'>
                                            <div className='bg-button inline-block rounded-md w-80 p-3 relative mr-5'>
                                                <ModalImage
                                                    small={item.image}
                                                    large={item.image}
                                                />;
                                                <BsFillTriangleFill className='text-2xl absolute bottom-[-2px] right-[-7px] text-button' />
                                            </div>
                                            <p className='font-open font-medium text-sm text-[rgba(0,0,0,.25)] ml-5'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                                        </div>
                                        : (
                                            <div className='mb-8 text-right'>
                                                <div className='inline-block mr-5'>
                                                    <audio controls src={item.audio}></audio>
                                                </div>
                                                <p className='font-open font-medium text-sm text-[rgba(0,0,0,.25)] mr-5'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                                            </div>
                                        )
                            ) : item.message ? (
                                <div className='mb-8'>
                                    <div className='bg-[#f1f1f1] inline-block rounded-md py-3 px-12 relative ml-5'>
                                        <p className='font-open font-medium text-base'>{item.message}</p>
                                        <BsFillTriangleFill className='text-2xl absolute bottom-[-2px] left-[-7px] text-[#f1f1f1]' />
                                    </div>
                                    <p className='font-open font-medium text-sm text-[rgba(0,0,0,.25)] ml-5'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                                </div>
                            ) : item.image ?
                                <div className='mb-8'>
                                    <div className='bg-[#f1f1f1] inline-block rounded-md w-80 p-3 relative ml-5'>
                                        <ModalImage
                                            small={item.image}
                                            large={item.image}
                                        />;
                                        <BsFillTriangleFill className='text-2xl absolute bottom-[-2px] left-[-7px] text-[#f1f1f1]' />
                                    </div>
                                    <p className='font-open font-medium text-sm text-[rgba(0,0,0,.25)] ml-5'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                                </div>
                                : (
                                    <div className='mb-8'>
                                        <div className='inline-block ml-5'>
                                            <audio controls src={item.audio}></audio>
                                        </div>
                                        <p className='font-open font-medium text-sm text-[rgba(0,0,0,.25)] ml-5'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                                    </div>
                                )
                        ))
                    ) : (
                        <h1>Double Message</h1>
                    )}
                    {/* Receive Message Start */}
                    {/* <div className='mb-8'>
                        <div className='bg-[#f1f1f1] inline-block rounded-md py-3 px-12 relative ml-5'>
                            <p className='font-open font-medium text-base'>Hey There !</p>
                            <BsFillTriangleFill className='text-2xl absolute bottom-[-2px] left-[-7px] text-[#f1f1f1]' />
                        </div>
                        <p className='font-open font-medium text-sm text-[rgba(0,0,0,.25)] ml-5'>Today, 2:01pm</p>
                    </div> */}
                    {/* Receive Message End */}

                    {/* Send Message Start */}
                    {/* <div className='mb-8 text-right'>
                        <div className='bg-button inline-block rounded-md py-3 px-12 relative mr-5'>
                            <p className='font-open font-medium text-base text-white text-left'>Hello...</p>
                            <BsFillTriangleFill className='text-2xl absolute bottom-[-2px] right-[-7px] text-button' />
                        </div>
                        <p className='font-open font-medium text-sm text-[rgba(0,0,0,.25)] ml-5'>Today, 2:01pm</p>
                    </div> */}
                    {/* Send Message End */}

                    {/* Receive Image Start */}
                    {/* <div className='mb-8'>
                        <div className='bg-[#f1f1f1] inline-block rounded-md w-80 p-3 relative ml-5'>
                            <ModalImage
                                small={'images/registration.png'}
                                large={'images/registration.png'}
                            />;
                            <BsFillTriangleFill className='text-2xl absolute bottom-[-2px] left-[-7px] text-[#f1f1f1]' />
                        </div>
                        <p className='font-open font-medium text-sm text-[rgba(0,0,0,.25)] ml-5'>Today, 2:01pm</p>
                    </div> */}
                    {/* Receive Image End */}

                    {/* Send Image Start */}
                    {/* <div className='mb-8 text-right'>
                        <div className='bg-button inline-block rounded-md w-80 p-3 relative mr-5'>
                            <ModalImage
                                small={'images/login.png'}
                                large={'images/login.png'}
                            />;
                            <BsFillTriangleFill className='text-2xl absolute bottom-[-2px] right-[-7px] text-button' />
                        </div>
                        <p className='font-open font-medium text-sm text-[rgba(0,0,0,.25)] ml-5'>Today, 2:01pm</p>
                    </div> */}
                    {/* Send Image End */}

                    {/* Receive Audio Start */}
                    {/* <div className='mb-8'>
                        <div className='inline-block ml-5'>
                            <audio controls></audio>
                        </div>
                        <p className='font-open font-medium text-sm text-[rgba(0,0,0,.25)] ml-5'>Today, 2:01pm</p>
                    </div> */}
                    {/* Receive Audio End */}

                    {/* Send Audio Start */}
                    {/* <div className='mb-8 text-right'>
                        <div className='inline-block mr-5'>
                            <audio controls></audio>
                        </div>
                        <p className='font-open font-medium text-sm text-[rgba(0,0,0,.25)] mr-5'>Today, 2:01pm</p>
                    </div> */}
                    {/* Send Audio End */}

                    {/* Receive Audio Start */}
                    {/* <div className='mb-8'>
                        <div className='inline-block ml-5'>
                            <video controls></video>
                        </div>
                        <p className='font-open font-medium text-sm text-[rgba(0,0,0,.25)] ml-5'>Today, 2:01pm</p>
                    </div> */}
                    {/* Receive Audio End */}

                    {/* Send Audio Start */}
                    {/* <div className='mb-8 text-right'>
                        <div className='inline-block mr-5'>
                            <video controls></video>
                        </div>
                        <p className='font-open font-medium text-sm text-[rgba(0,0,0,.25)] mr-5'>Today, 2:01pm</p>
                    </div> */}
                    {/* Send Audio End */}
                </div>
                <div className='flex mt-3 gap-x-3'>
                    <div className='w-[85%] relative'>
                        {!audiourl && (
                            <>
                                <input onChange={(e) => setMessage(e.target.value)} value={message} className='bg-[#f1f1f1] p-3 w-full rounded-lg' />
                                <label>
                                    <input onChange={handleImageUpload} className='hidden' type='file' />
                                    <GrGallery className='absolute top-4 right-2' />
                                </label>
                                <BsFillCameraFill onClick={() => setCheck(!check)} className='absolute top-4 right-8' />
                                <AudioRecorder onRecordingComplete={(blob) => addAudioElement(blob)} />
                                <BsEmojiSmile onClick={() => setShowemoji(!showemoji)} className='absolute top-4 right-20' />
                                {showemoji && (
                                    <div className='absolute top-[-450px] right-4'>
                                        <EmojiPicker onEmojiClick={(emoji) => handleEmoji(emoji)} />
                                    </div>
                                )}
                            </>
                        )}
                        {audiourl && (
                            <div className='flex gap-x-2'>
                                <audio controls src={audiourl}></audio>
                                <button onClick={() => setAudiourl('')} className='bg-button p-3 rounded-md'>
                                    <RiDeleteBin5Line className='text-white' />
                                </button>
                                <button onClick={handleAudioUpload} className='bg-button p-3 rounded-md'>
                                    <RiSendPlaneFill className='text-white' />
                                </button>
                            </div>
                        )}
                    </div>
                    {check && (
                        <div className='w-full h-screen absolute top-0 left-0 bg-[rgba(0,0,0,.9)] z-50 flex justify-center items-center'>
                            <AiFillCloseCircle onClick={() => setCheck(false)} className='text-white z-50 text-4xl cursor-pointer absolute top-8 right-8' />
                            <Camera
                                onTakePhoto={(dataUri) => { handleTakePhoto(dataUri); }}
                                idealFacingMode={FACING_MODES.ENVIRONMENT}
                                idealResolution={{ width: 640, height: 480 }}
                                imageType={IMAGE_TYPES.JPG}
                                imageCompression={0.97}
                                isMaxResolution={true}
                                isImageMirror={true}
                                isSilentMode={false}
                                isDisplayStartCameraError={false}
                                isFullscreen={true}
                                sizeFactor={1}
                            />
                        </div>
                    )}
                    {!audiourl && (
                        <button onClick={handleMessageSend} className='bg-button p-3 rounded-md'>
                            <GrSend className='text-white' />
                        </button>
                    )}

                </div>
            </div>
        </div >
    )
}

export default Chat;