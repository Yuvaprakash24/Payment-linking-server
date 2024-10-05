const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("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"); // replace with your own secret key

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
            success_url: "https://yuvis-ez-foods.netlify.app/success",
            cancel_url: "https://yuvis-ez-foods.netlify.app/cancel",
        });
        res.json({id: session.id});
    } catch(error){
        console.log(error);
    }
})
app.listen(4242, () => {
    console.log("server is running on port 4242");
})
