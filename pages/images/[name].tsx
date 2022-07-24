import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import Layout from '../../components/layout'
import { findImageByName } from '../../models/image'
import Image from '../../types/image'

interface Props {
  image: Image | undefined
}

const Page: NextPage<Props> = ({ image }) => {
  return <Layout>
    <h1 className='mb-4 text-2xl font-bold'>Comporessed Images: {image.name}</h1>
    <Link href="/">
      <a className="text-black-400 hover:text-blue-600 hover:underline">
        ← Back to overview
      </a>
    </Link>
    <pre className='p-2 mt-6 text-sm text-gray-500 rounded bg-gray-50'>{JSON.stringify(image, undefined, 2)}</pre>
  </Layout>
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { name } = params
  const image = await findImageByName(name.toString())
  return {
    props: {
      image,
    }
  }
}

export default Page
