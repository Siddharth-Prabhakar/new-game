import clientPromise from '../../../lib/mongodb'
import { requireAuth } from '../../../lib/auth'

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { score, level, gameData } = req.body
    const userId = req.userId

    if (!score || !level) {
      return res.status(400).json({ error: 'Score and level are required' })
    }

    const client = await clientPromise
    const db = client.db('webgame')
    const users = db.collection('users')

    // Get current user stats
    const user = await users.findOne({ _id: userId })
    const currentStats = user.gameStats || {}

    // Update game statistics
    const updatedStats = {
      level: Math.max(currentStats.level || 1, level),
      score: Math.max(currentStats.score || 0, score),
      gamesPlayed: (currentStats.gamesPlayed || 0) + 1,
      bestScore: Math.max(currentStats.bestScore || 0, score),
      lastPlayed: new Date()
    }

    // Update user stats
    await users.updateOne(
      { _id: userId },
      { $set: { gameStats: updatedStats } }
    )

    // Save game session
    const gameSession = {
      userId,
      score,
      level,
      gameData,
      playedAt: new Date()
    }

    const sessions = db.collection('gameSessions')
    await sessions.insertOne(gameSession)

    res.status(200).json({
      message: 'Score saved successfully',
      stats: updatedStats
    })

  } catch (error) {
    console.error('Save score error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default requireAuth(handler) 