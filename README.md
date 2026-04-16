# Trello Clone

A full-stack Kanban-style project management tool 
replicating Trello's UI and functionality.

**Live Demo**
- Frontend: https://trello-clone-rust-beta.vercel.app
- Backend API: https://trello-clone-2-lral.onrender.com

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router v6, Context API |
| Drag & Drop | @dnd-kit (modern, accessible DnD library) |
| Styling | Plain CSS |
| Backend | Node.js, Express.js |
| ORM | Prisma ORM |
| Database | MySQL |

---

## Features Implemented

### Core (Required)
- Create and view boards with all lists and cards
- Create, edit, delete lists
- Drag and drop to reorder lists horizontally
- Create, edit, delete, archive cards
- Drag and drop cards between lists and within a list
- Card details: labels, due date, checklist with 
  items, assign members
- Search cards by title
- Filter cards by labels, members, due date

### Bonus
- Multiple boards support
- File attachments on cards
- Comments on cards
- Activity log
- Card cover images
- Board background customization
- Responsive design (mobile, tablet, desktop)

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MySQL running locally

### Backend Setup

1. Create a MySQL database:
```sql
   CREATE DATABASE trello_clone;
```

2. Copy and configure environment variables:
cd backend
cp .env.example .env
   Update `DATABASE_URL` with your MySQL credentials.

3. Install dependencies:
npm install

4. Sync schema and generate Prisma client:
npm run db:push
npm run generate

5. Seed sample data:
npm run seed

6. Start the server:
npm run dev
   Backend runs at `http://localhost:5000`

### Frontend Setup

1. Install dependencies:
cd frontend
npm install

2. Set the API base URL in `.env`:
VITE_API_BASE_URL=http://localhost:5000/api

3. Start the frontend:
npm run dev
   Frontend runs at `http://localhost:5173`

---

## Assumptions

- Authentication is omitted as per assignment 
  instructions — a default user is pre-seeded.
- The app opens board with `id = 1` by default 
  (seeded automatically).
- `prisma db push` is used for schema sync instead 
  of migrations (suitable for development/demo).
- Default member ID is configured via 
  `DEFAULT_MEMBER_ID` in backend `.env`.

---

## Troubleshooting

**Board not found on frontend:**
```bash
cd backend
npm run seed
npm run dev
```

**Schema errors (missing tables/columns):**
```bash
cd backend
npm run db:push
npm run generate
npm run seed
```

**Verify seeded board in MySQL:**
```sql
USE trello_clone;
SELECT * FROM Board;
```

---

## Deployment

- Backend deployed on **Render**
- Frontend deployed on **Vercel**
- Set `VITE_API_BASE_URL` to deployed backend 
  URL with `/api` suffix on Vercel
- Set `DATABASE_URL`, `PORT`, `NODE_ENV`, 
  `DEFAULT_MEMBER_ID` on Render