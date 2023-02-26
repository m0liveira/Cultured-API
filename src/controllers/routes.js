module.exports = (app) => {
    app.route('/mangas').get(app.routes.mangas.getAll);
};