# Driving Test & Road Sign Test Feature - Implementation Prompt

## Overview
Add two new test sections to the Learn2Drive app at https://learn2drive.fly.dev/quiz:
1. **Driving Skills Test** - Based on Missouri's actual behind-the-wheel driving exam
2. **Road Sign Recognition Test** - Based on Missouri's road sign test requirement

Both tests should follow the existing quiz pattern but be structured as practical evaluation checklists that parents/instructors can use during actual driving sessions.

---

## Feature 1: Driving Skills Test

### Purpose
This test mirrors the actual Missouri State Highway Patrol driving exam criteria. Parents/instructors use this as a checklist during driving practice to evaluate the student's readiness for the official test.

### Database Schema

```sql
-- Driving test categories and criteria
CREATE TABLE driving_test_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE driving_test_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES driving_test_categories(id) ON DELETE CASCADE,
  criteria_name TEXT NOT NULL,
  evaluation_guide TEXT NOT NULL,
  max_points INTEGER DEFAULT 5,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Driving test attempts and evaluations
CREATE TABLE driving_test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id VARCHAR(255) NOT NULL,
  test_date TIMESTAMP DEFAULT NOW(),
  total_score INTEGER,
  max_possible_score INTEGER,
  passed BOOLEAN,
  evaluator_name VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE driving_test_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES driving_test_attempts(id) ON DELETE CASCADE,
  criteria_id UUID REFERENCES driving_test_criteria(id) ON DELETE CASCADE,
  points_deducted INTEGER DEFAULT 0,
  evaluator_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Driving Test Categories & Criteria

Based on Missouri's official driving exam (Chapter 2), create these categories with specific evaluation criteria:

#### Category 1: Vehicle Controls & Pre-Drive
**Description:** Testing knowledge and use of vehicle controls before driving begins

**Criteria:**
1. **Find Accelerator Without Searching**
   - Evaluation Guide: "Student locates gas pedal immediately without looking down. Demonstrates foot position and understands pressure sensitivity."
   - Max Points: 3

2. **Find Brake Without Searching**
   - Evaluation Guide: "Student locates brake pedal immediately without looking down. Demonstrates proper pressure for smooth stopping."
   - Max Points: 3

3. **Operate Turn Signals Correctly**
   - Evaluation Guide: "Student activates left/right turn signals without looking. Cancels signals after turns. Uses proper timing (100 feet before turn)."
   - Max Points: 3

4. **Operate Windshield Wipers Correctly**
   - Evaluation Guide: "Student adjusts wiper speed appropriately without looking. Knows intermittent, low, and high settings."
   - Max Points: 2

5. **Release Parking Brake**
   - Evaluation Guide: "Student releases parking brake smoothly before driving. Checks that brake warning light is off."
   - Max Points: 2

#### Category 2: Starting & Stopping
**Description:** Smooth vehicle starts and controlled stops

**Criteria:**
1. **Start Vehicle Smoothly**
   - Evaluation Guide: "Vehicle starts without jerking. Student checks surroundings before moving. Releases brake gradually then applies gas smoothly."
   - Max Points: 5

2. **Stop Vehicle Smoothly**
   - Evaluation Guide: "Progressive braking with no sudden stops. Vehicle comes to rest without jerking. Student anticipates stops early."
   - Max Points: 5

3. **Reaction Time**
   - Evaluation Guide: "Student responds quickly but not frantically to examiner's instructions and traffic conditions."
   - Max Points: 3

4. **Vehicle Control When Stopping**
   - Evaluation Guide: "Maintains straight line when stopping. No rolling backward on hills. Vehicle fully stopped (not rolling)."
   - Max Points: 4

#### Category 3: Parallel Parking
**Description:** Park in a space 25 feet long and 7 feet wide, within 18 inches of curb

**Criteria:**
1. **Vehicle Position Before Backing**
   - Evaluation Guide: "Student positions alongside front car, 1-2 feet away, mirrors aligned. Signals intent to park."
   - Max Points: 3

2. **No Contact With Space Markers**
   - Evaluation Guide: "Student completes parking without hitting cones/markers at any point."
   - Max Points: 5 (automatic fail if hit)

3. **Smooth Entry Into Space**
   - Evaluation Guide: "Backs at appropriate speed (walking pace). Makes smooth steering adjustments. Checks mirrors and blind spots."
   - Max Points: 4

4. **Park Within 18 Inches of Curb**
   - Evaluation Guide: "Final position is 12-18 inches from curb. Use measuring tool if needed. Closer is better."
   - Max Points: 5

5. **Park Near Center of Space**
   - Evaluation Guide: "Vehicle is centered between front and rear markers. Equal space front and back."
   - Max Points: 3

6. **Complete Within Two Minutes**
   - Evaluation Guide: "Student completes parallel park within 2 minutes from start to finish. Time with stopwatch."
   - Max Points: 3

7. **Wheels Turned Correctly**
   - Evaluation Guide: "When finished parking, front wheels are turned toward curb on downhill or no grade, away from curb on uphill."
   - Max Points: 3

8. **Check Traffic Before Leaving Space**
   - Evaluation Guide: "Student checks mirrors, signals, and shoulder checks before pulling out of parking space."
   - Max Points: 3

#### Category 4: Backing
**Description:** Safe backing procedures and control

**Criteria:**
1. **Look Over Right Shoulder**
   - Evaluation Guide: "Student turns body and looks directly through rear window. Does not rely solely on mirrors."
   - Max Points: 5

2. **Straight Line Backing**
   - Evaluation Guide: "Vehicle backs in straight line without weaving. Maintains control throughout maneuver."
   - Max Points: 4

3. **Stay In Proper Lane**
   - Evaluation Guide: "When backing in traffic lane, student stays within lane markers. Doesn't drift into other lanes."
   - Max Points: 4

4. **Appropriate Backing Speed**
   - Evaluation Guide: "Backs at walking pace or slower. Full control at all times. Can stop immediately if needed."
   - Max Points: 3

#### Category 5: Turns (Left & Right)
**Description:** Make at least two right turns and two left turns properly

**Criteria:**
1. **Correct Lane for Turning**
   - Evaluation Guide: "Student positions in proper lane well before turn. Right turns from right lane, left turns from left or center lane."
   - Max Points: 4

2. **Proper Turn Signal Timing**
   - Evaluation Guide: "Signal activated at least 100 feet (3 seconds) before turn. Signal continuous until turn is completed."
   - Max Points: 4

3. **Turn Into Proper Lane**
   - Evaluation Guide: "Completes turn into nearest legal lane. Right turn into right lane, left turn into left lane. Doesn't cut corners or swing wide."
   - Max Points: 5

4. **Proper Traffic Checks**
   - Evaluation Guide: "Checks mirrors before turn. Looks for pedestrians/cyclists in crosswalk. Shoulder checks before lane changes."
   - Max Points: 5

5. **Appropriate Turn Speed**
   - Evaluation Guide: "Slows appropriately for turn (10-15 mph typically). Doesn't brake hard in middle of turn. Smooth acceleration out of turn."
   - Max Points: 3

6. **Vehicle Control During Turn**
   - Evaluation Guide: "Smooth steering inputs. Maintains proper lane position throughout turn. No jerky movements."
   - Max Points: 4

#### Category 6: Hill Parking
**Description:** Park on a hill safely with proper wheel positioning

**Criteria:**
1. **Vehicle Control**
   - Evaluation Guide: "Smooth approach and stop on hill. No rolling backward. Maintains position while setting parking brake."
   - Max Points: 4

2. **Park Within 18 Inches of Curb**
   - Evaluation Guide: "Final position is within 18 inches of curb, measured from nearest tire."
   - Max Points: 4

3. **Correct Gear Selection**
   - Evaluation Guide: "Automatic: Park. Manual: 1st gear uphill, reverse downhill. Understands why."
   - Max Points: 3

4. **Wheels Turned Correctly**
   - Evaluation Guide: "UPHILL WITH CURB: wheels turned left (away from curb). UPHILL NO CURB: wheels turned right. DOWNHILL: wheels turned right (toward curb)."
   - Max Points: 5

5. **Parking Brake Set**
   - Evaluation Guide: "Parking brake firmly engaged before releasing foot brake. Brake warning light on."
   - Max Points: 3

6. **Check Traffic & Signal**
   - Evaluation Guide: "Checks mirrors and signals before pulling away from curb. Looks over shoulder for blind spots."
   - Max Points: 3

#### Category 7: Intersections
**Description:** Entering and leaving intersections safely

**Criteria:**
1. **Obey Traffic Signs & Signals**
   - Evaluation Guide: "Stops at red lights and stop signs. Yields when required. Proceeds on green only when safe."
   - Max Points: 5 (critical)

2. **Appropriate Approach Speed**
   - Evaluation Guide: "Slows down approaching intersections. Scanning for hazards. Ready to stop if needed."
   - Max Points: 4

3. **Traffic Awareness**
   - Evaluation Guide: "Checks all directions before entering intersection. Aware of pedestrians, cyclists, cross-traffic."
   - Max Points: 5

4. **Correct Lane Position**
   - Evaluation Guide: "Stays in proper lane approaching and through intersection. Doesn't drift or change lanes in intersection."
   - Max Points: 4

5. **Yield Right-of-Way Correctly**
   - Evaluation Guide: "Yields to oncoming traffic on left turns. Yields to traffic on right at 4-way stops. Doesn't block intersection."
   - Max Points: 5

6. **Complete Stop At Stop Signs**
   - Evaluation Guide: "Full stop (wheels not rolling) behind stop line or crosswalk. Counts '1-Mississippi' before proceeding."
   - Max Points: 5 (critical)

#### Category 8: General Driving Skills
**Description:** Overall driving competency and safety awareness

**Criteria:**
1. **Safe Following Distance**
   - Evaluation Guide: "Maintains 3-4 second following distance. Increases distance in poor conditions. Uses reference point method."
   - Max Points: 5

2. **Appropriate Speed**
   - Evaluation Guide: "Matches flow of traffic. Stays within speed limits. Adjusts speed for conditions."
   - Max Points: 4

3. **Proper Lane Driving**
   - Evaluation Guide: "Stays centered in lane. Doesn't weave or drift. Follows lane markings correctly."
   - Max Points: 5

4. **Traffic Awareness**
   - Evaluation Guide: "Checks mirrors every 5-8 seconds. Scans ahead 12-15 seconds. Identifies hazards early."
   - Max Points: 5

5. **Yields Right-of-Way Appropriately**
   - Evaluation Guide: "Yields when legally required. Doesn't hesitate when they have right-of-way. Courteous but not overly timid."
   - Max Points: 4

### Grading System
- **Maximum Score:** 150 points (sum of all max_points)
- **Passing Score:** 120 points (80% - lose no more than 30 points)
- **Automatic Fails:**
  - Crash with another vehicle (student's fault)
  - Hit a pedestrian
  - Dangerous driving that could cause crash
  - Violate traffic law
  - Refuse to follow examiner instructions

### User Interface Requirements

#### Test Selection Screen
- Two test type options: "Driving Skills Test" and "Road Sign Test"
- Show recent attempts for each test type
- Display pass/fail status and scores

#### Driving Test Evaluation Screen
- Mobile-optimized layout
- Category-by-category evaluation
- For each criteria:
  - Criteria name clearly displayed
  - Evaluation guide visible (collapsible)
  - Points deduction slider: 0 to max_points
  - Quick notes field
  - Pass/Fail/Not Tested buttons
- Running score display at top
- Timer for parallel parking section
- "Automatic Fail" button for critical violations
- Save draft (partial evaluation)
- Submit final evaluation

#### Results Screen
- Overall score: X/150 points
- Pass/Fail determination (≥120 = Pass)
- Category breakdown with scores
- Individual criteria results
- Evaluator notes
- Date/time of test
- Print/PDF export option
- Share results with student

---

## Feature 2: Road Sign Recognition Test

### Purpose
This test helps students practice identifying Missouri road signs as required for the official written exam. Includes all sign types from the Missouri Driver Guide.

### Database Schema

```sql
CREATE TABLE road_sign_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE road_signs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES road_sign_categories(id) ON DELETE CASCADE,
  sign_name VARCHAR(255) NOT NULL,
  sign_meaning TEXT NOT NULL,
  shape VARCHAR(50) NOT NULL,
  color_scheme VARCHAR(100) NOT NULL,
  image_url TEXT,
  additional_notes TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE road_sign_test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id VARCHAR(255) NOT NULL,
  test_date TIMESTAMP DEFAULT NOW(),
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  percentage DECIMAL(5,2),
  passed BOOLEAN,
  time_taken INTEGER, -- seconds
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE road_sign_test_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES road_sign_test_attempts(id) ON DELETE CASCADE,
  sign_id UUID REFERENCES road_signs(id) ON DELETE CASCADE,
  selected_answer TEXT,
  is_correct BOOLEAN,
  time_spent INTEGER, -- seconds on this question
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Road Sign Categories & Signs

