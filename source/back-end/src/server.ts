import { app } from './app'

const port = process.env.PORT ?? 3000

app.listen(port, () => {
  console.log(`HTTP Server listening on port ${port}`)
})
