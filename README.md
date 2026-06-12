# 🚌 RideBook — Car Ticket Reservation System

A full-stack **MERN** application for booking passenger transport tickets online.
Supports **Bus, Minibus, Taxi, Minivan, Coach, Shuttle** — any passenger vehicle type.

---

## Roles

| Role | Capabilities |
|------|-------------|
| **Passenger** | Search trips, view seat map, book tickets, cancel bookings |
| **Driver** | Register vehicles, create trips, view stats |
| **Controller** | Manage routes, set trip schedules/times, approve vehicles, manage drivers |

---

## Project Structure

```
Car-tickiet-reservatio/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── seed.js
│   └── .env
└── frontend/
    ├── public/
    └── src/
        ├── pages/
        │   ├── driver/
        │   └── controller/
        ├── store/slices/
        ├── components/
        └── utils/
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Backend Setup
```bash
cd backend
npm install
# Edit .env — set MONGO_URI and JWT_SECRET
npm run dev
```

### 2. Seed Test Accounts
```bash
cd backend
node seed.js
```
This creates:
- **Controller**: controller@ridebook.com / password123
- **Driver**: driver@ridebook.com / password123
- **Passenger**: passenger@ridebook.com / password123

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
App runs at http://localhost:3000

---

## Typical Workflow

1. **Controller** logs in → adds Routes (e.g. Addis Ababa → Hawassa)
2. **Driver** registers → adds a Vehicle (gets approved by controller)
3. **Driver** creates a Trip on a route with their vehicle + departure time
4. **Controller** sets the arrival time / confirms the schedule
5. **Passenger** searches origin → destination, picks a trip, selects seats, fills passenger details, books
6. Passenger receives a booking code (e.g. TKT-LQ3K2A-F9XP)

---

## API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/routes | Public |
| POST | /api/routes | Controller |
| GET | /api/trips/search?origin=&destination=&date= | Public |
| POST | /api/trips | Driver |
| PUT | /api/trips/:id/schedule | Controller |
| POST | /api/bookings | Passenger |
| GET | /api/bookings/my-bookings | Passenger |
| PUT | /api/bookings/:id/cancel | Passenger/Controller |
| POST | /api/vehicles | Driver |
| PUT | /api/vehicles/:id/approve | Controller |
