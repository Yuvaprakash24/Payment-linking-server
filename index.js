const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51Q5VE3JjDszyTt5F7rpsmUwHRhufQY0meEgydYXEt0Fc86iBoUcDyrjyn7KmHFACwfwsGpaA6grecDKfu25cTx6h00Jdmqnlip"); // replace with your own secret key

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.get('/', async(req, res) => {
    res.json({message: "Hello from nodejs server"});
})

app.post('/create-checkout-session', async(req, res) => {
    try {
        const { items } = req.body;
        const line_items = await items.map(item => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            }
            ,quantity: item.quantity
        }));
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
        });
        res.json({id: session.id});
    } catch(error){
        console.log(error);
    }
})
app.listen(4242, () => {
    console.log("server is running on port 4242");
})