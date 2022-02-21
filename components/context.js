import { createContext, useReducer } from "react"
import { useCookies } from "react-cookie"


function useBoxContext() {
  const [cookies, setCookie] = useCookies(['box'])

  function useCookieState(name, path) {
    return useReducer((prev, next) => {
      setCookie(name, next, { path: path })
      return next
    }, cookies[name])
  }

  const [clientID, setClientID] = useCookieState('box_client_id', '/')
  const [clientSecret, setClientSecret] = useCookieState('box_client_secret', '/')
  const [serviceAccountID, setServiceAccountID] = useCookieState('box_service_account_id', '/')

  const [accessToken, setAccessToken] = useReducer((prev, next) => {
    setCookie('box_access_token', next, { path: '/ ' })
    return next
  }, cookies.box_access_token)

  const [accessTokenExpiry, setAccessTokenExpiry] = useReducer((prev, next) => {
    setCookie('box_access_token_expiry', next, { path: '/ ' })
    return next
  }, cookies.box_access_token_expiry)

  const [refreshToken, setRefreshToken] = useReducer((prev, next) => {
    setCookie('box_refresh_token', next, { path: '/ ' })
    return next
  }, cookies.box_refresh_token)

  const [userFolderId, setUserFolderId] = useReducer((prev, next) => {
    setCookie('user_folder_id', next, { path: '/ ' })
    return next
  }, cookies.user_folder_id)


  return {
    clientID,
    setClientID,
    clientSecret,
    setClientSecret,
    serviceAccountID,
    setServiceAccountID,
    accessToken,
    setAccessToken,
    accessTokenExpiry,
    setAccessTokenExpiry,
    refreshToken,
    setRefreshToken,
    userFolderId,
    setUserFolderId,
  }
}

export const BoxContext = createContext(null)

export default function AppContext({ children }) {

  const boxContext = useBoxContext()

  return (<BoxContext.Provider value={boxContext}>
    {children}
  </BoxContext.Provider>)
}