const express = require("express");
const {connectToMongoDB} = require("./connection")
const urlRoute = require('./routes/url');

const URL = require('./models/url');

const app = express();
const PORT = 8000;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
.then(() => console.log("MongoDB connected"))

app.use(express.json());

app.use("/url", urlRoute);

app.get('/:shortId', async(req, res) => {
    const shortId = req.params.shortId;
   const entry =  await URL.findOneAndUpdate(
        {
            shortId
        },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                }
            }
        }  
    );

    console.log("entry", entry);
    res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`))