const express = require('express');

const customerRoutes = require('./routes/customer');
const app = express();
const port = 3000;


app.use("/customers", customerRoutes);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
