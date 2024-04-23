
exports.paginacion = (request, Objeto) => {
    const page = request.query.page*1 || 1;
    const pageSize = request.query.pageSize*1 || 2;
    const skip = (page-1) * pageSize;

    const objeto = Objeto.find()
}