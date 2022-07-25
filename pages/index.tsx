import { NextPage } from 'next'
import { useState, ChangeEvent, useEffect } from 'react'
import { useS3Upload } from "next-s3-upload"
import Card from "react-bootstrap/Card"
import imageCompression from "browser-image-compression"

import Layout from '../components/layout'
import getApiData from '../utils/get-api-data'
import postApiData from '../utils/post-api-data'
import Image from '../types/image'
import Search from '../components/search'

const Page: NextPage = () => {
  let { uploadToS3 } = useS3Upload()
  const [images, setImages] = useState<Image[]>()
  const [isLoaded, setIsLoaded] = useState(true)
  const [compressedLink, setCompressedLink] = useState("http://navparivartan.in/wp-content/uploads/2018/11/placeholder.png")
  const [originalLink, setOriginalLink] = useState("")
  const [originalImage, setOriginalImage] = useState<File>()
  const [clicked, setClicked] = useState(false)
  const [uploadImage, setUploadImage] = useState(false)
  const [outputFileName, setOutputFileName] = useState("compress")

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const imageFile:File = e.target.files[0]
    setOriginalLink(URL.createObjectURL(imageFile))
    setOriginalImage(imageFile)
    setOutputFileName(imageFile.name)
    setUploadImage(true)
  }

  const handleClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault()

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 500,
      useWebWorker: true
    }

    if (options.maxSizeMB >= originalImage.size / 1024) {
      alert("Image is too small, can't be Compressed!")
      return 0
    }

    let output: File
    imageCompression(originalImage, options).then(async x => {
      output = x
      const downloadLink = URL.createObjectURL(output);
      let { url } = await uploadToS3(output)
      postApiData('/api/post-image',{
        name: output.name,
        uri: url,
        size: output.size,
        created: new Date(),
      }).then(res => {
        if(res === 'success') {
          setIsLoaded(true)
        }
      })
      setCompressedLink(downloadLink)
    });

    setClicked(true)
    return 1;
  }

  useEffect(() => {
    const fetchData = async () => {
      if(isLoaded) {
        const resData = await getApiData('/api/get-images')
        setImages(resData)
        setIsLoaded(false)
      }
    }
    fetchData()
  }, [isLoaded])

  return <Layout>
    <div className="m-5">
      <div className="text-light text-center">
        <h1>Three Simple Steps</h1>
        <h3>1. Upload Image</h3>
        <h3>2. Click on Compress</h3>
        <h3>3. Download Compressed Image</h3>
      </div>

      <div className="row mt-5">
        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
          {uploadImage ? (
            <Card.Img
              className="ht"
              variant="top"
              src={originalLink}
            ></Card.Img>
          ) : (
            <Card.Img
              className="ht"
              variant="top"
              src="http://navparivartan.in/wp-content/uploads/2018/11/placeholder.png"
            ></Card.Img>
          )}
          <div className="d-flex justify-content-center">
            <input
              type="file"
              accept="image/*"
              className="mt-2 btn btn-dark w-75"
              onChange={handleInput}
            />
          </div>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-12 mb-5 mt-5 col-sm-12 d-flex justify-content-center align-items-baseline">
          <br />
          {outputFileName ? (
            <button
              type="button"
              className=" btn btn-dark"
              onClick={handleClick}
            >
              Compress
            </button>
          ) : (
            <></>
          )}
        </div>

        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 mt-3">
          <Card.Img variant="top" src={compressedLink}></Card.Img>
          {clicked ? (
            <div className="d-flex justify-content-center">
              <a
                href={compressedLink}
                download={outputFileName}
                className="mt-2 btn btn-dark w-75"
              >
                Download
              </a>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
    <h2 className="mt-10 text-xl font-semibold text-center">Search Compressed Images</h2>
    <Search 
      images={images}
    />
  </Layout>
}

export default Page
