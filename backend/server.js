const express = require('express')
const app = express()
const apiPort = 5000
app.use(express.urlencoded({ extended: true}));


app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

app.listen(apiPort, () => {
    console.log(`Server running on port ${apiPort}`)
})