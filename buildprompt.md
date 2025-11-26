# Driver Training Tracker - Build Prompt for Claude Opus

Create a mobile-optimized TypeScript web application for tracking new driver training progress with the following requirements:

## Core Functionality

### Driver Profile Management
- Create and manage multiple driver profiles
- Store driver name, birth date, and start date
- Display countdown to driver's 16th birthday on dashboard
- Show overall training progress percentage

### Training Checklist Structure
- Implement 8 major training phases (sections) based on the attached checklist
- Each phase contains multiple individual skills/tasks
- Support custom phase creation and editing
- Allow adding/editing/removing tasks within phases

### Progress Tracking
- Mark individual tasks as: Not Started, In Progress, Completed
- Add dated notes/observations for each task
- Provide feedback field for instructor comments to the driver
- Track completion date for each skill
- Calculate and display progress by phase and overall

### Dashboard Views
- Driver overview: progress bars, completion stats, birthday countdown
- Phase detail view: expandable sections showing all tasks
- Progress timeline: chronological view of completed skills
- Feedback log: consolidated view of all instructor notes

## Technical Requirements

### Technology Stack
- TypeScript for type safety
- Mobile-first responsive design
- Modern framework (Next.js, React, or similar)
- TailwindCSS or similar for styling
- PostgreSQL database

### Deployment
- Deploy to Fly.io using `fly` and `flyctl` CLI
- Use environment variables via .env file
- PostgreSQL connection string: DATABASE_URL in .env
- Include fly.toml configuration file
- Provide deployment instructions

### Database Schema Requirements
- drivers table: id, name, birth_date, start_date, created_at
- phases table: id, driver_id, title, description, order_index
- tasks table: id, phase_id, title, description, order_index
- progress table: id, task_id, status, completion_date, notes, feedback, updated_at

### Mobile Optimization
- Touch-friendly interface elements
- Large tap targets (minimum 44x44px)
- Swipe gestures for navigation where appropriate
- Fast load times and minimal dependencies
- Offline-capable for viewing (optional PWA features)
- Responsive layout: works on 320px to 1920px screens

## User Experience Features

### Quick Actions
- One-tap task status updates
- Quick note addition from task view
- Bulk operations (mark multiple tasks as complete)
- Search/filter tasks across all phases

### Visual Feedback
- Color-coded progress indicators (red/yellow/green)
- Completion animations
- Progress charts (phase completion, overall progress)
- Recent activity feed on dashboard

### Data Management
- Export progress reports (PDF or CSV)
- Import the provided checklist as default template
- Backup/restore functionality
- Print-friendly progress reports

## Initial Data

The application should seed with this 8-phase driver training checklist:

```
Phase 1: Basic Safety & Vehicle Familiarity
Phase 2: Fundamental Driving Skills  
Phase 3: Traffic Navigation
Phase 4: Intermediate Traffic Skills
Phase 5: Highway and Freeway Driving
Phase 6: Challenging Conditions
Phase 7: Advanced Safety and Emergency Skills
Phase 8: Independent Driving Readiness
```

(Full checklist with all tasks is attached in teen_driver_skills_checklist.md)

## Development Priorities

1. **First**: Set up basic project structure with Fly.io deployment working
2. **Second**: Implement database schema and driver profile CRUD
3. **Third**: Build phase and task management with progress tracking
4. **Fourth**: Add dashboard with birthday countdown and progress visualization
5. **Fifth**: Polish mobile UI/UX and add notes/feedback functionality
6. **Sixth**: Implement export/reporting features

## Deliverables

Please provide:
1. Complete source code with TypeScript
2. Database migration files
3. fly.toml configuration
4. .env.example file with required variables
5. README.md with:
   - Setup instructions
   - Fly.io deployment steps
   - Database initialization commands
   - Usage guide
6. Package.json with all dependencies

## Quiz Section

### Missouri Driver Guide Integration
Include a quiz/study section that helps new drivers prepare for their written test using content from the Missouri Driver Guide.

**Quiz Features:**
- Multiple-choice questions (25 questions per practice test, matching the real test format)
- Questions organized by topic/chapter:
  - Missouri Driver License requirements
  - Rules of the Road
  - Sharing the Road (motorcycles, trucks, pedestrians, bicycles)
  - Parking regulations
  - Highway driving
  - Pavement markings, traffic signs, and signals
  - Safe driving tips (everyday and special conditions)
  - Alcohol, drugs, and driving
  - Point system and violations
- Track quiz scores and attempts
- Show correct answers with explanations
- Progress tracking: percentage correct by topic
- Practice mode vs. test mode
- Must score 80% (20 out of 25) to "pass" like the real test

**Sample Question Topics to Include:**
- Right-of-way rules at intersections
- Speed limits and passing zones
- Emergency vehicle procedures
- School bus stopping requirements
- Hand signals and turn signals
- Parking restrictions and handicapped spaces
- Traffic sign meanings (shapes and colors)
- Blood alcohol limits and DUI laws
- Point system and license suspension
- GDL (Graduated Driver License) requirements
- Safe following distances
- Roundabout navigation
- Weather driving conditions

**Database Schema for Quiz:**
- quiz_questions table: id, topic, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, chapter_reference
- quiz_attempts table: id, driver_id, score, total_questions, date_taken, time_taken
- quiz_answers table: id, attempt_id, question_id, selected_answer, is_correct

**Reference Document:**
The application should seed quiz questions based on the Missouri Driver Guide (https://dor.mo.gov/forms/Driver%20Guide.pdf). Create at least 100 questions covering all major topics from Chapters 1-11 of the guide.

## Additional Notes

- Keep dependencies minimal for faster mobile performance
- Use semantic HTML for accessibility
- Include basic form validation
- Add confirmation dialogs for destructive actions
- Implement proper error handling and user feedback
- Consider adding simple authentication (optional for MVP)

Build this as a production-ready application that a parent can actually use to track their teen's driving progress effectively on their phone.