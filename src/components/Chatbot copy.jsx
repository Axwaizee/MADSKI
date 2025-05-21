import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  styled,
  Typography,
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Avatar
} from '@mui/material';
import { Send, Logout, FaceRetouchingNatural } from '@mui/icons-material';

export const Logo = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  color: 'rgb(186, 191, 213)',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  '& .logo-text': {
    background: `linear-gradient(45deg, rgba(76, 98, 209, 0.9) 0%,rgb(255, 255, 255) 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
    fontSize: '2rem'
  }
}));

const AnimatedContainer = styled(motion.div)(({ theme }) => ({
  height: '100vh',
  background: `linear-gradient(135deg, #0a1929 0%, #051321 100%)`,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
}));

const ChatContainer = styled(Paper)(({ theme }) => ({
  flex: 1,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #0b8280 100%)`,
  borderRadius: '20px',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  margin: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
}));

const MessageBubble = styled(motion.div)(({ theme, isuser }) => ({
  backgroundColor: isuser ? theme.palette.primary.main : 'rgba(42, 82, 134, 0.9)',
  color: isuser ? 'white' : 'rgba(255, 255, 255, 0.9)',
  borderRadius: isuser ? '20px 0 20px 20px' : '0 20px 20px 20px ',
  padding: theme.spacing(2),
  maxWidth: '70%',
  margin: theme.spacing(1),
  alignSelf: isuser ? 'flex-end' : 'flex-start',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
}));

const LogoIcon = () => (
  <Logo
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5 }}
>
  <FaceRetouchingNatural sx={{ fontSize: 43 }} />
  
</Logo>
 
);

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { text: input, isUser: true };
      setMessages([...messages, newMessage]);
      setInput('');

      setTimeout(() => {
        const botResponse = { 
          text: 'This is a sample response from MADSKI. Our systems are currently processing your request.', 
          isUser: false 
        };
        setMessages(prev => [...prev, botResponse]);
      }, 100);
    }
  };

  return (
    <AnimatedContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Logo
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <FaceRetouchingNatural sx={{ fontSize: 60 }} />
            <Typography variant="body1" className="logo-text">
              MADSKI
            </Typography>
          </Logo>
        </Box>

        <IconButton
          onClick={() => navigate('/')}
          size="large"
          sx={{
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            },
            width: 56,
            height: 56
          }}
        >
          <Logout sx={{ fontSize: 32 }} 
          
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/');
          }} />
        </IconButton>
      </Box>

      <ChatContainer>
        <Box sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.4)'
            }
          }
        }}>
          <List sx={{ paddingBottom: '80px' }}>
            {messages.map((message, index) => (
              <ListItem 
                key={index} 
                sx={{ 
                  justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  my: 1,
                  px: 1
                }}
              >
                {!message.isUser && (
                  <Box sx={{ mr: 1, mt: 1 }}>
                    <LogoIcon />
                  </Box>
                )}
                <MessageBubble
                  isuser={message.isUser ? 1 : 0}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ListItemText 
                    primary={message.text} 
                    sx={{ m: 0 }}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: '0.95rem',
                        lineHeight: 1.4
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{
                    display: 'block',
                    textAlign: 'right',
                    mt: 1,
                    opacity: 0.7
                  }}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </MessageBubble>
                {message.isUser && (
                  <Avatar 
                    sx={{ 
                      ml: 1, 
                      backgroundColor: '#1976d2',
                      width: 32,
                      height: 32,
                      mt: 1
                    }}
                  >
                    U
                  </Avatar>
                )}
              </ListItem>
            ))}
            <div ref={chatEndRef} />
          </List>
        </Box>

        <Box sx={{
          position: 'sticky',
          bottom: 0,
          p: 2,
          background: 'rgba(0, 0, 0, 0.7)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <Box sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            maxWidth: '800px',
            mx: 'auto'
          }}>
            <TextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              variant="outlined"
              size="small"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00BFFF'
                  }
                },
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!input.trim()}
              sx={{
                color: 'white',
                backgroundColor: '#00BFFF',
                '&:hover': {
                  backgroundColor: '#0084FF',
                },
                '&:disabled': {
                  opacity: 0.5
                }
              }}
            >
              <Send />
            </IconButton>
          </Box>
        </Box>
      </ChatContainer>
    </AnimatedContainer>
  );
}