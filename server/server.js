require('dotenv').config();
const app=require('./src/app');
const connectDB=require('./src/db/db');

const PORT=process.env.PORT || 3000;

const startServer=async() =>{
    try{
        await connectDB();
        console.log("Database connected");

        app.listen(PORT,()=>{
            console.log(`server is running on http://localhost:${PORT}`);
        });
    } catch (error){
        console.error(error.message);
        process.exit(1);
    }
};

startServer();