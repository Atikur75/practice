import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { RiEyeCloseFill, RiEyeFill } from 'react-icons/ri';
import { Comment } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import { userLoginInfo } from '../../slices/userSlice';

const Login = () => {

    const auth = getAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [emailErr, setEmailErr] = useState('');
    let [passwordErr, setPasswordErr] = useState('');
    let [passwordShow, setPasswordShow] = useState(false);
    let [loading, setLoading] = useState(false);

    let handleEmail = (e) => {
        setEmail(e.target.value);
        setEmailErr('');
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
        if (!password) {
            setPasswordErr('Password is required!');
        }
        if (email && password && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
            setLoading(true);
            signInWithEmailAndPassword(auth, email, password).then((user) => {
                toast.info('Login Successful!');
                setEmail('');
                setPassword('');
                dispatch(userLoginInfo(user.user));
                localStorage.setItem('userLoginInfo', JSON.stringify(user));
                setTimeout(() => {
                    navigate('/')
                }, 2000);
                setLoading(false);
            }).catch((error) => {
                const errorCode = error.code;
                console.log(errorCode);
                setLoading(false);
            });
        }
    }

    return (
        <div className='flex'>
            <ToastContainer position="bottom-center" theme="dark" />
            <div className='w-1/2 flex justify-end mr-16 mt-20'>
                <div className=''>
                    <h1 className='font-nunito font-bold text-4xl text-header-res'>Login to your account!</h1>
                    <img className='mt-5 cursor-pointer' src='images/Google.png' />
                    <div className='relative mt-9'>
                        <input onChange={handleEmail} value={email} type="email" className='border border-solid rounded-lg border-border-color-res w-96 py-6 px-14' />
                        <p className='font-nunito font-semibold text-sm text-header-res absolute top-[-10px] left-10 bg-white px-[18px]'>Email Address
                        </p>
                        {emailErr && (
                            <p className='font-nunito font-semibold text-xl text-red-600 ml-1.5'>{emailErr}</p>
                        )}
                    </div>

                    <div className='relative mt-9'>
                        <input onChange={handlePassword} value={password} type={passwordShow ? "text" : "password"} className='border border-solid rounded-lg border-border-color-res w-96 py-6 px-14' />
                        <p className='font-nunito font-semibold text-sm text-header-res absolute top-[-10px] left-10 bg-white px-[18px]'>Password</p>
                        {passwordErr && (
                            <p className='font-nunito font-semibold text-xl text-red-600 ml-1.5'>{passwordErr}</p>
                        )}
                        {passwordShow ? (
                            <RiEyeFill onClick={() => setPasswordShow(!passwordShow)} className='absolute top-[30px] right-12' />
                        ) :
                            (
                                <RiEyeCloseFill onClick={() => setPasswordShow(!passwordShow)} className='absolute top-[30px] right-12' />
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
                        <button onClick={handleSubmit} className='w-96 bg-button rounded-lg font-nunito font-semibold text-xl text-white py-5 mt-10'>Login to Continue</button>
                    )}
                    <p className='w-96 font-open font-regular text-sm text-already mt-9'>Don’t have an account ? <Link to='/registration' className='font-open font-bold text-signin cursor-pointer'>Sign Up</Link></p>
                    <p className='w-96 font-open font-regular text-sm text-already mt-5'> <Link to='/forgotPassword' className='font-open font-bold text-signin cursor-pointer'>Forget Password?</Link></p>
                </div>
            </div>
            <div className='w-1/2'>
                <img className='w-full h-screen object-cover' src='images/login.png' />
            </div>
        </div>
    )
}

export default Login;