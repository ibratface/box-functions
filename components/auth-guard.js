import { Fragment, useContext, useEffect } from "react";
import { UserAccount } from "../lib/user-account";
import { BoxContext } from "./context";
import { useRouter } from "next/router";

export default function AuthGuard({ children }) {
  const boxContext = useContext(BoxContext)
  const userAccount = new UserAccount(boxContext)
  const router = useRouter()

  useEffect(() => {
    async function reauthorize() {
      await userAccount.refreshTokens()
      if (!userAccount.isAuthorized()) router.push('/oauth/login')
    }
    reauthorize()
  }, [])

  return userAccount.isAuthorized() ? <Fragment>{children}</Fragment> : null
}