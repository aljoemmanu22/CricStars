
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminHome from '../../../pages/admin/AdminHome';
import AdminLogin from '../../../pages/admin/AdminLogin';
import AdminUserList from '../../../pages/admin/AdminUserList';
import AdminPrivateRoute from '../../AdminPrivateRoute';
import { useDispatch, useSelector } from 'react-redux';
import { set_Authentication } from '../../../Redux/authentication/authenticationSlice';
import isAuthAdmin from '../../../utils/isAuthAdmin';

function AdminWrapper() {
  const dispatch = useDispatch();
  const authentication_user = useSelector(state => state.authentication_user);

  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');

  const checkAuthAndFetchUserData = async () => {
    try {
      const isAuthenticated = await isAuthAdmin();
      dispatch(
        set_Authentication({
          name: isAuthenticated.name,
          isAuthenticated: isAuthenticated.isAuthenticated,
          isAdmin: isAuthenticated.isAdmin,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!authentication_user.name) {
      checkAuthAndFetchUserData();
    }
    console.log('cc----',authentication_user.isAdmin)
  }, []);

  return (
    <>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route path="/" element={<AdminPrivateRoute><AdminHome /></AdminPrivateRoute>} />
        <Route path="/user_list" element={<AdminPrivateRoute><AdminUserList /></AdminPrivateRoute>} />
      </Routes>
    </>
  );
}

export default AdminWrapper;
