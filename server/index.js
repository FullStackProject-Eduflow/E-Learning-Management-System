import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
import userRoute from './routes/user.route.js'; // <-- Import userRoute
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();

// CALL DATABASE CONNECTION HERE 
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for JSON
app.use(express.json());

app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
// APIs 
app.use('/api/v1/user', userRoute); 
"https://localhost:8080/api/v1/user/register"


// Start server
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});