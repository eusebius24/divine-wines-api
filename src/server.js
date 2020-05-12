const app = require('./app')
const knex = require('knex');
require('dotenv').config
const { PORT } = require('./config')
const DivineWinesService = require('./divinewines/divinewines-service')

const db = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

app.set('db', db)

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
})