const router = express.Router();
import express from "express";
import auth from '../middleware/verify.js';
import { Order } from "../models/orderModel.js";
import { Auth } from "../models/authModel.js";

export default function( adminIO) {
router.get('/:uname', auth,async (req, res) => {
    try{
        const { uname } = req.params;
        if (req.user.username !== uname) {
          return res.status(403).send({ message: 'Access forbidden. You are not authorized to perform this action.'});
      }

        const userData =await Auth.findOne({username: uname}).exec();
        // console.log(req.user.username)
       return res.status(200).json(userData);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message});
    }
  });
  router.post('/:uname', auth,async  (req, res) => {
    try{
        const { uname } = req.params;
        const newOrder = {username: uname, base: req.body.base, spice: req.body.spice, sugar: req.body.sugar, container: req.body.container, quantity: req.body.quantity, orderno: req.body.orderno}
        const order = await Order.create(newOrder);
        adminIO.emit('order_placed', {orderno: req.body.orderno});
        res.status(201).send(order);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message});
    }
  });

// router.get('/getorders/ordernos', auth,async (req, res) => {
//     try{
//         const orders = await Order.find({}, 'orderno').exec();
//         console.log(typeof orders)
//        return res.status(200).json(orders);
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).send({ message: error.message});
//     }
// });

router.get('/:uname/orders', auth,async (req, res) => {
    try{
        const { uname } = req.params;

        const userData = await Order.find({ username: uname }).exec();
       return res.status(200).json(userData);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message});
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const orderData = await Order.findById(id).exec();
    const result = await Order.findByIdAndDelete(id, req.body);
    
    if(!result){
        return res.status(404).json({messagee: 'Order not found'})
    }
    adminIO.emit('order_cancelled', {orderno: orderData.orderno});
    return res.status(200).json({message: 'Order deleted successfully'})
} catch (error) {
    console.log(error.message);
    res.status(500).json({message: error.message})
}
})

router.get('/notifications', auth, async (req, res) => {
    try {
      const { username } = req.user; // Assuming username is in the token
      const notifications = await Notification.find({ username, isRead: false });
      res.status(200).json({ notifications });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  });
  
  
 return router;
}