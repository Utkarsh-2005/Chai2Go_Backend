// server.js
import authRoutes from './routes/authRoutes.js'
import viewRoutes from './routes/viewRoutes.js'
import dotenv from 'dotenv';
dotenv.config();
import express, { json } from 'express';
import cors from 'cors';
import auth from './middleware/verify.js';
import { connect } from 'mongoose';
import { Auth } from './models/authModel.js';

const app = express();

app.use(json());
app.use(cors());


// Placeholder for your database
app.use('/view', viewRoutes)


  // Apply middleware to the '/view' route
//   app.get('/view/:uname', auth,async (req, res) => {
//     try{
//         const { uname } = req.params;

//         const userData =await Auth.findOne({username: uname}).exec();
//        return res.status(200).json(userData);
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).send({ message: error.message});
//     }
//   });

app.use('/', authRoutes);

// app.get('/view', (req, res) => {
//     res.send(users);
// })
// Register endpoint
// app.post('/register', async (req, res) => {
//     try {
//         const existingUser = users.find(user => user.username === req.body.username);
//         if (existingUser) {
//             return res.status(400).send('User already exists');
//         }
//         // Hash password
//         const hashedPassword = await bcrypt.hash(req.body.password, 10);
//         const user = { username: req.body.username, password: hashedPassword };
//         users.push(user);
//         res.status(201).send();
//     } catch {
//         res.status(500).send();
//     }
// });

// // Login endpoint
// app.post('/login', async (req, res) => {
//     const user = users.find(user => user.username === req.body.username);
//     if (user == null) {
//         return res.status(400).send('Cannot find user');
//     }
//     try {
//         if (await bcrypt.compare(req.body.password, user.password)) {
//             // Authentication successful
//             const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            
//             res.json({ accessToken: accessToken });

//         } else {
//             res.status(401).send('Incorrect password');
//             console.log(username)
//         }
//     } catch {
//         res.status(500).send();
//     }
// });


connect(process.env.mongoDBURL).then(
    ()=>{
        console.log("successfully connected")
        app.listen(process.env.PORT, () => {
            console.log(`app is listeninng on port ${process.env.PORT}`);
        });
    }).catch((error)=> {
        console.log(error)
    });
