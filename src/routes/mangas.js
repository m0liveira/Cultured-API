const puppeteer = require('puppeteer');

const url = 'https://manga4life.com/search/';

module.exports = (app) => {
    const getAll = async (req, res) => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);

        // Wait for the dynamically loaded content to appear
        await page.waitForSelector('.top-15.ng-scope');

        // get images
        const images = await page.evaluate(() => {
            const content = document.querySelectorAll('.img-fluid');
            return Array.from(content).map((el) => el.src);
        });

        // get titles
        const titles = await page.evaluate(() => {
            const content = document.querySelectorAll('.SeriesName.ng-binding');
            return Array.from(content).map((el) => el.textContent);
        });

        // get authors
        const authors = await page.evaluate(() => {
            const content = document.querySelectorAll('div.row div.col-md-10.col-8 div.ng-scope:nth-of-type(1)');
            return Array.from(content).map((el) => {
                let newStr = '';

                const cleanedString = el.textContent.replace('·', '').replace(/[\n\t\u200B\u00A0]/g, ' ').trim().replace(/\s+/g, ' ');
                const arr = cleanedString.split(' ').slice(1).reverse().slice(2).reverse();

                arr.forEach((element) => {
                    newStr += `${element} `;
                });

                return newStr.trim().toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
            });
        });

        // get release dates
        const releases = await page.evaluate(() => {
            const content = document.querySelectorAll('div.row div.col-md-10.col-8 div.ng-scope:nth-of-type(1) span+a');
            return Array.from(content).map((el) => el.textContent);
        });

        // get status
        const status = await page.evaluate(() => {
            const content = document.querySelectorAll('div.row div.col-md-10.col-8 div.ng-scope:nth-of-type(2) a:nth-of-type(2)');
            return Array.from(content).map((el) => el.textContent.split(' ').shift());
        });

        // get chapters nº
        const chapters = await page.evaluate(() => {
            const content = document.querySelectorAll('div.row div.col-md-10.col-8 div.ng-scope:nth-of-type(3) a');
            return Array.from(content).map((el) => Number(el.textContent.split(' ').pop()));
        });

        // get genres
        const genres = await page.evaluate(() => {
            const content = document.querySelectorAll('div.row div.col-md-10.col-8 div:nth-of-type(4)');
            return Array.from(content).map((el) => {
                const cleanedString = el.textContent.replace(/[\n\t\u200B\u00A0]/g, ' ').trim().replace(/\s+/g, ' ');
                const newStr = cleanedString.replace('Genres: ', '');
                return newStr;
             });
        });

        await browser.close();

        const mangas = [];

        mangas.push({
            image: images[0],
            title: titles[0],
            author: authors[0],
            year: releases[0],
            status: status[0],
            chapters: chapters[0],
            genres: genres[0]
        });

        mangas.push({
            image: images[3],
            title: titles[3],
            author: authors[3],
            year: releases[3],
            status: status[3],
            chapters: chapters[3],
            genres: genres[3]
        });

        res.status(200).json(mangas);
    };

    return { getAll };
};