import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/logo1.jpg';
import notify from '../../components/Notification/notify';
import { Box, Button, Typography, Paper } from '@mui/material';
import { MdPhotoCamera, MdSave, MdImage } from 'react-icons/md';

function ManageLogo() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(logo);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Here you would handle the upload to server
    notify("success", "Update Logo Successfully");
    // Optionally reset file input
    // setSelectedFile(null);
    navigate("/admin/dashboard");
  };

  return (
    <Box
      minHeight="60vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={2}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
        color="secondary"
        sx={{ color: '#ec4899', fontWeight: 'bold' }} // Tailwind pink-500
        display="flex"
        alignItems="center"
        gap={1}
      >
        <MdImage style={{ fontSize: 32, color: '#ec4899' }} />
        <span style={{ fontWeight: 'bold', color: '#ec4899' }}>Update Logo</span>
      </Typography>
      <Paper
        elevation={1}
        sx={{
          mb: 4,
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          bgcolor: '#fff',
          borderRadius: 2,
          border: '1px solid #e5e7eb',
          width: { xs: '90vw', sm: 220 },
          maxWidth: 300,
        }}
      >
        <img
          src={preview}
          alt="Current Logo"
          style={{
            width: 120,
            height: 60,
            objectFit: 'contain',
            borderRadius: 8,
            background: '#fff',
            border: '1px solid #e5e7eb',
            display: 'block',
            margin: 'auto'
          }}
        />
      </Paper>
      <Box
        component="form"
        onSubmit={handleSave}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          width: '100%',
          maxWidth: 220,
        }}
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="logo-upload"
        />
        <label htmlFor="logo-upload" style={{ width: '100%' }}>
          <Button
            variant="contained"
            startIcon={<MdPhotoCamera />}
            component="span"
            fullWidth
            sx={{
              bgcolor: '#db2777', // Tailwind pink-600
              '&:hover': { bgcolor: 'black' }, // Tailwind pink-700
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Change Logo
          </Button>
        </label>
        <Button
          type="submit"
          variant="contained"
          color="success"
          startIcon={<MdSave />}
          fullWidth
          disabled={!selectedFile}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Save Logo
        </Button>
      </Box>
    </Box>
  );
}

export default ManageLogo;