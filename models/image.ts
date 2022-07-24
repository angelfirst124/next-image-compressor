import fs from 'fs'
import images from '../data/images.json'
import Image from '../types/image'
import path from 'path'


export const findImageByName = async (name: string) => {
  return images.find(image => image.name.toUpperCase() === name.toUpperCase())
}

export const allImages = async () => {
  return images
}

export const searchImage = async (keyword: string) => {
  const allData = await allImages()
  const results = allData.filter(image =>
    image.name.toLowerCase().includes(keyword.toLowerCase()) ||
    image.uri.toLowerCase().includes(keyword.toLowerCase())
  )
  return results
}

export const postImage = async (payload: Image) => {
  const pushedImages = [...images, payload]
  const jsonString = JSON.stringify(pushedImages)
  const filePath = path.join(process.cwd(), 'data/images.json');
  fs.writeFile(filePath, jsonString, (err: any) => {
    if (err) {
        console.log('Error writing file', err)
        return 0;
    } else {
        console.log('Successfully wrote file')
        return 1;
    }
  })
  return 1;
}
