import path from 'path'
import express from 'express'
import cors from 'cors'
import { appRoutes } from './router'

const app = express()

/* =========BACK-END-END====== */
app.use(cors({
  origin: '*'
}))
app.use(express.json())
app.use('/api', appRoutes)

/* =========FRONT-END====== */
app.use(express.static(path.join(__dirname, '..', '..', 'front-end', 'build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'front-end', 'build', 'index.html'))
})

app.listen(3000, () => {
  console.log(`HTTP Server listening on port ${3000}`)
})
