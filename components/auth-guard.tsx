import { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { UserSession } from "../lib/user-session";

export default function AuthGuard({ children }) {
  const router = useRouter()

  useEffect(() => {
    async function reauthorize() {
      await UserSession.Current.reauthorize()
      if (!UserSession.Current.IsValid) router.push('/oauth/login')
    }
    if (!UserSession.Current.IsValid) reauthorize()
  }, [UserSession.Current.IsValid])

  return UserSession.Current.IsValid ? <Fragment>{children}</Fragment> : null
}