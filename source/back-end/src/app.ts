import path from 'path'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { appRoutes } from './router'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const app = express()

/* =========BACK-END====== */

/* Security Middlewares */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://bsbeauty.duckdns.org'
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) { callback(null, true); return }

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': ["'self'", 'data:', 'blob:', 'https:'],
      'script-src': [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'blob:',
        'https://vlibras.gov.br',
        'https://www.vlibras.gov.br',
        'https://cdn.jsdelivr.net',
        'localhost:*'
      ],
      'worker-src': ["'self'", 'blob:'],
      'media-src': ["'self'", 'blob:', 'https:'],
      'img-src': ["'self'", 'data:', 'https:'],
      'connect-src': ["'self'", 'ws:', 'https:']
    }
  },
  referrerPolicy: { policy: 'no-referrer' },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-origin' }
}))
app.use((req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    [
      'geolocation=()',
      'camera=()',
      'microphone=()',
      'fullscreen=(self)',
      'autoplay=(self)',
      'interest-cohort=()'
    ].join(', ')
  )
  next()
})
app.disable('x-powered-by')
/* Application Middlewares */
app.use(cookieParser())
app.use(express.json())
app.use('/api', appRoutes)
/* =========FRONT-END====== */
app.use(express.static(path.join(dirname, '..', '..', 'front-end', 'build')))
app.get('*', (_req, res) => {
  res.sendFile(path.join(dirname, '..', '..', 'front-end', 'build', 'index.html'))
})
