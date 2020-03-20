const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.MONGO_CLUSTER}-aqf8c.mongodb.net/test?retryWrites=true&w=majority`

const connectDB = async (db, table, task) => {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });

        try {
            const collection = client.db(db).collection(table);
            const data = await task(collection);
            client.close();
            if (!data) {
                // data not found
                return { code: 404, error: 'data not found' }
            }
            return { code: 200, data: data };
        } catch (err) {
            // collection operation error
            client.close();
            return { code: 400, error: err };
        }
    } catch (err) {
        // database connection error
        return { code: 500, error: err };
    }
}

module.exports = { connectDB };