#### Category 1: Regulatory Signs
**Description:** White/red signs that tell you what you must or must not do

**Signs:**
1. **Stop Sign**
   - Shape: Octagon
   - Colors: Red with white letters
   - Meaning: "Come to a complete stop. Yield to traffic and pedestrians. Proceed when safe."
   - Notes: "8-sided. Only sign with this shape. Must stop before stop line, crosswalk, or intersection."

2. **Yield Sign**
   - Shape: Triangle (pointing down)
   - Colors: Red border, white background, red letters
   - Meaning: "Slow down and yield right-of-way to traffic and pedestrians. Stop if necessary."
   - Notes: "Only downward-pointing triangle sign."

3. **Do Not Enter**
   - Shape: Square
   - Colors: Red with white lettering
   - Meaning: "You cannot enter this roadway. Turn around."
   - Notes: "Typically paired with Wrong Way sign."

4. **Wrong Way**
   - Shape: Horizontal rectangle
   - Colors: Red with white lettering
   - Meaning: "You are going the wrong direction. Turn around immediately and safely."
   - Notes: "If you see this, you've entered oncoming traffic lanes."

5. **Speed Limit**
   - Shape: Vertical rectangle
   - Colors: White with black lettering
   - Meaning: "Maximum legal speed in ideal conditions. Reduce speed in poor conditions."
   - Notes: "Default Missouri limits: 70 mph rural interstate, 25 mph in towns unless posted."

