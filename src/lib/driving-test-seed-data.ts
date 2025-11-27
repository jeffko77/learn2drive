// Driving Test Seed Data based on Missouri's official driving exam criteria

export const drivingTestCategories = [
  {
    name: "Vehicle Controls & Pre-Drive",
    description: "Testing knowledge and use of vehicle controls before driving begins",
    orderIndex: 1,
    criteria: [
      {
        criteriaName: "Find Accelerator Without Searching",
        evaluationGuide: "Student locates gas pedal immediately without looking down. Demonstrates foot position and understands pressure sensitivity.",
        maxPoints: 3,
        orderIndex: 1,
      },
      {
        criteriaName: "Find Brake Without Searching",
        evaluationGuide: "Student locates brake pedal immediately without looking down. Demonstrates proper pressure for smooth stopping.",
        maxPoints: 3,
        orderIndex: 2,
      },
      {
        criteriaName: "Operate Turn Signals Correctly",
        evaluationGuide: "Student activates left/right turn signals without looking. Cancels signals after turns. Uses proper timing (100 feet before turn).",
        maxPoints: 3,
        orderIndex: 3,
      },
      {
        criteriaName: "Operate Windshield Wipers Correctly",
        evaluationGuide: "Student adjusts wiper speed appropriately without looking. Knows intermittent, low, and high settings.",
        maxPoints: 2,
        orderIndex: 4,
      },
      {
        criteriaName: "Release Parking Brake",
        evaluationGuide: "Student releases parking brake smoothly before driving. Checks that brake warning light is off.",
        maxPoints: 2,
        orderIndex: 5,
      },
    ],
  },
  {
    name: "Starting & Stopping",
    description: "Smooth vehicle starts and controlled stops",
    orderIndex: 2,
    criteria: [
      {
        criteriaName: "Start Vehicle Smoothly",
        evaluationGuide: "Vehicle starts without jerking. Student checks surroundings before moving. Releases brake gradually then applies gas smoothly.",
        maxPoints: 5,
        orderIndex: 1,
      },
      {
        criteriaName: "Stop Vehicle Smoothly",
        evaluationGuide: "Progressive braking with no sudden stops. Vehicle comes to rest without jerking. Student anticipates stops early.",
        maxPoints: 5,
        orderIndex: 2,
      },
      {
        criteriaName: "Reaction Time",
        evaluationGuide: "Student responds quickly but not frantically to examiner's instructions and traffic conditions.",
        maxPoints: 3,
        orderIndex: 3,
      },
      {
        criteriaName: "Vehicle Control When Stopping",
        evaluationGuide: "Maintains straight line when stopping. No rolling backward on hills. Vehicle fully stopped (not rolling).",
        maxPoints: 4,
        orderIndex: 4,
      },
    ],
  },
  {
    name: "Parallel Parking",
    description: "Park in a space 25 feet long and 7 feet wide, within 18 inches of curb",
    orderIndex: 3,
    criteria: [
      {
        criteriaName: "Vehicle Position Before Backing",
        evaluationGuide: "Student positions alongside front car, 1-2 feet away, mirrors aligned. Signals intent to park.",
        maxPoints: 3,
        orderIndex: 1,
      },
      {
        criteriaName: "No Contact With Space Markers",
        evaluationGuide: "Student completes parking without hitting cones/markers at any point.",
        maxPoints: 5,
        orderIndex: 2,
      },
      {
        criteriaName: "Smooth Entry Into Space",
        evaluationGuide: "Backs at appropriate speed (walking pace). Makes smooth steering adjustments. Checks mirrors and blind spots.",
        maxPoints: 4,
        orderIndex: 3,
      },
      {
        criteriaName: "Park Within 18 Inches of Curb",
        evaluationGuide: "Final position is 12-18 inches from curb. Use measuring tool if needed. Closer is better.",
        maxPoints: 5,
        orderIndex: 4,
      },
      {
        criteriaName: "Park Near Center of Space",
        evaluationGuide: "Vehicle is centered between front and rear markers. Equal space front and back.",
        maxPoints: 3,
        orderIndex: 5,
      },
      {
        criteriaName: "Complete Within Two Minutes",
        evaluationGuide: "Student completes parallel park within 2 minutes from start to finish. Time with stopwatch.",
        maxPoints: 3,
        orderIndex: 6,
      },
      {
        criteriaName: "Wheels Turned Correctly",
        evaluationGuide: "When finished parking, front wheels are turned toward curb on downhill or no grade, away from curb on uphill.",
        maxPoints: 3,
        orderIndex: 7,
      },
      {
        criteriaName: "Check Traffic Before Leaving Space",
        evaluationGuide: "Student checks mirrors, signals, and shoulder checks before pulling out of parking space.",
        maxPoints: 3,
        orderIndex: 8,
      },
    ],
  },
  {
    name: "Backing",
    description: "Safe backing procedures and control",
    orderIndex: 4,
    criteria: [
      {
        criteriaName: "Look Over Right Shoulder",
        evaluationGuide: "Student turns body and looks directly through rear window. Does not rely solely on mirrors.",
        maxPoints: 5,
        orderIndex: 1,
      },
      {
        criteriaName: "Straight Line Backing",
        evaluationGuide: "Vehicle backs in straight line without weaving. Maintains control throughout maneuver.",
        maxPoints: 4,
        orderIndex: 2,
      },
      {
        criteriaName: "Stay In Proper Lane",
        evaluationGuide: "When backing in traffic lane, student stays within lane markers. Doesn't drift into other lanes.",
        maxPoints: 4,
        orderIndex: 3,
      },
      {
        criteriaName: "Appropriate Backing Speed",
        evaluationGuide: "Backs at walking pace or slower. Full control at all times. Can stop immediately if needed.",
        maxPoints: 3,
        orderIndex: 4,
      },
    ],
  },
  {
    name: "Turns (Left & Right)",
    description: "Make at least two right turns and two left turns properly",
    orderIndex: 5,
    criteria: [
      {
        criteriaName: "Correct Lane for Turning",
        evaluationGuide: "Student positions in proper lane well before turn. Right turns from right lane, left turns from left or center lane.",
        maxPoints: 4,
        orderIndex: 1,
      },
      {
        criteriaName: "Proper Turn Signal Timing",
        evaluationGuide: "Signal activated at least 100 feet (3 seconds) before turn. Signal continuous until turn is completed.",
        maxPoints: 4,
        orderIndex: 2,
      },
      {
        criteriaName: "Turn Into Proper Lane",
        evaluationGuide: "Completes turn into nearest legal lane. Right turn into right lane, left turn into left lane. Doesn't cut corners or swing wide.",
        maxPoints: 5,
        orderIndex: 3,
      },
      {
        criteriaName: "Proper Traffic Checks",
        evaluationGuide: "Checks mirrors before turn. Looks for pedestrians/cyclists in crosswalk. Shoulder checks before lane changes.",
        maxPoints: 5,
        orderIndex: 4,
      },
      {
        criteriaName: "Appropriate Turn Speed",
        evaluationGuide: "Slows appropriately for turn (10-15 mph typically). Doesn't brake hard in middle of turn. Smooth acceleration out of turn.",
        maxPoints: 3,
        orderIndex: 5,
      },
      {
        criteriaName: "Vehicle Control During Turn",
        evaluationGuide: "Smooth steering inputs. Maintains proper lane position throughout turn. No jerky movements.",
        maxPoints: 4,
        orderIndex: 6,
      },
    ],
  },
  {
    name: "Hill Parking",
    description: "Park on a hill safely with proper wheel positioning",
    orderIndex: 6,
    criteria: [
      {
        criteriaName: "Vehicle Control",
        evaluationGuide: "Smooth approach and stop on hill. No rolling backward. Maintains position while setting parking brake.",
        maxPoints: 4,
        orderIndex: 1,
      },
      {
        criteriaName: "Park Within 18 Inches of Curb",
        evaluationGuide: "Final position is within 18 inches of curb, measured from nearest tire.",
        maxPoints: 4,
        orderIndex: 2,
      },
      {
        criteriaName: "Correct Gear Selection",
        evaluationGuide: "Automatic: Park. Manual: 1st gear uphill, reverse downhill. Understands why.",
        maxPoints: 3,
        orderIndex: 3,
      },
      {
        criteriaName: "Wheels Turned Correctly",
        evaluationGuide: "UPHILL WITH CURB: wheels turned left (away from curb). UPHILL NO CURB: wheels turned right. DOWNHILL: wheels turned right (toward curb).",
        maxPoints: 5,
        orderIndex: 4,
      },
      {
        criteriaName: "Parking Brake Set",
        evaluationGuide: "Parking brake firmly engaged before releasing foot brake. Brake warning light on.",
        maxPoints: 3,
        orderIndex: 5,
      },
      {
        criteriaName: "Check Traffic & Signal",
        evaluationGuide: "Checks mirrors and signals before pulling away from curb. Looks over shoulder for blind spots.",
        maxPoints: 3,
        orderIndex: 6,
      },
    ],
  },
  {
    name: "Intersections",
    description: "Entering and leaving intersections safely",
    orderIndex: 7,
    criteria: [
      {
        criteriaName: "Obey Traffic Signs & Signals",
        evaluationGuide: "Stops at red lights and stop signs. Yields when required. Proceeds on green only when safe.",
        maxPoints: 5,
        orderIndex: 1,
      },
      {
        criteriaName: "Appropriate Approach Speed",
        evaluationGuide: "Slows down approaching intersections. Scanning for hazards. Ready to stop if needed.",
        maxPoints: 4,
        orderIndex: 2,
      },
      {
        criteriaName: "Traffic Awareness",
        evaluationGuide: "Checks all directions before entering intersection. Aware of pedestrians, cyclists, cross-traffic.",
        maxPoints: 5,
        orderIndex: 3,
      },
      {
        criteriaName: "Correct Lane Position",
        evaluationGuide: "Stays in proper lane approaching and through intersection. Doesn't drift or change lanes in intersection.",
        maxPoints: 4,
        orderIndex: 4,
      },
      {
        criteriaName: "Yield Right-of-Way Correctly",
        evaluationGuide: "Yields to oncoming traffic on left turns. Yields to traffic on right at 4-way stops. Doesn't block intersection.",
        maxPoints: 5,
        orderIndex: 5,
      },
      {
        criteriaName: "Complete Stop At Stop Signs",
        evaluationGuide: "Full stop (wheels not rolling) behind stop line or crosswalk. Counts '1-Mississippi' before proceeding.",
        maxPoints: 5,
        orderIndex: 6,
      },
    ],
  },
  {
    name: "General Driving Skills",
    description: "Overall driving competency and safety awareness",
    orderIndex: 8,
    criteria: [
      {
        criteriaName: "Safe Following Distance",
        evaluationGuide: "Maintains 3-4 second following distance. Increases distance in poor conditions. Uses reference point method.",
        maxPoints: 5,
        orderIndex: 1,
      },
      {
        criteriaName: "Appropriate Speed",
        evaluationGuide: "Matches flow of traffic. Stays within speed limits. Adjusts speed for conditions.",
        maxPoints: 4,
        orderIndex: 2,
      },
      {
        criteriaName: "Proper Lane Driving",
        evaluationGuide: "Stays centered in lane. Doesn't weave or drift. Follows lane markings correctly.",
        maxPoints: 5,
        orderIndex: 3,
      },
      {
        criteriaName: "Traffic Awareness",
        evaluationGuide: "Checks mirrors every 5-8 seconds. Scans ahead 12-15 seconds. Identifies hazards early.",
        maxPoints: 5,
        orderIndex: 4,
      },
      {
        criteriaName: "Yields Right-of-Way Appropriately",
        evaluationGuide: "Yields when legally required. Doesn't hesitate when they have right-of-way. Courteous but not overly timid.",
        maxPoints: 4,
        orderIndex: 5,
      },
    ],
  },
];

// Automatic fail conditions for the driving test
export const automaticFailConditions = [
  "Crash with another vehicle (student's fault)",
  "Hit a pedestrian",
  "Dangerous driving that could cause crash",
  "Violate traffic law",
  "Refuse to follow examiner instructions",
];

// Grading constants
export const DRIVING_TEST_PASSING_SCORE = 120; // 80% of 150
export const DRIVING_TEST_MAX_SCORE = 150;
export const DRIVING_TEST_MAX_DEDUCTIONS = 30;

