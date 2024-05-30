import React, { useEffect, useState } from "react";
import  Sidebar from '../../Components/admin/Sidebar'
import AdminHeader from '../../Components/admin/AdminHeader/AdminHeader'
import AdminHomeCards from './AdminHomeCards.js';

function AdminHome() {

  return (
    <div>
      <Sidebar/>
      <AdminHeader/>
      <div className="w-full md:w-[calc(100%-286px)] md:ml-64 bg-gray-200 min-h-screen transition-all main">
        <div  className='p-6'>
          <AdminHomeCards/>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
