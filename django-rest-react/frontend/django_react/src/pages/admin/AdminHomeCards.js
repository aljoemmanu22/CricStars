import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ublock from '../../images/userblock.png'

function AdminHomeCards() {
    const baseURL = "http://127.0.0.1:8000";
    const [data,setData]=useState(null)
  
  
    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await axios.get(baseURL + '/api/accounts/admin/admin_home/',{
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access')}`,
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
              }
            });
            if (res.status === 200) {
              console.log(res.data);
              setData(res.data);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);
    
      if (!data) {
        return <div>Loading...</div>;
      }
  
    console.log('data............',data);
  return (

    <div className="py-5">
        <main className="h-full overflow-y-auto">
            <div className="container mx-auto grid">
                <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 hover:translate-y-2 transition-transform duration-300 ease-in-out">
                        <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Students
                            </p>
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                {data.user}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 hover:translate-y-2 transition-transform duration-300 ease-in-out">
                        <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
                            <img className="w-5 h-5" src={ublock} alt=''/>
                        </div>
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                Blocked Students
                            </p>
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                {data.buser}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
  </div>
  )
}

export default AdminHomeCards