6. **No Left Turn**
   - Shape: Square
   - Colors: White with black and red symbol
   - Meaning: "Left turns prohibited at this intersection."
   - Notes: "Red circle with slash over left arrow."

7. **No Right Turn**
   - Shape: Square
   - Colors: White with black and red symbol
   - Meaning: "Right turns prohibited at this intersection."
   - Notes: "Red circle with slash over right arrow."

8. **No U-Turn**
   - Shape: Square
   - Colors: White with black and red symbol
   - Meaning: "U-turns not allowed at this location."
   - Notes: "Red circle with slash over U-turn arrow."

9. **One Way**
   - Shape: Horizontal rectangle
   - Colors: White with black arrow
   - Meaning: "Traffic flows only in the direction of the arrow."
   - Notes: "Drive only in the direction shown."

10. **Keep Right / Keep Left**
    - Shape: Vertical rectangle
    - Colors: White with black arrow
    - Meaning: "Pass only on the side indicated by the arrow."
    - Notes: "Typically used around median or obstruction."

#### Category 2: Warning Signs
**Description:** Yellow diamond signs that warn of hazards or changes ahead

**Signs:**
1. **Curve Sign**
   - Shape: Diamond
   - Colors: Yellow with black arrow
   - Meaning: "Road curves ahead in direction shown. Slow down."
   - Notes: "Often includes advisory speed plate showing recommended speed."

