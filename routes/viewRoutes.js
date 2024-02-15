const router = express.Router();
import express from "express";
import auth from '../middleware/verify.js';
import { Order } from "../models/orderModel.js";
import { Auth } from "../models/authModel.js";

router.get('/:uname', auth,async (req, res) => {
    try{
        const { uname } = req.params;

        const userData =await Auth.findOne({username: uname}).exec();
       return res.status(200).json(userData);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message});
    }
  });
  router.post('/:uname', auth,async (req, res) => {
    try{
        const { uname } = req.params;
        const newOrder = {username: uname, base: req.body.base, spice: req.body.spice, sugar: req.body.sugar, container: req.body.container, quantity: req.body.quantity}
        const order = await Order.create(newOrder);
        res.status(201).send(order);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message});
    }
  });

  router.get('/:uname/orders', auth,async (req, res) => {
    try{
        const { uname } = req.params;

        const userData =await Order.findOne({username: uname}).exec();
       return res.status(200).json(userData);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message});
    }
  });

  // const userData =await Auth.findOne({username: uname}).exec();
export default router;