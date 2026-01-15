# TripLyst

TripLyst is a full-stack travel itinerary planning web application that allows users to create, manage, and share custom travel itineraries. Users can build itineraries manually or generate them with AI assistance, explore public itineraries created by others, and bookmark trips for future reference.

The application is built with modern web technologies and focuses on secure data access, scalability, and a clean user experience.

---

## 🌐 Live Demo

🔗 **[https://trip-lyst.vercel.app](https://trip-lyst.vercel.app)**

---

## 🚀 Features

* **User Authentication** – Secure sign-up and login using Supabase Auth
* **Itinerary Creation** – Create detailed travel itineraries manually or with AI assistance
* **AI-Powered Generation** – Generate itineraries using the Google Gemini API with validation and constraints
* **Public & Private Itineraries** – Control visibility of itineraries
* **Discovery & Search** – Browse and search public itineraries by destination
* **Bookmarking** – Save and manage bookmarked itineraries
* **Image Uploads** – Upload and manage profile and itinerary images
* **Access Control** – Ownership and visibility enforced using Row Level Security (RLS)

---

## 🛠️ Tech Stack

### Frontend

* **Next.js** (App Router)
* **React**
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui**

### Backend / Infrastructure

* **Supabase**
  * Authentication
  * PostgreSQL Database
  * Row Level Security (RLS)
  * Storage (Images)
* **Google Gemini API** – AI itinerary generation
* **Vercel** – Deployment and hosting

