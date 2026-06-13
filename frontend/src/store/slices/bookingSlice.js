import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const createBooking = createAsyncThunk('bookings/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/bookings', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Booking failed');
  }
});

export const fetchMyBookings = createAsyncThunk('bookings/myBookings', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/bookings/my-bookings');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load bookings');
  }
});

export const cancelBooking = createAsyncThunk('bookings/cancel', async (id, { rejectWithValue }) => {
  try {
    await api.put(`/bookings/${id}/cancel`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Cancel failed');
  }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(createBooking.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(createBooking.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchMyBookings.pending,   (s) => { s.loading = true; })
      .addCase(fetchMyBookings.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchMyBookings.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(cancelBooking.fulfilled,   (s, a) => {
        const b = s.list.find((x) => x._id === a.payload);
        if (b) b.status = 'cancelled';
      });
  },
});

export default bookingSlice.reducer;
