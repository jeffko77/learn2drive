# Learn2Drive - Teen Driver Training Tracker

A mobile-optimized web application for tracking new driver training progress with Missouri DMV quiz prep.

![Learn2Drive](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4-cyan)

## Features

### 📊 Driver Profile Management
- Create and manage multiple driver profiles
- Birthday countdown to 16th birthday
- Overall training progress visualization

### 📝 Training Checklist
- 8 comprehensive training phases
- 100+ individual driving skills to track
- Progress tracking with notes & feedback
- Filter by status (Not Started, In Progress, Completed)

### 🎯 Missouri DMV Quiz Prep
- 100+ practice questions from Missouri Driver Guide
- Practice by topic or take a full 25-question test
- 80% passing score (like the real test)
- Track quiz history and scores

### 📱 Mobile Optimized
- Touch-friendly interface (44x44px tap targets)
- PWA-ready for home screen installation
- Works on screens 320px to 1920px
- Dark theme road-inspired design

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Icons**: Lucide React
- **Deployment**: Fly.io

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Fly.io CLI (for deployment)

### Local Development

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd learn2drive
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your DATABASE_URL
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Visit [http://localhost:3000](http://localhost:3000)

6. **Seed quiz questions**
   Click "Load Quiz Questions" on the home page to initialize 100+ Missouri DMV practice questions.

## Deployment to Fly.io

### First Time Setup

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly.io**
   ```bash
   fly auth login
   ```

3. **Create the app**
   ```bash
   fly launch --no-deploy
   ```

4. **Create a PostgreSQL database**
   ```bash
   fly postgres create --name learn2drive-db
   fly postgres attach learn2drive-db
   ```

5. **Set the DATABASE_URL secret**
   The attach command should set this automatically. Verify with:
   ```bash
   fly secrets list
   ```

6. **Deploy**
   ```bash
   fly deploy
   ```

7. **Run database migrations**
   ```bash
   fly ssh console -C "npx prisma migrate deploy"
   ```

### Subsequent Deployments

```bash
fly deploy
```

### Useful Commands

```bash
# View logs
fly logs

# Open deployed app
fly open

# SSH into the container
fly ssh console

# Check app status
fly status

# Scale resources
fly scale memory 1024
```

## Database Schema

### Tables

- **drivers**: id, name, birth_date, start_date, created_at, updated_at
- **phases**: id, driver_id, title, description, order_index
- **tasks**: id, phase_id, title, description, order_index
- **progress**: id, task_id, status, completion_date, notes, feedback
- **quiz_questions**: id, topic, question_text, options (A-D), correct_answer, explanation
- **quiz_attempts**: id, driver_id, score, total_questions, date_taken, mode
- **quiz_answers**: id, attempt_id, question_id, selected_answer, is_correct

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/drivers | List all drivers |
| POST | /api/drivers | Create new driver |
| GET | /api/drivers/[id] | Get driver details |
| PUT | /api/drivers/[id] | Update driver |
| DELETE | /api/drivers/[id] | Delete driver |
| POST | /api/progress | Update task progress |
| PUT | /api/progress | Bulk update tasks |
| GET | /api/quiz/questions | Get quiz questions |
| GET | /api/quiz/topics | Get quiz topics |
| POST | /api/quiz/attempts | Submit quiz attempt |
| GET | /api/quiz/attempts | Get quiz history |
| POST | /api/seed | Seed quiz questions |
| GET | /api/seed | Check seed status |

## Training Phases

1. **Basic Safety & Vehicle Familiarity** - Pre-drive checks, basic controls
2. **Fundamental Driving Skills** - Parking lot practice
3. **Traffic Navigation** - Residential streets
4. **Intermediate Traffic Skills** - Multi-lane roads
5. **Highway and Freeway Driving** - High-speed traffic
6. **Challenging Conditions** - Weather and visibility
7. **Advanced Safety and Emergency Skills** - Defensive driving
8. **Independent Driving Readiness** - Real-world navigation

## Quiz Topics

- Missouri Driver License Requirements
- Rules of the Road
- Sharing the Road
- Parking Regulations
- Traffic Signs and Signals
- Pavement Markings
- Safe Driving
- Alcohol, Drugs, and Driving
- Point System and Violations
- Roundabouts
- Highway Driving
- Hand Signals

## License

MIT
