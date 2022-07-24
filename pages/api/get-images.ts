import { NextApiRequest, NextApiResponse } from 'next'

import { allImages } from '../../models/image'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const images = await allImages()

  res.status(200).json(images)
}
