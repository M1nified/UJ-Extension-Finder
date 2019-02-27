var express = require('express');
/* GET home page. */
const dbInit = require('./../database/init');

var router = express.Router();

router.get('/extension/:extension', async function (req, res, next) {
    console.log("/extension/:extension");
    const db = await dbInit.connect();
    const resultCursor = db.collection('extLib').find({
        extension: req.params.extension.toString()
    })

    if (!(await resultCursor.hasNext())) {
        res.status(404);
        console.error(404);
        res.send();
        return;
    }

    const result = await resultCursor.next();
    delete (result._id);
    res.send(result);
});

router.get('/extension', async function (req, res, next) {
    console.log('/extension');
    console.log(req.query.sExt);
    if (typeof req.query.sExt !== "undefined") {
        const sExt = req.query.sExt;
        const db = await dbInit.connect();
        const resultCursor = db.collection('extLib').find({
            extension: new RegExp(`^${sExt}.*`, 'i')
        });
        const results = [];
        while (await resultCursor.hasNext()) {
            const elem = await resultCursor.next();
            delete (elem._id);
            results.push(elem);
        }
        if (results.length === 0) {
            res.status(404);
        }
        res.send(results);
        return;
    }

    res.status(404);
    res.send();
})

router.post('/extension', async function (req, res, next) {
    const extension = req.body;
    if (!extension.hasOwnProperty('extension') || extension.extension == '') {
        res.status(400);
        res.send('Extension has to be provided.');
        return;
    }

    if (!extension.hasOwnProperty('description') || extension.description == '') {
        res.status(400);
        res.send('Description has to be provided.');
        return;
    }

    const db = await dbInit.connect();
    try {

        const insertResult = await db.collection('extLib').insertOne(extension);
        const { insertedId } = insertResult;
        res.status(201);
        res.send(insertedId);

    } catch (err) {
        res.status(500);
        res.send('Failed to store.');
        return;
    }

})

module.exports = router;
