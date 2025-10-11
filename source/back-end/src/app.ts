import path from 'path'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { appRoutes } from './router'
import cookieParser from 'cookie-parser'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const app = express()

/* =========BACK-END====== */
app.use(cookieParser())
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(express.json())
app.use('/api', appRoutes)
/* =========FRONT-END====== */
app.use(express.static(path.join(dirname, '..', '..', 'front-end', 'build')))
app.get('*', (_req, res) => {
  res.sendFile(path.join(dirname, '..', '..', 'front-end', 'build', 'index.html'))
})
