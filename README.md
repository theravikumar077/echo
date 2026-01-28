# 🌐 Echo — Location-Based Anonymous Group Chat

> **Anonymous nearby group chats. No identity. No noise.**

Echo is a modern, privacy-first, location-based anonymous group chat web application.  
It allows users to create temporary group chats that can be joined anonymously by anyone within a **5 km radius**, using a **shareable live link**.

No logins for anonymous users.  
No identity leaks.  
No long-term message storage.

Built with **production-grade architecture**, **real-time WebSockets**, and a **premium glassmorphic UI**.

---

## 🚀 Product Vision

Echo is designed for:
- Hyperlocal conversations
- Event-based anonymous chats
- Temporary communities
- Privacy-focused social interaction

Core principles:
- **Privacy-first**
- **Real-time**
- **Minimal data**
- **Premium UX**

---

## ✨ Key Features

### 🔐 Authentication (Registered Users Only)
- Email + password authentication
- JWT-based secure sessions
- Login required **only** for dashboard access
- Anonymous users never authenticate

---

### 🧭 Location-Based Access
- Each group has a fixed **5 km radius**
- Browser requests location permission
- Distance validation is done **server-side**
- Users outside radius are blocked

---

### 🧑‍🤝‍🧑 Anonymous Group Chats
- Join groups via shareable link
- No login, no identity tracking
- Random anonymous name + avatar per session
- Identity exists only during session

---

### 💬 Real-Time Chat (WebSockets)
- Socket.IO-powered live chat
- Typing indicators
- Join / leave notifications
- Smooth animated message flow
- Auto-scroll + micro-interactions

---

### 👑 Admin Controls (Group Creator)
- Mute users
- Kick users
- Clear chat
- Manually close group
- Groups auto-destroy after expiry

---

### 🛡 Safety & Moderation
- Rate limiting per socket
- Spam detection
- Profanity filtering
- Report user system
- Auto-mute on abuse
- Temporary bans (group-level)

---

## 🎨 Design System (Glassmorphism)

**Design Language**
- Frosted glass cards (`backdrop-blur`)
- Transparent layers + gradients
- Dark mode by default
- Neon accents (cyan / purple / blue)
- Rounded corners (18px–28px)
- Soft glowing borders
- Subtle shadows

**Typography**
- Modern sans-serif (Inter / Poppins / Satoshi)
- Soft whites, no harsh contrast
- Clear visual hierarchy

**Animations (Framer Motion)**
- Page transitions (fade + slide)
- Button hover micro-interactions
- Glass card hover lift
- Chat message slide-in + fade
- Typing indicator animation
- Loading shimmer / pulse

**UX Rules**
- Mobile-first
- Fully responsive
- Touch-friendly
- Clean, minimal, futuristic

---

## 🧩 User Flow

### 1️⃣ Landing Page
- Fullscreen hero
- Animated gradient background
- Glassmorphic hero card
- CTA:
  - Login
  - Sign Up
- Tagline:
  > *Anonymous nearby group chats. No identity. No noise.*

---

### 2️⃣ Dashboard (Authenticated Users)
- Create new groups
- View active groups
- View expired groups
- Group cards show:
  - Group name
  - Status
  - Radius (5 km)
  - Expiry timer
  - Copy share link

---

### 3️⃣ Group Creation
- Glass modal / fullscreen mobile view
- Fields:
  - Group name
  - Optional description
  - Auto-detected location
  - Fixed radius (5 km)
  - Optional expiry
- Backend generates:
  - Unique group ID
  - Shareable URL
- Creator becomes admin

---

### 4️⃣ Anonymous Group Join
- User opens share link
- Location permission requested
- Server validates distance
- If valid:
  - Anonymous identity assigned
  - Join WebSocket room
- If invalid:
  - Animated access denied screen

---

## ⚙️ Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS (Glassmorphism)
- Framer Motion (Animations)
- Socket.IO Client

### Backend
- Node.js
- Express.js
- Socket.IO

### Database
- PostgreSQL / MongoDB

### Authentication
- JWT (registered users only)

### Real-Time Scaling (Optional)
- Redis adapter for Socket.IO
- Horizontal scaling support

---

## 🗂 Project Structure

### Frontend
