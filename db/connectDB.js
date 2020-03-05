const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URL;

const connectDB = async (task) => {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        const collection = client.db('income').collection('salary');

        try {
            const data = await task(collection);
            client.close();
            return {
                success: true,
                data: data
            }
        } catch (err) {
            client.close();
            return {
                success: false,
                error: err
            }
        }
    } catch (err) {
        return {
            success: false,
            error: err
        }
    }
}

module.exports = connectDB;
