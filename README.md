<!-- Explains how to set up and run the Trello clone project. -->
# Trello Clone

Full-stack Trello clone built with Node.js, Express, MySQL, Prisma, React, React Router, Context API, and `@dnd-kit`.

## Tech Stack

- Backend: Node.js, Express.js, Prisma ORM, MySQL
- Frontend: React.js, React Router v6, Context API, `@dnd-kit`
- Styling: Plain CSS

## Setup Steps

1. Install MySQL and create a database named `trello_clone`.
2. In `backend/.env`, confirm the `DATABASE_URL` matches your local MySQL credentials.
3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
   Backend source files live in `backend/src`.
4. Sync the database schema:
   ```bash
   npm run db:push
   npm run generate
   ```
5. Seed the database:
   ```bash
   npm run seed
   ```
6. Start the backend:
   ```bash
   npm run dev
   ```
7. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
8. Start the frontend:
   ```bash
   npm run dev
   ```

## Assumptions

- Authentication is intentionally omitted per the assignment.
- The app uses a hardcoded board route for board `1`.
- The default member id comes from `backend/.env`.
- API and frontend run locally at `http://localhost:5000` and `http://localhost:5173`.
- The project uses `prisma db push` for local schema sync unless you create your own migrations later.

## How To Seed

Run the following from `backend/` after syncing the schema:

```bash
npm run db:push
npm run generate
npm run seed
```

## Deployment Notes

- Set the backend environment variables in your hosting platform, especially `DATABASE_URL`, `PORT`, `NODE_ENV`, and `DEFAULT_MEMBER_ID`.
- Before the backend starts for the first time, sync the schema and generate the Prisma client with:
  ```bash
  npm run db:push
  npm run generate
  ```
- Seed sample data only if you want the deployed demo to start with the assignment board data:
  ```bash
  npm run seed
  ```
- Set the frontend environment variable `VITE_API_BASE_URL` to your deployed backend URL with the `/api` suffix.

## Troubleshooting

- If the backend starts but the frontend shows `Board not found`, reseed the database:
  ```bash
  cd backend
  npm run seed
  npm run dev
  ```
- If schema-related errors appear, such as missing tables or missing columns, resync Prisma with the database:
  ```bash
  cd backend
  npm run db:push
  npm run generate
  npm run seed
  npm run dev
  ```
- If you want to confirm the seeded board exists in MySQL, run:
  ```sql
  use trello_clone;
  select * from Board;
  ```
  The assignment expects the seeded board to be available as `id = 1`.