2. **Right/Left Turn**
   - Shape: Diamond
   - Colors: Yellow with black arrow
   - Meaning: "Sharp turn ahead where recommended speed is 30 mph or less."
   - Notes: "90-degree or sharper turn. More severe than curve sign."

3. **Reverse Turn (Winding Road)**
   - Shape: Diamond
   - Colors: Yellow with black S-curve
   - Meaning: "Two curves in opposite directions. Second may be sharper than first."
   - Notes: "Recommended maximum 30 mph."

4. **Merge**
   - Shape: Diamond
   - Colors: Yellow with black arrows
   - Meaning: "Traffic from another road merging. Be prepared for vehicles entering your lane."
   - Notes: "Watch for merging vehicles, adjust speed if needed."

5. **Lane Ends Merge Left/Right**
   - Shape: Diamond
   - Colors: Yellow with black arrows
   - Meaning: "Two lanes become one. Merge in direction shown."
   - Notes: "If you're in the ending lane, you must yield and merge."

6. **Added Lane**
   - Shape: Diamond
   - Colors: Yellow with black arrows
   - Meaning: "Traffic entering from side but a new lane is added. No merging needed."
   - Notes: "Unlike merge sign, no need to change speed or position."

7. **Traffic Signal Ahead**
   - Shape: Diamond
   - Colors: Yellow with black traffic light symbol
   - Meaning: "Traffic light signal ahead. Be prepared to stop."
   - Notes: "Warns of upcoming signal that may not be visible yet."

