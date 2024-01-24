// npm i --save-dev @types/express
// npm i --save-dev @types/morgan
// npm i --save-dev @types/cors
import express, { Request, Response, NextFunction } from 'express'
import logger from 'morgan'
import cors from 'cors'

interface ServerError {
  status?: number
  message?: string
}

const app = express()
const formatLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatLogger))
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.all('*', (_, res: Response) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err: ServerError, req: Request, res: Response, next: NextFunction): void => {
  const { status = 500, message = 'Server Error' } = err
  res.status(status).json({ message })
})

export default app
