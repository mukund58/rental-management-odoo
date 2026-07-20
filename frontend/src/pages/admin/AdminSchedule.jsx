import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Button, Paper, Grid, MenuItem, Select, IconButton, TextField, CircularProgress } from '@mui/material';
import { Edit, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { rentalApi } from '../../api/rentalApi';

export const AdminSchedule = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = Jan, 11 = Dec
  const [currentYear, setCurrentYear] = useState(2026);

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for inline editing
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const data = await rentalApi.getAllRentals();
        setRentals(data);
      } catch (err) {
        console.error('Failed to fetch rentals', err);
        toast.error('Failed to load schedule data');
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  const handleEditClick = (id, currentText) => {
    setEditingId(id);
    setEditValue(currentText);
  };

  const handleSaveEdit = () => {
    setEditingId(null);
    toast.success('Order text updated!');
  };

  const toggleDate = (day) => {
    if (selectedDates.includes(day)) {
      setSelectedDates(selectedDates.filter(d => d !== day));
    } else {
      setSelectedDates([...selectedDates, day].sort((a, b) => a - b));
    }
  };

  // Calendar math
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

  // Group rentals by day for the current month/year
  const calendarData = useMemo(() => {
    const data = {};
    rentals.forEach(rental => {
      const pickup = new Date(rental.pickupDate);
      const returnDate = new Date(rental.returnDate);

      // We check if the rental overlaps with the current viewed month
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(currentYear, currentMonth, day);

        let added = false;
        if (!data[day]) data[day] = { dots: [], orders: [] };

        // Normalize dates for comparison (ignoring time)
        const curTime = currentDate.setHours(0, 0, 0, 0);
        const pTime = new Date(pickup).setHours(0, 0, 0, 0);
        const rTime = new Date(returnDate).setHours(0, 0, 0, 0);

        if (curTime === pTime) {
          data[day].dots.push('pickup');
          added = true;
        } else if (curTime === rTime) {
          if (rental.status === 4 /* Late */) {
            data[day].dots.push('lateDelivery');
          } else {
            // normal return, maybe no specific dot in legend, or booked
            data[day].dots.push('booked');
          }
          added = true;
        } else if (curTime > pTime && curTime < rTime) {
          data[day].dots.push('booked');
          added = true;
        }

        if (added) {
          data[day].orders.push(rental);
        }
      }
    });
    return data;
  }, [rentals, currentMonth, currentYear, daysInMonth]);


  const renderDots = (day) => {
    const dots = calendarData[day]?.dots || [];
    // remove duplicates for visual cleanliness if a day has multiple of same type
    const uniqueDots = [...new Set(dots)];
    return (
      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, height: 6 }}>
        {uniqueDots.map((dot, i) => {
          let dotStyle = { width: 6, height: 6, borderRadius: '50%' };
          if (dot === 'booked') {
            dotStyle = { ...dotStyle, border: '1px solid #22c55e', bgcolor: 'transparent' };
          } else if (dot === 'pickup') {
            dotStyle = { ...dotStyle, bgcolor: '#f97316' };
          } else if (dot === 'latePickup') {
            // Just matching the schema, though we might not have a distinct late pickup status
            dotStyle = { ...dotStyle, border: '1px solid #ef4444', bgcolor: 'transparent' };
          } else if (dot === 'lateDelivery') {
            dotStyle = { ...dotStyle, bgcolor: '#991b1b', border: '1px solid #991b1b', display: 'flex', alignitems: 'center', justifyContent: 'center' };
          }
          return (
            <Box key={i} sx={dotStyle}>
              {dot === 'lateDelivery' && <Box sx={{ width: 2, height: 2, bgcolor: 'white', borderRadius: '50%' }} />}
            </Box>
          );
        })}
      </Box>
    );
  };

  const getOrderColor = (rental, date) => {
    // Determine color based on rental status and date
    const rTime = new Date(rental.returnDate).setHours(0, 0, 0, 0);
    const cTime = new Date(currentYear, currentMonth, date).setHours(0, 0, 0, 0);

    if (rental.status === 4 && cTime === rTime) return '#ef4444'; // Late
    if (rental.status === 1 || rental.status === 0) return '#c084fc'; // Reserved/Pending
    if (cTime === new Date(rental.pickupDate).setHours(0, 0, 0, 0)) return '#f97316'; // Pickup
    return '#22c55e'; // Booked/Available
  };

  const getOrderStatusText = (rental) => {
    switch (rental.status) {
      case 0: return 'Pending';
      case 1: return 'Reserved';
      case 2: return 'Picked Up';
      case 3: return 'Returned';
      case 4: return 'Late';
      case 5: return 'Cancelled';
      default: return 'Available';
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3, maxWidth: 1400, mx: 'auto', minHeight: '100vh' }}>

      {/* Top Header */}
      <Box sx={{ display: 'flex', alignitems: 'center', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          sx={{ display: 'none', bgcolor: '#c084fc', '&:hover': { bgcolor: '#a855f7' }, borderRadius: 2 }}
          onClick={() => toast.success('New Schedule Created')}
        >
          New
        </Button>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Rental Scheduler</Typography>
      </Box>

      {/* Month Dropdown */}
      <Box sx={{ mb: 3 }}>
        <Select
          size="small"
          value={`${currentMonth}-${currentYear}`}
          onChange={(e) => {
            const [m, y] = e.target.value.split('-');
            setCurrentMonth(parseInt(m));
            setCurrentYear(parseInt(y));
            setSelectedDates([]);
          }}
          sx={{ width: 150, bgcolor: 'background.paper' }}
        >
          {months.map((m, i) => (
            <MenuItem key={i} value={`${i}-2026`}>{m} 2026</MenuItem>
          ))}
        </Select>
      </Box>

      <Grid container spacing={4}>

        {/* Legend (Left) */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', alignitems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontWeight: 600 }}>Booked</Typography>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #22c55e', bgcolor: 'transparent' }} />
            </Box>
            <Box sx={{ display: 'flex', alignitems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontWeight: 600 }}>Pick up</Typography>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f97316' }} />
            </Box>
            <Box sx={{ display: 'flex', alignitems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontWeight: 600 }}>Late Pick up</Typography>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #ef4444', bgcolor: 'transparent' }} />
            </Box>
            <Box sx={{ display: 'flex', alignitems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 600 }}>Late Delivery</Typography>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#991b1b', display: 'flex', alignitems: 'center', justifyContent: 'center' }}>
                <Box sx={{ width: 4, height: 4, bgcolor: 'white', borderRadius: '50%' }} />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Calendar (Center) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 1, borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <Box key={i} sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontWeight: 600 }}>{day}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>

              {/* Padding days */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <Box key={`pad-${i}`} sx={{ height: 60, p: 1, borderBottom: '1px solid', borderRight: '1px solid', borderColor: 'divider' }}></Box>
              ))}

              {/* Actual days */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const isSelected = selectedDates.includes(day);
                return (
                  <Box
                    key={day}
                    onClick={() => toggleDate(day)}
                    sx={{
                      height: 60,
                      p: 1,
                      borderBottom: '1px solid',
                      borderRight: '1px solid',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      bgcolor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignitems: 'center'
                    }}
                  >
                    <Box sx={{
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignitems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      border: isSelected ? '2px solid #ef4444' : 'none'
                    }}>
                      <Typography sx={{ fontWeight: 500 }}>{day}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      {renderDots(day)}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Grid>

        {/* Details (Right) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', height: '100%', minHeight: 400 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignitems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : selectedDates.length === 0 ? (
              <Typography color="text.secondary">Select a date to view schedules</Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {selectedDates.map(date => {
                  const dayOrders = calendarData[date]?.orders || [];
                  return (
                    <Box key={date}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        {months[currentMonth]} {date}{date === 1 || date === 21 || date === 31 ? 'st' : date === 2 || date === 22 ? 'nd' : date === 3 || date === 23 ? 'rd' : 'th'}, {currentYear}
                      </Typography>

                      {dayOrders.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">No orders for this date.</Typography>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {dayOrders.map((order, idx) => {
                            const itemId = `item-${order.id}-${date}`;
                            const pName = order.items && order.items.length > 0 ? order.items[0].productName : 'Product';
                            const pQty = order.items && order.items.length > 0 ? order.items[0].quantity : 1;
                            const defaultText = `${idx + 1}. ${order.orderNumber}: ${pName}, ${pQty} Unit (${getOrderStatusText(order)})`;

                            return (
                              <Box key={order.id} sx={{ display: 'flex', alignitems: 'center', justifyContent: 'space-between' }}>
                                {editingId === itemId ? (
                                  <Box sx={{ display: 'flex', alignitems: 'center', flexGrow: 1, gap: 1 }}>
                                    <TextField size="small" fullWidth value={editValue} onChange={(e) => setEditValue(e.target.value)} autoFocus />
                                    <IconButton size="small" color="success" onClick={handleSaveEdit}><Check size={16} /></IconButton>
                                  </Box>
                                ) : (
                                  <>
                                    <Typography sx={{ color: getOrderColor(order, date), fontWeight: 500 }}>
                                      {defaultText}
                                    </Typography>
                                    <IconButton size="small" onClick={() => handleEditClick(itemId, defaultText)}><Edit size={16} /></IconButton>
                                  </>
                                )}
                              </Box>
                            );
                          })}
                        </Box>
                      )}
                    </Box>
                  );
                })}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  (all the status mentioned in the brackets are showing the product availability)
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default AdminSchedule;
