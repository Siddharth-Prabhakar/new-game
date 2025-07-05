import clientPromise from '../../../lib/mongodb'
import { hashPassword, generateToken } from '../../../lib/auth'
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password, username } = req.body

    // Validate input
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const client = await clientPromise
    const db = client.db('webgame')
    const users = db.collection('users')

    // Check if user already exists
    const existingUser = await users.findOne({ 
      $or: [{ email }, { username }] 
    })

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')

    // Create user
    const user = {
      email,
      username,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
      createdAt: new Date(),
      gameStats: {
        level: 1,
        score: 0,
        gamesPlayed: 0,
        bestScore: 0
      }
    }

    const result = await users.insertOne(user)

    // Generate JWT token
    const token = generateToken(result.insertedId)

    // Set cookie
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`)

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.insertedId,
        email,
        username,
        isVerified: false
      },
      token
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 