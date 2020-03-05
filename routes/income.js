const express = require('express');
const router = express.Router();

const { ObjectId } = require('mongodb');

const connectDB = require('../db/connectDB');

router.route('/')
    .get(async (req, res) => {
        try {
            const task = async (collection) => await collection.find().toArray();
            const resp = await connectDB(task);
            res.status(200).send(resp);
        } catch (err) {
            res.status(400).send({ success: false, error: err });
        }
    })
    .post(async (req, res) => {
        const document = {
            date: req.body.date,
            earnings: {
                basic: req.body.earnings.basic,
                hra: req.body.earnings.hra,
                conveyanceReimbursement: req.body.earnings.conveyanceReimbursement,
                adhoc: req.body.earnings.adhoc,
                transportAllowance: req.body.earnings.transportAllowance,
                ltaTaxable: req.body.earnings.ltaTaxable,
                medicalTaxable: req.body.earnings.medicalTaxable,
                odcBonus: req.body.earnings.odcBonus
            },
            deductions: {
                providentFund: req.body.deductions.providentFund,
                professionalTax: req.body.deductions.professionalTax,
                welfareFund: req.body.deductions.welfareFund
            },
            totalEarnings: req.body.totalEarnings,
            totalDeductions: req.body.totalDeductions,
            netPay: req.body.netPay,
            createdAt: new Date(),
            lastUpdatedAt: new Date()
        }

        try {
            const task = async (collection) => await collection.insertOne(document);
            const resp = await connectDB(task);
            res.status(200).send(resp);
        } catch (err) {
            res.status(400).send({ success: false, error: err });
        }
    })

router.route('/:id')
    .get((req, res) => {
        res.status(200).send('From the get with id income router')
    })
    .put((req, res) => {
        res.status(200).send('From the put with id income router')
    })
    .delete(async (req, res) => {
        try {
            const task = async (collection) => await collection.deleteOne({ _id: ObjectId(req.params.id) });
            const resp = await connectDB(task);
            res.status(200).send(resp);
        } catch (err) {
            res.status(400).send({ success: false, error: err });
        }
    })

module.exports = router;