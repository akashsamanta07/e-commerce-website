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
import notify from '../components/Notification/notify';
import getImageUrl from '../components/getImageUrl.js';

import API_BASE from "../utils/API_BASE";

function HomeSlider() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add Slider Dialog State
  const [addOpen, setAddOpen] = useState(false);
  const [addImage, setAddImage] = useState(null);
  const [addPreview, setAddPreview] = useState('');

  // Edit Slider Dialog State
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState('');

  // Fetch sliders from API
  const fetchSliders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/get-home-sliders`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        // Sort sliders ascending by updatedAt (oldest first)
        const sortedSliders = Array.isArray(data.data)
          ? [...data.data].sort((a, b) => {
              const dateA = new Date(a.updatedAt);
              const dateB = new Date(b.updatedAt);
              return dateA - dateB;
            })
          : [];
        setSliders(sortedSliders);
      } else {
        setSliders([]);
        notify("warning", "No Data");
      }
    } catch (err) {
      notify("error", "Fetch fail");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // Handle Add Slider
  const handleAddSlider = () => {
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

      const res = await fetch(`${API_BASE}/admin/add-home-slider`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        notify("success", "Slider Upload Successfully");
        setAddOpen(false);
        setAddImage(null);
        setAddPreview('');
        fetchSliders();
      } else {
        notify("error", data.message);
      }
    } catch (err) {
      notify("error", "Network Error");
    }
    setLoading(false);
  };

  // Handle Edit Slider (image change)
  const handleEdit = (id) => {
    const slider = sliders.find(s => s._id === id);
    setEditId(id);
    setEditImage(null);
    setEditPreview(slider ? getImageUrl(slider.image) : '');
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
      const res = await fetch(`${API_BASE}/admin/edit-home-slider/${editId}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        notify("success", "Slider Update Successfully");
        setEditOpen(false);
        setEditId(null);
        setEditImage(null);
        setEditPreview('');
        fetchSliders();
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
      const res = await fetch(`${API_BASE}/admin/delete-home-slider/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        notify("success", "Slider Remove Successfully");
        fetchSliders();
      } else {
        notify("error", data.message);
      }
    } catch (err) {
      notify("error", "Network Error");
    }
    setLoading(false);
  };

  // TableContainer style: if more than 4 sliders, set maxHeight and overflowY
  const tableContainerSx = {
    borderRadius: 2,
    border: '1px solid #e5e7eb',
    bgcolor: '#f3f4f6',
    ...(sliders.length > 4
      ? { maxHeight: '60vh', overflowY: 'auto', display: 'block' }
      : {})
  };

  return (
    <Box sx={{ m: 2, p: 1, bgcolor: '#fff' }}>
      {/* Top Section: Slider List title and Add Slider button */}
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
          color="secondary"
          sx={{ color: '#ec4899', mb: { xs: 1, md: 0 }, textAlign: { xs: 'center', md: 'left' } }}
        >
          Home Slider List
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
          onClick={handleAddSlider}
        >
          Add Slider
        </Button>
      </Box>

      {/* Table Section: Only show images in table */}
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
              {sliders.map(slider => (
                <TableRow key={slider._id}>
                  <TableCell sx={{ border: '1px solid #d1d5db' }}>
                    {slider.image ? (
                      <img
                        src={getImageUrl(slider.image)}
                        alt={`Slider ${slider._id}`}
                        style={{ width: 200, height: 80, objectFit: 'cover', borderRadius: 8, background: '#fff' }}
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/200x80?text=No+Image";
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 200,
                          height: 80,
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
                    <IconButton color="primary" onClick={() => handleEdit(slider._id)}>
                      <MdEdit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(slider._id)}>
                      <MdDelete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {sliders.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No sliders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Add Slider Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Slider</DialogTitle>
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
                  style={{ width: 300, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x120?text=No+Image";
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

      {/* Edit Slider Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Slider</DialogTitle>
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
                  style={{ width: 300, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x120?text=No+Image";
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

export default HomeSlider;