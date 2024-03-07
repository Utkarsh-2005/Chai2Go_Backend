const router = express.Router();
import express from "express";
import auth from '../middleware/verify.js';
import { Order } from "../models/orderModel.js";
import { Auth } from "../models/authModel.js";

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
        // const orderNo = Math.floor(Math.random() * 9000) + 1000;
        // const orders = await Order.find({}, 'orderno').exec();
        // function orderNoGenerator() {
        //   const orderNo = Math.floor(Math.random() * 9000) + 1000;
        //   orders.map((order)=> {
        //     if (order.orderno === orderNo){
        //       orderNoGenerator()
        //     }
        //   })
        //   return orderNo;
        // }
        // console.log(orders)
        const newOrder = {username: uname, base: req.body.base, spice: req.body.spice, sugar: req.body.sugar, container: req.body.container, quantity: req.body.quantity, orderno: req.body.orderno}
        const order = await Order.create(newOrder);
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

    const result = await Order.findByIdAndDelete(id, req.body);
    
    if(!result){
        return res.status(404).json({messagee: 'Order not found'})
    }

    return res.status(200).json({messagee: 'Order deleted successfully'})
} catch (error) {
    console.log(error.message);
    res.status(500).json({message: error.message})
}
})

export default router;