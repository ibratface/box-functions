import { NextApiRequest, NextApiResponse } from "next";
import { getBoxClientServiceAccount } from "../../lib/server/util";


function error(res, status = 404, e = null) {
  res.status(status)
  if (e) res.send(e)
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { folderId } = req.body
  try {
    const box = getBoxClientServiceAccount()
    try {
      await box.folders.get(folderId)
    }
    catch (e) {
      if (e.status === 400 && e.code === 'terms_of_service_required') {
        await box.termsOfService.updateUserStatus(e.context_info.tos_user_status_id, true)
      }
      else {
        throw e
      }
    }
    res.status(200).end()
  }
  catch (e) {
    error(res, 400, e)
  }
}