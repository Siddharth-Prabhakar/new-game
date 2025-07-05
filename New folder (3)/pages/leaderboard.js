import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Leaderboard.module.css'

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/game/leaderboard')
      const data = await response.json()

      if (response.ok) {
        setLeaderboard(data.leaderboard)
      } else {
        setError('Failed to load leaderboard')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading leaderboard...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Leaderboard - Web Game</title>
        <meta name="description" content="Top players leaderboard" />
      </Head>

      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>← Back to Home</Link>
        <h1>🏆 Leaderboard</h1>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={fetchLeaderboard} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      )}

      <div className={styles.leaderboardContainer}>
        {leaderboard.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No scores yet. Be the first to play!</p>
            <Link href="/game" className={styles.playButton}>
              Play Game
            </Link>
          </div>
        ) : (
          <div className={styles.leaderboard}>
            {leaderboard.map((player, index) => (
              <div key={index} className={styles.leaderboardItem}>
                <div className={styles.rank}>
                  <span className={styles.rankIcon}>{getRankIcon(player.rank)}</span>
                </div>
                <div className={styles.playerInfo}>
                  <div className={styles.username}>{player.username}</div>
                  <div className={styles.playerStats}>
                    <span>Level {player.level}</span>
                    <span>{player.gamesPlayed} games</span>
                  </div>
                </div>
                <div className={styles.score}>
                  {player.bestScore.toLocaleString()} pts
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <Link href="/game" className={styles.playButton}>
          Play Game
        </Link>
        <p className={styles.updateInfo}>
          Leaderboard updates in real-time
        </p>
      </div>
    </div>
  )
} 