const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.MONGO_CLUSTER}-aqf8c.mongodb.net/test?retryWrites=true&w=majority`

const connectDB = async (dbName, collectionName, task) => {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });

        try {
            const collection = client.db(dbName).collection(collectionName);
            // console.log('/db/connectDB - collection - ', collection)
            const data = await task(collection);
            console.log('/db/connectDB - data[0] - ', data[0])
            client.close();
            if (!data) {
                // data not found
                console.log('db/connectDB.js error-1')
                return { success: false, code: 404, error: 'data not found' }
            }
            return { success: true, code: 200, data: data };
        } catch (err) {
            // collection operation error
            console.log('db/connectDB.js error-2 err - ', err)
            client.close();
            return { success: false, code: 400, error: err };
        }
    } catch (err) {
        // database connection error
        console.log('db/connectDB.js error-3 err - ', err)
        return { success: false, code: 500, error: err };
    }
}

module.exports = { connectDB };
