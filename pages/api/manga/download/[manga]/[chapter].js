import fs from 'fs'
import axios from 'axios'

import Providers from '../../../../../constants/providers';

export default function Chapter(req, res) {
	const {
		query: { manga, chapter, provider },
	} = req

	if(!manga || !provider || !chapter) {
		res.status(400).json({
			err: "Query is missing manga name or provider or chapter"
		});
	}

	if(!fs.existsSync(`./providers/${provider}.js`)) {
		res.status(400).json({
			err: "The provider requested doesn't exists"
		});
	}

	const p = require(`../../../../../providers/${provider}.js`)

	p.getMangaChapter(manga, chapter).then((r) => {
		p.downloadChapter(r.pages, manga, chapter).then((file) => {
			// res.writeHead(200, {
			// 	'Content-Type': 'application/pdf',
			// 	"Content-disposition": `attachment; filename="${manga}-${chapter}.pdf"`
			// });
			res.status(200).json({
				file: `${manga}-${chapter}.pdf`
			})
		})
	}).catch(err => {
		console.log(err)
		res.status(500).end()
	})
}
