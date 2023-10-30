'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { useRouter, useRouter as userRouterNavigation } from 'next/navigation'
import axios from 'axios'
import type AccountInfo from '@/model/AccountInfo'
import { useAccountStore } from '@/theme/store'

enum Status {
  LOADING, DONE, ERROR
}

interface PrivateRouteProps {
  children?: ReactNode
}

function PrivateRoute (props: PrivateRouteProps): ReactNode {
  const [status, setStatus] = useState<Status>(Status.LOADING)
  const [userInfo, setUserInfo] = useState<AccountInfo | null>(null)
  const router = useRouter()
  const [accountInfo, updateAccountInfo] = useAccountStore(i => [i.accountInfo, i.updateAccountInfo])
  useEffect(() => {
    setUserInfo(JSON.parse(localStorage.getItem('user info') ?? '{}') as AccountInfo)
    let jwtStr: string | null = null
    if (typeof window !== 'undefined') {
      jwtStr = localStorage.getItem('jwt')
      if (jwtStr === null) router.push(`/login?returnUrl=${window.location.pathname}`)
    }
    if (jwtStr !== null) {
      axios.defaults.headers.common.Authorization = 'Bearer ' + jwtStr
      getInfoFromApi()
        .then(r => {
          if (r.status === 200) {
            setStatus(Status.DONE)
            updateAccountInfo(r.data.user)
          }
        })
        .catch(error => {
          setStatus(Status.ERROR)
          navigation.push('/login')
        })
    }
  }, [])

  switch (status) {
    case Status.LOADING:
      return <>Đăng kiểm tra thông tin đăng nhập...</>
    case Status.DONE:
      return <>
				<CurrentUserInfoContext.Provider value={{
				  user: userInfo,
				  setUser: setUserInfo,
				  updateInfo: () => {
				    getInfoFromApi().then(r => {
				      if (r.status === 200) setUserInfo(JSON.parse(localStorage.getItem('user info') ?? '{}') as UserInfo)
				    })
				  }
				}}>
					{props.children}
				</CurrentUserInfoContext.Provider>
			</>
    case Status.ERROR:
      return <>SOMETHING WRONG...</>
  }
}

export default PrivateRoute

async function getInfoFromApi () {
  let lastUpdate = localStorage.getItem('last update')
  if (lastUpdate === null || isNaN(Date.parse(lastUpdate))) lastUpdate = new Date().toISOString()
  return await axios.post<Response>('http://localhost:8080/api/user/lastUpdate', { lastUpdate })
    .then(r => {
      if (r.status === 200) {
        localStorage.setItem('last update', r.data.lastUpdate)
        localStorage.setItem('user info', JSON.stringify(r.data.user))
      }
      return r
    })
}
