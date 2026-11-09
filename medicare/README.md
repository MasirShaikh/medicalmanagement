# MediCare — Clinic Management System

Full-stack project: **Angular** (frontend) + **Django REST Framework** (backend) + **PostgreSQL** (database), JWT auth with role-based access (Admin / Doctor / Receptionist / Patient).

```
medicare/
├── backend/     Django + DRF API
└── frontend/    Angular app
```

---

## 1. Backend setup (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then edit DB credentials

# Create the database first (psql):
#   CREATE DATABASE medicare;

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API runs at **http://localhost:8000/**. Admin panel at **http://localhost:8000/admin/**.

## 2. Frontend setup (Angular)

```bash
cd frontend
npm install
ng serve
```

App runs at **http://localhost:4200/** and calls the API at `http://localhost:8000/api` (see `src/environments/environment.ts`).

Login with the superuser you created (or register via `POST /api/auth/register/`). These are **real localhost URLs on your own machine** — once both servers are running, that's your actual local instance of the project, with data persisted in PostgreSQL.

---

## 3. API Endpoints

```
POST   /api/auth/login/                Obtain JWT access + refresh token
POST   /api/auth/register/             Create a new user
POST   /api/auth/refresh/              Refresh access token
GET    /api/auth/me/                   Current user profile
GET    /api/auth/roles/                List roles

GET    /api/doctors/                   List doctors
POST   /api/doctors/                   Add doctor
GET    /api/doctors/{id}/              Doctor detail
GET    /api/doctors/departments/       List departments

GET    /api/patients/                  List patients (search)
POST   /api/patients/                  Add patient
GET    /api/patients/{id}/             Patient detail
PUT    /api/patients/{id}/             Update patient
DELETE /api/patients/{id}/             Delete patient

GET    /api/appointments/                          List appointments (filter by status/doctor/date)
POST   /api/appointments/                          Book appointment (rejects double-booking)
PATCH  /api/appointments/{id}/                     Update status (completed/cancelled/no_show)
GET    /api/appointments/available-slots/?doctor=&date=   ⭐ Real-time free/booked slot list

GET    /api/medical-records/           List / add medical records
POST   /api/medical-records/           (symptoms, diagnosis, vitals)

GET    /api/prescriptions/             List prescriptions (nested medicine items)
POST   /api/prescriptions/             Create prescription with items

GET    /api/billing/                   List invoices (nested line items)
POST   /api/billing/                   Generate invoice
GET    /api/billing/payments/          List payments
POST   /api/billing/payments/          Record a payment

GET    /api/reports/dashboard-statistics/?range=today|7d|30d
                                        Cards, appointment status breakdown, revenue, doctor performance
```

All endpoints except `login` and `register` require `Authorization: Bearer <access_token>`.

### ⭐ Double-booking prevention (the core business logic)
This is enforced in **two layers**, exactly as planned:
1. **Database level** — a `UniqueConstraint` on `(doctor, date, time)` (excluding cancelled appointments) in `appointments/models.py`, so even simultaneous requests can't create a clash.
2. **API level** — `AppointmentSerializer.validate()` checks for an existing active appointment at the same doctor+date+time and returns a clear validation error.
3. **Frontend** — the booking modal calls `GET /api/appointments/available-slots/` before showing the slot grid, so already-booked times are visibly disabled before the user even tries.

---

## 4. Database tables & relationships

| Table | Key fields |
|---|---|
| `roles` | name (admin / doctor / receptionist / patient) |
| `users` | username, email, role_id, phone |
| `departments` | name, description |
| `doctors` | name, specialization, department_id, fee, available_days/time, status |
| `patients` | full_name, dob, gender, blood_group, emergency_contact |
| `appointments` | patient_id, doctor_id, date, time (unique per doctor+date+time), status |
| `medical_records` | patient_id, doctor_id, appointment_id, symptoms, diagnosis, vitals |
| `prescriptions` | patient_id, doctor_id, diagnosis, notes |
| `prescription_items` | prescription_id, medicine_name, dosage, frequency, duration |
| `invoices` | patient_id, appointment_id, subtotal, discount, total, status |
| `invoice_items` | invoice_id, description, amount |
| `payments` | invoice_id, amount, method |

```
Doctor → Appointments → Patient → Medical Records → Prescription → Prescription Items
Appointment → Invoice → Payment
```

---

## 5. UI

Green medical fintech-style theme (`frontend/src/assets/styles/theme.scss`): primary green `#16A34A`, deep green accent `#0B4F3F`, white cards, soft shadows, rounded 16-20px corners — no grad ­ient overload, no glassmorphism.

Sidebar: Dashboard · Doctors · Patients · Appointments · Prescriptions · Billing · Reports · Settings.

---

## 6. What's implemented vs. scaffolded

**Fully wired (backend + frontend):** JWT login, Dashboard (live stats from `/api/reports/dashboard-statistics/`), Patients (full CRUD, search), **Appointments with real-time slot booking** (the core "⭐" business logic — doctor+date picker fetches live availability from the backend and prevents double-booking at both the API and database level).

**Backend API fully built, frontend routes not yet wired:** Doctors, Prescriptions (with nested medicine items), Billing (invoices + payments), Medical Records, Reports. Every endpoint above works standalone (test with Postman/curl or the Django admin) — building their Angular pages is a copy of the Patients/Appointments pattern already in the codebase (a `*.service.ts` calling the REST endpoint, a list component, and a form/modal component).

A separate static HTML **visual preview** (`preview/medicare-preview.html`, also viewable live at the shared claude.ai link) starts with zero data and saves anything you add to your own browser's localStorage — useful for showing the UI without setting up the backend. This zip's `backend/` + `frontend/` folders are the real, database-backed implementation.
