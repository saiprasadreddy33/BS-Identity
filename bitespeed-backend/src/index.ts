import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import identifyRouter from './routes/identify';

const app = express();
app.use(bodyParser.json());

const uri = "mongodb+srv://watto:Saiprasadreddy@cluster0.tz7kuxn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


mongoose.connect(uri).then(() => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.error('Error connecting to MongoDB', error);
});

app.use('/identify', identifyRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
