'use strict';

module.exports = function(Product) {
    Product.beforeRemote("find", async ctx => {
        
    })
    Product.afterRemote("find", async ctx => {
        const result = ctx.result;

        for  (let i=0; i< result.length; i++) {
            const prod = result[i];
            const cate = await prod.category.get();
            if(cate) result[i].__data.categoryName = cate.name;
        }
    })
    Product.afterRemote("findById", async ctx => {
        const result = ctx.result;
        const cate = await result.category.get();
        if(cate) result.__data.categoryName = cate.name;
    })
};
