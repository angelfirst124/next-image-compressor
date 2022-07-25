import { useCallback, useRef, useState, useEffect } from 'react'
import Link from 'next/link'

export default function Search({ images }) {
  const searchRef = useRef(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const controllerRef = useRef<AbortController | null>();

  const searchEndpoint = (query: string) => `/api/search?q=${query}`

  const onChange = useCallback((event) => {
    const query = event.target.value;
    setQuery(query)
  }, [])

  const onFocus = useCallback(() => {
    window.addEventListener('click', onClick)
  }, [])

  const onClick = useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      window.removeEventListener('click', onClick)
    }
  }, [])

  useEffect(() => {
    async function search() {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        if (query.length) {
          await fetch(searchEndpoint(query), {
            signal: controllerRef.current?.signal
          })
          .then(res => res.json())
          .then(res => {
            setResults(res.results)
          });

          controllerRef.current = null;
        } else {
          setResults(images)
        }
      } catch (e) {

      }
    }

    search();
  }, [query, images]);

  return (
    <div
      className="container mt-5 d-flex flex-column"
      ref={searchRef}
    >
      <input
        className="border-b-2 focus:outline-none border-gray-300 hover:border-blue-600 focus:border-blue-600 h-10 p-2 w-full"
        onChange={onChange}
        onFocus={onFocus}
        placeholder='Search posts'
        type='text'
        value={query}
      />
      { results?.length > 0 && 
          results.map((image, index) => (
            <Link href={`/images/${image.name.toLowerCase()}`} key={image.uri + index}>
              <a className='d-flex justify-content-between p-5 mt-5 text-gray-800 border border-gray-200 rounded-lg shadow-sm hover:border-blue-600 focus:border-blue-600 focus:ring focus:ring-blue-200 focus:outline-none'>
                <span>
                    {image.name}
                </span>
                <span className='ml-auto text-gray-500'>
                    {image.size}
                </span>
              </a>
            </Link>
          ))
      }
    </div>
  )
}
