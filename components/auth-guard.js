import { Fragment, useContext, useEffect } from "react";
import { UserAccount } from "../lib/user-account";
import { BoxContext } from "./context";
import Login from "./login";
import { useRouter } from "next/router";

export default function AuthGuard({ children }) {
  const boxContext = useContext(BoxContext)
  const userAccount = new UserAccount(boxContext)
  const router = useRouter()

  useEffect(() => {
    if (!userAccount.isAuthorized()) router.push('/')
  }, [])

  return userAccount.isAuthorized() ?
    <Fragment>{children}</Fragment> :
    <Login></Login>
}