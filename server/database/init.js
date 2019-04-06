const { MongoClient } = require('mongodb');

const CONNECTION_STRING = process.env.MONGODB_URI || 'mongodb://localhost:27017/ExtensionLibrary';
console.log('CONNECTION_STRING', CONNECTION_STRING);

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
        // db = cli.db('heroku_fr8n7d4z');
        db = cli.db();
        console.log(db.extLib);
        console.log('CONNECTED');
        return db;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

module.exports.connect = connect;
