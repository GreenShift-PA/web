import * as express from 'express'

const app = express()

app.get("/", (req, res) => {
    res.status(200).send('Server up')
})

app.listen(process.env.PORT, () => {
    console.log("Server up");
})