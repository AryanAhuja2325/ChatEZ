const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectToDB = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

dotenv.config();
connectToDB();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`);
})
