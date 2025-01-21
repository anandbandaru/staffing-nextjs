import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const SaveButton = ({ size, onClick, startIcon, children, ...props }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      size="small"
      onClick={handleClick}
      startIcon={!loading && startIcon}
      disabled={loading}
      {...props}>
      {loading ? <CircularProgress size={18} /> : children}
    </Button>
  );
};

export default SaveButton;