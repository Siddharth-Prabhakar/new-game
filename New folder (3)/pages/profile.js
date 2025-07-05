import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Profile.module.css'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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
    setNewUsername(JSON.parse(userData).username)
    setLoading(false)
  }, [router])

  const handleUpdateProfile = async () => {
    if (!newUsername.trim()) {
      setError('Username cannot be empty')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: newUsername })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Profile updated successfully!')
        setEditing(false)
        
        // Update local user data
        const userData = JSON.parse(localStorage.getItem('user'))
        const updatedUser = { ...userData, username: newUsername }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
      } else {
        setError(data.error || 'Failed to update profile')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return <div className={styles.loading}>Loading profile...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Profile - Web Game</title>
        <meta name="description" content="User profile" />
      </Head>

      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>← Back to Home</Link>
        <h1>👤 Profile</h1>
      </div>

      <div className={styles.profileCard}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.profileSection}>
          <h2>Account Information</h2>
          
          <div className={styles.infoGroup}>
            <label>Email:</label>
            <span>{user.email}</span>
          </div>

          <div className={styles.infoGroup}>
            <label>Username:</label>
            {editing ? (
              <div className={styles.editGroup}>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className={styles.editInput}
                  maxLength={20}
                />
                <button 
                  onClick={handleUpdateProfile}
                  className={styles.saveButton}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button 
                  onClick={() => {
                    setEditing(false)
                    setNewUsername(user.username)
                    setError('')
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className={styles.displayGroup}>
                <span>{user.username}</span>
                <button 
                  onClick={() => setEditing(true)}
                  className={styles.editButton}
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          <div className={styles.infoGroup}>
            <label>Account Status:</label>
            <span className={user.isVerified ? styles.verified : styles.unverified}>
              {user.isVerified ? '✓ Verified' : '⚠ Not Verified'}
            </span>
          </div>

          <div className={styles.infoGroup}>
            <label>Member Since:</label>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className={styles.profileSection}>
          <h2>Game Statistics</h2>
          
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{user.gameStats?.level || 1}</div>
              <div className={styles.statLabel}>Current Level</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statValue}>{user.gameStats?.bestScore || 0}</div>
              <div className={styles.statLabel}>Best Score</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statValue}>{user.gameStats?.gamesPlayed || 0}</div>
              <div className={styles.statLabel}>Games Played</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {user.gameStats?.gamesPlayed > 0 
                  ? Math.round((user.gameStats?.bestScore || 0) / user.gameStats?.gamesPlayed)
                  : 0
                }
              </div>
              <div className={styles.statLabel}>Average Score</div>
            </div>
          </div>
        </div>

        <div className={styles.profileSection}>
          <h2>Actions</h2>
          
          <div className={styles.actionButtons}>
            <Link href="/game" className={styles.playButton}>
              Play Game
            </Link>
            <Link href="/leaderboard" className={styles.leaderboardButton}>
              View Leaderboard
            </Link>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 