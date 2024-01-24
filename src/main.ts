import mongoose from 'mongoose'
import app from './app.js'
import dtnv from 'dotenv'

dtnv.config()
const { DB_HOST, PORT = 5001 } = process.env

if (DB_HOST !== undefined) {
  mongoose
    .connect(DB_HOST)
    .then(() => {
      console.log('Database connection successful')
      app.listen(PORT, () => {
        console.log(`Server running. Use our API on port ${PORT}`)
      })
    })
    .catch((e) => {
      console.log(e.message)
      process.exit(1)
    })
}

// app.use('/api/auth', require('./routes/auth.routes'))
// app.use('/api/link', require('./routes/link.routes'))
// app.use('/t', require('./routes/redirect.routes'))
