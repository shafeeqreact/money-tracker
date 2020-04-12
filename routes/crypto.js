const _ = require('lodash');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const path = require('path');

const processCoinbase = require('../utilities/processCoinbase');
const processCoinbasePro = require('../utilities/processCoinbasePro');
const processProTransfers = require('../utilities/processProTransfers');
const processBittrex = require('../utilities/processBittrex');
const processBittrexTransfers = require('../utilities/processBittrexTransfers');
const processHistory = require('../utilities/processHistory');

const {
    getAllTransactions,
    getAllTransWithQuery,
    getOneTransaction,
    insertOneTransaction,
    insertManyTransaction,
    deleteOneTransaction,
    updateOneTransaction
} = require('../db/crypto');

const { insertManyHistoryTransactions } = require('../db/history');

router.route('/')
    .get(async (req, res) => {
        try {
            const resp = await getAllTransactions();
            if (!resp.success) {
                return res.status(404).send(resp.error)
            } else {
                const groupData = _.groupBy(resp.data, (tran) => tran.coin);

                // free api to get the coin name
                const resp1 = await axios.get('https://reference-data-api.kaiko.io/v1/assets')

                const result = Object.keys(groupData)
                    .map(key => {
                        let document = {};

                        document.coin = key;
                        document.transactions = groupData[key] ? groupData[key] : [];

                        document.name = '';
                        if (resp1.data && resp1.data.result === 'success') {
                            const name = resp1.data.data.filter(item => item.code === key.toLowerCase())
                            document.name = name[0] ? name[0].name : key;
                        }

                        document.quantity = document.transactions
                            .reduce(((accum, curr) =>
                                (curr.type === 'buy' || curr.type === 'receive' || curr.type === 'convert-buy' ||
                                    curr.type === 'coinbase earn' || curr.type === 'rewards income') ?
                                    (accum + curr.quantity) :
                                    (accum - curr.quantity)),
                                0);
                        document.quantity = parseFloat(document.quantity.toFixed(8))

                        document.amount = document.transactions
                            .reduce(((accum, curr) =>
                                (curr.type === 'buy' || curr.type === 'convert-buy') ? (accum + curr.amount) :
                                    (curr.type === 'sell' || curr.type === 'convert-sell') ? (accum - curr.amount) :
                                        accum),
                                0);
                        document.amount = document.amount >= 0 ? document.amount : 0;

                        document.fee = document.transactions
                            .reduce(((accum, curr) => accum + curr.fee), 0);

                        document.totalAmount = document.transactions
                            .reduce(((accum, curr) =>
                                (curr.type === 'buy' || curr.type === 'convert-buy') ? (accum + curr.totalAmount) :
                                    (curr.type === 'sell' || curr.type === 'convert-sell') ? (accum - curr.totalAmount) :
                                        accum),
                                0);

                        document.avgRate = document.quantity === 0 ? 0 : document.amount / document.quantity;

                        return document;
                    })

                // console.log('crypto.js totalAmount - ', result.reduce((accum, curr) => accum + curr.totalAmount, 0))

                res.status(200).send(result)
            }
        } catch (err) {
            console.log(err)
            return res.status(400).send({ success: false, error: err });
        }
    })
    .post(async (req, res) => {
        try {
            // console.log('post req.body - ', req.body)
            const resp = await insertOneTransaction(req.body);
            if (!resp.success)
                return res.status(400).send(resp.error);
            // console.log('post resp - ', resp);
            res.status(201).send(resp.data);
        } catch (err) {
            console.log(err)
            return res.status(400).send({ success: false, error: err });
        }
    })

router.route('/:id')
    .get(async (req, res) => {
        try {
            const resp = await getOneTransaction(req.params.id);
            if (!resp.success)
                return res.status(404).send(resp.error);

            res.status(200).send(resp.data);
        } catch (err) {
            console.log(err)
            return res.status(400).send({ success: false, error: err });
        }
    })
    .put(async (req, res) => {
        try {
            const resp = await updateOneTransaction(req.params.id, req.body);
            if (!resp.success)
                return res.status(400).send(resp.error);

            res.status(200).send(resp.data);
        } catch (err) {
            console.log(err)
            return res.status(400).send({ success: false, error: err });
        }
    })
    .delete(async (req, res) => {
        try {
            console.log(req.params)
            const resp = await deleteOneTransaction(req.params.id);
            if (!resp.success)
                return res.status(404).send(resp.error);

            res.status(200).send(resp.data);
        } catch (err) {
            console.log(err)
            return res.status(400).send({ success: false, error: err });
        }
    })

