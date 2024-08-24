const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { errorHandler } = require('./middlewares/error-handler');

const app = express();

// Connect to the database
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/google-docs-clone';
mongoose.connect(`${MONGO_URI}`)
  .then(() => console.log('Connected to MongoDB Atlas cluster'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define the routes
const userRoute = require('./routes/user-route');
const documentRoute = require('./routes/document-route');

app.use(cors({
  origin: '*', // Adjust as needed
  allowedHeaders: ['Authorization', 'Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/user', userRoute);
app.use('/api/document', documentRoute);
app.get('*',(req,res,next)=>{
  res.status(200).json({
    message:'bad request'
  })
})
app.use(errorHandler);

module.exports = app;
