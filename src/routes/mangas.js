const puppeteer = require('puppeteer');

const url = 'https://manga4life.com/';

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
        return error;
    }
}

async function loadMoreMangas(page, iterations) {
    try {
        let buttonExists = true;
        for (let i = 1; i < iterations; i++) {
            if (!buttonExists) break;

            buttonExists = await page.evaluate(() => {
                const button = document.querySelector('button.btn.btn-outline-primary.form-control.top-15.bottom-5.ng-scope');
                if (!button) return false;
                button.click();
                return true;
            });
            await new Promise((resolve) => setTimeout(resolve, 1));
        }
    } catch (error) {
        return error;
    }
}

async function getAvailableMangas(page, skipTo) {
    try {
        // get all elements
        const mangas = await page.evaluate((skip) => {
            // get values from the scrapped content
            const getScrappedContent = (element, querySelector, attribute) => {
                const content = element.querySelector(querySelector);
                return content ? content[attribute] : null;
            };

            const rows = document.querySelectorAll('div.top-15.ng-scope');
            return Array.from(rows).slice(skip).map((row) => {
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
        }, skipTo);

        return mangas;
    } catch (error) {
        return error;
    }
}

async function getMangaDetails(page) {
    try {
        const pageContent = await page.evaluate(async () => {
            const getScrappedContent = (element, querySelector, attribute) => {
                const content = element.querySelector(querySelector);
                return content ? content[attribute] : null;
            };

            const getArrContent = (index) => {
                let temp = '';

                document.querySelectorAll(`div.BoxBody div.row ul.list-group.list-group-flush li:nth-of-type(${index}) a`).forEach((link) => {
                    temp += `${link.textContent}, `;
                });

                return temp;
            };

            const manga = document.querySelectorAll('div.BoxBody div.row')[2];
            const listElement = document.querySelectorAll('div.BoxBody div.row ul.list-group.list-group-flush li');

            const image = getScrappedContent(manga, '.img-fluid', 'src');
            const title = getScrappedContent(listElement[0], 'h1', 'textContent');

            const authors = getArrContent(3).trim().toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase()).slice(0, -1);

            const genres = getArrContent(4).slice(0, -2);

            const type = document.querySelector('div.BoxBody div.row ul.list-group.list-group-flush li:nth-of-type(5) a').textContent;

            const year = document.querySelector('div.BoxBody div.row ul.list-group.list-group-flush li:nth-of-type(6) a').textContent;

            const status = document.querySelector('div.BoxBody div.row ul.list-group.list-group-flush li:nth-of-type(8) a').textContent.split(' ')[0];

            const description = document.querySelector('div.BoxBody div.row ul.list-group.list-group-flush li:nth-of-type(10) div').textContent;

            return { image, title, authors, genres, type, year, status, description };
        });

        return pageContent;
    } catch (error) {
        return error;
    }
}

async function getChapters(page) {
    try {
        const pageContent = await page.evaluate(async () => {
            const getScrappedContent = (element, querySelector, attribute) => {
                const content = element.querySelector(querySelector);
                return content ? content[attribute] : null;
            };

            const chapters = document.querySelectorAll('div.BoxBody div.list-group.top-10.bottom-5.ng-scope a');

            return Array.from(chapters).map((chapter) => {
                const chapterNumber = getScrappedContent(chapter, 'span.ng-binding', 'textContent').replace(/\n\t+|[\n]/g, '').replace('Chapter', 'Chapter ');
                const releaseDate = getScrappedContent(chapter, 'span.float-right.d-none.d-md-inline.ng-binding', 'textContent');

                return { chapter: chapterNumber, date: releaseDate };
            });
        });

        return pageContent;
    } catch (error) {
        return error;
    }
}

async function getMangaPageContent(page) {
    const mangaDetails = await getMangaDetails(page);
    let mangaChapters = await getChapters(page);
    // const relatedMangas = await getMangaDetails(page);

    while (mangaChapters.length === 0) {
        mangaChapters = await getChapters(page);
    }

    const manga = {
        image: mangaDetails.image,
        title: mangaDetails.title,
        authors: mangaDetails.authors,
        genres: mangaDetails.genres,
        type: mangaDetails.type,
        year: mangaDetails.year,
        status: mangaDetails.status,
        description: mangaDetails.description,
        chapters: mangaChapters
    };

    return manga;
}

module.exports = (app) => {
    const getAll = async (req, res) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(`${url}search/`);

            await page.waitForSelector('div.top-15.ng-scope');

            await loadAllMangas(page);

            const mangas = await getAvailableMangas(page, 0);

            await browser.close();

            const body = { mangas, length: mangas.length, status: 200 };

            return res.status(200).json(body);
        } catch (error) {
            return res.status(500).json({ message: 'Error: something happened while scraping the website', error, status: 500 });
        }
    };

    const getTrending = async (req, res) => {
        try {
            const page = req.query.page || 1;
            if (page < 1) return res.status(400).json({ message: 'Error: Invalid parameter (page)', parameter: { details: 'page value has to be 1 or higher' }, status: 400 });

            let index = 0;
            const browser = await puppeteer.launch();
            const browserPage = await browser.newPage();
            await browserPage.goto(`${url}search/?sort=vm&desc=true`);

            await browserPage.waitForSelector('div.top-15.ng-scope');

            await loadMoreMangas(browserPage, page);

            page !== 1 ? index = (page - 1) * 30 : index = 0;

            const mangas = await getAvailableMangas(browserPage, index);

            await browser.close();

            const body = { mangas, length: mangas.length, status: 200 };

            return res.status(200).json(body);
        } catch (error) {
            return res.status(500).json({ message: 'Error: something happened while scraping the website', error, status: 500 });
        }
    };

    const getManga = async (req, res) => {
        try {
            const slug = req.query.slug || '';

            if (!req.query.slug) {
                return res.status(400).json({ message: 'Required query params missing, (parameter: slug)', status: 400 });
            }

            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(`${url}manga/${slug}`);

            await page.waitForSelector('div.BoxBody');

            await page.click('div.BoxBody div.list-group.top-10.bottom-5.ng-scope div.ShowAllChapters');

            const manga = await getMangaPageContent(page);

            await browser.close();

            return res.status(200).json({ manga, slug, url: `${url}manga/${slug}`, status: 200 });
        } catch (error) {
            return res.status(500).json({ message: 'Error: something happened while scraping the website', error, status: 500 });
        }
    };

    return { getAll, getTrending, getManga };
};