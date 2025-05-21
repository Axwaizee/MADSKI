import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box,
  Button,
  Container,
  Grid,
  Typography,
  styled,
  useTheme
} from '@mui/material';
import { 
  FaceRetouchingNatural,
  Logout,
  MusicNote,
  SmartToy 
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
}));

const FeatureCard = styled(motion.div)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '24px',
  padding: theme.spacing(4),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  minHeight: 400,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  '&:hover': {
    transform: 'translateY(-8px)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: theme.shadows[6]
  },
}));

const AnimatedBackgroundCircle = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  filter: 'blur(2px)',
  zIndex: 0,
  [theme.breakpoints.down('md')]: {
    display: 'none'
  },
}));

export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const options = [
    {
      title: "Music Classification",
      description: "AI-powered music genre identification and analysis system",
      icon: <MusicNote sx={{ fontSize: 48, color: 'primary.main' }} />,
      path: '/music'
    },
    {
      title: "Chatbot",
      description: "Interactive conversational assistant for seamless communication",
      icon: <SmartToy sx={{ fontSize: 48, color: 'primary.main' }} />,
      path: '/chat'
    }
  ];

  const handleLogout = () => {
    // Add logout logic
    navigate('/login');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Circles */}
      <AnimatedBackgroundCircle
        animate={{ scale: [1, 1.2, 1], rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity }}
        sx={{ width: 256, height: 256, top: -80, left: -80 }}
      />
      <AnimatedBackgroundCircle
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        sx={{ width: 256, height: 256, bottom: -80, right: -80 }}
      />

      {/* Header */}
      <Box sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        backdropFilter: 'blur(8px)',
        py: 2,
        position: 'sticky',
        top: 0,
        zIndex: 1
      }}>
        <Container maxWidth="xl">
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FaceRetouchingNatural sx={{ 
                fontSize: 40,
                color: 'common.white'
              }} />
              <GradientText variant="h4">
                MADSKI
              </GradientText>
            </Box>
            
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'common.white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{
            color: 'common.white',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            mb: 2,
            [theme.breakpoints.up('md')]: {
              fontSize: '3.5rem'
            }
          }}>
            MADSKI INFORMATIVE SYSTEM
          </Typography>
          
          <Typography variant="h4" sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            mb: 4
          }}>
            Welcome MADSKI USERS !!
          </Typography>
          
          <Typography variant="body1" sx={{
            color: 'rgba(255, 255, 255, 0.64)',
            maxWidth: 800,
            mx: 'auto',
            fontSize: '1.25rem'
          }}>
            Select one of the options below to get started with our AI-powered features
          </Typography>
        </Box>

        {/* Feature Cards */}
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
          {options.map((option, index) => (
            <Grid item xs={12} md={6} lg={5} key={index}>
              <FeatureCard
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate(option.path)}
                animate={hoveredCard === index ? { y: -8 } : { y: 0 }}
              >
                <Box sx={{ color: 'primary.main', mb: 3 }}>
                  {option.icon}
                </Box>
                
                <Typography variant="h5" sx={{ 
                  color: 'primary.main',
                  fontWeight: 'bold',
                  mb: 2
                }}>
                  {option.title}
                </Typography>
                
                <Typography variant="body1" sx={{ 
                  color: 'text.secondary',
                  mb: 4,
                  fontSize: '1.1rem'
                }}>
                  {option.description}
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    mt: 'auto',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                    }
                  }}
                >
                  Open {option.title}
                </Button>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}