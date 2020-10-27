const mongodb = require('mongodb')
const dotenv = require('dotenv')
dotenv.config({path: './config/config.env'})

async function dbConnection ()
{
    let client
    let clientOptions = {
            useUnifiedTopology: true,
            useNewUrlParser: true
    }
        
    try {

        client = await mongodb.connect(process.env.CONNECTION_STRING, clientOptions)
        module.exports = client
        // run app once database connection is
        const app = require('./app')
        app.listen(process.env.PORT)
    

    } catch (dbErr){
        console.log(dbErr)
    
    } 

}

dbConnection().then(console.log('Connection to "emailSender" collection has been established.')).catch("error")
