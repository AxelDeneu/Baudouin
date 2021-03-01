import fs from 'fs'
import axios from 'axios'

import Providers from '../../../constants/providers';

export default function Manga(req, res) {
	const {
		query: { manga, provider },
	} = req

	if(!manga || !provider) {
		res.status(400).json({
			err: "Query is missing manga name or prodivder"
		});
	}

	if(!fs.existsSync(`./providers/${provider}.js`)) {
		res.status(400).json({
			err: "The provider requested doesn't exists"
		});
	}

	const p = require(`../../../providers/${provider}.js`)

	p.getManga(manga).then(async (r) => {
		await res.status(200).json({
			manga: manga,
			data: r
		});
	}).catch(err => {
		console.log(err)
		res.status(500).end()
	})
}
