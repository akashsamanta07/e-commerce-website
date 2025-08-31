import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import notify from '../../components/Notification/notify';
// add CircularProgress import as per instruction
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { MdPhotoCamera, MdSave, MdImage } from 'react-icons/md';
import API_BASE from '../../utils/API_BASE';
import getImageUrl from '../../components/getImageUrl';

function ManageLogo({obj}) {
  let {setData}=obj;
  const navigate = useNavigate();
  const [preview, setPreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [logoId, setLogoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const fileInputRef = useRef();

  // Fetch current logo from API
  useEffect(() => {
    let isMounted = true;
    const fetchLogo = async () => {
      setFetching(true);
      try {
        const res = await fetch(`${API_BASE}/admin/get-logo`);
        const data = await res.json();
        if (isMounted) {
          // The backend returns { success, data: logo } where logo is an object or null
          if (data.success && data.data && data.data._id) {
            setLogoId(data.data._id);
            setPreview(getImageUrl(data.data.image));
          } else {
            setPreview('');
            setLogoId(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setPreview('');
          setLogoId(null);
        }
      }
      if (isMounted) setFetching(false);
    };
    fetchLogo();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('photo', selectedFile);

      // Always use PUT for update, POST for add
      let url = '';
      let method = '';
      let isAdd = !logoId;
      if (isAdd) {
        url = `${API_BASE}/admin/add-logo`;
        method = 'POST';
      } else {
        url = `${API_BASE}/admin/edit-logo/${logoId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        notify("success", isAdd ? "Logo Added Successfully" : "Update Logo Successfully");
        setSelectedFile(null);
        if (data.data && data.data._id) {
          setLogoId(data.data._id);
        }
          navigate("/admin/dashboard");
          setData(prev => ({ ...prev, logo: !prev.logo }));
      } else {
        notify("error", data.message || (isAdd ? "Add Logo Failed" : "Update Logo Failed"));
      }
    } catch (err) {
      notify("error", "Update Logo Failed");
    }
    setLoading(false);
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
        sx={{ color: '#ec4899', fontWeight: 'bold' }}
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
        {fetching ? (
          <Box display="flex" alignItems="center" justifyContent="center" minHeight={60} width="100%">
            <CircularProgress size={32} />
          </Box>
        ) : (
          <img
            src={preview || "https://via.placeholder.com/120x60?text=No+Logo"}
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
            onError={e => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/120x60?text=No+Logo";
            }}
          />
        )}
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
              bgcolor: '#db2777',
              '&:hover': { bgcolor: 'black' },
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
          disabled={!selectedFile || loading}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Save Logo"}
        </Button>
      </Box>
    </Box>
  );
}

export default ManageLogo;