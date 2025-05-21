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
  Toolbar
} from '@mui/material';
import {
  FaceRetouchingNatural,
  ArrowBack
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

const ImageContainer = styled(motion.div)(({ theme }) => ({
  borderRadius: '15px',
  overflow: 'hidden',
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const Logo = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  colors: 'black',
  gap: theme.spacing(2),
  '& .logo-text': {
    background: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%,rgb(13, 27, 177) 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
    fontSize: '1.8rem'
  }
}));

export default function FaceAuthenticationPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <>
      <AppBar position="fixed"  elevation={0} sx={{ backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
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
              animate={{ scale: [1, 1.2, 1], rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity }}
              style={{ width: 500, height: 500, top: -150, right: -100 }}
            />
            <FeatureCircle
              animate={{ y: [0, 30, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              style={{ width: 300, height: 300, bottom: -100, left: 100 }}
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
            Face Authentication
          </Typography>

          <ContentContainer>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6} sx={{marginLeft:"auto", marginRight:"auto"}}>
                <ImageContainer
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <Box
                    component="img"
                    src="/face1.jpg"
                    alt="Face Authentication"
                    sx={{
                      maxWidth: '100%',
                      marginX: 'auto',
                      height: 'auto',
                      borderRadius: '12px'
                    }}
                  />
                </ImageContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: 'medium' }}>
                    Overview
                  </Typography>

                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.05rem' }}>
                    Our face authentication system blends cutting-edge biometric identification with elegant user
                    experience. This secure and seamless platform uses advanced neural networks and spoof detection
                    to verify users with remarkable accuracy and privacy. Whether you're managing access in a corporate
                    environment or securing sensitive personal systems, MADSKI ensures top-tier protection and
                    usability. The system performs well across various lighting conditions and uses encrypted data
                    handling to safeguard user privacy. It's designed for businesses, institutions, and individuals who
                    demand effortless, high-assurance authentication. With a focus on security, speed, and reliability,
                    our solution brings the future of access control to your fingertips—literally.
                  </Typography>

                 
                </motion.div>
              </Grid>
            </Grid>
          </ContentContainer>
        </Container>
      </AnimatedContainer>
    </>
  );
}
