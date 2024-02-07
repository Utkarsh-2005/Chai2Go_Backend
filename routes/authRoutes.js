import { Auth } from "../models/authModel.js"
import express from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const existingUser = await Auth.findOne({ username: req.body.username });
        
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = { username: req.body.username, password: hashedPassword };
        const user = await Auth.create(newUser);
        res.status(201).send(user);
    } catch (e){
        res.status(500).send({message: e.message});
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const user = await Auth.findOne({username: req.body.username}).exec();
        if (user == null) {
            return res.status(400).send('Cannot find user');
        }
        if (await bcrypt.compare(req.body.password, user.password)) {
            // Authentication successful
            const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            res.json({ accessToken: accessToken });
        } else {
            res.status(401).send('Incorrect password');
        }
    } catch (e){
        console.error(e);
        res.status(500).send({error: 'Internal Server Error'});
    }
});


export default router;