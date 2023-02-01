import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import AuthImage from '../images/auth-image.jpg';
import AuthDecoration from '../images/auth-decoration.png';

import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, setCredentials } from '../features/auth/authSlice'
import { useLoginMutation } from '../features/auth/authApiSlice'

import usePersist from '../hooks/usePersist';

function Signin() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const [persist, setPersist] = usePersist()
  const [errMsg, setErrMsg] = useState('')

  const whereItCameFrom = location?.state?.from || "/"
  const [login, { isLoading }] = useLoginMutation()
  const [loginInfo, setLoginInfo] = useState({
    user: "",
    pwd: ""
  })



  const handleChange = (evt) => {
    const value = evt.target.value;
    setLoginInfo({
      ...loginInfo,
      [evt.target.name]: value
    });
  }

  const handleToggle = () => setPersist(prev => !prev)

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(loginInfo).unwrap()
      const { AuthData } = userData
      dispatch(setCredentials(AuthData));
      navigate(whereItCameFrom)
    } catch (err) {
      console.log(err)
      if (!err.originalStatus) {
        setErrMsg('No Server Response');
      } else if (err.originalStatus === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.originalStatus === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg(err.data);
      }
    }
  }


  useEffect(() => {
    setErrMsg('');
  }, [loginInfo.user, loginInfo.pwd])


  return (
    <main className="bg-white">

      <div className="relative md:flex">

        {/* Content */}
        <div className="md:w-1/2">
          <div className="min-h-screen h-full flex flex-col after:flex-1">

            {/* Header */}
            <div className="flex-1">
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link className="block" to="/">
                  <svg width="32" height="32" viewBox="0 0 32 32">
                    <defs>
                      <linearGradient x1="28.538%" y1="20.229%" x2="100%" y2="108.156%" id="logo-a">
                        <stop stopColor="#A5B4FC" stopOpacity="0" offset="0%" />
                        <stop stopColor="#A5B4FC" offset="100%" />
                      </linearGradient>
                      <linearGradient x1="88.638%" y1="29.267%" x2="22.42%" y2="100%" id="logo-b">
                        <stop stopColor="#38BDF8" stopOpacity="0" offset="0%" />
                        <stop stopColor="#38BDF8" offset="100%" />
                      </linearGradient>
                    </defs>
                    <rect fill="#6366F1" width="32" height="32" rx="16" />
                    <path d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z" fill="#4F46E5" />
                    <path d="M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z" fill="url(#logo-a)" />
                    <path d="M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z" fill="url(#logo-b)" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="max-w-sm mx-auto px-4 py-8">
              <h1 className="text-3xl text-slate-800 font-bold mb-6">Welcome back! ✨</h1>
              {/* Form */}
              <form onSubmit={submitHandler} autoComplete="true">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email Address</label>
                    <input name="user" value={loginInfo.user} onChange={handleChange} id="email" className="form-input w-full" type="text" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                    <input name="pwd" value={loginInfo.pwd} onChange={handleChange} id="password" className="form-input w-full" type="password" autoComplete="on" />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="mr-1">
                    <Link className="text-sm underline hover:no-underline" to="/reset-password">Forgot Password?</Link>
                  </div>
                  {/* <Link className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3" to="/">Sign In</Link> */}
                  {isLoading ? (
                    <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed shadow-none" disabled>
                      <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                        <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                      </svg>
                      <span className="ml-2">Loading</span>
                    </button>
                  ) : (
                    <button type="submit" className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3">Sign In</button>
                  )}


                </div>
              </form>
              {/* Footer */}
              <div className="pt-5 mt-6 border-t border-slate-200">
                <div className="text-sm">
                  Don’t you have an account? <Link className="font-medium text-indigo-500 hover:text-indigo-600" to="/signup">Sign Up</Link>
                </div>
                {/* Warning */}
                <div className="mt-5">
                  <label htmlFor="persist" className="form__persist">
                    <input
                      type="checkbox"
                      className=""
                      id="persist"
                      onChange={handleToggle}
                      checked={persist}
                    />
                    Trust This Device
                  </label>
                </div>
                <p className={`${!!errMsg && "text-red-500"}`}>{errMsg}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Image */}
        <div className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2" aria-hidden="true">
          <img className="object-cover object-center w-full h-full" src={AuthImage} width="760" height="1024" alt="Authentication" />
          <img className="absolute top-1/4 left-0 -translate-x-1/2 ml-8 hidden lg:block" src={AuthDecoration} width="218" height="224" alt="Authentication decoration" />
        </div>

      </div>

    </main>
  );
}

export default Signin;