import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  styled, Typography, Box, Container, TextField, IconButton, Paper,
  Avatar, Button, useMediaQuery, useTheme
} from '@mui/material';
import {
  FaceRetouchingNatural, Send, Logout, ArrowBack
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { keyframes } from '@emotion/react';

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const AnimatedContainer = styled(motion.div)(({ theme }) => ({
  height: '100dvh',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #0b8280 100%)`,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
}));

const FeatureCircle = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  filter: 'blur(2px)',
  zIndex: 0,
  [theme.breakpoints.down('md')]: { display: 'none' },
}));

const Logo = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& .logo-text': {
    background: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%, rgb(13, 27, 177) 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
    fontSize: '1.5rem',
  }
}));

const ChatContainer = styled(Paper)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(53, 45, 45, 0.2)',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 1,
  margin: theme.spacing(2, 0),
}));

const MessageArea = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const InputArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
}));

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  maxWidth: '80%',
}));

const MessageContent = styled(Box)(({ theme, isUser }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: '16px',
  backgroundColor: isUser ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
  color: 'white',
  wordWrap: 'break-word',
  '& ol, & ul': {
    paddingLeft: theme.spacing(3),
  },
  '& li': {
    marginBottom: theme.spacing(0.5),
  },
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 2, 0, 2),
  width: '100%',
  zIndex: 2,
}));

export default function ChatbotUI() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const inputRef = useRef(null);
  const messageAreaRef = useRef(null);

  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, text: "Hello! I'm MADSKI's AI assistant. How can I help you today?", isUser: false },
  ]);
  const [userInitial, setUserInitial] = useState('U');

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) setUserInitial(username.charAt(0).toUpperCase());
  }, []);

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    const handleKey = (e) => {
      if (document.activeElement !== inputRef.current && /^[a-zA-Z0-9,.? ]$/.test(e.key)) {
        inputRef.current.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    const userMessage = { id: Date.now(), text: message, isUser: true };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');

    try {
      setChatHistory(prev => [...prev, {
        id: Date.now() + 1, text: '', isUser: false, isStreaming: true
      }]);

      const response = await fetch(`${import.meta.env.VITE_CHATBOT}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        while (buffer.includes('\n\n')) {
          const eventEnd = buffer.indexOf('\n\n');
          const chunk = buffer.slice(0, eventEnd);
          buffer = buffer.slice(eventEnd + 2);
          try {
            const eventData = chunk.replace('data: ', '');
            const { content, error } = JSON.parse(eventData);
            if (error) throw new Error(error);
            setChatHistory(prev => {
              const last = prev[prev.length - 1];
              if (last.isStreaming) {
                return [...prev.slice(0, -1), { ...last, text: last.text + (content || '') }];
              }
              return prev;
            });
          } catch (err) {
            console.error('SSE parse error:', err);
          }
        }
      }

      setChatHistory(prev => {
        const last = prev[prev.length - 1];
        return [...prev.slice(0, -1), { ...last, isStreaming: false }];
      });
    } catch (err) {
      setChatHistory(prev => [...prev.slice(0, -1), {
        id: Date.now(), text: `Error: ${err.message}`, isUser: false
      }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const handleLogout = () => navigate('/login');

  return (
    <AnimatedContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <FeatureCircle animate={{ scale: [1, 1.2, 1], rotate: 360 }} transition={{ duration: 20, repeat: Infinity }}
        style={{ width: 600, height: 600, top: -200, left: -200 }} />
      <FeatureCircle animate={{ y: [0, 40, 0] }} transition={{ duration: 12, repeat: Infinity }}
        style={{ width: 400, height: 400, bottom: -150, right: -150 }} />

      <Container maxWidth="xl" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <HeaderContainer>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
              <ArrowBack />
            </IconButton>
            <Logo onClick={() => navigate("/")} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <FaceRetouchingNatural sx={{ fontSize: isMobile ? 40 : 60 }} />
              <Typography variant="body1" className="logo-text">MADSKI</Typography>
            </Logo>
          </Box>
          <Button variant="contained" startIcon={<Logout />} onClick={handleLogout} sx={{
            borderRadius: '12px', backgroundColor: 'black',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.3)' }
          }}>
            {isMobile ? '' : 'Logout'}
          </Button>
        </HeaderContainer>

        <ChatContainer elevation={0}>
          <MessageArea ref={messageAreaRef}>
            {chatHistory.map((msg) => (
              <MessageBubble key={msg.id} isUser={msg.isUser}>
                {!msg.isUser && <Avatar sx={{ bgcolor: theme.palette.primary.main }}><FaceRetouchingNatural /></Avatar>}
                <MessageContent isUser={msg.isUser}>
                  {msg.isStreaming ? (
                    <Typography variant="body1" sx={{ position: 'relative' }}>
                      {msg.text}
                      <Box component="span" sx={{
                        animation: `${blink} 1s infinite`,
                        position: 'absolute', right: -10, bottom: 2
                      }}>▋</Box>
                    </Typography>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ node, ...props }) => <Typography variant="body1" {...props} />,
                        li: ({ node, ...props }) => <li style={{ marginLeft: '1em' }} {...props} />
                      }}>
                      {msg.text}
                    </ReactMarkdown>
                  )}
                </MessageContent>
                {msg.isUser && <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>{userInitial}</Avatar>}
              </MessageBubble>
            ))}
          </MessageArea>

          <InputArea>
            <TextField
              fullWidth
              inputRef={inputRef}
              variant="outlined"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                sx: {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                }
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                '&:hover': { backgroundColor: theme.palette.primary.dark },
              }}
            >
              <Send />
            </IconButton>
          </InputArea>
        </ChatContainer>
      </Container>
    </AnimatedContainer>
  );
}
