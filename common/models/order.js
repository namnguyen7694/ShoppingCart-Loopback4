'use strict';
const _ = require('lodash');
const app = require('../../server/server')

module.exports = function(Order) {
    Order.observe("after save", async ctx => {
        const ModelOrderItem = app.models.OrderItem;
        const instance = ctx.instance;
        const products = _.get(ctx, "options.req.body.products", []);

        await products.forEach (async prod =>{
            await ModelOrderItem.create({
                orderId: instance.__data.id,
                productId: prod.productId,
                quantity: prod.quantity
            })
        })
    })

    Order.afterRemote("findById", async ctx => {
        const result = ctx.result;
        const account = await result.accounts.get();   
        //lam tiep tra ve thong tin account
        const ModelOrderItem = app.models.OrderItem;
        const orderItems = await ModelOrderItem.find({
            where : {
                orderId : result.__data.id
            }})

        const productList = [];
        for (let i=0; i< orderItems.length; i++) {
            const item = orderItems[i];
            const detailItem = await item.product.get()
            if(detailItem) productList.push({
                ...detailItem.__data,
                quantity: item.__data.quantity
            })
        }
        const totalPrice = productList
            .map(prod => prod.price*prod.quantity)
            .reduce((a,b) => a + b, 0);

        result.__data.productList = productList;
        result.__data.totalPrice = totalPrice;
        result.__data.accountInfo = account.__data.email;
    })
    
};

/**
 * @todo sau khi post order -->chi tiet order gom product vs qty
 */