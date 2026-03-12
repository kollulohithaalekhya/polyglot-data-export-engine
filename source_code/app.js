require("dotenv").config()

const express = require("express")
const app = express()

const exportRoutes = require("./routes/exportRoutes")
const benchmarkRoutes = require("./routes/benchmarkRoutes")

app.use(express.json())

app.use("/", exportRoutes)
app.use("/", benchmarkRoutes)

app.get("/", (req,res)=>{
    res.send("Polyglot Data Export Engine Running")
})

const PORT = process.env.PORT || 8080

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})