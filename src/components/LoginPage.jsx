import { useState, useEffect, useCallback, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  styled,
  Typography,
  Button,
  Box,
  useMediaQuery
} from '@mui/material';
import { ArrowBack, FaceRetouchingNatural } from '@mui/icons-material';
import { Logo } from './HomePage';

const LoginContainer = styled(motion.div)(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #0b8280 100%)`,
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing(4),
}));

const AuthCircle = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  filter: 'blur(2px)',
  zIndex: 0,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

export default function LoginPage() {
  const webcamRef = useRef(null);
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_FACE_RECOGNITION}/recognize`, {
        image: imageSrc.split(',')[1]
      });
      setMatches(response.data.matches);
    } catch (error) {
      console.error('Recognition error:', error);
    }
  }, []);

  const handleLogin = async (username) => {
    try {
      await axios.post(`${import.meta.env.VITE_FACE_RECOGNITION}/login`, { username }).then((data)=>data.data).then((data) => {
        if (data.status === 'success') {
          localStorage.setItem('user_info', JSON.stringify(data.user_info));
          localStorage.setItem('username', data.user);
          localStorage.setItem('token', data.token);
          navigate('/dashboard');
        } else {
          console.error('Login failed:', data.message);
        }
      })

    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(capture, 2500); // Lower delay
    return () => clearInterval(interval);
  }, [capture]);

  return (
    <LoginContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!isMobile && (
        <>
          <AuthCircle
            animate={{ scale: [1, 1.2, 1], rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity }}
            style={{ width: 600, height: 600, top: -200, left: -200 }}
          />
          <AuthCircle
            animate={{ y: [0, 40, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
            style={{ width: 400, height: 400, bottom: -150, right: -150 }}
          />
        </>
      )}

      <Box sx={{
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>

          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ color: 'black' , fontWeight:"bold", fontSize: "1.2rem"}}
          >
            Back to Home
          </Button>

          <Logo
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}

          >
            <FaceRetouchingNatural sx={{
              fontSize: 60,
            }} />
            <Typography variant="body1" className="logo-text">
              MADSKI
            </Typography>
          </Logo>
        </Box>

        <Typography variant="h1" sx={{
          color: 'white',
          mb: 6,
          textAlign: 'center'
        }}>
          Face Authentication
        </Typography>

        <Box sx={{
          display: 'flex',
          gap: 4,
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <Box sx={{
            flex: 1,
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: 6
          }}>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                aspectRatio: '4/3'
              }}
              videoConstraints={{
                width: 640,
                height: 480,
                facingMode: 'user'
              }}
            />
          </Box>

          <Box sx={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 4,
            padding: 4,
            backdropFilter: 'blur(10px)',
            minHeight: 400
          }}>
            <Typography variant="h2" sx={{
              color: 'white',
              mb: 4
            }}>
              Recognized Users
            </Typography>

            {matches.length > 0 ? (
              matches.map((match, index) => (
                <Button
                  fullWidth
                  key={index}
                  onClick={() => handleLogin(match.name)}
                  sx={{
                    mb: 2,
                    py: 2,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  {match.name} ({match.confidence}%)
                </Button>
              ))
            ) : (
              <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Face the camera to begin
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </LoginContainer>
  );
}