8. **Stop Ahead**
   - Shape: Diamond
   - Colors: Yellow with black stop sign symbol
   - Meaning: "Stop sign ahead. Begin slowing down."
   - Notes: "Prepare to stop at upcoming intersection."

9. **Yield Ahead**
   - Shape: Diamond
   - Colors: Yellow with black yield sign symbol
   - Meaning: "Yield sign ahead. Prepare to yield or stop."
   - Notes: "Slow down and prepare to yield right-of-way."

10. **Intersection**
    - Shape: Diamond
    - Colors: Yellow with black cross symbol
    - Meaning: "Cross road ahead. Watch for traffic crossing your path."
    - Notes: "Indicates uncontrolled intersection - no signals."

11. **Side Road (Left/Right/Both)**
    - Shape: Diamond
    - Colors: Yellow with black T-symbol
    - Meaning: "Road enters from the direction shown."
    - Notes: "Watch for vehicles entering from side."

12. **T Intersection**
    - Shape: Diamond
    - Colors: Yellow with black T
    - Meaning: "Road you're on ends ahead. You must turn left or right."
    - Notes: "Prepare to turn - cannot continue straight."

13. **Divided Highway Begins**
    - Shape: Diamond
    - Colors: Yellow with black symbol
    - Meaning: "Road becomes divided with median ahead."
    - Notes: "Opposite lanes will be separated."

14. **Divided Highway Ends**
    - Shape: Diamond
    - Colors: Yellow with black symbol
    - Meaning: "Divided road ends. Two-way traffic ahead with no median."
    - Notes: "Watch for oncoming traffic - no longer separated."

15. **Hill / Steep Grade**
    - Shape: Diamond
    - Colors: Yellow with black truck symbol
    - Meaning: "Steep downgrade ahead. Use lower gear if needed."
    - Notes: "May show percentage of grade. Trucks use low gear."

16. **Slippery When Wet**
    - Shape: Diamond
    - Colors: Yellow with black car skidding
    - Meaning: "Road becomes very slippery in wet weather."
    - Notes: "Reduce speed and increase following distance in rain."

17. **Narrow Bridge**
    - Shape: Diamond
    - Colors: Yellow with black bridge symbol
    - Meaning: "Bridge or road ahead is narrower than current road."
    - Notes: "Slow down, be prepared to meet oncoming traffic."

