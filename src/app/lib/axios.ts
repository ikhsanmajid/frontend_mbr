import axios, { AxiosError } from "axios"
import { getSession, signOut } from "next-auth/react"
import { redirect } from "next/navigation"

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_APIENDPOINT_URL as string}`,
  headers: {
    "Content-Type": "application/json",
  },
  // validateStatus: (status) => {
  //   return status >= 200 && status < 500
  // },
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

  async (error: AxiosError) => {
    const session = await getSession()
    if (error.response?.status === 401 || session == null) {

      if (!isRedirecting) {
        isRedirecting = true;

        signOut({
          redirect: false,
        }).then(() => {
          window.location.href = `/mbr/login?code=session_expired&next=${encodeURIComponent(window.location.pathname.substring(4))}`;
          //redirect(`/login?code=session_expired&next=${encodeURIComponent(window.location.pathname)}`)
        });
      }
    } else if (error.code == "ERR_NETWORK") {
      const next = location.pathname + location.search;
      const url = new URL('/mbr/server-offline', location.origin);
      url.searchParams.set('next', next.substring(4));
      location.assign(url.toString());
      //redirect(`${url.toString()}`)
      // window.location.href = `/server-offline?next=${encodeURIComponent(window.location.pathname)}`;
    }

    return Promise.reject(error);
  }
);


export default api
