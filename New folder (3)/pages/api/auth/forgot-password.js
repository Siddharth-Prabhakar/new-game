import clientPromise from '../../../lib/mongodb'
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const client = await clientPromise
    const db = client.db('webgame')
    const users = db.collection('users')

    // Find user by email
    const user = await users.findOne({ email })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Update user with reset token
    await users.updateOne(
      { _id: user._id },
      { 
        $set: { 
          resetToken,
          resetTokenExpiry
        } 
      }
    )

    // In a real app, you would send an email here
    // For now, we'll just return the token (in production, send via email)
    res.status(200).json({ 
      message: 'Password reset email sent',
      resetToken // Remove this in production
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 