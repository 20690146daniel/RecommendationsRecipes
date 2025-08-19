const express = require('express')
const app = express()
const port = 3000

app.use(express.json());
require('./src/models');


require('./src/routes/routes')(app);
app.listen(port, () => {
  console.log(`Proyecto escuchando en el puerto ${port}`)
})


