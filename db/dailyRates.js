const { connectDB } = require('./connectDB');

const getAllDailyRatesWithQuery = async (query) => {
    try {
        const task = async (collection) => await collection.find(query).toArray();
        const resp = await connectDB('investment', 'daily-rates', task);
        return resp;
    } catch (err) {
        console.log('db/dailyRates.js getAllDailyRatesWithQuery error-1 err - ', err)
        return { success: false, error: err };
    }
}

const insertManyDailyRates = async (cdata) => {
    try {
        const task = async (collection) => await collection.insertMany(cdata);
        try {
            const resp = await connectDB('investment', 'daily-rates', task);
            return { success: true, data: resp.data };
        } catch (err) {
            console.log('db/dailyRates.js insertManyDailyRates error-1 err - ', err)
            return { success: false, error: err };
        }
    } catch (err) {
        console.log('db/dailyRates.js insertManyDailyRates error-2 err - ', err)
        return { success: false, error: err };
    }
}

const deleteAllDailyRates = async () => {
    try {
        const task = async (collection) => await collection.deleteMany({});
        const resp = await connectDB('investment', 'daily-rates', task);
        return resp;
    } catch (err) {
        console.log('db/dailyRates.js deleteAllDailyRates error-1 err - ', err)
        return { success: false, error: err };
    }
}

module.exports = {
    getAllDailyRatesWithQuery,
    insertManyDailyRates,
    deleteAllDailyRates
}