

# 📜 Contributing Guidelines

## Branch Strategy

Never push directly to `main`.

```text
main
├── frontend
└── backend
```

### Backend Branches

```text
backend/auth
backend/product
backend/rental
backend/payment
backend/dashboard
```

### Frontend Branches

```text
frontend/auth
frontend/product
frontend/rental
frontend/dashboard
```

Merge only after both teammates verify the feature works.

---

## Commit Message Convention

```text
feat: add login API

feat: product listing

feat: rental booking

fix: payment calculation

fix: dashboard counts

refactor: rental service

docs: update README
```

Avoid commits like:

```text
final
changes
update
abc
```

---

## Folder Structure

### Backend

```text
Backend/

Controllers/
Services/
Repositories/
DTOs/
Entities/
Middleware/
Extensions/
Data/
Migrations/

Program.cs
```

### Frontend

```text
Frontend/

pages/
components/
layouts/
services/
hooks/
context/
assets/
```

---

# 📅 Hackathon Timeline (18 Jul 10:41 AM → 19 Jul 10:00 AM)

## 🟢 Phase 1 (10:45 AM – 12:00 PM)

### Goal

Project setup + Authentication

### Backend

* [ ] Create Solution
* [ ] Configure EF Core
* [ ] JWT
* [ ] User Entity
* [ ] Register API
* [ ] Login API
* [ ] Swagger

### Frontend

* [ ] React setup
* [ ] Routing
* [ ] Axios
* [ ] Login Page
* [ ] Register Page
* [ ] Navbar
* [ ] Protected Routes
* [ ] fix vendor

✅ Deliverable

```
User can Login
```

---

# 🟢 Phase 2 (12:00 PM – 2:30 PM)

### Product Module

Backend

* [ ] Category
* [ ] Product Entity
* [ ] CRUD
* [ ] Seed Products

Frontend

* [ ] Product Cards
* [ ] Product Details
* [ ] Search
* [ ] Filter

✅ Deliverable

```
Customer can browse products
```

---

# 🍽 Lunch (2:30 PM – 3:00 PM)

Push code.

Merge.

Fix conflicts.

---

# 🟢 Phase 3 (3:00 PM – 6:00 PM)

Rental Booking

Backend

* [ ] Rental Entity
* [ ] Rental Item
* [ ] Booking API
* [ ] Price Calculation

Frontend

* [ ] Date Picker
* [ ] Checkout
* [ ] Booking Summary

Integration

* [ ] Connect API

✅ Deliverable

```
Booking Created
```

---

# 🟢 Phase 4 (6:00 PM – 8:00 PM)

Payment

Backend

* [ ] Payment API
* [ ] Invoice
* [ ] Update Rental Status

Frontend

* [ ] Payment Screen
* [ ] Success Screen

Integration

* [ ] Payment Flow

✅ Deliverable

```
Rental Confirmed
```

---

# 🍕 Dinner (8:00 PM – 8:30 PM)

Push everything.

---

# 🟢 Phase 5 (8:30 PM – 11:00 PM)

Pickup + Return

Backend

* [ ] Pickup API
* [ ] Return API
* [ ] Late Fee
* [ ] Refund

Frontend

* [ ] Pickup Page
* [ ] Return Page

Integration

* [ ] End-to-end workflow

✅ Deliverable

```
Rental Completed
```

---

# 🌙 Phase 6 (11:00 PM – 1:00 AM)

Dashboard

Backend

* [ ] Dashboard API
* [ ] Revenue
* [ ] Active Rentals

Frontend

* [ ] Dashboard Cards
* [ ] Statistics

---

# 🌙 Phase 7 (1:00 AM – 3:00 AM)

Admin

Backend

* [ ] Product CRUD
* [ ] Rental List

Frontend

* [ ] Admin Product
* [ ] Admin Rentals

---

# 🌙 Phase 8 (3:00 AM – 5:00 AM)

Testing

Both

* [ ] Fix bugs
* [ ] Validation
* [ ] Error messages
* [ ] Responsive UI

---

# 🌅 Phase 9 (5:00 AM – 7:00 AM)

Polish

* [ ] Loading Spinner
* [ ] Toast Messages
* [ ] Better UI
* [ ] Icons
* [ ] Empty States

---

# 🌅 Phase 10 (7:00 AM – 8:30 AM)

Demo Preparation

* [ ] Seed Database
* [ ] Demo Accounts
* [ ] Screenshots
* [ ] README
* [ ] Architecture Diagram

---

# 🌅 Phase 11 (8:30 AM – 9:30 AM)

Final Testing

Run the complete flow.

```
Register

↓

Login

↓

Browse Products

↓

Rent Product

↓

Payment

↓

Pickup

↓

Return

↓

Dashboard Updated
```

No broken APIs.

---

# 🚀 Phase 12 (9:30 AM – 10:00 AM)

Submission

* [ ] Push all code
* [ ] Merge into main
* [ ] Verify GitHub
* [ ] Upload submission
* [ ] Record demo (if required)

---

# 🔄 Sync Schedule

Meet briefly every **90 minutes** (10–15 minutes max):

| Time     | Agenda                  |
| -------- | ----------------------- |
| 12:00 PM | Authentication complete |
| 3:00 PM  | Product integration     |
| 6:00 PM  | Rental flow working     |
| 8:30 PM  | Payment complete        |
| 11:00 PM | Pickup & Return         |
| 1:00 AM  | Dashboard review        |
| 5:00 AM  | Bug fixing              |
| 8:30 AM  | Final demo rehearsal    |

---

# 🚦Definition of Done (per module)

A module is **done** only when all of these are true:

* [ ] Backend API implemented
* [ ] API documented in Swagger
* [ ] Frontend integrated (no mock data)
* [ ] Validation implemented
* [ ] Error handling works
* [ ] Database updated correctly
* [ ] Changes committed
* [ ] Changes pushed to GitHub
* [ ] Tested end-to-end

---

# 🎯 MVP Checklist (Must Finish Before 7:00 AM)

| Module                   |         Priority         |
| ------------------------ | :----------------------: |
| Authentication           |           ⭐⭐⭐⭐⭐          |
| Product Listing          |           ⭐⭐⭐⭐⭐          |
| Rental Booking           |           ⭐⭐⭐⭐⭐          |
| Payment (Mock)           |           ⭐⭐⭐⭐⭐          |
| Pickup                   |           ⭐⭐⭐⭐           |
| Return & Late Fee        |           ⭐⭐⭐⭐           |
| Dashboard                |           ⭐⭐⭐⭐           |
| Admin Product CRUD       |            ⭐⭐⭐           |
| Profile                  |            ⭐⭐            |
| Notifications / QR / PDF | ⭐ (Only if time remains) |

## Critical Advice

From **10:45 AM to 7:00 AM**, focus on getting a complete, working rental lifecycle rather than perfecting individual pages. A polished end-to-end demo—**Login → Browse → Book → Pay → Pickup → Return → Dashboard**—will make a much stronger impression on judges than many incomplete features. Keep `main` deployable, push code frequently, and avoid starting new modules until the current workflow is integrated and functioning.
