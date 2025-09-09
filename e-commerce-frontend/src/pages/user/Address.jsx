import React, { useState, useEffect } from "react";
import { TextField, Button, Paper, CircularProgress} from "@mui/material";
import API_BASE from "../../utils/API_BASE";
import notify from "../../components/Notification/notify";
import { useNavigate } from "react-router-dom";

function Address({ auth }) {
  const [addressInfo, setAddressInfo] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch address from backend on mount
  useEffect(() => {
    const fetchAddress = async () => {
      if (!auth?._id) return;
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/user/${auth._id}/address`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.success && data.address) {
          setAddressInfo({
            address: data.address.address || "",
            city: data.address.city || "",
            state: data.address.state || "",
            zip: data.address.zip || "",
          });
        }
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchAddress();
    // eslint-disable-next-line
  }, [auth?.user?._id]);

  const handleChange = (e) => {
    setAddressInfo({
      ...addressInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!auth?._id) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/user/${auth._id}/address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(addressInfo),
        }
      );
      const data = await res.json();
      if (data.success) {
        notify("success", data.message || "updated");
        setAddressInfo({
          address: data.address.address,
          city: data.address.city,
          state: data.address.state,
          zip: data.address.zip,
        });
        navigate("/my-account");
      } else {
        notify("error", data.message || "Failed to save address.");
      }
    } catch (err) {
      notify("error", "An error occurred while saving the address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 mx-5 flex items-center justify-center">
      <Paper elevation={4} className="p-6 rounded-lg shadow-lg bg-white w-full max-w-md">
        <h2 className="text-2xl font-bold text-pink-600 mb-6">Address Details</h2>
        <form onSubmit={handleSave} className="space-y-5">
          <TextField
            label="Address"
            name="address"
            value={addressInfo.address}
            onChange={handleChange}
            required
            fullWidth
            disabled={loading}
          />
          <TextField
            label="City"
            name="city"
            value={addressInfo.city}
            onChange={handleChange}
            required
            fullWidth
            disabled={loading}
          />
          <TextField
            label="State"
            name="state"
            value={addressInfo.state}
            onChange={handleChange}
            required
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Zip Code"
            name="zip"
            value={addressInfo.zip}
            onChange={handleChange}
            required
            fullWidth
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            className="!bg-pink-600 hover:!bg-black !text-white !font-semibold !rounded-md"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Save Address"}
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default Address;
