'use strict';

module.exports = function(Category) {
    Category.afterRemote("prototype.__create__products", async ctx => {        //__create__relatedModelNamePlural
        const result = ctx.result;
        const cate = await result.category.get();
        result.__data.categoryName = cate.name;
    })       

    Category.afterRemote("prototype.__get__products", async ctx => {        //__find__relatedModelNamePlural
        const result = ctx.result;
        for  (let i=0; i< result.length; i++) {
            const prod = result[i];
            const cate = await prod.category.get();
            result[i].__data.categoryName = cate.name;
        }
    })       
};
