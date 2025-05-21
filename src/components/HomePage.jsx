import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  styled,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  useMediaQuery
} from '@mui/material'
import {
  FaceRetouchingNatural,
  Security,
  MusicNote,
  SmartToy
} from '@mui/icons-material'

const AnimatedContainer = styled(motion.div)(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #0b8280 100%)`,
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing(4),
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

const FeatureCard = styled(motion.div)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  padding: theme.spacing(3),
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
}));

export const Logo = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  '& .logo-text': {
    background: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%,rgb(13, 27, 177) 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
    fontSize: '2rem'
  }
}));

export default function HomePage() {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width:600px)')
  const features = [
    {
      icon: <Security sx={{ fontSize: 40, color: 'white' }} />,
      title: "Face Authentication",
      description: "Secure login using advanced facial recognition technology",
      route: "/info-face"
    },
    {
      icon: <MusicNote sx={{ fontSize: 40, color: 'white' }} />,
      title: "Music Classification",
      description: "AI-powered music genre identification",
      route: "/info-music"
    },
    {
      icon: <SmartToy sx={{ fontSize: 40, color: 'white' }} />,
      title: "AI Chatbot",
      description: "Conversational assistant for seamless interactions",
      route: "/info-chat"
    }
  ];

  return (
    <AnimatedContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {!isMobile && (
        <>
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
        </>
      )}

      <Container maxWidth="xl"> <Typography
        variant="h1"
        sx={{
          color: 'white',
          mb: 7,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 1

        }}
      >
        MADSKI INFORMATIVE SYSTEM
      </Typography>
        <Grid container spacing={6} alignItems="center" justifyContent="space-between">

          <Grid item xs={11} md={6}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>


              <Logo
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}

              >
                <FaceRetouchingNatural sx={{
                  fontSize: 80,
                }} />
                <Typography variant="h4" className="logo-text">
                  MADSKI
                </Typography>
              </Logo>



              {/* <Typography variant="h1" gutterBottom sx={{ color: 'white' }}>
              MADSKI INFORMATIVE SYSTEM
              </Typography> */}

              <Typography variant="body1" sx={{
                fontSize: '1.3rem',
                color: 'rgba(255,255,255,0.9)',
                mb: 4,
                maxWidth: 500
              }}>
                MADSKI Informative System offers secure AI-powered facial recognition authentication, featuring military-grade security, instant identity verification, and cross-platform compatibility for seamless, protected access
              </Typography>

              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  px: 6,
                  py: 1.5,
                  fontSize: '1.1rem',
                  boxShadow: 4
                }}
              >
                Start Face Login →
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ pl: { md: 6 } }}>
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={()=>{navigate(feature.route)}}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs="auto">
                      {feature.icon}
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                        {feature.title}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {feature.description}
                      </Typography>
                    </Grid>
                  </Grid>
                </FeatureCard>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </AnimatedContainer>
  )
}