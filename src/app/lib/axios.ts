// 'use client';
// import axios from 'axios';

// export const apiURL = process.env.NEXT_PUBLIC_APIENDPOINT_URL as string

// const axiosInstance = axios.create({
//   baseURL: apiURL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Tambahkan interceptor untuk request
// axiosInstance.interceptors.request.use(
//   (config) => {
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Tambahkan interceptor untuk response
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       window.location.href = '/login?expired=true'; // Redirect menggunakan App Router
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

import axios, { AxiosError } from "axios"
import { getSession, signOut } from "next-auth/react"

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_APIENDPOINT_URL as string}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

api.interceptors.request.use(async (config) => {
  const session = await getSession()
  if (session?.user?.access_token) {
    config.headers.Authorization = `Bearer ${session.user.access_token}`
  }
  return config
},
  (error) => Promise.reject(error)
)


let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,

  (error: AxiosError) => {
    if (error.response?.status === 401) {

      if (!isRedirecting) {
        isRedirecting = true;

        signOut({
          redirect: false,
        }).then(() => {
          window.location.href = `/login?code=session_expired&next=${encodeURIComponent(window.location.pathname)}`;
        });
      }
    } else if (error.code == "ERR_NETWORK") {
      window.location.href = `/server-offline?next=${encodeURIComponent(window.location.pathname)}`;
    }

    return Promise.reject(error);
  }
);


export default api
