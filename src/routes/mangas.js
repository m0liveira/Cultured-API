const puppeteer = require('puppeteer');

const url = 'https://manga4life.com/search/';

module.exports = (app) => {
    const getAll = async (req, res) => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);

        // Wait for the dynamically loaded content to appear
        await page.waitForSelector('.top-15.ng-scope');

        const html = await page.evaluate(() => {
            const divs = document.querySelectorAll('.top-15.ng-scope');
            return Array.from(divs).map((div) => div.innerHTML);
        });

        await browser.close();

        res.status(200).send(`<!DOCTYPE html>
        <html>
        <head>
            <title>Scraped Content</title>
        </head>
        <body>
            ${html}
        </body>
        </html>`);

        // const mangas = [{
        //     title: '#Killstagram',
        //     author: 'Ryoung',
        //     year: '2019',
        //     status: 'Ongoing',
        //     chapters: 43,
        //     genres: ['horror', 'josei', 'psychological']
        // }];

        // res.status(200).json(html);
    };

    return { getAll };
};