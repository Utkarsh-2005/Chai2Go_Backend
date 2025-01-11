import express from "express";
import { Order } from "../models/orderModel.js";
import auth from '../middleware/verify.js';
import { Notification } from "../models/orderConfirmedModel.js";

const router = express.Router();

export default function(adminIO) {
    let ordernum = 0
    router.get('/', auth, async (req, res) => {
        try {
            if (req.user.username !== "Admin321") {
                return res.status(403).send({ message: 'Access forbidden. You are not authorized to access this.' });
            }
            const userData = await Order.find().exec();
            return res.status(200).json(userData);
        } catch (error) {
            console.log(error.message);
            res.status(500).send({ message: error.message });
        }
    });

    router.delete('/delete/:id', auth, async (req, res) => {
        try {
            const { id } = req.params;
            const orderData = await Order.findById(id).exec();
            const result = await Order.findByIdAndDelete(id, req.body);
            if (!result) {
                return res.status(404).json({ message: 'Order not found' });
            }
            ordernum = orderData.orderno
            // console.log(orderData)
            // // Emit event using io passed from server.js
            return res.status(200).json({ message: 'Order deleted successfully' });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        }
    });

    router.post('/message/:id', auth, async (req, res) => {
        try{
            const { id } = req.params;
            // if (!result) {
            //     return res.status(404).json({ message: 'Order not found' });
            // }
            const notification = new Notification({
                id: id,
                orderno: ordernum,
                message: req.body.message,
                username: req.body.username
              });
          
              await notification.save();
            adminIO.emit('order_confirmed', {id: id, orderno: ordernum, message: req.body.message, username: req.body.username});
            res.status(200).send({ message: 'Success' });
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: error.message});
        }
      });


    return router;
}
