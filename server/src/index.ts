import connectDB from "../db/index"
import dotenv from "dotenv"
import { server } from "./app"

const port = process.env.HTTP_PORT || 8000

dotenv.config({
    path: './.env'
})

connectDB().then(() => {
    server.listen(port, () => {
        console.log(`Server is listening to port ${port}`)
    })
    server.on("error", (error) => {
        console.log("ERROR: ", error)
        throw error
    })
}).catch((error) => {
    console.log("MongoDB connection failed: ", error)
})