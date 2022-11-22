const router = require("express").Router()
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken")
const CryptoJS = require("crypto-js")
const Order = require("../models/Order")


// Create order
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)

    try {
        const savedOrder = await newOrder.save()

        res.status(200).json(savedOrder)

    } catch (error) {
        res.status(500).json(error)
    }
})


// Update order
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })

        res.status(200).json(updatedOrder)

    } catch (err) {
        res.status(500).json(err)
    }
})



// Delete order
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id)

        res.status(200).json("Order has been successfully deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})


// Get user orders
router.get("/find/:userId", verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })

        res.status(200).json(orders)

    } catch (error) {
        res.status(500).json(error)
    }
})


// Get all orders
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new
    try {
        const orders = await Order.find()

        res.status(200).json(orders)

    } catch (error) {
        res.status(500).json(error)
    }
})


// Get order income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: prevMonth } } },
            { $project: { month: { $month: "$createdAt" }, sales: "$amount" } },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }
        ])
        res.status(200).json(income)
    } catch (error) {
        res.status(500).json(error)
    }


})


module.exports = router