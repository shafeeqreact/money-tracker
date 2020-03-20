const { ObjectId } = require('mongodb');

const { connectDB } = require('./connectDB');

const getAllTransactions = async () => {
    try {
        const task = async (collection) => await collection.find().toArray();
        const resp = await connectDB('income', 'salary', task);
        return resp;
    } catch (err) {
        return { success: false, error: err };
    }
}

const getOneTransaction = async (id) => {
    try {
        const task = async (collection) => await collection.findOne({ _id: ObjectId(id) });
        const resp = await connectDB('income', 'salary', task);
        return resp;
    } catch (err) {
        return { success: false, error: err };
    }
}

const insertOneTransaction = async (cdata) => {
    const document = {
        date: cdata.date ? cdata.date : "9999-99-99",
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
        const resp = await connectDB('income', 'salary', task);
        return resp;
    } catch (err) {
        return { success: false, error: err };
    }
}

const deleteOneTransaction = async (id) => {
    try {
        console.log(id)
        const task = async (collection) => await collection.deleteOne({ _id: ObjectId(id) });
        const resp = await connectDB('income', 'salary', task);
        return resp;
    } catch (err) {
        return { success: false, error: err };
    }
}

const updateOneTransaction = async (id, cdata) => {
    try {
        const query = { _id: ObjectId(id) };
        const task = async (collection) => await collection.findOne(query);
        const resp = await connectDB('income', 'salary', task);
        if (!resp.success)
            return { success: false, error: resp.error };
        try {
            const document = {
                $set: {
                    date: cdata.date ? cdata.date : resp.data.date,
                    earnings: {
                        basic: cdata.earnings.basic ? cdata.earnings.basic : (cdata.earnings.basic === 0 ? 0 : resp.data.earnings.basic),
                        hra: cdata.earnings.hra ? cdata.earnings.hra : (cdata.earnings.hra === 0 ? 0 : resp.data.earnings.hra),
                        conveyanceReimbursement: cdata.earnings.conveyanceReimbursement ? cdata.earnings.conveyanceReimbursement : (cdata.earnings.conveyanceReimbursement === 0 ? 0 : resp.data.earnings.conveyanceReimbursement),
                        adhoc: cdata.earnings.adhoc ? cdata.earnings.adhoc : (cdata.earnings.adhoc === 0 ? 0 : resp.data.earnings.adhoc),
                        transportAllowance: cdata.earnings.transportAllowance ? cdata.earnings.transportAllowance : (cdata.earnings.transportAllowance === 0 ? 0 : resp.data.earnings.transportAllowance),
                        ltaTaxable: cdata.earnings.ltaTaxable ? cdata.earnings.ltaTaxable : (cdata.earnings.ltaTaxable === 0 ? 0 : resp.data.earnings.ltaTaxable),
                        medicalTaxable: cdata.earnings.medicalTaxable ? cdata.earnings.medicalTaxable : (cdata.earnings.medicalTaxable === 0 ? 0 : resp.data.earnings.medicalTaxable),
                        odcBonus: cdata.earnings.odcBonus ? cdata.earnings.odcBonus : (cdata.earnings.odcBonus === 0 ? 0 : resp.data.earnings.odcBonus)
                    },
                    deductions: {
                        providentFund: cdata.deductions.providentFund ? cdata.deductions.providentFund : (cdata.deductions.providentFund === 0 ? 0 : resp.data.deductions.providentFund),
                        professionalTax: cdata.deductions.professionalTax ? cdata.deductions.professionalTax : (cdata.deductions.professionalTax === 0 ? 0 : resp.data.deductions.professionalTax),
                        welfareFund: cdata.deductions.welfareFund ? cdata.deductions.welfareFund : (cdata.deductions.welfareFund === 0 ? 0 : resp.data.deductions.welfareFund)
                    },
                    totalEarnings: cdata.totalEarnings ? cdata.totalEarnings : (cdata.totalEarnings === 0 ? 0 : resp.data.totalEarnings),
                    totalDeductions: cdata.totalDeductions ? cdata.totalDeductions : (cdata.totalDeductions === 0 ? 0 : resp.data.totalDeductions),
                    netPay: cdata.netPay ? cdata.netPay : (cdata.netPay === 0 ? 0 : resp.data.netPay),
                    lastUpdatedAt: new Date()
                }
            };
            const task = async (collection) => await collection.updateOne(query, document);
            const resp1 = await connectDB('income', 'salary', task);
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
    getOneTransaction,
    insertOneTransaction,
    deleteOneTransaction,
    updateOneTransaction
};
