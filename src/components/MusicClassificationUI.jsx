import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    styled,
    Typography,
    Button,
    Box,
    Grid,
    IconButton
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
    const navigate = useNavigate();

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) setAudioFile(file);
    };

    const handleRecord = () => alert('Recording feature coming soon!');

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
                    <Typography variant="h6" color="white">Genre: Pop Rock</Typography>
                    <Typography color="white">Confidence: 92%</Typography>
                </BorderedBox>

                <BorderedBox>
                    <Typography variant="h5" color="white" gutterBottom>
                        Preview
                    </Typography>
                    <Box position="relative" display="flex" justifyContent="center" alignItems="center">
                        <motion.div
                            animate={{ rotate: 360 }}
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
                    >
                        Upload Audio
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
                        bgcolor="#ff4081"
                        startIcon={<Mic />}
                        onClick={handleRecord}
                    >
                        Record
                    </ActionButton>
                </BorderedBox>
            </SectionBox>
        </ContainerBox>
    );
} 