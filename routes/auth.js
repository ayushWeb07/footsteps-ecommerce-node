const router = require("express").Router()
const User = require("../models/User")

const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")


// Register user
router.post("/register", async (req, res) => {
    try {
        const newUser = new User({
            fullname: req.body.fullname,
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.CRYPTO_JS_SECRET).toString()
        })


        const accessToken = jwt.sign({
            id: newUser?._id,
            isAdmin: newUser?.isAdmin
        }, process.env.JWT_SECRET, { expiresIn: "3d" })

        const savedUser = await newUser.save()

        const { password, ...others } = savedUser._doc

        if (savedUser) {
            res.status(200).json({ ...others, accessToken })
        }
    }
    catch (err) {
        res.status(500).json(err)
    }

})


// Login user
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })

        if (!user || CryptoJS.AES.decrypt(user?.password, process.env.CRYPTO_JS_SECRET).toString(CryptoJS.enc.Utf8) !== req.body.password) {
            res.status(401).json("Wrong credentials!")
        } else {
            const accessToken = jwt.sign({
                id: user?._id,
                isAdmin: user?.isAdmin
            }, process.env.JWT_SECRET, { expiresIn: "3d" })

            const { password, ...others } = user._doc

            res.status(200).json({ ...others, accessToken })
        }




    } catch (error) {
        res.status(500).json(error?.response?.data)
    }
})


module.exports = router