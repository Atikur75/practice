import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { userLoginInfo } from '../../slices/userSlice';
import Sidebar from '../../components/Sidebar';
import Userlists from '../../components/Userlists';
import Search from '../../components/Search';
import Mygroups from '../../components/Mygroups';
import Grouplists from '../../components/Grouplists';
import Friends from '../../components/Friends';
import FriendRequest from '../../components/FriendRequest';
import BlockUsers from '../../components/BlockUsers';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Home = () => {

  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let [verify, setVerify] = useState(false);

  let data = useSelector((state) => state.userLoginInfo.userInfo);

  onAuthStateChanged(auth, (user) => {
    if (user.emailVerified) {
      setVerify(true);
      dispatch(userLoginInfo(user));
      localStorage.setItem('userLoginInfo', JSON.stringify(user));
    }
  });

  useEffect(() => {
    if (!data) {
      navigate('/login');
    }
  }, []);

  return (
    <div className='flex gap-x-6'>
      {verify ? (
        <>
          <div className='w-[186px] pl-2.5'>
            <Sidebar active='home'/>
          </div>
          <div className='w-[427px]'>
            <Search />
            <Grouplists />
            <FriendRequest />
          </div>
          <div className='w-[344px]'>
            <Friends />
            <Mygroups />
          </div>
          <div className='w-[344px]'>
            <Userlists />
            <BlockUsers />
          </div>
        </>
      ) : (
        <div className='w-full h-screen flex justify-center items-center'>
          <h1 className='font-nunito font-bold text-5xl bg-button text-white p-5'>Please First Verify Your Email!</h1>
        </div>
      )}


    </div>
  )
}

export default Home;