import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Game.module.css'

export default function Game() {
  const [gameState, setGameState] = useState('menu') // menu, playing, paused, gameOver
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [timeLeft, setTimeLeft] = useState(60)
  const [targets, setTargets] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const gameRef = useRef(null)
  const timerRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      // Spawn targets
      const spawnInterval = setInterval(() => {
        spawnTarget()
      }, 2000 - (level * 100)) // Faster spawning at higher levels

      return () => {
        clearInterval(timerRef.current)
        clearInterval(spawnInterval)
      }
    }
  }, [gameState, level])

  const spawnTarget = () => {
    if (gameState !== 'playing') return

    const newTarget = {
      id: Date.now(),
      x: Math.random() * (gameRef.current?.clientWidth - 50) || 0,
      y: Math.random() * (gameRef.current?.clientHeight - 50) || 0,
      size: Math.random() * 30 + 20,
      points: Math.floor(Math.random() * 5) + 1
    }

    setTargets(prev => [...prev, newTarget])

    // Remove target after 3 seconds
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== newTarget.id))
    }, 3000)
  }

  const handleTargetClick = (target) => {
    setScore(prev => prev + target.points)
    setTargets(prev => prev.filter(t => t.id !== target.id))
    
    // Level up every 50 points
    if ((score + target.points) % 50 === 0) {
      setLevel(prev => prev + 1)
    }
  }

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setLevel(1)
    setTimeLeft(60)
    setTargets([])
  }

  const pauseGame = () => {
    setGameState('paused')
    clearInterval(timerRef.current)
  }

  const resumeGame = () => {
    setGameState('playing')
  }

  const endGame = () => {
    setGameState('gameOver')
    clearInterval(timerRef.current)
    saveScore()
  }

  const saveScore = async () => {
    if (!user) return

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/game/save-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          score,
          level,
          gameData: { timeLeft, targetsHit: targets.length }
        })
      })

      if (response.ok) {
        // Update local user data
        const userData = JSON.parse(localStorage.getItem('user'))
        const updatedUser = { ...userData, gameStats: { ...userData.gameStats, bestScore: Math.max(userData.gameStats?.bestScore || 0, score) } }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error('Failed to save score:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Play Game - Web Game</title>
        <meta name="description" content="Play the game" />
      </Head>

      <div className={styles.gameHeader}>
        <Link href="/" className={styles.backButton}>← Back to Home</Link>
        <div className={styles.gameInfo}>
          <span>Score: {score}</span>
          <span>Level: {level}</span>
          <span>Time: {formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className={styles.gameContainer}>
        {gameState === 'menu' && (
          <div className={styles.menu}>
            <h1>Click the Targets!</h1>
            <p>Click on the targets that appear to score points. The faster you click, the more points you get!</p>
            <button onClick={startGame} className={styles.startButton}>
              Start Game
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className={styles.gameArea}>
            <div 
              ref={gameRef}
              className={styles.gameCanvas}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  // Clicked on empty space
                  setScore(prev => Math.max(0, prev - 1))
                }
              }}
            >
              {targets.map(target => (
                <div
                  key={target.id}
                  className={styles.target}
                  style={{
                    left: target.x,
                    top: target.y,
                    width: target.size,
                    height: target.size
                  }}
                  onClick={() => handleTargetClick(target)}
                >
                  <span className={styles.targetPoints}>+{target.points}</span>
                </div>
              ))}
            </div>
            <button onClick={pauseGame} className={styles.pauseButton}>
              Pause
            </button>
          </div>
        )}

        {gameState === 'paused' && (
          <div className={styles.pauseMenu}>
            <h2>Game Paused</h2>
            <button onClick={resumeGame} className={styles.resumeButton}>
              Resume
            </button>
            <button onClick={startGame} className={styles.restartButton}>
              Restart
            </button>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className={styles.gameOver}>
            <h2>Game Over!</h2>
            <div className={styles.finalStats}>
              <p>Final Score: {score}</p>
              <p>Level Reached: {level}</p>
              <p>Time Remaining: {formatTime(timeLeft)}</p>
            </div>
            {loading ? (
              <p>Saving score...</p>
            ) : (
              <div className={styles.gameOverButtons}>
                <button onClick={startGame} className={styles.playAgainButton}>
                  Play Again
                </button>
                <Link href="/leaderboard" className={styles.leaderboardButton}>
                  View Leaderboard
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 