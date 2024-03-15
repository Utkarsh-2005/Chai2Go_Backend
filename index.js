// server.js
import authRoutes from './routes/authRoutes.js'
import viewRoutes from './routes/viewRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import dotenv from 'dotenv';
dotenv.config();
import express, { json } from 'express';
import cors from 'cors';
import auth from './middleware/verify.js';
import { connect } from 'mongoose';
import { Auth } from './models/authModel.js';
import { Order } from "./models/orderModel.js";
import { createServer } from 'http';
import { Server } from 'socket.io';


const app = express();

const server = createServer(app)

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin:"*",
        methods:["GET","POST"],
        credentials: true,
    }
})

io.on("connection", (socket) => {
    console.log("A new user has connected", socket.id)
})

app.use(json());
app.use(cors());


// Placeholder for your database
app.use('/view', viewRoutes(io));
app.use('/admin', adminRoutes(io));
app.get('/ordernos', auth,async (req, res) => {
    try{
        const orders = await Order.find({}, 'orderno').exec();
       return res.status(200).json(orders);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message});
    }
});

app.use('/', authRoutes);

connect(process.env.mongoDBURL).then(
    ()=>{
        console.log("successfully connected")
        server.listen(process.env.PORT, () => {
            console.log(`app is listeninng on port ${process.env.PORT}`);
        });
    }).catch((error)=> {
        console.log(error)
    });
 