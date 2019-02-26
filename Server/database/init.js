const MongoClient = require('mongodb').MongoClient;

let db = null;

async function connect() {
    console.log('connect')
    try {
        if(db !== null && db.serverConfig.isConnected()){
            return db;
        }
        const cli = await MongoClient.connect('mongodb://localhost:27017', {
            useNewUrlParser: true
        })
        db = cli.db('ExtensionLibrary');
        console.log(db.extLib);
        console.log('CONNECTED');
        return db;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

module.exports.connect = connect;