18. **Pedestrian Crossing**
    - Shape: Diamond
    - Colors: Yellow with black pedestrian symbols (or fluorescent yellow-green)
    - Meaning: "Pedestrian crossing ahead. Yield to pedestrians."
    - Notes: "Be ready to stop. Especially common near schools."

19. **Bicycle Crossing**
    - Shape: Diamond
    - Colors: Yellow with black bicycle symbol
    - Meaning: "Bike path crosses road ahead. Yield to cyclists."
    - Notes: "Watch for bicyclists entering roadway."

20. **Deer Crossing**
    - Shape: Diamond
    - Colors: Yellow with black deer symbol
    - Meaning: "Deer frequently cross road in this area."
    - Notes: "Most active at dawn and dusk. Scan road edges."

21. **School Crossing**
    - Shape: Pentagon (5-sided)
    - Colors: Yellow with black pedestrian symbols (transitioning to fluorescent yellow-green)
    - Meaning: "School zone. Watch for children crossing."
    - Notes: "Unique pentagon shape. Reduce speed, heightened awareness."

22. **Advisory Speed**
    - Shape: Square
    - Colors: Yellow with black numbers
    - Meaning: "Recommended safe speed for the curve or turn."
    - Notes: "Typically placed below curve/turn warning signs. This is advice for ideal conditions."

23. **Large Arrow (Chevron)**
    - Shape: Tall rectangle
    - Colors: Yellow with large black arrow
    - Meaning: "Sharp change in direction. Follow arrow direction."
    - Notes: "Often multiple chevrons outlining a sharp curve."

24. **Roundabout Ahead**
    - Shape: Diamond
    - Colors: Yellow with black circular arrows
    - Meaning: "Roundabout intersection ahead. Slow down and follow posted speed."
    - Notes: "Prepare to yield to traffic in circle."

#### Category 3: Construction/Work Zone Signs
**Description:** Orange signs indicating construction or maintenance work

**Signs:**
1. **Road Work Ahead**
   - Shape: Diamond
   - Colors: Fluorescent orange with black lettering
   - Meaning: "Construction zone ahead. Reduce speed and watch for workers."
   - Notes: "Fines double in work zones. Speeds typically reduced 10-20 mph."

2. **Detour**
   - Shape: Horizontal rectangle
   - Colors: Orange with black lettering/arrow
   - Meaning: "Road closed ahead. Follow detour in direction shown."
   - Notes: "Follow detour signs to return to original route."

3. **Lane Closed**
   - Shape: Diamond
   - Colors: Orange with black marking
   - Meaning: "Lane ends due to construction. Merge as indicated."
   - Notes: "Merge early, don't wait until forced."

4. **Flagger Ahead**
   - Shape: Diamond
   - Colors: Orange with black figure
   - Meaning: "Worker controlling traffic ahead with flag or sign."
   - Notes: "Obey flagger as you would a traffic signal."

#### Category 4: Guide Signs
**Description:** Green/blue/brown signs showing directions and services

**Signs:**
1. **Highway Route Marker - Interstate**
   - Shape: Shield with points at top
   - Colors: Red, white and blue
   - Meaning: "Interstate highway number"
   - Notes: "Even numbers run east-west, odd numbers run north-south."

2. **Highway Route Marker - US Route**
   - Shape: Shield
   - Colors: Black and white
   - Meaning: "US highway number"
   - Notes: "Major routes across states."

3. **Highway Route Marker - State Route**
   - Shape: Circle or shield (varies by state)
   - Colors: Black and white
   - Meaning: "State highway number"
   - Notes: "Missouri uses white circle with black number."

4. **Highway Route Marker - County Route**
   - Shape: Square
   - Colors: Black and white or blue and white
   - Meaning: "County road number"
   - Notes: "Lettered roads in Missouri (e.g., Route AA)."

