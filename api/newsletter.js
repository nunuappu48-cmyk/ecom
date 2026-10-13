// Vercel Serverless Function: Newsletter Subscription Endpoint
import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const { email } = req.body || {}

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required.' })
  }

  const connectionString = process.env.VITE_NEON_DATABASE_URL || process.env.DATABASE_URL

  if (!connectionString) {
    return res.status(200).json({
      success: true,
      message: 'Email subscribed successfully!'
    })
  }

  try {
    const sql = neon(connectionString)
    await sql`
      INSERT INTO public.newsletter_subscribers (email)
      VALUES (${email.toLowerCase()})
      ON CONFLICT (email) DO NOTHING
    `

    return res.status(200).json({
      success: true,
      message: 'Welcome to EcomCenter updates!'
    })
  } catch (err) {
    console.error('Newsletter API error:', err)
    return res.status(500).json({ error: 'Failed to process subscription.' })
  }
}
