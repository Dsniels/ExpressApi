
const paginacion = (Objeto, requestQuery) => {

    const page = requestQuery.page*1 || 1;
    const pageSize = requestQuery.pageSize*1 || 2;
    const skip = (page-1) * pageSize;

        return Objeto.skip(skip).limit(pageSize);

};

module.exports = paginacion;