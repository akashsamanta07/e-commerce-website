import React, { useState } from 'react';
import s1 from '../../assets/add/s1.jpg';
import s2 from '../../assets/add/s2.jpg';
import s3 from '../../assets/add/s3.jpg';
import s4 from '../../assets/add/s4.jpg';
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
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { MdEdit, MdDelete, MdAddPhotoAlternate } from 'react-icons/md';
import notify from '../../components/Notification/notify';

const initialBanners = [
  { id: 1, image: s1 },
  { id: 2, image: s2 },
  { id: 3, image: s3 },
  { id: 4, image: s4 },
  { id: 5, image: s1 },
  { id: 6, image: s2 },
  { id: 7, image: s3 },
  { id: 8, image: s4 },
];

function Banner() {
  const [banners, setBanners] = useState(initialBanners);

  // Add Banner Dialog State
  const [addOpen, setAddOpen] = useState(false);
  const [addImage, setAddImage] = useState(null);
  const [addPreview, setAddPreview] = useState('');

  // Edit Banner Dialog State
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState('');

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

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (addImage) {
      const newBanner = {
        id: Date.now(),
        image: addPreview
      };
      setBanners([...banners, newBanner]);
      setAddOpen(false);
      setAddImage(null);
      setAddPreview('');
    }
    notify("success","Banner Upload Successfully");
  };

  // Handle Edit Banner
  const handleEdit = (id) => {
    const banner = banners.find(b => b.id === id);
    setEditId(id);
    setEditImage(null);
    setEditPreview(banner.image);
    setEditOpen(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setEditPreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setBanners(banners.map(b =>
      b.id === editId
        ? { ...b, image: editPreview }
        : b
    ));
    setEditOpen(false);
    setEditId(null);
    setEditImage(null);
    setEditPreview('');
    notify("success","Banner Update Successfully");
  };

  // Handle Delete
  const handleDelete = (id) => {
    setBanners(banners.filter(b => b.id !== id));
    notify("warning","Banner Remove Successfully");
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
    <Box sx={{ m: 2,p:1, bgcolor: '#fff' }}>
      {/* Top Section: Banner List title and Add Banner button, centered and justified between */}
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

      {/* Table Section: Only show images in table */}
      <TableContainer component={Paper} sx={tableContainerSx}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e5e7eb' }}>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #d1d5db' }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #d1d5db' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banners.map(banner => (
              <TableRow key={banner.id}>
                <TableCell sx={{ border: '1px solid #d1d5db' }}>
                  <img
                    src={banner.image}
                    alt={`Banner ${banner.id}`}
                    style={{ width: 120, height: 60, objectFit: 'cover', borderRadius: 8, background: '#fff' }}
                  />
                </TableCell>
                <TableCell sx={{ border: '1px solid #d1d5db' }}>
                  <IconButton color="primary" onClick={() => handleEdit(banner.id)}>
                    <MdEdit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(banner.id)}>
                    <MdDelete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {banners.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No banners found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Banner Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Banner</DialogTitle>
        <form onSubmit={handleAddSubmit}>
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
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="success" disabled={!addPreview}>
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Banner Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Banner</DialogTitle>
        <form onSubmit={handleEditSubmit}>
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
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="success" disabled={!editPreview}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Banner;