
const paginacion = (Objeto, requestQuery) => {

    const page = Number(requestQuery.page) || 1;
    const pageSize = Number(requestQuery.pageSize) || 2;
    const skip = (page-1) * pageSize;

        return Objeto.skip(skip).limit(pageSize);

};

module.exports = paginacion;