const router = require("express").Router()
const stripe = require("stripe")("sk_test_51K8pH1SDOra4H4QHca0Bw4OdIBJrfRmc2LvUYFZR5X1nKB0Ixl09ftTxAKa5B8ykzjRLeIWgmS0dRzIfT6aWDU8r0082Ke6GAD")

router.post("/payment", (req, res) => {
    stripe.charges.create(
        {
            source: req.body.tokenId,
            amount: req.body.amount,
            currency: "inr"
        },
        (stripeErr, stripeRes) => {
            if (stripeErr) {
                res.status(500).json(stripeErr)
            } else {
                res.status(200).json(stripeRes)
            }
        }
    )
})

module.exports = router
