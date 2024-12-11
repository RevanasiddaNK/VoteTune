# VoteTune

**VoteTune** is a collaborative music player app where a group of friends can select songs, vote for the next song to play, and enjoy a seamless music-sharing experience. The app allows users to create/join music parties, add songs to playlists, and vote on which song should play next, all in real time.

## Project Overview

**VoteTune** provides a fun, interactive music experience for friends and communities. It offers features such as user authentication, playlist management, and a voting system to decide the next song to play. The app aims to create a unique and shared music experience, bringing friends closer together through music.

## Key Features

- 🎤 **User  Authentication**: Secure login system with JWT-based authentication.
- 🎶 **Create/Join a Party**: Users can create a party or join an existing one with friends.
- ➕ **Add Songs**: Users can add songs from YouTube to the party playlist.
- 🗳️ **Vote System**: Members vote on which song should play next.
- 🔄 **Real-time Song Playing**: The song with the most votes gets played.
- 🚀 **Live Updates**: The app uses real-time communication to update votes and song transitions.

## Technologies Used

- **Frontend**:  
  - **Next.js**: React framework for building the frontend.
  - **TypeScript**: Static typing for JavaScript, improving code quality and maintainability.
  - **Tailwind CSS**: Utility-first CSS framework for styling.
  - **React**: JavaScript library for building user interfaces.
  - **Zod**: Type-safe validation library for user input.

- **Authentication**:  
  - **NextAuth.js**: Authentication library for Next.js.

- **Real-time Communication**:  
  - **Socket.io**: To enable real-time communication for song votes and playback (long polling for now).

- **Database**:  
  - **Prisma ORM**: Database toolkit for interacting with MySQL.

### Getting Started


1. clone the repository:
   ```bash
   git clone https://github.com/code100x/muzer
   ```
2. Navigate to the project directory:
   ```bash
   cd muzer
   ```
3. (optional) Start a PostgreSQL database using Docker:
   ```bash
   docker run -d \
       --name muzer-db \
       -e POSTGRES_USER=myuser \
       -e POSTGRES_PASSWORD=mypassword \
       -e POSTGRES_DB=mydatabase \
       -p 5432:5432 \
       postgres
   ```
   based on this command the connection url will be
   ```
   DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mydatabase?schema=public
   ```
4. Create a `.env` file based on the `.env.example` file and configure the `DATABASE_URL` with your postgreSQL connection string.
5. Install dependencies:
   ```bash
   pnpm install
   ```
6. Run database migrations:
   ```bash
   pnpm run prisma:migrate
   ```
7. Start the development server:
   ```bash
   pnpm run dev
