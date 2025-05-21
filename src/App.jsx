import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'
import ChatUI from './components/chatbot'
import MusicClassificationUI from './components/MusicClassificationUI'
import FaceAuthenticationPage from './components/FaceAuthentication'
import MusicClassification from './components/MusicClassification'
import AIChatbot from './components/AIChatbot'
import Dashboard from './components/Dashboard'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<ChatUI />} />
        <Route path="/music" element={<MusicClassificationUI />} />
        <Route path="/info-face" element={<FaceAuthenticationPage />} />
        <Route path="/info-music" element={<MusicClassification />} />
        <Route path="/info-chat" element={<AIChatbot />} />
      </Routes>
    </Router>
  )
}