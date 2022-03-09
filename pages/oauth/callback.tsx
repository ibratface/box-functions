import { LinearProgress } from "@mui/material";
import { useRouter } from "next/router"
import { useEffect } from "react"
import { Session } from "../../lib/session";


export default function OAuthCallback() {
  const router = useRouter()

  useEffect(() => {
    async function authorize() {
      await Session.Current.completeAuthorization(router.query.code as string)
      await Session.Current.initialize()
      router.push('/')
    }
    if (router.query.code) authorize()
  }, [router.query.code])

  return <LinearProgress/>
}