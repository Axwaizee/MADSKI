import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import {
    styled,
    Typography,
    Button,
    Box,
    IconButton,
    CircularProgress
} from '@mui/material';
import {
    CloudUpload,
    Audiotrack,
    ArrowBack,
    Logout,
    FaceRetouchingNatural,
    Album
} from '@mui/icons-material';

const API_URL = import.meta.env.VITE_MUSIC_CLASSIFICATION;
const socket = io(API_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  withCredentials: true
});

const ContainerBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    padding: theme.spacing(4),
    minHeight: '100vh',
    background: `linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)`,
}));

const SectionBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(3),
    width: '100%',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column'
    },
}));

const BorderedBox = styled(Box)(({ theme }) => ({
    border: '2px solid white',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
}));

const UploadBox = styled(BorderedBox)(({ theme }) => ({
    flex: 1,
    transition: 'all 0.3s ease',
}));

const PreviewBox = styled(BorderedBox)(({ theme }) => ({
    flex: 1,
    transition: 'all 0.3s ease',
}));

const ResultsBox = styled(BorderedBox)(({ theme }) => ({
    flex: 1,
    transition: 'all 0.3s ease',
}));

const ActionButton = styled(Button)(({ bgcolor }) => ({
    backgroundColor: bgcolor || '#7c4dff',
    color: '#fff',
    '&:hover': {
        backgroundColor: bgcolor || '#7c4dff',
        opacity: 0.85,
    },
}));

export default function MusicClassificationUI() {
    const [audioFile, setAudioFile] = useState(null);
    const [audioPreview, setAudioPreview] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const audioElement = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('connect', () => console.log('Connected to WebSocket'));
        socket.on('prediction', handleSocketPrediction);
        socket.on('connect_error', (err) => console.error('Connection error:', err));

        return () => {
            socket.off('prediction');
            socket.disconnect();
        };
    }, []);

    const handleSocketPrediction = (data) => {
        setPredictions([...data.predictions]);
        setShowResults(true);
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAudioFile(file);
        setAudioPreview(URL.createObjectURL(file));
        setIsProcessing(true);
        setShowPreview(true);
        setShowResults(false);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            setPredictions(result.predictions);
            setShowResults(true);
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ContainerBox>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={2}>
                    <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
                        <ArrowBack />
                    </IconButton>
                    <FaceRetouchingNatural sx={{ fontSize: 40, color: 'white', cursor: 'pointer' }} onClick={()=>{navigate("/")}} />
                    <Typography variant="h5" color="white" fontWeight="bold" sx={{ cursor: 'pointer' }} onClick={()=>{navigate("/")}}>
                        MADSKI
                    </Typography>
                </Box>
                <IconButton onClick={() => navigate('/')} sx={{ color: 'white' }}>
                    <Logout />
                </IconButton>
            </Box>

            <AnimatePresence>
                {showResults && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <SectionBox>
                            <ResultsBox>
                                <Typography variant="h5" color="white" gutterBottom>
                                    Classification Result
                                </Typography>
                                {predictions.length > 0 ? (
                                    predictions.map(([genre, confidence], index) => (
                                        <Box key={genre} width="100%" textAlign="center" my={1}>
                                            <Typography color="white">
                                                {index + 1}. {genre} ({Math.round(confidence * 100)}%)
                                            </Typography>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography color="white">No results yet</Typography>
                                )}
                            </ResultsBox>
                        </SectionBox>
                    </motion.div>
                )}
            </AnimatePresence>

            <SectionBox>
                {showPreview ? (
                    <>
                        <PreviewBox>
                            <Typography variant="h5" color="white" gutterBottom>
                                Preview
                            </Typography>
                            <Box position="relative" display="flex" justifyContent="center" alignItems="center">
                                <motion.div
                                    animate={{ rotate: isProcessing ? 360 : 0 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                >
                                    <Album sx={{ fontSize: 160, color: 'rgba(255,255,255,0.2)' }} />
                                </motion.div>
                                <Audiotrack sx={{ position: 'absolute', fontSize: 60, color: '#ff4081' }} />
                            </Box>
                            {audioPreview && (
                                <audio 
                                    ref={audioElement}
                                    controls 
                                    src={audioPreview} 
                                    style={{ width: '100%', marginTop: 16 }}
                                />
                            )}
                        </PreviewBox>

                        <UploadBox>
                            <Typography variant="h6" color="white" gutterBottom>
                                Upload New Audio
                            </Typography>
                            <ActionButton
                                component="label"
                                startIcon={<CloudUpload />}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Processing...' : 'Upload Audio'}
                                <input type="file" hidden accept="audio/*" onChange={handleUpload} />
                            </ActionButton>
                            {audioFile && (
                                <Typography mt={2} color="white">
                                    {audioFile.name}
                                </Typography>
                            )}
                        </UploadBox>
                    </>
                ) : (
                    <UploadBox sx={{ flex: 1 }}>
                        <Typography variant="h4" color="white" gutterBottom textAlign="center">
                            Music Genre Classifier
                        </Typography>
                        <Typography variant="body1" color="white" gutterBottom textAlign="center" mb={4}>
                            Upload an audio file to analyze its music genre
                        </Typography>
                        <ActionButton
                            component="label"
                            startIcon={<CloudUpload />}
                            size="large"
                        >
                            Upload Audio File
                            <input type="file" hidden accept="audio/*" onChange={handleUpload} />
                        </ActionButton>
                    </UploadBox>
                )}
            </SectionBox>
        </ContainerBox>
    );
}