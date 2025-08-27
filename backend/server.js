import express from 'express'
import sql from './db.js'
const app = express()
app.use(express.json())

app.post('/test-invoice', async (req, res) => {
  try {
    const invoice = await sql`
      INSERT INTO invoices (ship_to, bill_no, terms_of_payment, state, grand_total)
      VALUES ('Test Customer', 'BILL001', 'Net 30', 'Karnataka', 1000)
      RETURNING *
    `
    res.json({ message: 'Invoice created', invoice: invoice[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/test-invoice/:id', async (req, res) => {
  try {
    const invoice = await sql`
      SELECT * FROM invoices WHERE id = ${req.params.id}
    `
    res.json({ invoice: invoice[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(5000, () => console.log('Server running on port 5000'))
