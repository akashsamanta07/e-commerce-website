import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { MdEdit, MdDelete, MdAddPhotoAlternate } from 'react-icons/md';
import notify from '../../components/Notification/notify';

import API_BASE from '../../utils/API_BASE';
import getImageUrl from '../../components/getImageUrl';


function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add Banner Dialog State
  const [addOpen, setAddOpen] = useState(false);
  const [addImage, setAddImage] = useState(null);
  const [addPreview, setAddPreview] = useState('');

  // Edit Banner Dialog State
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState('');

  // Fetch banners from API
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/get-banners`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setBanners(data.data);
      } else {
        setBanners([]);
        notify("warning", "No Data");
      }
    } catch (err) {
      notify("error", "Network Error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle Add Banner
  const handleAddBanner = () => {
    setAddImage(null);
    setAddPreview('');
    setAddOpen(true);
  };

  const handleAddImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddImage(file);
      setAddPreview(URL.createObjectURL(file));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addImage) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('photo', addImage);

      const res = await fetch(`${API_BASE}/admin/add-banner`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        notify("success", "Banner Upload Successfully");
        setAddOpen(false);
        setAddImage(null);
        setAddPreview('');
        fetchBanners();
      } else {
        notify("error", data.message);
      }
    } catch (err) {
      notify("error", "Network Error");
    }
    setLoading(false);
  };

  // Handle Edit Banner (image change)
  const handleEdit = (id) => {
    const banner = banners.find(b => b._id === id);
    setEditId(id);
    setEditImage(null);
    setEditPreview(banner ? getImageUrl(banner.image) : '');
    setEditOpen(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setEditPreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editId) return;
    setLoading(true);
    try {
      const formData = new FormData();
      if (editImage) {
        formData.append('photo', editImage);
      }
      const res = await fetch(`${API_BASE}/admin/edit-banner/${editId}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        notify("success", "Banner Update Successfully");
        setEditOpen(false);
        setEditId(null);
        setEditImage(null);
        setEditPreview('');
        fetchBanners();
      } else {
        notify("error", data.message);
      }
    } catch (err) {
      notify("error", "Network Error");
    }
    setLoading(false);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/delete-banner/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        notify("success", "Banner Remove Successfully");
        fetchBanners();
      } else {
        notify("error", data.message);
      }
    } catch (err) {
      notify("error", "Network error");
    }
    setLoading(false);
  };

  // TableContainer style: if more than 4 banners, set maxHeight and overflowY
  const tableContainerSx = {
    borderRadius: 2,
    border: '1px solid #e5e7eb',
    bgcolor: '#f3f4f6',
    ...(banners.length > 4
      ? { maxHeight: '60vh', overflowY: 'auto', display: 'block' }
      : {})
  };

  return (
    <Box sx={{ m: 2, p: 1, bgcolor: '#fff' }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        m={3}
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={2}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: '#ec4899', mb: { xs: 1, md: 0 }, textAlign: { xs: 'center', md: 'left' } }}
        >
          Banner List
        </Typography>
        <Button
          variant="contained"
          startIcon={<MdAddPhotoAlternate />}
          sx={{
            bgcolor: '#db2777',
            '&:hover': { bgcolor: 'black' },
            textTransform: 'none',
            fontWeight: 500,
            minWidth: 160,
          }}
          onClick={handleAddBanner}
        >
          Add Banner
        </Button>
      </Box>

      <TableContainer component={Paper} sx={tableContainerSx}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e5e7eb' }}>
                <TableCell sx={{ fontWeight: 'bold', border: '1px solid #d1d5db' }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 'bold', border: '1px solid #d1d5db' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {banners.map(banner => (
                <TableRow key={banner._id}>
                  <TableCell sx={{ border: '1px solid #d1d5db' }}>
                    {banner.image ? (
                      <img
                        src={getImageUrl(banner.image)}
                        alt={`Banner ${banner._id}`}
                        style={{ width: 120, height: 60, objectFit: 'cover', borderRadius: 8, background: '#fff' }}
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/120x60?text=No+Image";
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 120,
                          height: 60,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 2,
                          background: '#f3f4f6',
                          border: '1px solid #e5e7eb',
                          color: '#aaa',
                          fontSize: 16
                        }}
                      >
                        No Image
                      </Box>
                    )}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #d1d5db' }}>
                    <IconButton color="primary" onClick={() => handleEdit(banner._id)}>
                      <MdEdit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(banner._id)}>
                      <MdDelete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {banners.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No banners found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Add Banner Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Banner</DialogTitle>
        <form onSubmit={handleAddSubmit} encType="multipart/form-data">
          <DialogContent>
            <Button
              variant="contained"
              component="label"
              startIcon={<MdAddPhotoAlternate />}
              sx={{
                bgcolor: '#db2777',
                '&:hover': { bgcolor: 'black' },
                textTransform: 'none',
                fontWeight: 500,
                mb: 2
              }}
              fullWidth
            >
              Select Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAddImageChange}
                required
              />
            </Button>
            {addPreview && (
              <Box mt={2} display="flex" justifyContent="center">
                <img
                  src={addPreview}
                  alt="Preview"
                  style={{ width: 200, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/200x100?text=No+Image";
                  }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="success" disabled={!addPreview || loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Banner Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Banner</DialogTitle>
        <form onSubmit={handleEditSubmit} encType="multipart/form-data">
          <DialogContent>
            <Button
              variant="contained"
              component="label"
              startIcon={<MdAddPhotoAlternate />}
              sx={{
                bgcolor: '#db2777',
                '&:hover': { bgcolor: 'black' },
                textTransform: 'none',
                fontWeight: 500,
                mb: 2
              }}
              fullWidth
            >
              Change Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleEditImageChange}
              />
            </Button>
            {editPreview && (
              <Box mt={2} display="flex" justifyContent="center">
                <img
                  src={editPreview}
                  alt="Preview"
                  style={{ width: 200, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/200x100?text=No+Image";
                  }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="success" disabled={!editPreview || loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Banner;