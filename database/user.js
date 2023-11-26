const express = require('express');
const router = express.Router();
const { UserDetails } = require('./database');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const secretkey = process.env.SECRET_KEY
router.use(cookieParser())
router.use(express.urlencoded({ extended: true }))
router.use(express.json())
router.use(cors())

const autheticate = (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            throw new Error('No token provided')
        }
        const decodedToken = jwt.verify(token, secretkey)
        const _id = decodedToken.id
        UserDetails.findById(_id)
            .then(() => {
                next()
            }).catch(() => {
                console.log('cannot find the authorized token')
                res.status(401).send('unauthorized')
            })
    } catch (error) {
        console.log('json must be provided ' + error.message)
        res.status(401).send('unauthorized')
    }


}

router.get('/register', (req, res) => {
    res.render('signup')
})


router.post('/register', async (req, res) => {
    const details = req.body
    const { firstname, lastname, email, password, gender } = details
    const passwordHash = await bcrypt.hash(password, 10)
    console.log(passwordHash)
    try {
        const existingUser = await UserDetails.findOne({ email }).select('password')
        if (existingUser) {
            res.send("user already exists")
            return
        }
        const newUser = new UserDetails({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: passwordHash,
            gender: gender
        })
        await newUser.save()
        const payload = { id: newUser._id }
        const token = jwt.sign(payload, secretkey)
        console.log(token)
        const expirationTime = Date.now() + 30 * 24 * 60 * 60 * 1000;
        const expirationDate = new Date(expirationTime);
        res.cookie('token', token, { expires: expirationDate, httpOnly: true });

        res.send("successfully signed up")
    } catch (error) {
        console.log("an error occured " + error.message)
    }
})

router.get('/Login', (req, res) => {
    res.render('login')
})

router.post('/Login', async (req, res) => {
    const details = req.body
    const { email, password } = details
    console.log(details)
    try {
        const FindUser = await UserDetails.findOne({ email }).select('password')
        console.log(FindUser)
        if (!FindUser) {
            res.send("user not found")
            return
        }
        console.log("yes")
        const comparedPassword = await bcrypt.compare(password, FindUser.password)
        console.log(comparedPassword)
        if (comparedPassword) {
            const payload = { id: FindUser._id }
            const token = jwt.sign(payload, secretkey)
            console.log(token)
            const expirationTime = Date.now() + 30 * 24 * 60 * 60 * 1000;
            const expirationDate = new Date(expirationTime);
            res.cookie('token', token, { expires: expirationDate, httpOnly: true });
            res.send('logged in')
        } else {
            res.send("incorrect password")
        }
    } catch (error) {
        console.log("an error occurred " + error.message)
    }
})

module.exports = autheticate;

module.exports = router;
