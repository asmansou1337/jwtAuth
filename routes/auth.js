const router = require('express').Router()
const User = require('../model/User')
const {registerValidation, loginValidation} = require('../validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register' , async (req, res) => {
    try {
        // Validate data before creating the user
        const {error} = registerValidation(req.body)
        if (error)
         throw new Error(error.details[0].message)

        // Checking if the user is already in the database
        const emailExist = await User.findOne({email: req.body.email})
        if (emailExist) res.status(400).send('Email already exists!!')

        //Hash password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        })
        const savedUser = await user.save()
        res.send({id: savedUser._id, name: savedUser.name, email: savedUser.email})
    } catch (error) {
        res.status(400).send(error)
    }
    
})

//LOGIN
router.post('/login', async (req, res) => {
     // Data Validation
     const {error} = loginValidation(req.body)
     if (error)
     return res.status(400).send(error.details[0].message)
    // Checking if the email exists
    const user = await User.findOne({email: req.body.email})
    if (!user) return res.status(400).send('Email or password is wrong!!')
    // Validate password
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Invalid password!!')

    // Create And Assign A token
    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)
    // res.send('Logged In!!')
})

module.exports = router