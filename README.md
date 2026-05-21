# Interview Platform

An AI-powered interview simulation platform that helps candidates prepare for job interviews and assists recruiters in evaluating talent more effectively. This full-stack application supports live code execution, real-time expression tracking, personalized question generation, and detailed feedback analytics.

---

## Features

- **AI-Powered Interviews**: Simulates realistic job interviews using conversational AI tailored to different roles.
- **Live Code Execution**: Supports multiple languages using Judge0 API and Monaco Editor.
- **Expression Tracking**: Tracks user expressions every 3 seconds via Face-api.js for emotional analysis.
- **Real-Time Updates**: Uses Socket.IO for smooth and reactive UI updates during interviews.
- **Authentication**: Clerk integration for secure user management and session tracking.
- **3D Avatars with Lip Sync**: Integrated Ready Player Me avatars for immersive user representation.
- **Feedback Reports**: Provides confidence scores, strengths, and areas for improvement post-interview.
- **Analytics Dashboard**: Displays expression and performance analytics using Recharts.

---

##  Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, Zustand, Monaco Editor, Face-api.js, Recharts
- **Backend**: Node.js, Express.js, Zod (validation), Socket.IO
- **Auth & Avatars**: Clerk, Ready Player Me
- **Database**: MongoDB
- **Execution**: Judge0 API

---

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/interview-ai.git
cd interview-ai

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
