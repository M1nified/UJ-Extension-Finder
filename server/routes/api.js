var express = require('express');
/* GET home page. */
const dbInit = require('./../database/init');
const { ObjectID } = require('mongodb');
const crypto = require('crypto');

var router = express.Router();

router.get('/extension/:extensionId', async function (req, res, next) {
    console.log(`GET /extension/${req.params.extensionId}`);
    const db = await dbInit.connect();
    const result = await db.collection('extLib').findOne({
        _id: new ObjectID(req.params.extensionId)
    })

    if (!result.hasOwnProperty('_id')) {
        res.status(404);
        console.error(404);
        res.send();
        return;
    }

    result.id = result._id;
    delete (result._id);
    res.send(result);
});

router.delete('/extension/:extensionId', async function (req, res, next) {
    console.log(`DELETE /extension/${req.params.extensionId}`);
    // const user = await validateToken(req, res);
    // if (!user) return;
    const db = await dbInit.connect();
    const result = await db.collection('extLib').deleteOne({
        _id: new ObjectID(req.params.extensionId)
    })
    console.log(result)
    if (result.deletedCount === 0) {
        res.status(404);
        res.send();
        return;
    }
    res.status(200);
    res.send();
})

router.post('/extension/:extensionId', async function (req, res, next) {
    console.log(`POST /extension/${req.params.extensionId}`);
    const user = await validateToken(req, res);
    if (!user) return;

    const extension = req.body;

    const db = await dbInit.connect();

    try {

        const updateResult = db.collection('extLib').findOneAndUpdate(
            { _id: new ObjectID(req.params.extensionId) },
            extension
        )
        res.status(200);
        res.send();

    } catch (e) {
        res.status(500);
        res.send('Failed to POST.');
        return;
    }
})

router.put('/extension/:extensionId', async function (req, res, next) {
    console.log(`PUT /extension/${req.params.extensionId}`);
    const user = await validateToken(req, res);
    if (!user) return;

    const extension = req.body;
    console.log(extension);
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

        const replaceResult = await db.collection('extLib').findOneAndReplace(
            { _id: new ObjectID(req.params.extensionId) },
            extension
        )
        console.log('result', replaceResult);
        res.status(200);
        res.send();

    } catch (e) {
        res.status(500);
        res.send('Failed to PUT.');
        return;
    }
})

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
            elem.id = elem._id;
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
    // const user = await validateToken(req, res);
    // if (!user) return;

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

        // extension.creator = user._id;
        extension.creator = null;
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

router.post('/token', async function (req, res, next) {
    console.log(`POST /token`);
    const
        userName = req.body.userName,
        userPassword = req.body.password,
        userPasswordMd5 = crypto.createHash('md5').update(userPassword).digest('hex');

    console.log(userName, userPasswordMd5)

    const db = await dbInit.connect();

    try {

        const user = await db.collection('users').findOne({ userName });
        console.log(user);

        if (!user) {
            res.status(404);
            res.send();
            return;
        }

        if (user.password.toLowerCase() !== userPasswordMd5.toLowerCase()) {
            res.status(403);
            res.send();
            return;
        }

        let token = user.token;

        if (!token) {
            token = crypto.randomBytes(64).toString('hex');
            console.log('NEW TOKEN', token)
            await db.collection('users').updateOne({ _id: user._id }, { $set: { token } });
        }

        res.status(200);
        res.send({ token });

    } catch (e) {
        console.error(e);
        res.status(500);
        res.send();
        return;
    }

})

router.get('/user/:userId', async function (req, res, next) {
    console.log(`GET /user/${req.params.userId}`);
    const db = await dbInit.connect();
    const result = await db.collection('users').findOne({ _id: new ObjectID(req.params.userId) });

    if (!result.hasOwnProperty('_id')) {
        res.status(404);
        res.send();
        return;
    }

    result.id = result._id;
    delete (result._id);
    res.send(result);
})

async function getUserForToken(token) {
    if (!token)
        return false;
    const db = await dbInit.connect();
    const user = await db.collection('users').findOne({ token });
    return user;
}

async function validateToken(req, res) {
    const user = await getUserForToken(req.query.token);
    if (!user) {
        res.status(403);
        res.send();
        return false;
    }
    return user;
}

module.exports = router;