5. **Exit Sign**
   - Shape: Horizontal rectangle
   - Colors: Green with white lettering
   - Meaning: "Highway exit number and destination"
   - Notes: "Exit numbers match mile markers. Shows upcoming exit."

6. **Distance Sign**
   - Shape: Horizontal rectangle
   - Colors: Green with white lettering
   - Meaning: "Shows distance to cities ahead"
   - Notes: "Helps with trip planning."

7. **Rest Area**
   - Shape: Square
   - Colors: Blue with white symbols
   - Meaning: "Rest area with facilities ahead"
   - Notes: "May show distance to rest area."

8. **Gas/Food/Lodging**
   - Shape: Square
   - Colors: Blue with white symbols
   - Meaning: "Services available at next exit"
   - Notes: "Shows gas, food, lodging, hospital available."

9. **Hospital**
   - Shape: Square
   - Colors: Blue with white H
   - Meaning: "Hospital location"
   - Notes: "Shows direction to medical facility."

10. **Park & Recreation**
    - Shape: Horizontal rectangle
    - Colors: Brown with white lettering
    - Meaning: "Parks, historic sites, recreational areas"
    - Notes: "Points to tourist attractions and public recreation."

#### Category 5: Railroad & Special Signs
**Description:** Signs for railroad crossings and other special situations

**Signs:**
1. **Railroad Crossing (Advance Warning)**
   - Shape: Circle (round)
   - Colors: Yellow with black X and RR
   - Meaning: "Railroad crossing ahead. Slow down and look for trains."
   - Notes: "Only circular warning sign. Prepare to stop."

2. **Crossbuck**
   - Shape: X-shape (crossbuck)
   - Colors: White with black Railroad Crossing text
   - Meaning: "Yield to trains. Treat as yield sign."
   - Notes: "May have number plate showing how many tracks. Unique X-shape."

3. **Railroad Flashing Lights**
   - Shape: Circular lights
   - Colors: Red lights that flash alternately
   - Meaning: "Train approaching. Stop and wait until lights stop and gate rises."
   - Notes: "Stop 15-50 feet from tracks. Wait for lights to stop."

4. **Side Road Railroad Crossing**
   - Shape: Diamond
   - Colors: Yellow with black train and road symbol
   - Meaning: "Railroad tracks cross side road near intersection."
   - Notes: "Extra caution - tracks very close to intersection."

5. **Slow Moving Vehicle**
   - Shape: Triangle
   - Colors: Fluorescent orange triangle with red border
   - Meaning: "Vehicle ahead travels less than 25 mph"
   - Notes: "Typically on farm equipment, construction vehicles. Be patient, pass when safe."

6. **Soft Shoulder**
   - Shape: Diamond
   - Colors: Yellow with black lettering
   - Meaning: "Shoulder is soft/unpaved. Don't leave pavement."
   - Notes: "If you go off road onto shoulder, you may lose control."

7. **Object Marker**
   - Shape: Diamond or rectangle
   - Colors: Yellow/black stripes (diagonal)
   - Meaning: "Object in roadway or very close to edge (bridge support, guardrail end, etc.)"
   - Notes: "Stay in your lane - object is very close or in roadway."

### Road Sign Test Format

#### Test Settings
- **Standard Test:** 20 random signs from all categories
- **Category-Specific Test:** Focus on one category
- **Timed Mode:** 30 seconds per sign
- **Practice Mode:** Unlimited time, show answers immediately

#### Question Format
- Show sign image (or description if no image)
- Multiple choice: 4 options
  - What does this sign mean?
  - What shape is this sign?
  - What should you do when you see this sign?
- Mix question types to test knowledge thoroughly

#### Grading
- **Passing Score:** 16/20 (80%)
- Track which categories need more study
- Recommend retaking with missed signs

### User Interface Requirements

#### Road Sign Test Screen
- Test type selection (All Signs, By Category, Timed, Practice)
- Start test button
- Previous test results summary

#### During Test
- Sign image/description prominently displayed
- Question text clear
- 4 answer buttons (A, B, C, D)
- Progress indicator (X of 20)
- Timer (if timed mode)
- Skip button (for practice mode)
- Submit answer button

