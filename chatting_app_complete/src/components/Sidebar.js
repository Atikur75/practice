import React, { useState } from 'react';
import { AiOutlineHome, AiFillMessage, AiFillSetting } from 'react-icons/ai';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { MdCloudUpload } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLoginInfo } from '../slices/userSlice';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

const Sidebar = ({ active }) => {

    const auth = getAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const storage = getStorage();

    const [image, setImage] = useState('');
    const [cropData, setCropData] = useState("#");
    const [cropper, setCropper] = useState();

    let data = useSelector((state) => state.userLoginInfo.userInfo);

    let [imageModal, setImageModal] = useState(false);

    let handleSignOut = () => {
        signOut(auth).then(() => {
            dispatch(userLoginInfo(null));
            localStorage.removeItem('userLoginInfo');
            navigate('/login');
        }).catch((error) => {
            console.log(error);
        });
    }

    let handleProfilePicture = () => {
        setImageModal(true);
    }

    const handleUplaodProfilePicture = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
    };

    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            setCropData(cropper.getCroppedCanvas().toDataURL());
            const storageRef = ref(storage, auth.currentUser.uid);
            const message4 = cropper.getCroppedCanvas().toDataURL();
            uploadString(storageRef, message4, 'data_url').then((snapshot) => {
                getDownloadURL(storageRef).then((downloadURL) => {
                    updateProfile(auth.currentUser, {
                        photoURL: downloadURL
                    }).then(() => {
                        setImageModal(false);
                        setImage('');
                        setCropper('');
                        setCropData('');
                    });
                });
            });
        }
    };

    let handleCancel = () => {
        setImageModal(false);
        setImage('');
        setCropper('');
        setCropData('');
    }

    return (
        <div className='w-full bg-button h-screen rounded-3xl p-9'>
            <div className='relative w-28 h-28 rounded-full group'>
                <img className='mx-auto cursor-pointer w-full h-full rounded-full' src={data.photoURL} />
                <div onClick={handleProfilePicture} className='w-full h-full rounded-full bg-[rgba(0,0,0,.4)] absolute top-0 left-0 flex justify-center items-center opacity-0 group-hover:opacity-100 cursor-pointer'>
                    <MdCloudUpload className='text-white text-2xl' />
                </div>
            </div>
            <h2 className='font-nunito font-bold text-center text-2xl text-white mt-5'>
                {auth.currentUser.displayName}
            </h2>
            <div className={`mt-12 relative z-[1] after:z-[-1] ${active=='home' && 'after:bg-white'} after:w-[135%] after:h-[89px] after:content-[""] after:absolute after:top-[-24px] after:left-0 after:rounded-tl-lg after:rounded-bl-lg before:w-[8px] before:h-[253%] before:bg-button before:absolute before:top-[-25px] before:right-[-36px] before:content-[""] before:rounded-tl-lg before:rounded-bl-lg`}>
                <Link to='/'>
                    <AiOutlineHome className={`text-4xl ${active=='home' ? 'text-[#5F35F5]' : 'text-[#BAD1FF]'} mx-auto cursor-pointer`} />
                </Link>
            </div>
            <div className={`mt-12 relative z-[1] after:z-[-1] ${active=='message' && 'after:bg-white'} after:w-[135%] after:h-[89px] after:content-[""] after:absolute after:top-[-24px] after:left-0 after:rounded-tl-lg after:rounded-bl-lg before:w-[8px] before:h-[253%] before:bg-button before:absolute before:top-[-25px] before:right-[-36px] before:content-[""] before:rounded-tl-lg before:rounded-bl-lg`}>
                <Link to='/message'>
                    <AiFillMessage className={`text-4xl ${active=='message' ? 'text-[#5F35F5]' : 'text-[#BAD1FF]'} mx-auto cursor-pointer`} />
                </Link>
            </div>
            <div className='mt-12 relative z-[1] after:z-[-1] after:bg-none after:w-[135%] after:h-[89px] after:content-[""] after:absolute after:top-[-24px] after:left-0 after:rounded-tl-lg after:rounded-bl-lg before:w-[8px] before:h-[253%] before:bg-none before:absolute before:top-[-25px] before:right-[-36px] before:content-[""] before:rounded-tl-lg before:rounded-bl-lg'>
                <IoIosNotificationsOutline className='text-4xl text-[#BAD1FF] mx-auto cursor-pointer' />
            </div>
            <div className='mt-12 relative z-[1] after:z-[-1] after:bg-none after:w-[135%] after:h-[89px] after:content-[""] after:absolute after:top-[-24px] after:left-0 after:rounded-tl-lg after:rounded-bl-lg before:w-[8px] before:h-[253%] before:bg-none before:absolute before:top-[-25px] before:right-[-36px] before:content-[""] before:rounded-tl-lg before:rounded-bl-lg'>
                <AiFillSetting className='text-4xl text-[#BAD1FF] mx-auto cursor-pointer' />
            </div>
            <div className='mt-12 relative z-[1] after:z-[-1] after:bg-none after:w-[135%] after:h-[89px] after:content-[""] after:absolute after:top-[-24px] after:left-0 after:rounded-tl-lg after:rounded-bl-lg before:w-[8px] before:h-[253%] before:bg-none before:absolute before:top-[-25px] before:right-[-36px] before:content-[""] before:rounded-tl-lg before:rounded-bl-lg'>
                <FiLogOut onClick={handleSignOut} className='text-4xl text-[#BAD1FF] mx-auto cursor-pointer' />
            </div>
            {imageModal && (
                <div className='w-full h-screen bg-button absolute top-0 left-0 z-50 flex justify-center items-center'>
                    <div className='w-2/4 bg-white rounded-lg p-5'>
                        <h2 className='font-nunito font-bold text-3xl text-header-res'>Upload Your Profile Picture.</h2>
                        <div className='relative w-28 h-28 rounded-full group overflow-hidden mx-auto'>
                            {image ? (
                                <div className="img-preview w-full h-full rounded-full" />
                            ) : (
                                <img className='mx-auto cursor-pointer w-full h-full rounded-full' src={auth.currentUser.photoURL} />
                            )}
                        </div>
                        <input onChange={handleUplaodProfilePicture} className='mt-8' type='file' />
                        <br />
                        {image && (
                            <Cropper
                                style={{ height: 400, width: "100%" }}
                                zoomTo={0.5}
                                initialAspectRatio={1}
                                preview=".img-preview"
                                src={image}
                                viewMode={1}
                                minCropBoxHeight={10}
                                minCropBoxWidth={10}
                                background={false}
                                responsive={true}
                                autoCropArea={1}
                                checkOrientation={false}
                                onInitialized={(instance) => {
                                    setCropper(instance);
                                }}
                                guides={true}
                            />
                        )}
                        <button onClick={getCropData} className='w-1/4 bg-button rounded-lg font-nunito font-semibold text-xl text-white py-5 mt-8'>Upload</button>
                        <button onClick={handleCancel} className='w-1/4 bg-red-500 rounded-lg font-nunito font-semibold text-xl text-white py-5 mt-8 ml-8'>Cancel</button>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Sidebar;