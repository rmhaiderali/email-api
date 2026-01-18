import express from "express"
import nodemailer from "nodemailer"
import { log } from "boxen-extended"

const app = express()

app.use(express.json())

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" })
})

app.post("/api/send-mail", async (req, res) => {
  const { user, pass, from_name, to, subject, text, html, secret } = req.body

  if (secret !== process.env.API_SECRET) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const transporter = nodemailer.createTransport({
    // debug: true,
    logger: true,
    secure: true,
    service: "gmail",
    auth: { user, pass },
    tls: { rejectUnauthorized: true },
  })

  const from = from_name ? from_name + " <" + user + ">" : user

  const options = { from, to, subject, text, html }

  const { error, info } = await new Promise((resolve) => {
    transporter.sendMail(options, (error, info) => resolve({ error, info }))
  })

  log(error ?? info, { boxenOptions: { borderColor: error ? "red" : "green" } })

  res.json({ status: error ? "err" : "ok" })
})

export default app