#### Test Results
- Score: X/20 (XX%)
- Pass/Fail status
- Category breakdown of correct/incorrect
- List of missed signs with correct answers
- Option to review missed signs
- Retake test button
- Study recommendations

---

## Implementation Priorities

### Phase 1: Database & API
1. Create all database tables with proper relationships
2. Seed driving test categories and criteria (use the detailed data above)
3. Seed road sign categories and signs (use the comprehensive list above)
4. Create API endpoints:
   - GET /api/driving-test/categories
   - GET /api/driving-test/criteria
   - POST /api/driving-test/attempt
   - PUT /api/driving-test/attempt/:id
   - GET /api/driving-test/attempts (by driver)
   - GET /api/road-signs/categories
   - GET /api/road-signs/test (random or by category)
   - POST /api/road-signs/attempt
   - GET /api/road-signs/attempts (by driver)

### Phase 2: Driving Test UI
1. Test selection page
2. Evaluation form with category sections
3. Points deduction interface
4. Timer for parallel parking
5. Running score display
6. Results page with detailed breakdown
7. Print/export functionality

### Phase 3: Road Sign Test UI
1. Test configuration page
2. Quiz interface with images
3. Answer selection and validation
4. Progress tracking
5. Results and review page
6. Study recommendations

### Phase 4: Integration & Polish
1. Link from quiz page
2. Add to driver progress dashboard
3. Mobile optimization
4. Export test results to PDF
5. Email results to parent/instructor

---

## Data Seeding Examples

### Driving Test Seed Data (Partial - see full data above)
```javascript
// Category
{
  name: "Vehicle Controls & Pre-Drive",
  description: "Testing knowledge and use of vehicle controls before driving begins",
  order_index: 1
}

// Criteria
{
  category_id: <vehicle_controls_id>,
  criteria_name: "Find Accelerator Without Searching",
  evaluation_guide: "Student locates gas pedal immediately without looking down. Demonstrates foot position and understands pressure sensitivity.",
  max_points: 3,
  order_index: 1
}
```

### Road Sign Seed Data (Partial - see full data above)
```javascript
// Category
{
  name: "Regulatory Signs",
  description: "White/red signs that tell you what you must or must not do",
  order_index: 1
}

// Sign
{
  category_id: <regulatory_id>,
  sign_name: "Stop Sign",
  sign_meaning: "Come to a complete stop. Yield to traffic and pedestrians. Proceed when safe.",
  shape: "Octagon",
  color_scheme: "Red with white letters",
  additional_notes: "8-sided. Only sign with this shape. Must stop before stop line, crosswalk, or intersection.",
  order_index: 1
}
```

---

## Technical Notes

- Use existing PostgreSQL database
- Follow existing TypeScript/React patterns in the app
- Ensure mobile-first responsive design
- Use existing authentication and driver profile system
- Maintain consistency with quiz page styling
- Consider offline capability for evaluations
- Add proper error handling and validation
- Include loading states for all async operations

---

## Success Criteria

✅ Parents can evaluate driving skills using Missouri exam criteria
✅ System calculates pass/fail based on 30-point deduction rule
✅ Students can practice road sign recognition
✅ Both tests track attempts and show progress over time
✅ Results are easy to review and share
✅ Mobile interface is smooth and intuitive
✅ Data persists and syncs properly
✅ Tests integrate seamlessly with existing app

---

## Additional Resources

- Missouri Driver Guide Chapter 2: https://dor.mo.gov/pdf/Chapter2.pdf
- Missouri Driver Guide (Full): https://dor.mo.gov/forms/Driver%20Guide.pdf
- Existing Quiz Implementation: https://learn2drive.fly.dev/quiz

---

Build these features with attention to user experience, data accuracy, and mobile performance. The driving test should feel like a professional evaluation tool that gives parents confidence in their assessment, while the road sign test should be an engaging study tool that helps students learn efficiently.