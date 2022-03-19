import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserSession } from "../lib/client/user-session";

export default function AuthGuard({ children }) {
  const [authed, setAuthed] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    async function reauthorize() {
      await UserSession.Current.reauthorize()
      setAuthed(UserSession.Current.IsValid)
      if (!UserSession.Current.IsValid) router.push('/oauth/login')
    }

    if (UserSession.Current.IsValid !== authed)
      setAuthed(UserSession.Current.IsValid)
    if (!UserSession.Current.IsValid) reauthorize()
  })

  return authed ? <Fragment>{children}</Fragment> : null
}