import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import {
    styled,
    Typography,
    Button,
    Box,
    Grid,
    IconButton,
    CircularProgress
} from '@mui/material';
import {
    MusicNote,
    Mic,
    CloudUpload,
    Audiotrack,
    ArrowBack,
    Logout,
    FaceRetouchingNatural,
    Album
} from '@mui/icons-material';

const API_URL = 'http://localhost:5000';
const socket = io(API_URL);

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
}));

const BorderedBox = styled(Box)(({ theme }) => ({
    flex: 1,
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

const ActionButton = styled(Button)(({ bgcolor }) => ({
    backgroundColor: bgcolor,
    color: '#fff',
    '&:hover': {
        backgroundColor: bgcolor,
        opacity: 0.85,
    },
}));

export default function MusicClassificationUI() {
    const [audioFile, setAudioFile] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('prediction', handleSocketPrediction);
        return () => {
            socket.off('prediction');
            if (mediaRecorder) mediaRecorder.stop();
        };
    }, []);

    const handleSocketPrediction = (data) => {
        setPredictions(data.predictions);
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            setPredictions(result.predictions);
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            
            source.connect(processor);
            processor.connect(audioContext.destination);

            processor.onaudioprocess = (e) => {
                const audioData = e.inputBuffer.getChannelData(0);
                socket.emit('audio_chunk', {
                    chunk: audioData.buffer,
                    sample_rate: audioContext.sampleRate
                });
            };

            setMediaRecorder(processor);
            setIsRecording(true);
        } catch (error) {
            console.error('Recording failed:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.disconnect();
            setMediaRecorder(null);
        }
        setIsRecording(false);
    };

    return (
        <ContainerBox>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={2}>
                    <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
                        <ArrowBack />
                    </IconButton>
                    <FaceRetouchingNatural sx={{ fontSize: 40, color: 'white' }} />
                    <Typography variant="h5" color="white" fontWeight="bold">
                        MADSKI
                    </Typography>
                </Box>
                <IconButton onClick={() => navigate('/')} sx={{ color: 'white' }}>
                    <Logout />
                </IconButton>
            </Box>

            {/* Top Section: Result and Preview */}
            <SectionBox>
                <BorderedBox>
                    <Typography variant="h5" color="white" gutterBottom>
                        Classification Result
                    </Typography>
                    {isProcessing ? (
                        <CircularProgress sx={{ color: 'white' }} />
                    ) : predictions.length > 0 ? (
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
                </BorderedBox>

                <BorderedBox>
                    <Typography variant="h5" color="white" gutterBottom>
                        Preview
                    </Typography>
                    <Box position="relative" display="flex" justifyContent="center" alignItems="center">
                        <motion.div
                            animate={{ rotate: isRecording ? 360 : 0 }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        >
                            <Album sx={{ fontSize: 160, color: 'rgba(255,255,255,0.2)' }} />
                        </motion.div>
                        <Audiotrack sx={{ position: 'absolute', fontSize: 60, color: '#ff4081' }} />
                    </Box>
                </BorderedBox>
            </SectionBox>

            {/* Bottom Section: Upload and Record */}
            <SectionBox>
                <BorderedBox>
                    <Typography variant="h6" color="white" gutterBottom>
                        Upload Audio File
                    </Typography>
                    <ActionButton
                        component="label"
                        bgcolor="#7c4dff"
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
                </BorderedBox>

                <BorderedBox>
                    <Typography variant="h6" color="white" gutterBottom>
                        Record Now
                    </Typography>
                    <ActionButton
                        bgcolor={isRecording ? "#4caf50" : "#ff4081"}
                        startIcon={<Mic />}
                        onClick={isRecording ? stopRecording : startRecording}
                    >
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </ActionButton>
                </BorderedBox>
            </SectionBox>
        </ContainerBox>
    );
}