const { ObjectId } = require('mongodb');

const { connectDB } = require('./connectDB');

const getAllHistoryTransactions = async () => {
    try {
        const task = async (collection) => await collection.find().toArray();
        const resp = await connectDB('investment', 'history', task);
        return resp;
    } catch (err) {
        return { success: false, error: err };
    }
}

const getAllHistoryTransWithQuery = async (query) => {
    try {
        const task = async (collection) => await collection.find(query).toArray();
        const resp = await connectDB('investment', 'history', task);
        return resp;
    } catch (err) {
        return { success: false, error: err };
    }
}

const getOneTransaction = async (id) => {
    try {
        const task = async (collection) => await collection.findOne({ _id: ObjectId(id) });
        const resp = await connectDB('investment', 'history', task);
        return resp;
    } catch (err) {
        return { success: false, error: err };
    }
}

const insertOneTransaction = async (cdata) => {
    const document = {
        date: cdata.date ? cdata.date : "",
        coin: cdata.coin ? cdata.coin : "",
        name: cdata.name ? cdata.name : "",
        open: cdata.open ? cdata.open : 0,
        high: cdata.high ? cdata.high : 0,
        low: cdata.low ? cdata.low : 0,
        close: cdata.close ? cdata.close : 0,
        quantity: cdata.quantity ? cdata.quantity : 0,
        createdAt: new Date(),
        lastUpdatedAt: new Date()
    }

    try {
        const task = async (collection) => await collection.insertOne(document);
        const resp = await connectDB('investment', 'history', task);
        return resp;
    } catch (err) {
        return { success: false, error: err };
    }
}

const insertManyHistoryTransactions = async (cdata) => {
    try {
        console.log('db/history.js inserManyHistoryTransactions cdata[0] - ', cdata[0])
        const task = async (collection) => await collection.insertMany(cdata);
        try {
            const resp = await connectDB('investment', 'history', task);
            return { success: true, data: resp.data };
        } catch (err) {
            console.log('db/history.js insertManyHistoryTransactions error-1 err - ', err)
            return { success: false, error: err };
        }
    } catch (err) {
        console.log('db/history.js insertManyHistoryTransactions error-2 err - ', err)
        return { success: false, error: err };
    }
}

const deleteOneTransaction = async (id) => {
    try {
        console.log(id)
        const task = async (collection) => await collection.deleteOne({ _id: ObjectId(id) });
        const resp = await connectDB('investment', 'history', task);
        return resp;
    } catch (err) {
        return { success: false, error: err };
    }
}

const updateOneTransaction = async (id, cdata) => {
    try {
        const query = { _id: ObjectId(id) };
        const task = async (collection) => await collection.findOne(query);
        const resp = await connectDB('investment', 'history', task);
        if (!resp.success)
            return { success: false, error: resp };
        try {
            const document = {
                $set: {
                    date: cdata.date ? cdata.date : resp.data.date,
                    coin: cdata.coin ? cdata.coin : resp.data.coin,
                    name: cdata.name ? cdata.name : resp.data.name,
                    open: cdata.open ? cdata.open : resp.data.open,
                    high: cdata.high ? cdata.high : resp.data.high,
                    low: cdata.low ? cdata.low : resp.data.low,
                    close: cdata.close ? cdata.close : resp.data.close,
                    quantity: cdata.quantity ? cdata.quantity : resp.data.quantity,
                    lastUpdatedAt: new Date()
                }
            };
            const task = async (collection) => await collection.updateOne(query, document);
            const resp1 = await connectDB('investment', 'history', task);
            return resp1;
        } catch (err) {
            return { success: false, error: err };
        }
    } catch (err) {
        return { success: false, error: err };
    }
}

module.exports = {
    getAllHistoryTransactions,
    getAllHistoryTransWithQuery,
    getOneTransaction,
    insertOneTransaction,
    insertManyHistoryTransactions,
    deleteOneTransaction,
    updateOneTransaction
};
