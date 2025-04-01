🏥 Healthcare CRM System
A comprehensive, scalable Healthcare CRM platform designed to manage patients, doctors, nurses, appointments, and insurance documents with a modern admin interface.

Built with Next.js App Router, MongoDB, Mongoose, Tailwind CSS, Material UI, and other modern libraries, this system provides full CRUD functionality, file uploads, appointment tracking, and admin-side notifications — optimized for a seamless clinical workflow.

👥 Team Contributors
Name	Role
Arjav Patel	Admin UI Design, Patient Management, Insurance Upload & Preview
Gaurang Dhamleiya	Doctor & Nurse Management, Appointment Scheduling & Display
Anuj Patel	Backend API Integration, MongoDB Models, Upload Service, Utilities
✅ Core Features
🔐 Admin Authentication (optional for future extension)
🧍 Patient Management – CRUD operations with medical history support
📁 Insurance Document Handling – Upload, preview (PDF/image), edit, and download
🧑‍⚕️ Doctor/Nurse Management – Full CRUD and availability tracking
📅 Appointment Management – Bookings with nurse/doctor assignment
🔔 Today’s Appointments Badge – Notification badge with modal preview
📊 Dashboard Analytics – Metrics and real-time status cards
📤 File Upload Service – Stores insurance documents locally (with preview/download)
📂 MongoDB Integration – Clean Mongoose schemas with relational references
💡 Tech Stack
Technology	Purpose
Next.js 14+ (App Router)	Full-stack frontend/backend framework
TypeScript	Type safety across all code
MongoDB Atlas	Cloud database for persistent storage
Mongoose	MongoDB object modeling + population support
Tailwind CSS	Utility-first CSS framework
Material UI (MUI)	UI components (AppBar, Table, Dialogs)
Axios	Client-side HTTP calls
Faker.js	Fake data generation for development & seeding
React Icons	For intuitive actions (edit, delete, view, etc.)
Nodemailer (optional)	Email reminders for patients (future)
FormData & fs/promises	File upload handling for insurance files
🚀 Getting Started
1. Clone the Repository
git clone https://github.com/your-org/healthcare-crm.git cd healthcare-crm

Install Dependencies npm install
or
yarn install 3. Environment Variables Create a .env.local file in the root: MONGODB_URI=mongodb+srv://:@cluster.mongodb.net/healthcare NEXT_PUBLIC_API_URL=http://localhost:3000 Replace and with your MongoDB Atlas credentials.

Seed Data (Optional for Dev) If you use a seeder script powered by Faker.js: npm run seed or visit the route api/seed
Run the App
npm run dev Visit 👉 http://localhost:3000

📦 Key API Endpoints Method Endpoint Description GET /api/admin/patients List all patients POST /api/admin/patients Create new patient GET /api/admin/patients/:id Get patient details PUT /api/admin/patients/:id Update patient info DELETE /api/admin/patients/:id Delete a patient GET /api/admin/appointments/today Fetch today's appointments POST /api/insurance/upload Upload insurance file PUT /api/admin/insurance/:id Update insurance metadata/file GET /api/admin/insurance/by-patient/:id Get patient’s insurance list