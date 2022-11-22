const router = require("express").Router()
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken")
const CryptoJS = require("crypto-js")
const Cart = require("../models/Cart")


// Create cart
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body)

    try {
        const savedCart = await newCart.save()

        res.status(200).json(savedCart)

    } catch (error) {
        res.status(500).json(error)
    }
})


// Update cart
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })

        res.status(200).json(updatedCart)

    } catch (err) {
        res.status(500).json(err)
    }
})



// Delete cart
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const deletedCart = await Cart.findByIdAndDelete(req.params.id)

        res.status(200).json("Cart has been successfully deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})


// Get user cart
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId })

        res.status(200).json(cart)

    } catch (error) {
        res.status(500).json(error)
    }
})


// Get all carts
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new
    try {
        const carts = query ? await Cart.find().sort({ createdAt: -1 }).limit(5) : await Cart.find()

        res.status(200).json(carts)

    } catch (error) {
        res.status(500).json(error)
    }
})



module.exports = router