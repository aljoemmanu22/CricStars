import axios from "axios";
const baseURL = "http://127.0.0.1:8000";


export const AdminUserAxios = axios.create({
    baseURL: `${baseURL}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access')}`,
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  });
