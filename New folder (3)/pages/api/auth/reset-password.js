import clientPromise from '../../../lib/mongodb'
import { hashPassword } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const client = await clientPromise
    const db = client.db('webgame')
    const users = db.collection('users')

    // Find user with valid reset token
    const user = await users.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    })

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' })
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update user password and clear reset token
    await users.updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null
        } 
      }
    )

    res.status(200).json({ message: 'Password reset successfully' })

  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 