const puppeteer = require('puppeteer');

const url = 'https://manga4life.com/search/';

async function loadAllMangas(page) {
    try {
        let buttonExists = true;
        while (buttonExists) {
            buttonExists = await page.evaluate(() => {
                const button = document.querySelector('button.btn.btn-outline-primary.form-control.top-15.bottom-5.ng-scope');
                if (!button) return false;
                button.click();
                return true;
            });
            await new Promise((resolve) => setTimeout(resolve, 1));
        }
    } catch (error) {
        console.error(error);
    }
}

async function getAvailableMangas(page) {
    // get all elements
    const mangas = await page.evaluate(() => {
        // get values from the scrapped content
        const getScrappedContent = (element, querySelector, attribute) => {
            const content = element.querySelector(querySelector);
            return content ? content[attribute] : null;
        };

        const rows = document.querySelectorAll('div.top-15.ng-scope');
        return Array.from(rows).map((row) => {
            const image = getScrappedContent(row, '.img-fluid', 'src');

            const title = getScrappedContent(row, '.SeriesName.ng-binding', 'textContent');

            const link = getScrappedContent(row, '.SeriesName.ng-binding', 'href');

            const author = row.querySelector('div.row div.col-md-10.col-8 div.ng-scope:nth-of-type(1)');
            let newStr = '';
            const cleanedString = author.textContent.replace('·', '').replace(/[\n\t\u200B\u00A0]/g, ' ').trim().replace(/\s+/g, ' ');
            const arr = cleanedString.split(' ').slice(1).reverse().slice(2).reverse();

            arr.forEach((element) => {
                newStr += `${element} `;
            });
            const formatedAuthor = newStr.trim().toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase());

            const year = getScrappedContent(row, 'div.row div.col-md-10.col-8 div.ng-scope:nth-of-type(1) span+a', 'textContent');

            const unrefinedStatus = getScrappedContent(row, 'div.row div.col-md-10.col-8 div.ng-scope:nth-of-type(2) a:nth-of-type(2)', 'textContent');
            let status = null;
            if (unrefinedStatus !== null) { status = unrefinedStatus.split(' ').shift(); }

            const unrefinedChapters = getScrappedContent(row, 'div.row div.col-md-10.col-8 div.ng-scope:nth-of-type(3) a', 'textContent');
            let chapters = null;
            if (unrefinedChapters !== null) { chapters = Number(unrefinedChapters.split(' ').pop()); }

            const unrefinedGenres = getScrappedContent(row, 'div.row div.col-md-10.col-8 div:nth-of-type(4)', 'textContent');
            let genres = null;
            if (unrefinedGenres !== null) { genres = unrefinedGenres.replace(/[\n\t\u200B\u00A0]/g, ' ').trim().replace(/\s+/g, ' ').replace('Genres: ', ''); }

            let popular = getScrappedContent(row, 'i.fas.fa-fire-alt.ng-scope', 'title');
            popular === 'Popular Manga' ? popular = true : popular = false;

            return {
                image,
                title,
                author: formatedAuthor,
                year,
                status,
                chapters,
                genres,
                popular,
                link
            };
        });
    });

    return mangas;
}

module.exports = (app) => {
    const getAll = async (req, res) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url);

            await page.waitForSelector('div.top-15.ng-scope');

            await loadAllMangas(page);

            const mangas = await getAvailableMangas(page);

            await browser.close();

            const body = { mangas, length: mangas.length, status: 200 };

            res.status(200).json(body);
        } catch (error) {
            res.status(500).json({ message: 'Error: something happened while scraping the website', error });
        }
    };

    const getTrending = async (req, res) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url);

            await page.waitForSelector('div.top-15.ng-scope');

            const mangas = await getAvailableMangas(page);

            await browser.close();

            const body = { mangas, length: mangas.length, status: 200 };

            res.status(200).json(body);
        } catch (error) {
            res.status(500).json({ message: 'Error: something happened while scraping the website', error });
        }
    };

    return { getAll, getTrending };
};