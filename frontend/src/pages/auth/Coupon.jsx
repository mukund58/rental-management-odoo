import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getWelcomeCoupon } from '../../services/couponService';
import CouponCard from '../../components/auth/CouponCard';
import Button from '../../components/ui/Button';
import { PATHS } from '../../routes/paths';

export const Coupon = () => {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState({ couponCode: 'XXXX10', discount: '10%' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const response = await getWelcomeCoupon();
        if (response?.success && response?.data) {
          setCoupon(response.data);
        }
      } catch (err) {
        console.warn('Backend coupon API unavailable, using fallback dummy data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupon();
  }, []);

  const handleContinue = () => {
    navigate(PATHS.LOGIN || '/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignitems: 'center', width: '100%' }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          <CouponCard couponCode={coupon.couponCode} discount={coupon.discount} />

          <Button
            onClick={handleContinue}
            fullWidth
            variant="contained"
            sx={{
              py: 1.2,
              backgroundColor: '#9333ea', // Purple button as per mockup
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#7e22ce'
              }
            }}
          >
            Continue to Login
          </Button>
        </>
      )}
    </Box>
  );
};

export default Coupon;
