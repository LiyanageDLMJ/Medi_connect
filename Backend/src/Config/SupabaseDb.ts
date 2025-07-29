import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = "postgresql://postgres:tilSuTUaWpMIMGwh@db.meebbkyglwiuqdowfhdn.supabase.co:5432/postgres"
const sql = postgres(connectionString)

export default sql