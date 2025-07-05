import clientPromise from '../../../lib/mongodb'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' })
    }

    const client = await clientPromise
    const db = client.db('webgame')
    const users = db.collection('users')

    // Find user with verification token
    const user = await users.findOne({ verificationToken: token })

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' })
    }

    // Update user to verified
    await users.updateOne(
      { _id: user._id },
      { 
        $set: { 
          isVerified: true,
          verificationToken: null 
        } 
      }
    )

    res.status(200).json({ message: 'Email verified successfully' })

  } catch (error) {
    console.error('Email verification error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 