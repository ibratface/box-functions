import { LinearProgress } from "@mui/material";
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import { BoxContext } from "../../components/context";
import { UserAccount } from "../../lib/user-account";


export default function OAuthCallback() {
  const boxContext = useContext(BoxContext)
  const userAccount = new UserAccount(boxContext)
  const router = useRouter()

  useEffect(() => {
    async function authorize() {
      await userAccount.getAuthorization(router.query.code)
      router.push('/')
    }
    if (router.query.code) authorize()
  }, [router.query.code])

  return <LinearProgress>Authorizing...</LinearProgress>
}