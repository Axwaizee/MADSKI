import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  styled,
  Typography,
  Box,
  Container,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  FaceRetouchingNatural,
  Send,
  Logout,
  ArrowBack
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { keyframes } from '@emotion/react';

// Add this bounce animation at the top of your file
const bounce = keyframes`
  0%, 100% { 
    transform: translateY(0);
  }
  50% { 
    transform: translateY(-5px);
  }
`;
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

// Styled components
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
  [theme.breakpoints.down('md')]: {
    display: 'none'
  },
}));

const Logo = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& .logo-text': {
    background: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%,rgb(13, 27, 177) 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
    fontSize: '1.5rem'
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
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
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
  position: 'relative',
  '& .typing-dots': {
    display: 'inline-flex',
    gap: 2,
  },
  '& .typing-dots span': {
    display: 'block',
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: 'currentColor',
    animation: `${bounce} 0.8s infinite ease-in-out`,
    '&:nth-of-type(2)': {
      animationDelay: '0.2s',
    },
    '&:nth-of-type(3)': {
      animationDelay: '0.4s',
    },
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
  const messageAreaRef = useRef(null);
  const [message, setMessage] = useState('');
  const [userInitial, setUserInitial] = useState('U');

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username && username.length > 0) {
      setUserInitial(username.charAt(0).toUpperCase());
    }
  }, []);

  const [chatHistory, setChatHistory] = useState([
    { id: 1, text: "Hello! I'm MADSKI's AI assistant. How can I help you today?", isUser: false },
  ]);

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    const userMessage = { id: Date.now(), text: message, isUser: true };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');

    try {
      setChatHistory(prev => [...prev, {
        id: Date.now() + 1,
        text: '',
        isUser: false,
        isStreaming: true
      }]);

      const response = await fetch('http://localhost:5000/chat', {
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

        // Process complete SSE events
        while (buffer.includes('\n\n')) {
          const eventEnd = buffer.indexOf('\n\n');
          const eventChunk = buffer.slice(0, eventEnd);
          buffer = buffer.slice(eventEnd + 2);

          // Handle JSON parsing
          try {
            const eventData = eventChunk.replace('data: ', '');
            const { content, error } = JSON.parse(eventData);

            if (error) {
              throw new Error(error);
            }

            setChatHistory(prev => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage.isStreaming) {
                return [
                  ...prev.slice(0, -1),
                  { ...lastMessage, text: lastMessage.text + (content || '') }
                ];
              }
              return prev;
            });
          } catch (err) {
            console.error('Error parsing event:', err);
          }
        }
      }

      // Finalize streaming state
      setChatHistory(prev => {
        const lastMessage = prev[prev.length - 1];
        return [
          ...prev.slice(0, -1),
          { ...lastMessage, isStreaming: false }
        ];
      });

    } catch (err) {
      setChatHistory(prev => [
        ...prev.slice(0, -1),
        {
          id: Date.now(),
          text: `Error: ${err.message}`,
          isUser: false
        }
      ]);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <AnimatedContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <FeatureCircle
        animate={{ scale: [1, 1.2, 1], rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity }}
        style={{ width: 600, height: 600, top: -200, left: -200 }}
      />
      <FeatureCircle
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        style={{ width: 400, height: 400, bottom: -150, right: -150 }}
      />

      <Container maxWidth="xl" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <HeaderContainer>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              <ArrowBack />
            </IconButton>

            <Logo
              onClick={() => { navigate("/") }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <FaceRetouchingNatural sx={{ fontSize: isMobile ? 40 : 60 }} />
              <Typography variant="body1" className="logo-text">
                MADSKI
              </Typography>
            </Logo>
          </Box>

          <Button
            variant="contained"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              borderRadius: '12px',
              backgroundColor: 'rgb(0, 0, 0)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }
            }}
          >
            {isMobile ? '' : 'Logout'}
          </Button>
        </HeaderContainer>

        <ChatContainer elevation={0}>
          <MessageArea ref={messageAreaRef}>
            {chatHistory.map((msg) => (
              <MessageBubble key={msg.id} isUser={msg.isUser}>
                {!msg.isUser && (
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    <FaceRetouchingNatural />
                  </Avatar>
                )}
                <MessageContent isUser={msg.isUser}>
                  {msg.isStreaming ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body1" sx={{ position: 'relative' }}>
                        {msg.text}
                        <Box
                          component="span"
                          sx={{
                            animation: `${blink} 1s infinite`,
                            opacity: 0.7,
                            position: 'absolute',
                            right: -10,
                            bottom: 2
                          }}
                        >
                          ▋
                        </Box>
                      </Typography>
                    </Box>
                  ) : (
                    <ReactMarkdown components={{
                      p: ({ node, ...props }) => <Typography variant="body1" {...props} />
                    }}>
                      {msg.text}
                    </ReactMarkdown>
                  )}
                </MessageContent>
                {msg.isUser && (
                  <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                    {userInitial}
                  </Avatar>
                )}
              </MessageBubble>
            ))}
          </MessageArea>


          <InputArea>
            <TextField
              fullWidth
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
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                }
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