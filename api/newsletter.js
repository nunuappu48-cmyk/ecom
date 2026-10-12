// Vercel Serverless Function: Newsletter Subscription Endpoint
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const { email } = req.body || {}

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required.' })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('placeholder')) {
    // Offline / Demo fallback
    return res.status(200).json({
      success: true,
      message: 'Demo mode: Email subscribed successfully! 🍯'
    })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email: email.toLowerCase() }])

    if (error && error.code !== '23505') {
      throw error
    }

    return res.status(200).json({
      success: true,
      message: 'Welcome to the Sweet Loop! 🍯'
    })
  } catch (err) {
    console.error('Newsletter API error:', err)
    return res.status(500).json({ error: 'Failed to process subscription.' })
  }
}
