import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { RiEyeCloseFill, RiEyeFill } from 'react-icons/ri';
import { Comment } from 'react-loader-spinner';
import { getDatabase, ref, set } from "firebase/database";

const Registration = () => {

    const auth = getAuth();
    const navigate = useNavigate();
    const db = getDatabase();

    let [email, setEmail] = useState('');
    let [name, setName] = useState('');
    let [password, setPassword] = useState('');
    let [emailErr, setEmailErr] = useState('');
    let [nameErr, setNameErr] = useState('');
    let [passwordErr, setPasswordErr] = useState('');
    let [passwordShow, setPasswordShow] = useState(false);
    let [loading, setLoading] = useState(false);

    let handleEmail = (e) => {
        setEmail(e.target.value);
        setEmailErr('');
    }

    let handleName = (e) => {
        setName(e.target.value);
        setNameErr('');
    }

    let handlePassword = (e) => {
        setPassword(e.target.value);
        setPasswordErr('');
    }

    let handleSubmit = () => {
        if (!email) {
            setEmailErr('Email is required!');
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
            setEmailErr('Invalid Email!')
        }
        if (!name) {
            setNameErr('Name is required!');
        }
        if (!password) {
            setPasswordErr('Password is required!');
        }
        if (email && name && password && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
            setLoading(true);
            createUserWithEmailAndPassword(auth, email, password).then((user) => {
                updateProfile(auth.currentUser, {
                    displayName: name, photoURL: "images/avatar.png"
                }).then(() => {
                    toast.info('Registration Successful!');
                    setEmail('');
                    setName('');
                    setPassword('');
                    sendEmailVerification(auth.currentUser);
                    setTimeout(() => {
                        navigate('/login')
                    }, 2000);
                    setLoading(false);
                }).then(() => {
                    set(ref(db, 'users/'+ user.user.uid), {
                        username: user.user.displayName,
                        email: user.user.email,
                      });

                })
                    .catch((error) => {
                        const errorCode = error.code;
                        console.log(errorCode);
                        setLoading(false);
                    });

            }).catch((error) => {
                const errorCode = error.code;
                console.log(errorCode);
                setLoading(false);
            });
        }
    }

    return (
        <div className='flex'>
            <ToastContainer position="bottom-center" theme="colored" />
            <div className='w-1/2 flex justify-end mr-16 mt-20'>
                <div className=''>
                    <h1 className='font-nunito font-bold text-4xl text-header-res'>Get started with easily register</h1>
                    <h3 className='font-nunito font-normal text-xl text-header2-res mt-3'>Free register and you can enjoy it</h3>
                    <div className='relative mt-9'>
                        <input onChange={handleEmail} value={email} type="email" className='border border-solid rounded-lg border-border-color-res w-96 py-6 px-14' />
                        <p className='font-nunito font-semibold text-sm text-header-res absolute top-[-10px] left-10 bg-white px-[18px]'>Email Address
                        </p>
                        {emailErr && (
                            <p className='font-nunito font-semibold text-xl text-red-600 ml-1.5'>{emailErr}</p>
                        )}
                    </div>
                    <div className='relative mt-9'>
                        <input onChange={handleName} value={name} type="text" className='border border-solid rounded-lg border-border-color-res w-96 py-6 px-14' />
                        <p className='font-nunito font-semibold text-sm text-header-res absolute top-[-10px] left-10 bg-white px-[18px]'>Full name</p>
                        {nameErr && (
                            <p className='font-nunito font-semibold text-xl text-red-600 ml-1.5'>{nameErr}</p>
                        )}
                    </div>
                    <div className='relative mt-9'>
                        <input onChange={handlePassword} value={password} type={passwordShow ? "text" : "password"} className='border border-solid rounded-lg border-border-color-res w-96 py-6 px-14' />
                        <p className='font-nunito font-semibold text-sm text-header-res absolute top-[-10px] left-10 bg-white px-[18px]'>Password</p>
                        {passwordErr && (
                            <p className='font-nunito font-semibold text-xl text-red-600 ml-1.5'>{passwordErr}</p>
                        )}
                        {passwordShow ? (
                            <RiEyeFill onClick={() => setPasswordShow(!passwordShow)} className='absolute top-[30px] right-40' />
                        ) : (
                            <RiEyeCloseFill onClick={() => setPasswordShow(!passwordShow)} className='absolute top-[30px] right-40' />
                        )}
                    </div>
                    {loading ? (
                        <div className='flex justify-center w-96 mt-10'>
                            <Comment
                                visible={true}
                                height="80"
                                width="80"
                                ariaLabel="comment-loading"
                                wrapperStyle={{}}
                                wrapperClass="comment-wrapper"
                                color="#fff"
                                backgroundColor="#5F35F5"
                            />
                        </div>
                    ) : (
                        <button onClick={handleSubmit} className='w-96 bg-button rounded-full font-nunito font-semibold text-xl text-white py-5 mt-10'>Sign up</button>
                    )}
                    <p className='text-center w-96 font-open font-regular text-sm text-already mt-9'>Already  have an account ? <Link to='/login' className='font-open font-bold text-signin cursor-pointer'>Sign In</Link></p>
                </div>
            </div>
            <div className='w-1/2'>
                <img className='w-full h-screen object-cover' src='images/registration.png' />
            </div>
        </div>
    )
}

export default Registration;