const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const serverless = require("serverless-http")
const cors = require("cors")
const userRoute = require("./routes/user")
const productRoute = require("./routes/product")
const authRoute = require("./routes/auth")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
const paymentRoute = require("./routes/payment")

dotenv.config()

mongoose.connect(process.env.MONGO_SECRET).then(() => {
    console.log("Successfully connected to MongoDB")
}).catch((err) => {
    console.log(err)
})


app.use(cors())
app.use(express.json())


// Routes-
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/products", productRoute)
app.use("/api/carts", cartRoute)
app.use("/api/orders", orderRoute)
app.use("/api/checkout", paymentRoute)


app.listen(process.env.PORT || 4040, () => {
    console.log("Backend is running...")
})

module.exports.handler = serverless(app)