require('dotenv').config();
const app = require('./src/app');
const serverless = require('serverless-http');

const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor listo en http://localhost:${port}`);
  });
}



module.exports.handler = serverless(app);