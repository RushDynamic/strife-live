import express from "express";

const app = express();
const portNumber = 5250;
var offer = {};

app.use(express.json());
app.post('/store', (req, res) => {
    try {
        offer = req.body.offer;
        res.status(200).json({
            success: true
        });
    }
    catch (err) {
        console.log("An error occurred while storing the offer:", err.toString());
        res.status(500).json({
            success: false
        });
    }
});

app.get('/fetch', (req, res) => {
    try {
        console.log("Sending offer:", offer);
        let successResp = {
            success: true,
            offer: offer
        };
        res.status(200).json(successResp);
    }
    catch (err) {
        console.log("An error occurred while fetching the offer:", err.toString());
        res.status(500).json({
            success: false
        });
    }
});

app.listen(portNumber, () => {
    console.log(`Signaling server started on port ${portNumber}`);
});
