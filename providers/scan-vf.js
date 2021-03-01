// Japscan provider functions

import fs from 'fs'
import axios from 'axios'
import cheerio from 'cheerio'
const PDFDocument = require('pdfkit');
const sizeOf = require('buffer-image-size');

import Providers from '../constants/providers'

/*
Return structure should be an array of 10 or less results that match the query
*/

export const informations = Providers['scan-vf']

export const search = (queryString) => {
    return new Promise(async (resolve, reject) => {
        const res = await axios.get(informations.baseURL + '/search?query=' + queryString);

        fs.access('./public/images/scan-vf', (error) => {
            if(error) {
                fs.mkdir('./public/images/scan-vf', (err) => {
                    if(err)
                        return false
                })
            }
        })

        if(res.data) {
            let finalArray = []
            await res.data.suggestions.forEach(m => {
                const imgFile = `${m.data}.jpg`

                finalArray.push({
                    name: m.value,
                    author: "",
                    url: informations.baseURL + m.data,
                    cover: `/images/scan-vf/${imgFile}`,
                    slug: m.data
                })
            })
            return await resolve(finalArray)
        } else {
            return resolve([])
        }
    })
}

export const getManga = (queryString) => {
    return new Promise(async (resolve, reject) => {
        const res = await axios.get(informations.baseURL + queryString);
        const $ = await cheerio.load(res.data)
        const originalName = await $('body > div.wrapper > div > div:nth-child(1) > div > div:nth-child(3) > div.col-sm-8 > dl > dd:nth-child(4)').text().trim();
        const name = await $('body > div.wrapper > div > div:nth-child(1) > div > h2').text().trim()
        const description = await $('body > div.wrapper > div > div:nth-child(1) > div > div:nth-child(5) > div > div > p').text().trim()
        const finalChapters = [];
        const chapters = await $('ul.chapters > li');
        await chapters.each(chapter => {
            const finalVolumes = [];
            const volumes = $(chapters[chapter]).find('h5')
            volumes.each(v => {
                const href = $(volumes[v]).find('a').attr('href')
                finalVolumes.push({
                    name: $(volumes[v]).find('a').text().trim(),
                    url: href,
                    slug: href.replace(informations.baseURL + queryString + '/', '')
                })
            })
            finalChapters.push({
                name: $(chapters[chapter]).text().trim(),
                volumes: finalVolumes
            })
        })
        resolve({
            name: name,
            altName: originalName,
            description: description,
            chapters: finalChapters
        })
    })
}

export const getMangaChapter = (manga, chapter) => {
    return new Promise(async (resolve, reject) => {
        const res = await axios.get(informations.baseURL + '/' + manga + '/' + chapter + '/1');
        const $ = await cheerio.load(res.data)
        const pages = await $('#page-list > option')
        const pagesCount = pages.length
        const pagesData = pages.map(async page => {
            const url = informations.baseURL + manga + '/' + chapter + '/' + (page+1);
            const result = await axios.get(url)
            const $ = cheerio.load(result.data)
            if($('#ppp img').attr('src')) {
                const image = $('#ppp img').attr('src').trim()
                return {
                    page: page + 1,
                    image: image
                }
            }
        }).get();
        Promise.all(pagesData).then(result => {
            resolve({
                pagesCount: pagesCount,
                pages: result
            })
        })
    })
}

export const downloadChapter = (pages, manga, chapter) => {
    return new Promise(async (resolve, reject) => {
        const pagesData = pages.map(async page => {
            const image = await axios({
                method: "GET",
                url: page.image,
                responseType: 'arraybuffer'
            })
            return image.data;
        })
        Promise.all(pagesData).then(images => {
            const pdfDoc = new PDFDocument({
                autoFirstPage: false,
                margin: 0
            });
            pdfDoc.pipe(fs.createWriteStream(`./public/pdf/${manga}-${chapter}.pdf`))
            const imagesData = images.map((image, index) => {
                const buff = new Buffer.from(image);
                const size = sizeOf(buff)
                console.log(size)
                let layout = 'portrait';
                let pSize = [
                    size.width,
                    size.height
                ]
                if(size.width > size.height) {
                    layout = 'landscape'
                    pSize = [
                        size.height,
                        size.width
                    ]
                }
                pdfDoc.addPage({
                    margin: 0,
                    layout: layout,
                    size: pSize
                })
                pdfDoc.image(buff, 0, 0, {
                    width: size.width, 
                    height: size.height
                });
            })
            Promise.all(imagesData).then(r => {
                console.log("TOTO")
                pdfDoc.end();
                resolve(fs.createReadStream(`./public/pdf/${manga}-${chapter}.pdf`))
            })
        })
    })
}