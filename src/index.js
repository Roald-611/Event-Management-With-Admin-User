const express = require('express');
require('./db/mongoose');
require('dotenv').config();

const userRouter = require('./routers/users');
const eventRouter = require('./routers/event');
const adminRouter = require('./routers/admin');


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(adminRouter);
app.use(eventRouter)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
