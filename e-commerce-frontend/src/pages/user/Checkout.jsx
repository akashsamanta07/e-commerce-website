import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../components/UserContext/UserContext";
import { FaUser, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaCreditCard } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { Button, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Stepper, Step, StepLabel, Paper, CircularProgress } from "@mui/material";
import API_BASE from "../../utils/API_BASE";
import notify from "../../components/Notification/notify";


const steps = ["Personal Info", "Delivery Info", "Payment"];

function Checkout({ auth,setCartlist}) {
  const { total } = useContext(GlobalContext);
  const navigate = useNavigate();

  // Stepper state
  const [activeStep, setActiveStep] = useState(0);

  // Personal Info
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Delivery Info
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  // Payment Info
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

  // Loading and error state for order placement
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  // Handle changes
  const handlePersonalChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };
  const handleDeliveryChange = (e) => {
    setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });
  };
  const handleCardChange = (e) => {
    setCardInfo({ ...cardInfo, [e.target.name]: e.target.value });
  };

  // Stepper navigation
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Place order API call (no data sent, backend fetches from user cart)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOrderError("");

    if (!auth || !auth._id) {
      notify("error", "You are not logged in");
      return;
    }

    setPlacingOrder(true);
    try {
      // Only send payment method if you want, but as per prompt, no cart/order data sent
      const res = await fetch(`${API_BASE}/user/${auth._id}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          paymentMethod, // optional, backend can ignore or use
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Show notify message on success

        notify("success", "Order placed successfully!");
        setCartlist([]);
        // Navigate to home after successful order
        navigate("/");
      } else {
        notify("error","Order placed failed");
      }
    } catch (err) {
      notify("error","Network Error");
    } finally {
      setPlacingOrder(false);
    }
  };

  // Responsive container
  return (
    <div className="my-8 mx-5 #f5f0f0 flex items-center justify-center">
      <Paper elevation={4} className=" p-6 rounded-lg shadow-lg bg-white">
        <h2 className="text-3xl font-bold text-pink-600 mb-6 flex items-center gap-2">
          <MdPayment className="text-pink-500" size={32} />
          Checkout
        </h2>
        <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <span className="font-semibold">{label}</span>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit}>
          {activeStep === 0 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-pink-600 text-lg font-semibold mb-2">
                <FaUser />
                Personal Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Full Name"
                  name="name"
                  value={personalInfo.name}
                  onChange={handlePersonalChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: <FaUser className="mr-2 text-pink-400" />,
                  }}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={handlePersonalChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: <FaEnvelope className="mr-2 text-pink-400" />,
                  }}
                />
                <TextField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={personalInfo.phone}
                  onChange={handlePersonalChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: <FaPhoneAlt className="mr-2 text-pink-400" />,
                  }}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNext}
                  className="bg-pink-600 hover:bg-pink-700"
                  disabled={
                    !personalInfo.name || !personalInfo.email || !personalInfo.phone
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-pink-600 text-lg font-semibold mb-2">
                <FaMapMarkerAlt />
                Delivery Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Address"
                  name="address"
                  value={deliveryInfo.address}
                  onChange={handleDeliveryChange}
                  required
                  fullWidth
                />
                <TextField
                  label="City"
                  name="city"
                  value={deliveryInfo.city}
                  onChange={handleDeliveryChange}
                  required
                  fullWidth
                />
                <TextField
                  label="State"
                  name="state"
                  value={deliveryInfo.state}
                  onChange={handleDeliveryChange}
                  required
                  fullWidth
                />
                <TextField
                  label="ZIP Code"
                  name="zip"
                  value={deliveryInfo.zip}
                  onChange={handleDeliveryChange}
                  required
                  fullWidth
                />
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleBack}
                  className="border-pink-600 text-pink-600"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNext}
                  className="bg-pink-600 hover:bg-pink-700"
                  disabled={
                    !deliveryInfo.address ||
                    !deliveryInfo.city ||
                    !deliveryInfo.state ||
                    !deliveryInfo.zip
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-pink-600 text-lg font-semibold mb-2">
                <FaCreditCard />
                Payment
              </div>
              <FormControl component="fieldset" className="mb-4">
                <FormLabel component="legend">Select Payment Method</FormLabel>
                <RadioGroup
                  row
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="card"
                    control={<Radio color="secondary" />}
                    label="Credit/Debit Card"
                  />
                  <FormControlLabel
                    value="cod"
                    control={<Radio color="secondary" />}
                    label="Cash on Delivery"
                  />
                </RadioGroup>
              </FormControl>
              {paymentMethod === "card" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Card Number"
                    name="cardNumber"
                    value={cardInfo.cardNumber}
                    onChange={handleCardChange}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Name on Card"
                    name="nameOnCard"
                    value={cardInfo.nameOnCard}
                    onChange={handleCardChange}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Expiry (MM/YY)"
                    name="expiry"
                    value={cardInfo.expiry}
                    onChange={handleCardChange}
                    required
                    fullWidth
                  />
                  <TextField
                    label="CVV"
                    name="cvv"
                    value={cardInfo.cvv}
                    onChange={handleCardChange}
                    required
                    fullWidth
                    type="password"
                  />
                </div>
              )}
              <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mt-6">
                <div className="text-lg font-bold text-pink-700">
                  Total: <span className="text-black">₹{total}/-</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleBack}
                    className="border-pink-600 text-pink-600"
                    disabled={placingOrder}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    className="bg-pink-600 hover:bg-pink-700"
                    disabled={
                      placingOrder ||
                      (paymentMethod === "card" &&
                        (!cardInfo.cardNumber ||
                          !cardInfo.expiry ||
                          !cardInfo.cvv ||
                          !cardInfo.nameOnCard))
                    }
                  >
                    {placingOrder ? (
                      <span className="flex items-center gap-2">
                        <CircularProgress size={20} color="inherit" />
                        Placing Order...
                      </span>
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                </div>
              </div>
              {orderError && (
                <div className="text-red-600 font-semibold mt-4">{orderError}</div>
              )}
            </div>
          )}
        </form>
      </Paper>
    </div>
  );
}

export default Checkout;