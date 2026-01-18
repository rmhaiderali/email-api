import "dotenv/config"
import { log } from "boxen-extended"
import app from "./app.js"

const PORT = process.env.PORT

app.listen(PORT, () => {
  log("Server is running on http://localhost:" + PORT)
})
