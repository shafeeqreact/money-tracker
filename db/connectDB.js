const { MongoClient, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.MONGO_CLUSTER}-aqf8c.mongodb.net/test?retryWrites=true&w=majority`

const connectDB = async (task) => {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        
        try {
            const collection = client.db('income').collection('salary');
            const data = await task(collection);
            client.close();
            if(!data){
                // data not found
                return {code: 404, error: 'data not found'}
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

const getAllTransactions = async () => {
    try {
        const task = async (collection) => await collection.find().toArray();
        const data = await connectDB(task); 
        if(data && data.code !== 200)
            return { success: false, error: data}
        return { success: true, data: data };       
    } catch (err) {
        return { success: false, error: err };
    }
}

const getOneTransaction = async (id) => {
    try {
        const task = async (collection) => await collection.findOne({ _id: ObjectId(id) });
        const data = await connectDB(task); 
        if(data && data.code !== 200)
            return { success: false, error: data}
        return { success: true, data: data };   
    } catch (err) {
        return { success: false, error: err };
    }
}

const insertOneTransaction = async (data) => {
    const document = {
        date: data.date,
        earnings: {
            basic: data.earnings.basic,
            hra: data.earnings.hra,
            conveyanceReimbursement: data.earnings.conveyanceReimbursement,
            adhoc: data.earnings.adhoc,
            transportAllowance: data.earnings.transportAllowance,
            ltaTaxable: data.earnings.ltaTaxable,
            medicalTaxable: data.earnings.medicalTaxable,
            odcBonus: data.earnings.odcBonus
        },
        deductions: {
            providentFund: data.deductions.providentFund,
            professionalTax: data.deductions.professionalTax,
            welfareFund: data.deductions.welfareFund
        },
        totalEarnings: data.totalEarnings,
        totalDeductions: data.totalDeductions,
        netPay: data.netPay,
        createdAt: new Date(),
        lastUpdatedAt: new Date()
    }

    try {
        const task = async (collection) => await collection.insertOne(document);
        const data = await connectDB(task); 
        if(data && data.code !== 200)
            return { success: false, error: data}
        return { success: true, data: data };   
    } catch (err) {
        return { success: false, error: err };
    }
}

const deleteOneTransaction = async (id) => {
    try {
        const task = async (collection) => await collection.deleteOne({ _id: ObjectId(id) });
        const data = await connectDB(task); 
        if(data && data.code !== 200)
            return { success: false, error: data}
        return { success: true, data: data };   
    } catch (err) {
        return { success: false, error: err };
    }
}

module.exports = {
    getAllTransactions,
    getOneTransaction,
    insertOneTransaction,
    deleteOneTransaction
};
