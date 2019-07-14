import dotenv from 'dotenv'

const result = dotenv.config()
if (result.error) {
  console.error(result.error)
}

export const {
  PUBLIC_PORT,
  PRIVATE_PORT,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASS,
  SESSION_SECRET
} = process.env