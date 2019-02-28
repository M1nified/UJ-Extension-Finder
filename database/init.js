const MongoClient = require('mongodb').MongoClient;

const CONNECTION_STRING = process.env.MONGODB_URI;

let db;

async function connect() {
    console.log('connect')
    try {
        if (typeof db !== 'undefined' && db.serverConfig.isConnected()) {
            return db;
        }
        const cli = await MongoClient.connect(CONNECTION_STRING, {
            useNewUrlParser: true
        })
        // db = cli.db('ExtensionLibrary');
        db = cli.db('heroku_fr8n7d4z');
        console.log(db.extLib);
        console.log('CONNECTED');
        return db;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

module.exports.connect = connect;
