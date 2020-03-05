const express = require('express');
const router = express.Router();

router.route('/')
    .get((req, res) => {
        res.status(200).send('From the get expense router')
    })
    .post((req, res) => {
        res.status(200).send('From the post expense router')
    })

router.route('/:id')
    .put((req, res) => {
        res.status(200).send('From the put expense router')
    })
    .delete((req, res) => {
        res.status(200).send('From the delete expense router')
    })

module.exports = router;