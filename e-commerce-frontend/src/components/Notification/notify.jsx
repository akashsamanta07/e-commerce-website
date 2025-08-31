import { toast } from 'react-toastify';

const notify = (type,massage) => {
    const isMobile = window.innerWidth <= 640;
    const toastOptions = {
      autoClose: 1000,
      position: "top-right",
      className: isMobile ? "text-xs px-1 py-1 rounded-md" : "",
      style: isMobile
        ? { minWidth: "150px", maxWidth: "60vw", fontSize: "0.85rem", borderRadius: "10px", margin: "0.5rem" }
        : {},
    };
    if (type === "warning") {
        toast.warning(massage, toastOptions);
    } else if (type === "error") {
        toast.error(massage, toastOptions);
    } else {
        toast.success(massage, toastOptions);
    }

  };

  export default notify;


  //remove all display massage add toastify massage as notify("warning/success/error","massage")
  // make all notify massage size small 3 to 4 word
  // const API_BASE = "http://localhost:3005";
  //use import{ CircularProgress } from "@mui/material";
