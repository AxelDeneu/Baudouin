import axios from 'axios';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Loader from "react-loader-spinner";

import Layout from '../../../components/layout'
import MangaSkeleton from '../../../components/skeletons/mangaSkeleton'

const DownloadFile = (props) => {
	return (
		<div className="flex justify-center w-full">
			<a href={`/pdf/${props.href}`} download={props.href} target="_blank" className="px-3 py-2 bg-blue-500 rounded-md">Download your volume</a>
		</div>
	)
}

const MangaInformations = (props) => {
	return (
		<div className="grid w-full max-w-6xl grid-cols-12 pt-32 gap-y-10 gap-x-4">
			<div className="col-span-8 text-left">
				<div className="w-full mb-12">
					<button className="mb-4"><Link href="/">{'< Back to the search'}</Link></button>
					<h1 className="text-4xl font-bold">{props.data.name}</h1>
					<h2 className="mb-4 text-2xl">{props.data.altName}</h2>
					<p>{props.data.description}</p>
				</div>
				<div className="w-full chapters">
					{props.data.chapters.map(chapter => {
						const [volumesHeight, setVolumesHeight] = useState(0)
						
						const handleVolumesHeight = () => {
							if(volumesHeight == 'auto')
								setVolumesHeight(0)
							else
								setVolumesHeight('auto')
						}

						return (
							<>
								<h3 onClick={handleVolumesHeight} className="w-full px-3 py-1 mb-2 text-xl bg-gray-200 rounded-md cursor-pointer">{chapter.name}</h3>
								<div className="pl-8 mb-2 overflow-hidden transition-all" style={{ height: volumesHeight }}>
									{chapter.volumes.map(volume => {
										const [modalVisibility, setModalVisibility] = useState('none')
										const [download, setDownload] = useState('')

										const handleModalVisibility = () => {
											if(modalVisibility == 'none')
												setModalVisibility('flex')
											else
												setModalVisibility('none')
										}

										const handleDownloadFile = (manga, chapter, provider) => {
											setDownload(() => {
												return (
													<div className="flex flex-row justify-center w-full">
														<Loader type="Puff" color="grey" />
													</div>
												)
											})
											axios.get(`/api/manga/download/${manga}/${chapter}?provider=${provider}`).then(results => {
												setDownload(<DownloadFile href={results.data.file} />)
											})
										}

										return (
											<div className="flex flex-row justify-between mb-2">
												<h4>{volume.name}</h4>
												<button onClick={handleModalVisibility} className="px-3 py-1 text-white bg-blue-500 rounded-md">Download</button>
												<div className="fixed top-0 left-0 flex-row items-center justify-center w-screen h-screen" style={{ display: modalVisibility }}>
													<div onClick={handleModalVisibility} className="absolute top-0 left-0 z-0 w-full h-full bg-black bg-opacity-20"></div>
													<div className="z-10 grid w-full max-w-2xl grid-cols-2 p-6 space-x-4 bg-white rounded-md">
														<div className="flex flex-row flex-wrap items-center justify-center h-48 border-2 border-gray-400 border-dashed rounded-md cursor-pointer">
															<button onClick={() => handleDownloadFile(props.manga, volume.slug, props.provider)} className="text-lg text-gray-400">PDF</button>
															{download}
														</div>
														<div className="flex flex-row items-center justify-center h-48 border-2 border-gray-400 border-dashed rounded-md cursor-pointer">
															<button className="w-full text-lg text-gray-400">
																Image ZIP
																<div className="text-sm text-gray-400">Soon...</div>
															</button>
														</div>
													</div>
												</div>
											</div>
										)
									})}
								</div>
							</>
						)
					})}
				</div>
			</div>
			<div className="col-span-4">
				<Image src={`/images/${props.provider}/${props.manga}.jpg`} width={300} height={400} className="rounded-md" />
			</div>
		</div>
	)
  }

export default function Manga() {
	const router = useRouter()
	const { provider, manga } = router.query

	const [mangaInformations, setMangaInformations] = useState(<MangaSkeleton/>)

	useEffect(() => {
		if(provider && manga) {
			axios.get(`/api/manga/${manga}?provider=${provider}`).then(results => {
				const d = results.data.data;
				setMangaInformations(
					<MangaInformations
						data={d}
						manga={manga}
						provider={provider}
					/>
				)
			})
		}
	}, []);

	return (
		<Layout>
			<div className="w-full max-w-6xl transition-all">
				{mangaInformations}
			</div>
		</Layout>
	)
}