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
            extension: new RegExp(`^${sExt}.*`)
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

module.exports = router;
