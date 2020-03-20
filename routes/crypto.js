const express = require('express');
const router = express.Router();

const {
    getAllTransactions,
    getOneTransaction,
    insertOneTransaction,
    deleteOneTransaction,
    updateOneTransaction
} = require('../db/crypto');

router.route('/')
    .get(async (req, res) => {
        try {
            const resp = await getAllTransactions();
            if (!resp.success)
                res.status(404).send(resp.error)
            res.status(200).send(resp.data)
        } catch (err) {
            console.log(err)
            res.status(400).send({ success: false, error: err });
        }
    })
    .post(async (req, res) => {
        try {
            const resp = await insertOneTransaction(req.body);
            if (!resp.success)
                res.status(400).send(resp.error)
            res.status(201).send(resp.data);
        } catch (err) {
            console.log(err)
            res.status(400).send({ success: false, error: err });
        }
    })

router.route('/:id')
    .get(async (req, res) => {
        try {
            const resp = await getOneTransaction(req.params.id);
            if (!resp.success)
                res.status(404).send(resp.error)
            res.status(200).send(resp.data);
        } catch (err) {
            console.log(err)
            res.status(400).send({ success: false, error: err });
        }
    })
    .put(async (req, res) => {
        try {
            const resp = await updateOneTransaction(req.params.id, req.body);
            if (!resp.success)
                res.status(400).send(resp.error)
            res.status(200).send(resp.data);
        } catch (err) {
            console.log(err)
            res.status(400).send({ success: false, error: err });
        }
    })
    .delete(async (req, res) => {
        try {
            console.log(req.params)
            const resp = await deleteOneTransaction(req.params.id);
            if (!resp.success)
                res.status(404).send(resp.error)
            res.status(200).send(resp.data);
        } catch (err) {
            console.log(err)
            res.status(400).send({ success: false, error: err });
        }
    })

module.exports = router;
