import fs from 'fs'
import axios from 'axios'

import Providers from '../../../constants/providers';

export default function Search(req, res) {
	const {
		query: { search, provider },
	} = req

	if(!search || !provider) {
		res.status(400).json({
			err: "Query is missing search query or prodivder"
		});
	}

	if(!fs.existsSync(`./providers/${provider}.js`)) {
		res.status(400).json({
			err: "The provider requested doesn't exists"
		});
	}

	const p = require(`../../../providers/${provider}.js`)

	p.search(search).then(async (r) => {
		await Promise.all(r.map(async manga => {
			if(!fs.existsSync(`./public/${manga.cover}`)) {
				await downloadFile(manga, p, provider)
			}
		}))
		await res.status(200).json({
			search: search,
			results: r
		});
	}).catch(err => {
		res.status(500).end()
	})
}

const downloadFile = async (manga, p, provider) => {
	const writer = fs.createWriteStream(`./public${manga.cover}`)
	let url = p.informations.imagesRootURL.replace('%manga%', manga.slug)
	if(manga.imageUrl)
		url = manga.imageUrl

	return axios({
		method: "GET",
		responseType: 'stream',
		url: p.informations.imagesRootURL.replace('%manga%', manga.slug)
	}).then(downloadedImage => {
		return new Promise((resolve, reject) => {
			downloadedImage.data.pipe(writer);
			let error = null;
			writer.on('error', err => {
				error = err;
				writer.close();
				reject(err);
			});
			writer.on('close', () => {
				if (!error) {
					resolve(true);
				}
				//no need to call the reject here, as it will have been called in the
				//'error' stream;
			});
		});
	}).catch(err => {
		console.log(err)
	})
}
