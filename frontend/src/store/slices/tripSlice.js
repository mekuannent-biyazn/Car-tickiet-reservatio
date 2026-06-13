import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const searchTrips = createAsyncThunk('trips/search', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/trips/search', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Search failed');
  }
});

export const fetchTrip = createAsyncThunk('trips/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/trips/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load trip');
  }
});

const tripSlice = createSlice({
  name: 'trips',
  initialState: {
    results:  [],
    selected: null,
    loading:  false,
    error:    null,
  },
  reducers: {
    clearResults: (s) => { s.results = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchTrips.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(searchTrips.fulfilled, (s, a) => { s.loading = false; s.results = a.payload; })
      .addCase(searchTrips.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchTrip.pending,     (s) => { s.loading = true; })
      .addCase(fetchTrip.fulfilled,   (s, a) => { s.loading = false; s.selected = a.payload; })
      .addCase(fetchTrip.rejected,    (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { clearResults } = tripSlice.actions;
export default tripSlice.reducer;
