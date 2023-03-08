module.exports = (app) => {
    app.route('/mangas').get(app.routes.mangas.getAll);
    app.route('/mangas/trending').get(app.routes.mangas.getTrending);
    app.route('/mangas/manga').get(app.routes.mangas.getManga);
};