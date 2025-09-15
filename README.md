# 📊 PollWave

PollWave is a **real-time polling application backend** that enables users to create polls, vote on options, and see live updates instantly.  
It is built with **Node.js, Express.js, Prisma, PostgreSQL, and WebSockets**.

---

## 🚀 Features
- **User Management**: Create and retrieve users.
- **Poll Management**: Create and retrieve polls with multiple options.
- **Voting System**: Submit votes for specific poll options.
- **Real-Time Updates**: Live poll results are broadcast via WebSockets.
- **Clean REST API**: Well-structured endpoints following REST best practices.

---

## 🛠️ Tech Stack
- **Backend Framework**: [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Real-Time Communication**: [Socket.IO](https://socket.io/) (or `ws`)

---

## 📂 Database Schema
Using Prisma ORM:

- **User** → `id, name, email, passwordHash`
- **Poll** → `id, question, isPublished, createdAt, updatedAt`
- **PollOption** → `id, text`
- **Vote** → `id`

### Relationships
- **One-to-Many**: 
  - A User can create many Polls.
  - A Poll can have multiple PollOptions.
- **Many-to-Many**: 
  - A User can vote on many PollOptions.
  - A PollOption can be voted on by many Users.

---

## 📡 API Endpoints

### 👤 Users
- `POST /api/users` → Create a new user  
- `GET /api/users/:id` → Get user by ID  

### 📊 Polls
- `POST /api/polls` → Create a new poll with options  
- `GET /api/polls/:id` → Get poll details with options and votes  

### 🗳️ Votes
- `POST /api/votes` → Cast a vote for a poll option  

---

## 🔴 WebSocket Events
- **Join Poll Room** → Clients subscribe to updates for a specific poll.  
- **Vote Cast** → When a vote is submitted, all clients in that poll room receive the updated results instantly.  

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/PollWave.git
cd PollWave
2️⃣ Install dependencies
bash
Copy code
npm install
3️⃣ Configure environment variables
Create a .env file in the root directory:

env
Copy code
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/pollwave"
PORT=4000
4️⃣ Run Prisma migrations
bash
Copy code
npx prisma migrate dev --name init
5️⃣ Start the server
bash
Copy code
npm run dev
🧪 Example Poll Flow
Create a user → POST /api/users

Create a poll → POST /api/polls

Add options → Included during poll creation

Cast a vote → POST /api/votes

Watch results update in real-time via WebSocket

📌 Future Enhancements
User authentication with JWT

Poll expiration & scheduling

Analytics dashboard for poll creators

Docker setup for easy deployment

🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to fork this repo and submit a pull request.

📜 License
This project is licensed under the MIT License.

👨‍💻 Author
PollWave - Developed by Shubham Kumar 🚀
