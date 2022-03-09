import { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { Session } from "../lib/session";

export default function AuthGuard({ children }) {
  const router = useRouter()

  useEffect(() => {
    async function reauthorize() {
      await Session.Current.reauthorize()
      if (!Session.Current.IsValid) router.push('/oauth/login')
    }
    if (!Session.Current.IsValid) reauthorize()
  }, [Session.Current.IsValid])

  return Session.Current.IsValid ? <Fragment>{children}</Fragment> : null
}