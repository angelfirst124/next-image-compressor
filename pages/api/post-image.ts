import { NextApiRequest, NextApiResponse } from 'next'

import { postImage } from '../../models/image'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const result: any = await postImage(req.body)
    if(result)
        res.status(200).json("success")
    else
        res.status(400).json("failed")
}
