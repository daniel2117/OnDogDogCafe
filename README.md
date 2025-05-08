# 🐶 On Dog Dog Cafe

> A one-stop web platform for pet lovers — from adoption and rehoming to playtime and pastries.

Welcome to **On Dog Dog Cafe**, a full-stack web application designed to support dog lovers with a seamless, interactive experience. Whether you're looking to adopt, rehome, book a facility, or just enjoy our dog-friendly café, this platform has you covered.

---

## 🌟 Features

### 🏠 Home & Navigation
- Landing page with logo, intro & language toggle (🇬🇧 English / 🇨🇳 中文)
- Smooth scroll and responsive layout

### 📅 Facility Reservation
- Booking system for:
  - 🐾 Dog Daycare
  - 🏊‍♂️ Swimming Pool
  - 🐶 Dog Party Room
- Real-time time slot availability
- Email verification required before booking
- Modify / Cancel booking with ease

### 🐕 Adoption Application
- Multi-step application form with:
  - Address & household situation
  - Uploaded home environment images
  - Info about children, roommates, and other pets
- Support for modifying and viewing submitted applications

### 🐾 Rehoming Application
- 8-step form capturing:
  - Owner info, pet details, behavior checklist
  - Photo & document upload
  - Review + confirm before submit
- Modify mode with pre-filled data

### ✨ My Page Dashboard
- View all adoption, reservation, and rehoming applications
- Cancel, modify or leave feedback post-booking

---

## 🛠 Tech Stack

| Layer     | Stack                         |
|-----------|-------------------------------|
| Frontend  | React + Vite                  |
| Styling   | Tailwind CSS                  |
| Routing   | React Router                  |
| Backend   | RESTful API (Node.js/Express) |
| Storage   | MongoDB + Cloudinary (images) |
| i18n      | Language toggle via props     |
| Auth      | Email verification + localStorage |

---

## 📸 Screenshots

> 🐾 Facility Booking  
![booking](public/screenshots/Booking.png)

> 🐶 Adoptable Dogs  
![rehoming](public/screenshots/Adoption.png)

> 📋 My Page  
![mypage](public/screenshots/MyPage.png)

---

## 🚀 Getting Started

```bash
git clone https://github.com/yourusername/on-dog-dog-cafe.git
cd on-dog-dog-cafe
npm install
npm run dev
