import clientPromise from '../../../lib/mongodb'
import { requireAuth } from '../../../lib/auth'

async function handler(req, res) {
  const userId = req.userId

  try {
    const client = await clientPromise
    const db = client.db('webgame')
    const users = db.collection('users')

    if (req.method === 'GET') {
      // Get user profile
      const user = await users.findOne(
        { _id: userId },
        { 
          projection: { 
            password: 0, 
            verificationToken: 0, 
            resetToken: 0 
          } 
        }
      )

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.status(200).json({
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          isVerified: user.isVerified,
          gameStats: user.gameStats,
          createdAt: user.createdAt
        }
      })

    } else if (req.method === 'PUT') {
      // Update user profile
      const { username } = req.body

      if (!username) {
        return res.status(400).json({ error: 'Username is required' })
      }

      // Check if username is already taken
      const existingUser = await users.findOne({ 
        username, 
        _id: { $ne: userId } 
      })

      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' })
      }

      // Update user
      await users.updateOne(
        { _id: userId },
        { $set: { username } }
      )

      res.status(200).json({ message: 'Profile updated successfully' })

    } else {
      return res.status(405).json({ error: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default requireAuth(handler) 