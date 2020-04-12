const { ObjectId } = require('mongodb');

const { connectDB } = require('./connectDB');

const getAllTransactions = async () => {
    try {
        const task = async (collection) => await collection.find().toArray();
        const resp = await connectDB('investment', 'transactions', task);
        return resp;
    } catch (err) {
        return { success: false, error: err };
    }
}

const getAllTransWithQuery = async (query) => {
    try {
        const task = async (collection) => await collection.find(query).toArray();
        const resp = await connectDB('investment', 'transactions', task);
        return resp;
    } catch (err) {
        return { success: false, error: err };
    }
}

const getOneTransaction = async (id) => {
    try {
        const task = async (collection) => await collection.findOne({ _id: ObjectId(id) });
        const resp = await connectDB('investment', 'transactions', task);
        return resp;
    } catch (err) {
        return { success: false, error: err };
    }
}

const insertOneTransaction = async (cdata) => {
    const document = {
        date: cdata.date ? cdata.date : new Date(),
        coin: cdata.coin ? cdata.coin : "",
        name: cdata.name ? cdata.name : "",
        exchange: cdata.exchange ? cdata.exchange : "",
        type: cdata.type ? cdata.type : "",
        quantity: cdata.quantity ? cdata.quantity : 0,
        rate: cdata.rate ? cdata.rate : 0,
        amount: cdata.amount ? cdata.amount : 0,
        fee: cdata.fee ? cdata.fee : 0,
        totalAmount: cdata.totalAmount ? cdata.totalAmount : 0,
        toDateQuantity: cdata.toDateQuantity ? cdata.toDateQuantity : 0,
        toDateRate: cdata.toDateRate ? cdata.toDateRate : 0,
        toDateAmount: cdata.toDateAmount ? cdata.toDateAmount : 0,
        toDateFee: cdata.toDateFee ? cdata.toDateFee : 0,
        toDateTotalAmount: cdata.toDateTotalAmount ? cdata.toDateTotalAmount : 0,
        createdAt: new Date(),
        lastUpdatedAt: new Date()
    }

    try {
        const task = async (collection) => await collection.insertOne(document);
        const resp = await connectDB('investment', 'transactions', task);
        return resp;
    } catch (err) {
        return { success: false, error: err };
    }
}

const insertManyTransaction = async (cdata) => {
    try {
        const task = async (collection) => await collection.insertMany(cdata);
        const resp = await connectDB('investment', 'transactions', task);
        return resp;
    } catch (err) {
        return { success: false, error: err };
    }
}

const deleteOneTransaction = async (id) => {
    try {
        console.log(id)
        const task = async (collection) => await collection.deleteOne({ _id: ObjectId(id) });
        const resp = await connectDB('investment', 'transactions', task);
        return resp;
    } catch (err) {
        return { success: false, error: err };
    }
}

const updateOneTransaction = async (id, cdata) => {
    try {
        const query = { _id: ObjectId(id) };
        const task = async (collection) => await collection.findOne(query);
        const resp = await connectDB('investment', 'transactions', task);
        if (!resp.success)
            return { success: false, error: resp };
        try {
            const document = {
                $set: {
                    date: cdata.date ? cdata.date : resp.data.date,
                    coin: cdata.coin ? cdata.coin : resp.data.coin,
                    name: cdata.name ? cdata.name : resp.data.name,
                    exchange: cdata.exchange ? cdata.exchange : resp.data.exchange,
                    type: cdata.type ? cdata.type : resp.data.type,
                    quantity: cdata.quantity ? cdata.quantity : resp.data.quantity,
                    rate: cdata.rate ? cdata.rate : resp.data.rate,
                    amount: cdata.amount ? cdata.amount : resp.data.amount,
                    fee: cdata.fee ? cdata.fee : resp.data.fee,
                    totalAmount: cdata.totalAmount ? cdata.totalAmount : resp.data.totalAmount,
                    toDateQuantity: cdata.toDateQuantity ? cdata.toDateQuantity : resp.data.toDateQuantity,
                    toDateRate: cdata.toDateRate ? cdata.toDateRate : resp.data.toDateRate,
                    toDateAmount: cdata.toDateAmount ? cdata.toDateAmount : resp.data.toDateAmount,
                    toDateFee: cdata.toDateFee ? cdata.toDateFee : resp.data.toDateFee,
                    toDateTotalAmount: cdata.toDateTotalAmount ? cdata.toDateTotalAmount : resp.data.toDateTotalAmount,
                    lastUpdatedAt: new Date()
                }
            };
            const task = async (collection) => await collection.updateOne(query, document);
            const resp1 = await connectDB('investment', 'transactions', task);
            return resp1;
        } catch (err) {
            return { success: false, error: err };
        }
    } catch (err) {
        return { success: false, error: err };
    }
}

module.exports = {
    getAllTransactions,
    getAllTransWithQuery,
    getOneTransaction,
    insertOneTransaction,
    insertManyTransaction,
    deleteOneTransaction,
    updateOneTransaction
};
