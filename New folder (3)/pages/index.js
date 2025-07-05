import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Web Game - Play & Compete</title>
        <meta name="description" content="A fun web game with authentication" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span className={styles.highlight}>Web Game</span>
        </h1>

        <p className={styles.description}>
          A fun and challenging game with user authentication, leaderboards, and more!
        </p>

        {isLoggedIn ? (
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <h2>Welcome back, {user?.username}!</h2>
              <div className={styles.stats}>
                <p>Level: {user?.gameStats?.level || 1}</p>
                <p>Best Score: {user?.gameStats?.bestScore || 0}</p>
                <p>Games Played: {user?.gameStats?.gamesPlayed || 0}</p>
              </div>
            </div>
            
            <div className={styles.actionButtons}>
              <Link href="/game" className={styles.playButton}>
                Play Game
              </Link>
              <Link href="/profile" className={styles.profileButton}>
                Profile
              </Link>
              <Link href="/leaderboard" className={styles.leaderboardButton}>
                Leaderboard
              </Link>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.authSection}>
            <div className={styles.authButtons}>
              <Link href="/login" className={styles.loginButton}>
                Login
              </Link>
              <Link href="/register" className={styles.registerButton}>
                Sign Up
              </Link>
            </div>
            
            <div className={styles.features}>
              <h3>Game Features:</h3>
              <ul>
                <li>🎮 Fun and addictive gameplay</li>
                <li>🏆 Global leaderboard</li>
                <li>👤 User profiles and statistics</li>
                <li>🔐 Secure authentication</li>
                <li>📊 Progress tracking</li>
                <li>🎯 Multiple levels</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Web Game © 2024 - Built with Next.js and MongoDB</p>
      </footer>
    </div>
  )
} 