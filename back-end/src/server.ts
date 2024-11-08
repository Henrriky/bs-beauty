import express from 'express'
import cors from 'cors'
import { appRoutes } from './router'
// import { errorHandlerMiddleware } from './middlewares/error-handler.middleware'

const app = express()
app.use(cors({
  origin: '*'
}))
app.use(express.json())

app.use('/api', appRoutes)
// app.use('/', errorHandlerMiddleware) // express async middleware error

app.listen(3000, () => {
  console.log(`HTTP Server listening on port ${3000}`)
})
