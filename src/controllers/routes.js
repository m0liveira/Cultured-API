module.exports = (app) => {
    app.route('/mangas').get(app.routes.mangas.getAll);
    app.route('/mangas/trending').get(app.routes.mangas.getTrending);
};