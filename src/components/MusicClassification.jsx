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
  MusicNote,
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
    display: 'none',
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
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  marginBottom: theme.spacing(4),
}));

const WaveAnimation = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '40%',
  background: 'rgba(255, 255, 255, 0.05)',
  clipPath:
    'polygon(0% 100%, 100% 100%, 100% 40%, 75% 50%, 50% 60%, 25% 50%, 0% 40%)',
  zIndex: 0,
}));

const Logo = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  colors: 'black',
  gap: theme.spacing(2),
  '& .logo-text': {
    background: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%, rgb(35, 48, 197) 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
    fontSize: '1.8rem',
  },
}));

const musicGenres = ['disco','pop', 'hiphop', 'jazz', 'classical', 'metal', 'blues', 'reggae', 'rock', 'country'];

export default function MusicClassification() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ backdropFilter: 'blur(10px)' }}
      >
        <Toolbar>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ color: 'white' }}
          >
            Back
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Logo sx={{ cursor: 'pointer' }} onClick={()=>{navigate("/")}}>
            <FaceRetouchingNatural sx={{ fontSize: 45 }} />
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
                scale: [1, 1.1, 1],
                x: [0, 20, 0],
                y: [0, -10, 0],
              }}
              transition={{ duration: 15, repeat: Infinity }}
              style={{ width: 400, height: 400, top: -100, left: -100 }}
            />
            <FeatureCircle
              animate={{ scale: [1, 1.2, 1], rotate: 180 }}
              transition={{ duration: 12, repeat: Infinity }}
              style={{ width: 350, height: 350, bottom: -120, right: -100 }}
            />
            <WaveAnimation
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        )}

        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              mb: 2,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Music Classification
          </Typography>

          <ContentContainer>
            <ImageContainer
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Box
                component="img"
                src="/music.jpg"
                alt="Music Classification"
                sx={{
                  maxWidth: '70%',
                  marginX: 'auto',
                  height: 'auto',
                  borderRadius: '12px',
                }}
              />
            </ImageContainer>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <MusicInfoContent />
            </motion.div>
          </ContentContainer>
        </Container>
      </AnimatedContainer>
    </>
  );
}

function MusicInfoContent() {
  return (
    <>
      <Typography
        variant="h4"
        sx={{ color: 'white', mb: 3, fontWeight: 'medium' }}
      >
        AI-Powered Music Analysis
      </Typography>

      <Typography
        variant="body1"
        sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4, fontSize: '1.1rem' }}
      >
        Our sophisticated music classification system uses deep neural networks
        to analyze audio patterns and accurately categorize music across dozens
        of genres and subgenres. Upload any audio file and receive instant
        classification with detailed musical attribute analysis.
      </Typography>

      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Recognized Music Genres
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {musicGenres.map((genre, index) => (
          <Grid item xs={6} sm={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  p: 1.5,
                  height: '100%',
                }}
              >
                <MusicNote
                  sx={{
                    mr: 1,
                    color: (theme) => theme.palette.secondary.main,
                    fontSize: 20,
                  }}
                />
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                  {genre}
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>

  
    </>
  );
}
