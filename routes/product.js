const router = require("express").Router()
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken")
const CryptoJS = require("crypto-js")
const Product = require("../models/Product")


// Create product
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body)

    try {
        const savedProduct = await newProduct.save()

        res.status(200).json(savedProduct)

    } catch (error) {
        res.status(500).json(error)
    }
})


// Update product
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })

        res.status(200).json(updatedProduct)

    } catch (err) {
        res.status(500).json(err)
    }
})



// Delete product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id)

        res.status(200).json("Product with the name " + deletedProduct._doc.name + " has been successfully deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})


// Get a product
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        res.status(200).json(product)

    } catch (error) {
        res.status(500).json(error)
    }
})


// Get all products
router.get("/", async (req, res) => {
    const query = req.query.new
    try {
        const products = query ? await Product.find().sort({ createdAt: -1 }).limit(5) : await Product.find()

        res.status(200).json(products)

    } catch (error) {
        res.status(500).json(error)
    }
})



module.exports = router