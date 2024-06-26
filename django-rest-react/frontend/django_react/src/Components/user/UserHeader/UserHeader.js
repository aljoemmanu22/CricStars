import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { set_Authentication } from '../../../Redux/authentication/authenticationSlice';

function UserHeader() {
  const authentication_user = useSelector(state => state.authentication_user);
  const user_basic_details = useSelector(state => state.user_basic_details); // Assuming user_basic_details contains phone number
  const [username, setUsername] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (authentication_user && authentication_user.name) {
      setUsername(authentication_user.name);
    } else {
      setUsername(null);
    }

    if (user_basic_details && user_basic_details.phone) {
      setPhoneNumber(user_basic_details.phone);
    } else {
      setPhoneNumber(null);
    }
  }, [authentication_user, user_basic_details]);

  const location = useLocation();
  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    localStorage.clear();
    dispatch(
      set_Authentication({
        name: null,
        isAuthenticated: false,
        isAdmin: false,
      })
    );
    navigate('/');
  };

  return (
    <div className="relative px-3 border-b lg:bg-white sm:bg-red-800 md-bg-red">
      <nav className="flex items-center justify-between">
        <button
          className="lg:hidden text-gray-600 sm:text-white md:text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
            />
          </svg>
        </button>
        <Link to="">
          <img src="/images/Logo.png" className="h-16 cursor-pointer sm:hidden md:hidden lg:block" alt="Logo" />
          <img
            src="/images/Phonelogo.png"
            className="h-12 cursor-pointer pb-1.5 lg:hidden"
            alt="Phone Logo"
          />
        </Link>
        <ul className="hidden lg:flex justify-end flex-1 pr-14">
          <button onClick={() => {navigate('/user-cordinator-home')}}>
            <li className="px-1">
              <p className="px-2 font-sans font-semibold text-sm text-slate-600">
                Match Coordinator
              </p>
            </li>
          </button>
          {username && (
            <button onClick={() => {navigate('/past-matches')}}>
              <li className="px-1">
                <p className="px-2 font-sans font-semibold text-sm text-slate-600">
                  PAST MATCHES
                </p>
              </li>
            </button>
          )}
          {username !== null && (
            <li className="px-1">
              <a href="/my-records" className="px-2 font-sans font-semibold text-sm text-slate-600">
                MY RECORDS
              </a>
            </li>
          )}
          {/* <li className="px-1">
            <a href="/contact-us" className="px-2 font-sans font-semibold text-sm text-slate-600">
              CONTACT US
            </a>
          </li> */}
        </ul>
        {username !== null && (
          <Link to="profile" className="hidden lg:block">
            <img src="/images/userlogo.png" className="h-11 pt-2 cursor-pointer pr-14" alt="User Logo" />
          </Link>
        )}
        {username === null && location.pathname !== '/login' && (
          <button
            className="bg-white border-2 border-red-600 p-1.5 text-sm font-semibold text-red-600 rounded"
            onClick={handleNavigateToLogin}
          >
            SIGN IN / SIGN UP
          </button>
        )}
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div className="relative bg-white w-3/4 h-full p-5 z-50">
            <div className="bg-black text-white p-4 flex items-center">
              {username && (
                <>
                  <img src="/images/userlogo.png" className="h-12 mr-4" alt="User Logo" />
                  <div>
                    <p className="font-semibold">{username}</p>
                    {phoneNumber && <p className="text-sm">{phoneNumber}</p>}
                  </div>
                </>
              )}
            </div>
            <ul className="mt-8">
              <li className="py-2 border-b">
                <button onClick={() => {navigate('/user-cordinator-home')}} className="font-sans font-semibold text-sm text-slate-600">
                  Match Coordinator
                </button>
              </li>
              {username && (
                <li className="py-2 border-b">
                  <button onClick={() => {navigate('/past-matches')}} className="font-sans font-semibold text-sm text-slate-600">
                    PAST MATCHES
                  </button>
                </li>
              )}
              {username !== null && (
                <li className="py-2 border-b">
                  <a href="/my-records" className="font-sans font-semibold text-sm text-slate-600">
                    MY RECORDS
                  </a>
                </li>
              )}
              <li className="py-2 border-b">
                <a href="/contact-us" className="font-sans font-semibold text-sm text-slate-600">
                  CONTACT US
                </a>
              </li>
              {username !== null && (
                <li className="py-2 border-b">
                  <a href="/profile" className="font-sans font-semibold text-sm text-slate-600">
                    PROFILE
                  </a>
                </li>
              )}
              {username === null && location.pathname !== '/login' && (
                <li className="py-2">
                  <button
                    className="w-full bg-white border-2 border-red-600 p-1.5 text-sm font-semibold text-red-600 rounded"
                    onClick={handleNavigateToLogin}
                  >
                    SIGN IN / SIGN UP
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserHeader;
