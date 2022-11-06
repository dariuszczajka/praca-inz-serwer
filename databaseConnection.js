const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });
const MongoClient = require("mongodb").MongoClient;

let dbconection;

module.exports = {
    connectDB: function (callback) {
        return new Promise((resolve, reject) => {
            if (dbconnection) {
                resolve();
            }
            const url = process.env.DB;
            MongoClient.connect(url)
                .then((client) => {
                    dbconection = client.db();
                    resolve();
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
        });
    },
    getDB: function(){
        return dbconection
    }
};