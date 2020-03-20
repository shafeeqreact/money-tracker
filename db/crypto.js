const { ObjectId } = require('mongodb');

const { connectDB } = require('./connectDB');

const getAllTransactions = async () => {
    try {
        const task = async (collection) => await collection.find().toArray();
        const resp = await connectDB('investment', 'transaction', task);
        if (resp && (resp.code !== 200 || resp.data.length === 0))
            return { code: 404, error: 'data not found' }
        return { code: 200, data: resp.data };
    } catch (err) {
        return { code: 400, error: err };
    }
}

const getOneTransaction = async (id) => {
    try {
        const task = async (collection) => await collection.findOne({ _id: ObjectId(id) });
        const resp = await connectDB('investment', 'transaction', task);
        if (resp && resp.code !== 200)
            return { code: 404, error: 'data not found' }
        return { code: 200, data: resp.data };
    } catch (err) {
        return { code: 400, error: err };
    }
}

const insertOneTransaction = async (cdata) => {
    const document = {
        date: cdata.date ? cdata.date : "99-99-9999",
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
        const resp = await connectDB('investment', 'transaction', task);
        if (resp && resp.code !== 200)
            return { code: 400, error: 'bad request' }
        return { code: 201, data: resp.data };
    } catch (err) {
        return { code: 400, error: err };
    }
}

const insertManyTransaction = async (cdata) => {
    const document = {
        date: cdata.date ? cdata.date : "99-99-9999",
        earnings: {
            basic: cdata.earnings.basic ? cdata.earnings.basic : 0,
            hra: cdata.earnings.hra ? cdata.earnings.hra : 0,
            conveyanceReimbursement: cdata.earnings.conveyanceReimbursement ? cdata.earnings.conveyanceReimbursement : 0,
            adhoc: cdata.earnings.adhoc ? cdata.earnings.adhoc : 0,
            transportAllowance: cdata.earnings.transportAllowance ? cdata.earnings.transportAllowance : 0,
            ltaTaxable: cdata.earnings.ltaTaxable ? cdata.earnings.ltaTaxable : 0,
            medicalTaxable: cdata.earnings.medicalTaxable ? cdata.earnings.medicalTaxable : 0,
            odcBonus: cdata.earnings.odcBonus ? cdata.earnings.odcBonus : 0
        },
        deductions: {
            providentFund: cdata.deductions.providentFund ? cdata.deductions.providentFund : 0,
            professionalTax: cdata.deductions.professionalTax ? cdata.deductions.professionalTax : 0,
            welfareFund: cdata.deductions.welfareFund ? cdata.deductions.welfareFund : 0
        },
        totalEarnings: cdata.totalEarnings ? cdata.totalEarnings : 0,
        totalDeductions: cdata.totalDeductions ? cdata.totalDeductions : 0,
        netPay: cdata.netPay ? cdata.netPay : 0,
        createdAt: new Date(),
        lastUpdatedAt: new Date()
    }

    try {
        const task = async (collection) => await collection.insertOne(document);
        const resp = await connectDB('investment', 'transaction', task);
        if (resp && resp.code !== 200)
            return { code: 400, error: 'bad request' }
        return { code: 201, data: resp.data };
    } catch (err) {
        return { code: 400, error: err };
    }
}

const deleteOneTransaction = async (id) => {
    try {
        console.log(id)
        const task = async (collection) => await collection.deleteOne({ _id: ObjectId(id) });
        const resp = await connectDB('investment', 'transaction', task);
        if (resp && resp.code !== 200)
            return { code: 404, error: 'data not found' };
        return { code: 200, data: resp.data };
    } catch (err) {
        return { code: 400, error: err };
    }
}

const updateOneTransaction = async (id, cdata) => {
    try {
        const query = { _id: ObjectId(id) };
        const task = async (collection) => await collection.findOne(query);
        const resp = await connectDB('investment', 'transaction', task);
        if (resp && resp.code !== 200)
            return { success: false, error: resp };
        try {
            const document = {
                $set: {
                    date: cdata.date ? cdata.date : resp.data.date,
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
            const data = await connectDB('investment', 'transaction', task);
            if (data && data.code !== 200)
                return { success: false, error: data }
            return { success: true, data: data };
        } catch (err) {
            return { success: false, error: err };
        }
    } catch (err) {
        return { success: false, error: err };
    }
}

module.exports = {
    getAllTransactions,
    getOneTransaction,
    insertOneTransaction,
    insertManyTransaction,
    deleteOneTransaction,
    updateOneTransaction
};
