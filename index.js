const express = require("express");
const url = require("./controller/urlController")
const conn = require('./db/conn')
const cors = require('cors')

const app = express();

app.use(express.json())

app.use(cors({ credentials: true, origin: '*' }))

app.use(express.static('public'))


//Rotas
const UrlRoute = require('./routes/UrlRoute')
app.use('/url', UrlRoute)

//rota de redirecionamento direto
app.get('/:new_url', url.redirect)

//inicializando aplicação
conn
    .sync()
    .then(() => {
        app.listen(3000)
    })
    .catch((error) => console.log(error))