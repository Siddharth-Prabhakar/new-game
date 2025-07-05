import clientPromise from '../../../lib/mongodb'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const client = await clientPromise
    const db = client.db('webgame')
    const users = db.collection('users')

    // Get top 10 players by best score
    const leaderboard = await users
      .find({ 'gameStats.bestScore': { $gt: 0 } })
      .sort({ 'gameStats.bestScore': -1 })
      .limit(10)
      .project({
        username: 1,
        gameStats: 1,
        _id: 0
      })
      .toArray()

    res.status(200).json({
      leaderboard: leaderboard.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        bestScore: user.gameStats.bestScore,
        level: user.gameStats.level,
        gamesPlayed: user.gameStats.gamesPlayed
      }))
    })

  } catch (error) {
    console.error('Leaderboard error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 