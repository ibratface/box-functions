import { LinearProgress } from "@mui/material";
import { useRouter } from "next/router"
import { useEffect } from "react"
import { UserSession } from "../../lib/client/user-session";


export default function OAuthCallback() {
  const router = useRouter()


  useEffect(() => {
    async function authorize() {
      await UserSession.Current.completeAuthorization(router.query.code as string)
      await UserSession.Current.initialize()
      router.push('/')
    }
    if (router.query.code) authorize()
  }, [router, router.query.code])

  return <LinearProgress/>
}