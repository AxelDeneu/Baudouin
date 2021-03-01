import axios from 'axios';
import Head from 'next/head'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import Layout from '../components/layout'
import ResultsSkeleton from '../components/skeletons/resultsSkeleton'
import Providers from '../constants/providers'

const Manga = (props) => {
  return (
    <div className="w-1/3">
      <Link href={`/manga/${props.provider}/${props.url}`}>
        <div className="mb-2">
          <div style={{ position: 'relative', width: '150px', height: '225px' }} className="mx-auto">
            <Image 
              src={props.image}
              alt="Picture of the author"
              className="rounded-md shadow-sm cursor-pointer"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </Link>
      <div className="mb-2 text-xl font-bold text-black">{props.name}</div>
      <div className="text-black text-md opacity-70">{props.author}</div>
    </div>
  )
}

const formatResults = (r, provider) => {
  return (
    <div className="flex flex-wrap justify-center w-full max-w-6xl mx-auto">
      {r.results.map(manga => {
        return (
          <Manga 
            name={manga.name} 
            author={manga.author}
            key={manga.name} 
            image={manga.cover}
            url={manga.slug}
            provider={provider}
          />
        )
      })}
    </div>
  )
}

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState(<div></div>)
  const [provider, setProvider] = useState('scan-vf')

  const search = () => {
    setResults(<ResultsSkeleton/>)
    axios.get(`/api/search/${inputValue}?provider=${provider}`).then(results => {
      setResults(formatResults(results.data, provider))
    })
  }

  return (
    <Layout>
      <div className="w-full pt-44">
        <h1 className="text-6xl font-bold">
          Welcome to{' '}
          <span className="text-blue-600">
            Baudouin
          </span>
        </h1>

        <div className="mt-3 text-2xl">
          <div className="mb-20">Get started by searching your manga below</div>
          <div className="flex flex-row items-center justify-center">
            <select 
              onChange={(e) => setProvider(e.target.value)}
              className="h-10 px-3 py-2 text-sm text-gray-700 bg-gray-200 border border-gray-300 rounded-md rounded-r-none shadow-sm outline-none w-36 focus:outline-none focus:bg-gray-300" 
            >
              {Object.keys(Providers).map((key) => {
                return (
                  <option value={key}>{Providers[key].name}</option>
                )
              })}
            </select>
            <input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full h-10 max-w-xs px-3 py-2 text-lg bg-gray-200 border border-gray-300 shadow-sm outline-none focus:outline-none focus:bg-gray-100" 
              type="text" 
              name="search"
            />
            <button className="h-10 px-2 text-base text-white bg-gray-600 border-none rounded-md rounded-l-none shadow-none outline-none focus:outline-none focus:border-transparent" onClick={search}>OK</button>
          </div>
        </div>

        <div className="w-full pt-12 results">
          {results}
        </div>
      </div>
    </Layout>
  )
}
