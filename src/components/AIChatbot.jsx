import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  styled,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  useMediaQuery,
  AppBar,
  Toolbar,
  Paper
} from '@mui/material';
import {
  FaceRetouchingNatural,
  ArrowBack,
  Chat,
  Psychology
} from '@mui/icons-material';

const AnimatedContainer = styled(motion.div)(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #0b8280 100%)`,
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(4),
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

const ContentContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  padding: theme.spacing(4),
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  marginTop: theme.spacing(4),
  position: 'relative',
  zIndex: 1,
}));

const Logo = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  '& .logo-text': {
    background: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%,rgb(13, 27, 177) 100%)`,
    WebkitBackgroundClip: 'text',
    fontWeight: 'bold',
    fontSize: '1.8rem'
  }
}));

export default function AIChatbot() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={{ backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() => navigate(-1)}
            sx={{ color: 'white' }}
          >
            Back
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Logo>
            <FaceRetouchingNatural sx={{ fontSize: 40 }} />
            <Typography variant="h6" className="logo-text">
              MADSKI
            </Typography>
          </Logo>
        </Toolbar>
      </AppBar>

      <AnimatedContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {!isMobile && (
          <>
            <FeatureCircle
              animate={{ 
                x: [0, 30, 0],
                y: [0, -20, 0]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              style={{ width: 450, height: 450, top: -150, left: -100 }}
            />
            <FeatureCircle
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: 270
              }}
              transition={{ duration: 15, repeat: Infinity }}
              style={{ width: 350, height: 350, bottom: -100, right: -70 }}
            />
            <FeatureCircle
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 7, repeat: Infinity }}
              style={{ width: 200, height: 200, top: '40%', right: '15%' }}
            />
          </>
        )}

        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            sx={{ 
              color: 'white', 
              mb: 2, 
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            AI Chatbot
          </Typography>

          <ContentContainer>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Typography variant="h4" sx={{ color: 'white', mb: 3, fontWeight: 'medium' }}>
                Intelligent Virtual Assistant
              </Typography>

              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4, fontSize: '1.1rem' }}>
                The MADSKI AI Chatbot offers intuitive natural language interaction to help users seamlessly navigate system features, solve issues, and get personalized assistance. Using advanced natural language processing techniques, it understands user context and intent to provide precise and helpful responses. Its integration across the MADSKI platform ensures consistent support, enhancing user experience by delivering smart, conversational AI capabilities.
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                  {[
                    { 
                      icon: <Chat />, 
                      title: "Natural Conversations", 
                      description: "Interact naturally with conversational AI that understands context and intent." 
                    },
                    { 
                      icon: <Psychology />, 
                      title: "Personalized Assistance", 
                      description: "Receives personalized help based on your usage patterns and preferences." 
                    },
                  ].map((feature, index) => (
                    <Grid item xs={12} key={index}>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + (index * 0.2), duration: 0.5 }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          p: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          borderRadius: '12px',
                          alignItems: 'center',
                          gap: 2
                        }}>
                          <Box sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {feature.icon}
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" sx={{ color: 'white', mb: 0.5 }}>
                              {feature.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                              {feature.description}
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </motion.div>
          </ContentContainer>
        </Container>
      </AnimatedContainer>
    </>
  );
}
