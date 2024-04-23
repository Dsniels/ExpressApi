
exports.paginacion = (Objeto, requestQuery) => {

    const page = requestQuery.query.page*1 || 1;
    const pageSize = requestQuery.query.pageSize*1 || 2;
    const skip = (page-1) * pageSize;

        return Objeto.skip(skip).limit(pageSize);

}