router.route('/upload/history')
    .post(async (req, res) => {
        if (req.files === null) {
            console.log('/routes/crypto.js - /upload/history - error-1')
            return res.status(400).json({ msg: 'File not uploaded' })
        }

        const file = req.files.file;
        const pathLocation = path.join(__dirname, `../uploads/history/${file.name}`)
        // console.log('routs/crypto.js file , path - ', file, pathLocation)

        try {
            const resp = await processHistory(file, pathLocation);
            if (resp.status !== 200) {
                console.log('/routes/crypto.js - /upload/history - error-2 - resp - ', resp)
                return res.status(resp.status).json({ msg: resp.err })
            }
            // console.log('crypto resp.document - ', resp.document[2])

            try {
                console.log('/routes/crypto.js resp.document[0] - ', resp.document[0])
                const dbResp = await insertManyHistoryTransactions(resp.document)
                // console.log('crypto dbResp.success - ', dbResp.success)
                if (!dbResp.success) {
                    console.log('/routes/crypto.js - /upload/history - error-3')
                    return res.status(400).json({ msg: dbResp.error })
                }

                res.status(200).json({ fileName: file.name, filePath: `/uploads/history/${file.name}` })
            } catch (err) {
                console.log('/routes/crypto.js - /upload/history - error-4. err - ', err)
                return res.status(400).json({ msg: 'File not uploaded' })
            }
        } catch (err) {
            console.log('/routes/crypto.js - /upload/history - error-4. err - ', err)
            return res.status(400).json({ msg: 'File not uploaded' })
        }

    })

router.route('/upload/coinbase')
    .post(async (req, res) => {
        if (req.files === null) {
            return res.status(400).json({ msg: 'File not uploaded' })
        }

        const file = req.files.file;
        const pathLocation = path.join(__dirname, `../uploads/coinbase/${file.name}`)

        const resp = await processCoinbase(file, pathLocation);
        if (resp.status !== 200) {
            return res.status(resp.status).json({ msg: resp.err })
        }

        const dbResp = await insertManyTransaction(resp.document)
        if (!dbResp.success) {
            return res.status(dbResp.code).json({ msg: dbResp.error })
        }

        res.status(200).json({ fileName: file.name, filePath: `/uploads/coinbase/${file.name}` })
    })

router.route('/upload/coinbase-pro-transfers')
    .post(async (req, res) => {
        if (req.files === null) {
            return res.status(400).json({ msg: 'File not uploaded' })
        }

        const file = req.files.file;
        const pathLocation = path.join(__dirname, `../uploads/coinbasePro/${file.name}`)

        const resp = await processProTransfers(file, pathLocation);
        if (resp.status !== 200) {
            return res.status(resp.status).json({ msg: resp.err })
        }
        console.log('resp.document - ', resp.document[2])

        const dbResp = await insertManyTransaction(resp.document)
        if (!dbResp.success) {
            return res.status(dbResp.code).json({ msg: dbResp.error })
        }

        res.status(200).json({ fileName: file.name, filePath: `/uploads/coinbasePro/${file.name}` })
    })

router.route('/upload/coinbase-pro-fills')
    .post(async (req, res) => {
        if (req.files === null) {
            return res.status(400).json({ msg: 'File not uploaded' })
        }

        const file = req.files.file;
        const pathLocation = path.join(__dirname, `../uploads/coinbasePro/${file.name}`)

        const resp = await processCoinbasePro(file, pathLocation);
        if (resp.status !== 200) {
            return res.status(resp.status).json({ msg: resp.err })
        }
        console.log('resp.document - ', resp.document[0])

        const dbResp = await insertManyTransaction(resp.document)
        if (!dbResp.success) {
            return res.status(dbResp.code).json({ msg: dbResp.error })
        }

        res.status(200).json({ fileName: file.name, filePath: `/uploads/coinbasePro/${file.name}` })
    })

router.route('/upload/bittrex-orders')
    .post(async (req, res) => {
        if (req.files === null) {
            return res.status(400).json({ msg: 'File not uploaded' })
        }

        const file = req.files.file;
        const pathLocation = path.join(__dirname, `../uploads/bittrex/${file.name}`)

        const resp = await processBittrex(file, pathLocation);
        if (resp.status !== 200) {
            return res.status(resp.status).json({ msg: resp.err })
        }
        console.log('resp.document - ', resp.document[0])

        const dbResp = await insertManyTransaction(resp.document)
        if (!dbResp.success) {
            return res.status(dbResp.code).json({ msg: dbResp.error })
        }

        res.status(200).json({ fileName: file.name, filePath: `/uploads/bittrex/${file.name}` })
    })

router.route('/upload/bittrex-transfers')
    .post(async (req, res) => {
        if (req.files === null) {
            return res.status(400).json({ msg: 'File not uploaded' })
        }

        const file = req.files.file;
        const pathLocation = path.join(__dirname, `../uploads/bittrex/${file.name}`)

        const resp = await processBittrexTransfers(file, pathLocation);
        if (resp.status !== 200) {
            return res.status(resp.status).json({ msg: resp.err })
        }
        console.log('resp.document - ', resp.document[0])

        const dbResp = await insertManyTransaction(resp.document)
        if (!dbResp.success) {
            return res.status(dbResp.code).json({ msg: dbResp.error })
        }

        res.status(200).json({ fileName: file.name, filePath: `/uploads/bittrex/${file.name}` })
    })

module.exports = router;
