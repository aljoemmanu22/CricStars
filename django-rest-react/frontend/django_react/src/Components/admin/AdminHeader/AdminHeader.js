import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import userimg from '../../../images/user.png'
import { useDispatch, useSelector } from 'react-redux';
import { set_Authentication } from '../../../Redux/authentication/authenticationSlice';

function AdminHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authentication_user = useSelector(state => state.authentication_user)
  const user_basic_details = useSelector(state => state.user_basic_details)
  const logout = ()=>{
    localStorage.clear();
    dispatch(
      set_Authentication({
        name: null,
        isAuthenticated: false,
        isAdmin:false
      })
    );
    navigate('/admin/login')

  }

  return (
    <div className="py-2 px-6 bg-[#f8f4f3] flex items-center shadow-md shadow-black/5 sticky top-0 left-0 z-30">
      <button type="button" className="text-lg text-gray-900 font-semibold sidebar-toggle">
        <i className="ri-menu-line"></i>
      </button>

      <ul className="ml-auto flex items-center">
        <li className="mr-1 dropdown">
          <button type="button" className="dropdown-toggle text-gray-400 mr-4 w-8 h-8 rounded flex items-center justify-center  hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="hover:bg-gray-100 rounded-full" viewBox="0 0 24 24" style={{ fill: 'gray', transform: '', msFilter: '' }}>
              <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"></path>
            </svg>
          </button>
          <div className="dropdown-menu shadow-md shadow-black/5 z-30 hidden max-w-xs w-full bg-white rounded-md border border-gray-100">
            <form action="" className="p-4 border-b border-b-gray-100">
              <div className="relative w-full">
                <input type="text" className="py-2 pr-4 pl-10 bg-gray-50 w-full outline-none border border-gray-100 rounded-md text-sm focus:border-blue-500" placeholder="Search..." />
                <i className="ri-search-line absolute top-1/2 left-4 -translate-y-1/2 text-gray-900"></i>
              </div>
            </form>
          </div>
        </li>

       


        <li className="dropdown ml-3">
          <button type="button" className="dropdown-toggle flex items-center">
            <div className="flex-shrink-0 w-10 h-10 relative">
              <div className="p-1 bg-white rounded-full focus:outline-none focus:ring">
                <img className="w-8 h-8 rounded-full" src="https://laravelui.spruko.com/tailwind/ynex/build/assets/images/faces/9.jpg" alt="" />
                <div className="top-0 left-7 absolute w-3 h-3 bg-lime-400 border-2 border-white rounded-full animate-ping"></div>
                <div className="top-0 left-7 absolute w-3 h-3 bg-lime-500 border-2 border-white rounded-full"></div>
              </div>
            </div>
            <div className="p-2 md:block text-left">
              <h2 className="text-sm font-semibold text-gray-800">{authentication_user.name}</h2>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </button>
        </li>

        <li className="mr-1 dropdown">
        <button onClick={logout} className="text-gray-800 text-md font-semibold border px-4 py-2 rounded-lg hover:text-orange-500 hover:border-orange-500 ml-5">
                     Log Out
        </button>
        </li>
      </ul>
    </div>
  )
}

export default AdminHeader