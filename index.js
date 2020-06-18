const express = require('express')
const dotenv = require('dotenv')
const app = express()
const mongoose = require('mongoose')

const authRouter = require('./routes/auth')
const postsRouter = require('./routes/posts')

dotenv.config()

mongoose.connect(process.env.DB_CONNECT,
{ useNewUrlParser: true,useUnifiedTopology: true },
() => console.log('Connected To DB!!'))

// Middlwares
app.use(express.json())

// Routes Middllwares
app.use('/api/user' , authRouter)
app.use('/api/posts' , postsRouter)

app.listen(3000, () => console.log('Server Up and running'))