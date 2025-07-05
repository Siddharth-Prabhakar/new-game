# 🎮 Web Game with Authentication

A modern web game built with Next.js, featuring user authentication, leaderboards, and a fun click-based game. Perfect for learning full-stack development and deploying to Vercel.

## ✨ Features

- **🔐 User Authentication**
  - Email/password registration and login
  - JWT token-based authentication
  - Password hashing with bcrypt
  - Email verification (optional)
  - Password reset functionality

- **🎯 Interactive Game**
  - Click-based target game
  - Real-time scoring system
  - Multiple levels with increasing difficulty
  - Pause/resume functionality
  - Game statistics tracking

- **🏆 Leaderboard System**
  - Global leaderboard with top players
  - Real-time score updates
  - Player statistics and rankings

- **👤 User Profiles**
  - Personal game statistics
  - Editable username
  - Account information
  - Game history

- **🎨 Modern UI/UX**
  - Responsive design
  - Beautiful gradients and animations
  - Glassmorphism effects
  - Mobile-friendly interface

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- MongoDB Atlas account (free tier)
- Vercel account (free tier)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd web-game-auth
npm install
```

### 2. Set Up MongoDB

1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Create a database named `webgame`

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to see your game!

## 🚀 Deploy to Vercel

### Option 1: Deploy from GitHub

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Add Environment Variables**
   - In Vercel dashboard, go to Project Settings
   - Add your environment variables:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `EMAIL_USER`
     - `EMAIL_PASS`

4. **Deploy**
   - Click "Deploy"
   - Your game will be live in minutes!

### Option 2: Deploy with Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

## 📁 Project Structure

```
web-game-auth/
├── pages/                 # Next.js pages
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── game/         # Game-related endpoints
│   │   └── user/         # User profile endpoints
│   ├── _app.js           # App wrapper
│   ├── index.js          # Home page
│   ├── login.js          # Login page
│   ├── register.js       # Registration page
│   ├── game.js           # Game page
│   ├── leaderboard.js    # Leaderboard page
│   └── profile.js        # Profile page
├── styles/               # CSS modules
│   ├── globals.css       # Global styles
│   ├── Home.module.css   # Home page styles
│   ├── Auth.module.css   # Auth pages styles
│   ├── Game.module.css   # Game page styles
│   ├── Leaderboard.module.css
│   └── Profile.module.css
├── lib/                  # Utility functions
│   ├── mongodb.js        # Database connection
│   └── auth.js           # Authentication utilities
├── package.json          # Dependencies
├── vercel.json           # Vercel configuration
├── next.config.js        # Next.js configuration
└── README.md             # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Game
- `POST /api/game/save-score` - Save game score
- `GET /api/game/leaderboard` - Get leaderboard

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## 🎮 How to Play

1. **Register/Login** - Create an account or sign in
2. **Start Game** - Click "Play Game" from the home page
3. **Click Targets** - Click on the colored circles that appear
4. **Score Points** - Each target gives you points
5. **Level Up** - Reach higher levels for more challenging gameplay
6. **Compete** - Check the leaderboard to see how you rank

## 🛠️ Customization

### Adding New Game Features

1. **New Game Types**: Modify `pages/game.js`
2. **Additional Stats**: Update the database schema in API routes
3. **New UI Elements**: Add components and styles
4. **Game Mechanics**: Modify game logic in the game component

### Styling

- All styles use CSS Modules
- Color scheme can be changed in CSS variables
- Responsive design included
- Glassmorphism effects for modern look

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Rate limiting (can be added)
- Secure cookie handling

## 📱 Mobile Support

- Fully responsive design
- Touch-friendly game controls
- Mobile-optimized UI
- Progressive Web App ready

## 🚀 Performance

- Server-side rendering with Next.js
- Optimized images and assets
- Efficient database queries
- Minimal bundle size
- Fast loading times

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your connection string
   - Ensure IP whitelist includes Vercel
   - Verify database name is correct

2. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token expiration settings
   - Clear browser storage if needed

3. **Deployment Problems**
   - Check environment variables in Vercel
   - Verify build settings
   - Check function timeout limits

### Getting Help

- Check the console for error messages
- Verify all environment variables are set
- Test locally before deploying
- Check Vercel function logs

## 📈 Scaling

### For Production Use

1. **Database**: Upgrade MongoDB Atlas plan
2. **Email**: Use professional email service
3. **CDN**: Vercel Edge Network (included)
4. **Monitoring**: Add analytics and error tracking
5. **Security**: Implement rate limiting and additional security measures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with Next.js and React
- Styled with CSS Modules
- Database powered by MongoDB
- Deployed on Vercel
- Icons from emoji and CSS

---

**Happy Gaming! 🎮✨** 