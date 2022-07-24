import { NextApiRequest, NextApiResponse } from 'next'

import { searchImage } from '../../models/image'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const results = await searchImage(req.query.q.toString())

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ results }))
}
