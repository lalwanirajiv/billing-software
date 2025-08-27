import postgres from 'postgres'
import 'dotenv/config'  


const sql = postgres(process.env.DATABASE_URL)

async function testConnection() {
  try {
    const result = await sql`SELECT 1+1 AS result`
    console.log('✅ Database connected. Test query result:', result[0].result)
  } catch (err) {
    console.log(err);
    
    console.error('❌ DB connection failed:', err.message)
  }
}

testConnection()

export default sql
