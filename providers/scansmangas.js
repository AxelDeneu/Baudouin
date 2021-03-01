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

export const informations = Providers['scansmangas']

export const search = (queryString) => {
    return new Promise(async (resolve, reject) => {
        const res = await axios.get(informations.baseURL + '?post_type=manga&s=' + queryString);

        fs.access('./public/images/scansmangas', (error) => {
            if(error) {
                fs.mkdir('./public/images/scansmangas', (err) => {
                    if(err)
                        return false
                })
            }
        })

        const $ = await cheerio.load(res.data)
        const mangas = $('.trending > .bs')

        if(res.data) {
            let finalArray = []
            await mangas.each(m => {
                const url = $(mangas[m]).find('.bsx > a').attr('href');
                const mangaName = url.replace('https://scansmangas.xyz/manga/', '').replace('/', '')
                const imgFile = `${mangaName}.jpg`

                finalArray.push({
                    name: $(mangas[m]).find('.bsx .bigor .tt').text().trim(),
                    author: "",
                    url: $(mangas[m]).find('.bsx > a').attr('href'),
                    cover: `/images/scansmangas/${imgFile}`,
                    slug: mangaName,
                    imageUrl: $(mangas[m]).find('.bsx .limit img').attr('src')
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
        const res = await axios.get(informations.baseURL + 'manga/' + queryString);
        const $ = await cheerio.load(res.data)
        const originalName = await $('#main > div > div.bigcontent > div.infox > span').text().trim();
        const name = await $('#main > div > div.bigcontent > div.infox > h1').text().trim()
        const description = await $('#main > div > div.pads > div > div.entry-content.entry-content-single').text().trim()
        const finalChapters = [];
        const chapters = await $('#chapter_list li');
        await chapters.each(chapter => {
            const finalVolumes = [];
            const volumes = $(chapters[chapter]).find('.lchx.desktop')
            volumes.each(v => {
                const href = $(volumes[v]).find('a').attr('href')
                finalVolumes.push({
                    name: $(volumes[v]).find('a chapter').text().trim(),
                    url: href,
                    slug: href.replace(informations.baseURL + 'scan-' + queryString + '-', '').replace('/', '')
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
        const res = await axios.get(informations.baseURL + '/scan-' + manga + '-' + chapter + '/?im=1');
        const $ = await cheerio.load(res.data)
        const pages = await $('div.postbody div.other-opts a:not(:first-child):not(:nth-last-child(2))')
        const pagesCount = pages.length
        const pagesData = pages.map(async page => {
            const url = informations.baseURL + 'scans/' + manga + '/' + chapter + '/' + (page+1) + '.jpg';
            return {
                page: page + 1,
                image: url
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
            console.log(page)
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
                pdfDoc.end();
                resolve(fs.createReadStream(`./public/pdf/${manga}-${chapter}.pdf`))
            })
        })
    })
}