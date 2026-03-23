import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const phases = [
  {
    orderIndex: 1,
    title: 'Basic Safety & Vehicle Familiarity',
    description: 'Master these before the car moves',
    skills: [
      { title: 'Adjust seat position', description: 'Reach pedals comfortably, see over steering wheel' },
      { title: 'Adjust all mirrors', description: 'Rearview and both side mirrors' },
      { title: 'Check seatbelt fits properly', description: 'Across chest and hips' },
      { title: 'Locate and test turn signals, hazard lights, wipers', description: 'Know location without looking' },
      { title: 'Find parking brake location and operation', description: 'Engage and release smoothly' },
      { title: 'Identify gas, brake pedals', description: 'Know pedal positions by feel' },
      { title: 'Check that doors are properly closed', description: 'All doors secure before moving' },
      { title: 'Start and turn off engine safely', description: 'Proper startup sequence' },
      { title: 'Understand gear selector (P-R-N-D)', description: 'Park, Reverse, Neutral, Drive' },
      { title: 'Operate windshield wipers and lights', description: 'All wiper speeds, headlights, high beams' },
      { title: 'Locate and use horn', description: 'Appropriate horn use situations' },
      { title: 'Understand dashboard warning lights', description: 'Identify critical warning indicators' },
      { title: 'Check fuel level and understand gauges', description: 'Read fuel, temperature, and other gauges' },
    ],
  },
  {
    orderIndex: 2,
    title: 'Fundamental Driving Skills',
    description: 'Empty parking lot practice',
    skills: [
      { title: 'Smooth starts from complete stop', description: 'Gradual, controlled acceleration' },
      { title: 'Progressive braking to smooth stops', description: 'No jerking, stops before the line' },
      { title: 'Straight line driving at consistent speed', description: 'Maintain lane position' },
      { title: 'Gentle steering inputs and corrections', description: 'Small corrections, no overcorrecting' },
      { title: 'Proper following distance judgment (3-second rule)', description: 'Maintain safe distance' },
      { title: 'Forward parking between lines', description: 'Center in space, wheels straight' },
      { title: 'Reverse parking (backing into space)', description: 'Use mirrors and backup camera' },
      { title: 'Parallel parking basics', description: 'Reference points and timing' },
      { title: 'Angle parking (45-degree spaces)', description: 'Enter and exit safely' },
      { title: 'Three-point turn', description: 'Safe execution in tight space' },
      { title: 'Backing in straight line', description: 'Check mirrors, slow and controlled' },
    ],
  },
  {
    orderIndex: 3,
    title: 'Traffic Navigation',
    description: 'Quiet residential streets',
    skills: [
      { title: 'Right turns at intersections', description: 'Signal, check, turn from correct lane' },
      { title: 'Left turns at intersections', description: 'Yield oncoming traffic, proper lane' },
      { title: 'Stop sign procedure', description: 'Full stop, check all directions, proceed' },
      { title: 'Yield sign procedure', description: 'Slow, assess traffic, merge safely' },
      { title: 'Traffic light responses', description: 'Green, yellow, red — proper responses' },
      { title: 'Lane changes on surface streets', description: 'Signal, mirror, blind spot, move' },
      { title: 'Proper speed for residential areas', description: 'Typically 25 mph, watch for children' },
      { title: 'Pedestrian right-of-way', description: 'Crosswalks, driveways, school zones' },
      { title: 'Navigating 4-way stops', description: 'Right-of-way order, communication' },
      { title: 'U-turns where legal', description: 'Check signs, traffic, execute safely' },
      { title: 'Driveway entry and exit', description: 'Check pedestrians and traffic' },
    ],
  },
  {
    orderIndex: 4,
    title: 'Intermediate Traffic Skills',
    description: 'Busier streets and multi-lane roads',
    skills: [
      { title: 'Multi-lane road navigation', description: 'Choose correct lane, maintain position' },
      { title: 'Left turn from center turn lane', description: 'Enter and exit correctly' },
      { title: 'Right turn on red', description: 'Full stop, check, go when safe' },
      { title: 'Protected left turn signal', description: 'Green arrow — turn efficiently' },
      { title: 'Unprotected left turn', description: 'Yield, gap judgment, turn safely' },
      { title: 'Roundabout navigation', description: 'Yield to traffic, enter, exit correct lane' },
      { title: 'School zone awareness', description: 'Speed, zones, bus protocols' },
      { title: 'Railroad crossing procedure', description: 'Stop, look, listen, cross safely' },
      { title: 'Emergency vehicle response', description: 'Pull right, stop, yield' },
      { title: 'Construction zone driving', description: 'Reduce speed, follow signs, workers present' },
    ],
  },
  {
    orderIndex: 5,
    title: 'Highway and Freeway Driving',
    description: 'High-speed, multi-lane traffic',
    skills: [
      { title: 'On-ramp acceleration and merging', description: 'Match speed, find gap, merge smoothly' },
      { title: 'Highway lane maintenance', description: 'Stay centered, consistent speed' },
      { title: 'Highway speed judgment', description: 'Posted limits, flow of traffic' },
      { title: 'Following distance at highway speeds', description: '3-4 second rule minimum' },
      { title: 'Lane changes on highway', description: 'Signal, mirror, blind spot check' },
      { title: 'Passing other vehicles', description: 'When legal, safely execute' },
      { title: 'Exit ramp procedure', description: 'Signal early, reduce speed on ramp' },
      { title: 'Dealing with large trucks', description: 'Blind spots, safe following distance' },
      { title: 'Highway driving at night', description: 'Headlights, following distance, fatigue' },
      { title: 'Interstate interchange navigation', description: 'Multi-level, following signs' },
    ],
  },
  {
    orderIndex: 6,
    title: 'Challenging Conditions',
    description: 'Weather and visibility challenges',
    skills: [
      { title: 'Rain driving', description: 'Reduce speed, increase following distance' },
      { title: 'Wet road braking distances', description: 'Stop earlier, avoid sudden braking' },
      { title: 'Fog driving', description: 'Low beams, slower speeds, more space' },
      { title: 'Bright sunlight and glare', description: 'Sun visors, sunglasses, slow down' },
      { title: 'Night driving skills', description: 'Use headlights, watch for pedestrians' },
      { title: 'Gravel or unpaved roads', description: 'Slower speeds, wider turns' },
      { title: 'Road construction detours', description: 'Follow signs, watch for changes' },
      { title: 'Tire blowout response', description: 'Grip wheel, ease off gas, steer straight' },
      { title: 'Brake failure response', description: 'Downshift, pump brakes, use parking brake' },
      { title: 'Driving in heavy traffic', description: 'Patience, space management, no aggression' },
    ],
  },
  {
    orderIndex: 7,
    title: 'Advanced Safety and Emergency Skills',
    description: 'Defensive driving mastery',
    skills: [
      { title: 'Defensive driving principles', description: 'Anticipate, scan, plan ahead' },
      { title: 'Identifying aggressive drivers', description: 'Avoid, don\'t engage, create distance' },
      { title: 'Distraction avoidance', description: 'Phone away, focus on road' },
      { title: 'Drowsy driving awareness', description: 'Signs of fatigue, when to stop' },
      { title: 'Road rage de-escalation', description: 'Stay calm, don\'t retaliate' },
      { title: 'Skid recovery', description: 'Steer into skid, don\'t overcorrect' },
      { title: 'Hydroplaning response', description: 'Ease off gas, steer straight' },
      { title: 'Animal crossing response', description: 'Brake safely, don\'t swerve into traffic' },
      { title: 'Debris in road response', description: 'Assess, avoid safely, don\'t overreact' },
      { title: 'Accident scene response', description: 'Move to safety, call 911, document' },
      { title: 'Flat tire while driving', description: 'Grip wheel, slow gradually, pull over' },
      { title: 'Car fire response', description: 'Pull over, exit, stay away, call 911' },
      { title: 'Navigating without GPS', description: 'Map reading, landmarks, asking directions' },
      { title: 'Parallel parking on hills', description: 'Curbing wheels, parking brake' },
      { title: 'Towing awareness', description: 'Stopping distance, turning radius change' },
    ],
  },
  {
    orderIndex: 8,
    title: 'Independent Driving Readiness',
    description: 'Real-world navigation and judgment',
    skills: [
      { title: 'Solo trip planning', description: 'Route selection, timing, alternatives' },
      { title: 'Unfamiliar area navigation', description: 'GPS use, street signs, asking for help' },
      { title: 'Parking in tight urban spaces', description: 'Judgment, patience, multiple attempts ok' },
      { title: 'Drive-through navigation', description: 'Ordering, pulling forward, etiquette' },
      { title: 'Gas station operation', description: 'Fuel type, pump operation, payment' },
      { title: 'Car wash navigation', description: 'Automatic wash procedure' },
      { title: 'Grocery store parking lot', description: 'Cart areas, pedestrian traffic' },
      { title: 'School pickup/dropoff zones', description: 'Rules, patience, watching for kids' },
      { title: 'Highway rest stop usage', description: 'Entering, exiting, parking' },
      { title: 'Driving with passengers', description: 'Managing distractions from others' },
      { title: 'Night solo driving', description: 'Confidence and judgment alone at night' },
      { title: 'Extended trip (30+ min highway)', description: 'Fatigue management, comfort stops' },
      { title: 'Bad weather solo driving', description: 'Independent decision to delay/stop' },
      { title: 'Vehicle pre-trip inspection', description: 'Tires, lights, fluids check' },
      { title: 'Missouri driver\'s test simulation', description: 'Pass full mock behind-wheel test' },
    ],
  },
]

const quizQuestions = [
  // Rules of the Road
  { topic: 'Rules of the Road', questionText: 'What is the general speed limit in a residential area in Missouri?', optionA: '20 mph', optionB: '25 mph', optionC: '30 mph', optionD: '35 mph', correctAnswer: 'B', explanation: 'Missouri\'s default speed limit in residential and urban areas is 25 mph unless otherwise posted.' },
  { topic: 'Rules of the Road', questionText: 'When approaching a yellow traffic light, you should:', optionA: 'Speed up to clear the intersection', optionB: 'Stop immediately', optionC: 'Slow down and prepare to stop', optionD: 'Honk and proceed', correctAnswer: 'C', explanation: 'A yellow light means the signal is about to turn red. You should slow down and stop if it is safe to do so.' },
  { topic: 'Rules of the Road', questionText: 'At a four-way stop, who has the right of way?', optionA: 'The driver on the left', optionB: 'The driver who arrived first', optionC: 'The driver going straight', optionD: 'The largest vehicle', correctAnswer: 'B', explanation: 'At a four-way stop, the driver who arrives first has the right of way. If two vehicles arrive simultaneously, the driver on the right has priority.' },
  { topic: 'Rules of the Road', questionText: 'What does a solid white line on the road mean?', optionA: 'Passing is permitted', optionB: 'Lane changes are discouraged', optionC: 'You must stop here', optionD: 'Bicycle lane boundary', correctAnswer: 'B', explanation: 'A solid white line marks the edge of the road or separates lanes where lane changes are discouraged.' },
  { topic: 'Rules of the Road', questionText: 'When must you use headlights in Missouri?', optionA: 'Only after midnight', optionB: 'From sunset to sunrise and when visibility is less than 500 feet', optionC: 'Only in rain or snow', optionD: 'Whenever on the highway', correctAnswer: 'B', explanation: 'Missouri law requires headlights from sunset to sunrise and whenever weather conditions reduce visibility to less than 500 feet.' },
  { topic: 'Rules of the Road', questionText: 'What is the proper hand position on the steering wheel?', optionA: '12 and 6 o\'clock', optionB: '10 and 2 o\'clock', optionC: '9 and 3 o\'clock', optionD: '8 and 4 o\'clock', correctAnswer: 'C', explanation: 'Modern driving instruction recommends 9 and 3 o\'clock for better control and safety with airbags.' },
  { topic: 'Rules of the Road', questionText: 'What should you do when an emergency vehicle approaches with lights and sirens?', optionA: 'Speed up to clear the road', optionB: 'Stop in your lane', optionC: 'Pull to the right edge and stop', optionD: 'Continue at normal speed', correctAnswer: 'C', explanation: 'You must pull to the right edge of the road and stop until the emergency vehicle has passed.' },
  { topic: 'Rules of the Road', questionText: 'What is tailgating?', optionA: 'Driving too slowly', optionB: 'Following another vehicle too closely', optionC: 'Blocking an intersection', optionD: 'Failing to signal a turn', correctAnswer: 'B', explanation: 'Tailgating means following another vehicle too closely, which is dangerous and illegal in Missouri.' },
  { topic: 'Rules of the Road', questionText: 'When can you pass on the right?', optionA: 'Never', optionB: 'When the vehicle ahead is turning left and there is room', optionC: 'On any two-lane road', optionD: 'Only on highways', correctAnswer: 'B', explanation: 'You may pass on the right when the vehicle ahead is making a left turn and there is sufficient paved road width.' },
  { topic: 'Rules of the Road', questionText: 'A broken yellow center line means:', optionA: 'No passing allowed', optionB: 'Passing is permitted when safe', optionC: 'Divided highway ahead', optionD: 'Construction zone', correctAnswer: 'B', explanation: 'A broken yellow center line indicates that passing is permitted when it is safe to do so.' },
  { topic: 'Rules of the Road', questionText: 'What is the minimum following distance you should maintain?', optionA: '1 second', optionB: '2 seconds', optionC: '3 seconds', optionD: '5 seconds', correctAnswer: 'C', explanation: 'You should maintain at least a 3-second following distance under normal conditions, more in bad weather.' },
  { topic: 'Rules of the Road', questionText: 'When parking uphill with a curb, which way should your wheels be turned?', optionA: 'Away from the curb', optionB: 'Toward the curb', optionC: 'Straight ahead', optionD: 'It doesn\'t matter', correctAnswer: 'A', explanation: 'When parking uphill with a curb, turn your wheels away from the curb so if the car rolls, it rolls into the curb.' },
  { topic: 'Rules of the Road', questionText: 'What does a flashing red light mean?', optionA: 'Slow down', optionB: 'Stop, then proceed when safe', optionC: 'Yield', optionD: 'Road closed', correctAnswer: 'B', explanation: 'A flashing red light should be treated like a stop sign — come to a complete stop, then proceed when safe.' },
  { topic: 'Rules of the Road', questionText: 'You must signal a turn at least how far in advance?', optionA: '50 feet', optionB: '100 feet', optionC: '200 feet', optionD: '300 feet', correctAnswer: 'B', explanation: 'Missouri law requires you to signal at least 100 feet before turning.' },
  { topic: 'Rules of the Road', questionText: 'What is the speed limit in a school zone when children are present?', optionA: '15 mph', optionB: '20 mph', optionC: '25 mph', optionD: '30 mph', correctAnswer: 'B', explanation: 'The speed limit in Missouri school zones when children are present is 20 mph.' },
  // Traffic Signs and Signals
  { topic: 'Traffic Signs and Signals', questionText: 'What shape is a warning sign?', optionA: 'Circle', optionB: 'Rectangle', optionC: 'Diamond', optionD: 'Pentagon', correctAnswer: 'C', explanation: 'Warning signs are diamond-shaped and typically yellow, warning of hazards or changes ahead.' },
  { topic: 'Traffic Signs and Signals', questionText: 'What does an octagonal sign mean?', optionA: 'Yield', optionB: 'Stop', optionC: 'Railroad crossing', optionD: 'No entry', correctAnswer: 'B', explanation: 'Octagonal (8-sided) signs are stop signs. This unique shape allows recognition even when obscured.' },
  { topic: 'Traffic Signs and Signals', questionText: 'A triangular sign with the point down means:', optionA: 'Stop', optionB: 'Yield', optionC: 'Caution', optionD: 'No passing', correctAnswer: 'B', explanation: 'A downward-pointing triangle is a yield sign. You must slow down and give right-of-way to other vehicles.' },
  { topic: 'Traffic Signs and Signals', questionText: 'What color are guide signs on highways?', optionA: 'Blue', optionB: 'White', optionC: 'Green', optionD: 'Brown', correctAnswer: 'C', explanation: 'Highway guide signs are green with white lettering, providing direction and distance information.' },
  { topic: 'Traffic Signs and Signals', questionText: 'What does a blue sign indicate?', optionA: 'Recreational area', optionB: 'Motorist services (gas, food, lodging)', optionC: 'Construction zone', optionD: 'Speed limit', correctAnswer: 'B', explanation: 'Blue signs indicate motorist services such as gas stations, food, lodging, and hospitals.' },
  { topic: 'Traffic Signs and Signals', questionText: 'What does a pentagon-shaped sign indicate?', optionA: 'School zone', optionB: 'State park', optionC: 'No entry', optionD: 'Hospital ahead', correctAnswer: 'A', explanation: 'Pentagon-shaped signs (5 sides, pointed top) indicate school zones or school crossings.' },
  { topic: 'Traffic Signs and Signals', questionText: 'What does a "Do Not Enter" sign look like?', optionA: 'Red circle with white X', optionB: 'Red rectangle with white horizontal bar', optionC: 'White square with red border', optionD: 'Red diamond with white text', correctAnswer: 'B', explanation: 'A "Do Not Enter" sign is a red rectangle with a white horizontal bar, indicating you cannot proceed.' },
  { topic: 'Traffic Signs and Signals', questionText: 'Orange signs are used for:', optionA: 'Recreational areas', optionB: 'Construction and work zones', optionC: 'School zones', optionD: 'Railroad crossings', correctAnswer: 'B', explanation: 'Orange signs are used in construction and work zones. Obey these signs carefully for worker safety.' },
  { topic: 'Traffic Signs and Signals', questionText: 'What does a round yellow sign with an X mean?', optionA: 'No parking', optionB: 'Railroad crossing ahead', optionC: 'Wrong way', optionD: 'Intersection ahead', correctAnswer: 'B', explanation: 'A round yellow sign with an X and "RR" warns of a railroad crossing ahead.' },
  { topic: 'Traffic Signs and Signals', questionText: 'What does a green arrow light mean?', optionA: 'You may proceed with caution', optionB: 'Protected turn — proceed in direction of arrow', optionC: 'Turn only if safe', optionD: 'Yield to oncoming traffic then turn', correctAnswer: 'B', explanation: 'A green arrow is a protected signal. You may proceed in the direction of the arrow; oncoming traffic is stopped.' },
  { topic: 'Traffic Signs and Signals', questionText: 'A white rectangular sign with black text typically indicates:', optionA: 'Warning', optionB: 'Regulatory rule', optionC: 'Services ahead', optionD: 'Construction zone', correctAnswer: 'B', explanation: 'White rectangular signs with black text are regulatory signs, indicating laws you must follow (speed limits, no parking, etc.).' },
  { topic: 'Traffic Signs and Signals', questionText: 'What does "WRONG WAY" sign indicate?', optionA: 'You made a wrong turn, no immediate danger', optionB: 'You are driving against traffic, stop immediately', optionC: 'Road is closed ahead', optionD: 'No U-turn allowed', correctAnswer: 'B', explanation: 'A "Wrong Way" sign means you are going the wrong direction on a one-way road. Stop and turn around safely.' },
  // Safe Driving
  { topic: 'Safe Driving', questionText: 'What is the most common cause of teen driving accidents?', optionA: 'Speeding', optionB: 'Distracted driving', optionC: 'Driving under the influence', optionD: 'Running red lights', correctAnswer: 'B', explanation: 'Distracted driving, especially cell phone use, is the leading cause of teen driving accidents.' },
  { topic: 'Safe Driving', questionText: 'When is it safe to use a handheld cell phone while driving?', optionA: 'At red lights', optionB: 'On the highway', optionC: 'Never', optionD: 'In parking lots', correctAnswer: 'C', explanation: 'It is never safe to use a handheld cell phone while driving. Missouri restricts phone use for new drivers.' },
  { topic: 'Safe Driving', questionText: 'What should you do if you feel drowsy while driving?', optionA: 'Open a window and keep going', optionB: 'Turn up the music', optionC: 'Pull over safely and rest', optionD: 'Drink coffee and continue', correctAnswer: 'C', explanation: 'If you feel drowsy, the safest action is to pull off the road in a safe location and rest.' },
  { topic: 'Safe Driving', questionText: 'What is a blind spot?', optionA: 'A dirty windshield', optionB: 'An area around your vehicle not visible in mirrors', optionC: 'Headlight failure', optionD: 'A road with no streetlights', correctAnswer: 'B', explanation: 'Blind spots are areas around your vehicle that cannot be seen in your mirrors. Always turn your head to check before changing lanes.' },
  { topic: 'Safe Driving', questionText: 'How should you hold the steering wheel for best control?', optionA: 'One hand at top', optionB: 'Two hands at 9 and 3', optionC: 'Two hands at 12 and 6', optionD: 'One hand at bottom', correctAnswer: 'B', explanation: 'Holding the steering wheel at 9 and 3 o\'clock provides the best control and is safest with airbags.' },
  { topic: 'Safe Driving', questionText: 'What should you do when merging onto a highway?', optionA: 'Stop at the end of the ramp and wait', optionB: 'Accelerate to match highway speed and merge', optionC: 'Merge slowly regardless of traffic', optionD: 'Honk to signal your merge', correctAnswer: 'B', explanation: 'You should use the on-ramp to accelerate to highway speed, check for a gap, signal, and merge smoothly.' },
  { topic: 'Safe Driving', questionText: 'What is the first thing you should do at the scene of an accident?', optionA: 'Take photos', optionB: 'Call your parents', optionC: 'Check for injuries and call 911', optionD: 'Exchange insurance information', correctAnswer: 'C', explanation: 'Safety first. Check for injuries and call 911. Move vehicles out of traffic if safe to do so.' },
  { topic: 'Safe Driving', questionText: 'What does "defensive driving" mean?', optionA: 'Driving slowly', optionB: 'Anticipating hazards and the mistakes of others', optionC: 'Always yielding to other drivers', optionD: 'Using your horn frequently', correctAnswer: 'B', explanation: 'Defensive driving means being aware of potential hazards, anticipating other drivers\' actions, and being prepared to respond.' },
  { topic: 'Safe Driving', questionText: 'In wet conditions, you should increase your following distance to:', optionA: '4-5 seconds', optionB: '3 seconds', optionC: '2 seconds', optionD: '6-8 seconds', correctAnswer: 'A', explanation: 'In wet or slippery conditions, increase your following distance to at least 4-5 seconds to allow extra stopping time.' },
  { topic: 'Safe Driving', questionText: 'What is hydroplaning?', optionA: 'Driving through deep water', optionB: 'Tires losing contact with road on water film', optionC: 'Windshield fogging up', optionD: 'Engine water damage', correctAnswer: 'B', explanation: 'Hydroplaning occurs when tires ride on a film of water rather than the road surface, causing loss of control.' },
  { topic: 'Safe Driving', questionText: 'If your vehicle starts to skid, you should:', optionA: 'Brake hard immediately', optionB: 'Turn the wheel sharply', optionC: 'Steer in the direction you want to go', optionD: 'Accelerate out of it', correctAnswer: 'C', explanation: 'In a skid, steer smoothly in the direction you want the front of the vehicle to go. Avoid sudden braking.' },
  { topic: 'Safe Driving', questionText: 'Why should you avoid driving in another driver\'s blind spot?', optionA: 'It uses more fuel', optionB: 'They may not see you and change lanes into you', optionC: 'It is illegal', optionD: 'It causes tire wear', correctAnswer: 'B', explanation: 'Driving in another vehicle\'s blind spot is dangerous because the other driver may not see you and could change lanes.' },
  { topic: 'Safe Driving', questionText: 'What is the purpose of the "Move Over" law?', optionA: 'To allow faster drivers to pass', optionB: 'To protect emergency workers stopped on the roadside', optionC: 'To create space for merging vehicles', optionD: 'To reduce highway congestion', correctAnswer: 'B', explanation: 'Missouri\'s Move Over law requires drivers to move over a lane (or slow down) when passing stopped emergency vehicles.' },
  { topic: 'Safe Driving', questionText: 'How far ahead should you look while driving?', optionA: 'Just in front of your car', optionB: '1-2 seconds ahead', optionC: '10-15 seconds ahead', optionD: 'As far as possible', correctAnswer: 'C', explanation: 'You should scan 10-15 seconds ahead (about a city block or 1/4 mile on highways) to anticipate hazards early.' },
  { topic: 'Safe Driving', questionText: 'What should you do if your accelerator gets stuck?', optionA: 'Turn off the ignition while moving', optionB: 'Shift to neutral, brake firmly, pull over', optionC: 'Keep driving and call for help', optionD: 'Pump the accelerator', correctAnswer: 'B', explanation: 'If your accelerator sticks, shift to neutral to cut power, brake firmly, steer to the side, and stop safely.' },
  { topic: 'Safe Driving', questionText: 'What is the danger zone around a school bus?', optionA: '5 feet', optionB: '10 feet', optionC: '15 feet', optionD: '20 feet', correctAnswer: 'B', explanation: 'The 10-foot danger zone around a school bus is where children are at highest risk. Never enter this zone.' },
  { topic: 'Safe Driving', questionText: 'When should you use your hazard lights?', optionA: 'When driving slowly on the highway', optionB: 'When your vehicle is disabled or creating a hazard', optionC: 'In heavy rain to be more visible', optionD: 'When driving through tunnels', correctAnswer: 'B', explanation: 'Hazard lights should be used when your vehicle is disabled, involved in an accident, or creating a temporary hazard.' },
  { topic: 'Safe Driving', questionText: 'What is the correct response when a tire blows out?', optionA: 'Brake hard immediately', optionB: 'Grip the wheel firmly, ease off gas, steer straight', optionC: 'Swerve to the shoulder immediately', optionD: 'Accelerate briefly then brake', correctAnswer: 'B', explanation: 'In a blowout, grip the wheel firmly, ease off the accelerator gradually, and steer straight while slowing to a stop.' },
  // Alcohol, Drugs, and Driving
  { topic: 'Alcohol, Drugs, and Driving', questionText: 'What is the legal Blood Alcohol Content (BAC) limit for drivers under 21 in Missouri?', optionA: '0.08%', optionB: '0.04%', optionC: '0.02%', optionD: '0.00%', correctAnswer: 'C', explanation: 'Missouri has a zero tolerance policy for drivers under 21. A BAC of 0.02% or more will result in license suspension.' },
  { topic: 'Alcohol, Drugs, and Driving', questionText: 'How does alcohol affect driving ability?', optionA: 'Improves reaction time', optionB: 'Impairs judgment, vision, and coordination', optionC: 'Only affects night vision', optionD: 'Has no effect in small amounts', correctAnswer: 'B', explanation: 'Even small amounts of alcohol impair judgment, reaction time, coordination, and vision — all critical driving skills.' },
  { topic: 'Alcohol, Drugs, and Driving', questionText: 'What is "implied consent" in Missouri?', optionA: 'Agreeing to drive a friend home', optionB: 'By driving, you consent to sobriety testing', optionC: 'Passengers consent to the driver\'s rules', optionD: 'A parent\'s consent for a teen to drive', correctAnswer: 'B', explanation: 'Missouri\'s implied consent law means that by driving, you agree to submit to chemical testing if suspected of DWI.' },
  { topic: 'Alcohol, Drugs, and Driving', questionText: 'Can prescription medications affect your ability to drive?', optionA: 'No, prescriptions are always safe', optionB: 'Only illegal drugs affect driving', optionC: 'Yes, many medications impair driving ability', optionD: 'Only in large doses', correctAnswer: 'C', explanation: 'Many prescription and over-the-counter medications can cause drowsiness, dizziness, and other effects that impair driving.' },
  { topic: 'Alcohol, Drugs, and Driving', questionText: 'What does DWI stand for in Missouri?', optionA: 'Driving While Intoxicated', optionB: 'Driving Without Insurance', optionC: 'Driving With Impairment', optionD: 'Driving While Inexperienced', correctAnswer: 'A', explanation: 'DWI stands for Driving While Intoxicated, which includes alcohol and/or drugs.' },
  { topic: 'Alcohol, Drugs, and Driving', questionText: 'If you\'ve been drinking, the safest option is:', optionA: 'Drink coffee before driving', optionB: 'Wait 30 minutes then drive', optionC: 'Get a sober driver or use a rideshare', optionD: 'Drive slowly on back roads', correctAnswer: 'C', explanation: 'There is no safe way to drive after drinking. Always arrange for a sober driver, taxi, or rideshare service.' },
  { topic: 'Alcohol, Drugs, and Driving', questionText: 'How long after drinking can alcohol still affect your driving?', optionA: '30 minutes', optionB: '1 hour', optionC: 'Several hours', optionD: 'Only while you feel drunk', correctAnswer: 'C', explanation: 'Alcohol can impair your driving for several hours after your last drink. The only way to sober up is time.' },
  { topic: 'Alcohol, Drugs, and Driving', questionText: 'What is the legal BAC limit for adult drivers in Missouri?', optionA: '0.10%', optionB: '0.08%', optionC: '0.05%', optionD: '0.06%', correctAnswer: 'B', explanation: 'In Missouri, the legal BAC limit for drivers 21 and older is 0.08%.' },
  { topic: 'Alcohol, Drugs, and Driving', questionText: 'Which of the following is NOT a sign of intoxication?', optionA: 'Slurred speech', optionB: 'Improved reaction time', optionC: 'Poor coordination', optionD: 'Impaired judgment', correctAnswer: 'B', explanation: 'Alcohol never improves reaction time. Intoxication slows reaction time and impairs all driving-related skills.' },
  // Missouri Driver License Requirements
  { topic: 'Missouri Driver License Requirements', questionText: 'At what age can a Missouri resident get a learner\'s permit?', optionA: '14', optionB: '15', optionC: '16', optionD: '17', correctAnswer: 'B', explanation: 'Missouri residents can apply for a learner\'s permit (Temporary Instruction Permit) at age 15.' },
  { topic: 'Missouri Driver License Requirements', questionText: 'How long must you hold a Missouri learner\'s permit before getting a license?', optionA: '30 days', optionB: '3 months', optionC: '6 months', optionD: '1 year', correctAnswer: 'C', explanation: 'Missouri requires you to hold a learner\'s permit for at least 6 months before applying for a full license.' },
  { topic: 'Missouri Driver License Requirements', questionText: 'How many hours of supervised driving are required in Missouri?', optionA: '20 hours', optionB: '30 hours', optionC: '40 hours', optionD: '50 hours', correctAnswer: 'C', explanation: 'Missouri requires 40 hours of supervised driving practice, including 10 hours at night, before getting a license.' },
  { topic: 'Missouri Driver License Requirements', questionText: 'What are the driving restrictions for a Missouri Intermediate License (16-18)?', optionA: 'No restrictions', optionB: 'No driving after 9 PM', optionC: 'No driving between 1 AM and 5 AM unless for work/school', optionD: 'Only drive with a parent', correctAnswer: 'C', explanation: 'With an Intermediate License, you cannot drive between 1 AM and 5 AM unless driving for work, school, or religious activities.' },
  { topic: 'Missouri Driver License Requirements', questionText: 'How many unrelated passengers can a driver under 18 carry during the first 6 months of licensing?', optionA: 'None', optionB: 'One', optionC: 'Two', optionD: 'No restriction', correctAnswer: 'A', explanation: 'During the first 6 months with an intermediate license, drivers under 18 may not carry unrelated passengers under 19.' },
  { topic: 'Missouri Driver License Requirements', questionText: 'What score must you pass on the Missouri written test?', optionA: '70%', optionB: '75%', optionC: '80%', optionD: '85%', correctAnswer: 'C', explanation: 'You must score at least 80% (20 out of 25 questions) to pass the Missouri written driver\'s test.' },
  // Highway Driving
  { topic: 'Highway Driving', questionText: 'What is the standard speed limit on Missouri rural interstates?', optionA: '60 mph', optionB: '65 mph', optionC: '70 mph', optionD: '75 mph', correctAnswer: 'C', explanation: 'The standard speed limit on Missouri rural interstate highways is 70 mph.' },
  { topic: 'Highway Driving', questionText: 'On a highway, the left lane is primarily for:', optionA: 'Slower traffic', optionB: 'Passing and faster traffic', optionC: 'Trucks only', optionD: 'Any speed', correctAnswer: 'B', explanation: 'The left lane on a highway is for passing and faster-moving traffic. Keep right except to pass.' },
  { topic: 'Highway Driving', questionText: 'What is the recommended following distance on a highway?', optionA: '1-2 seconds', optionB: '2 seconds', optionC: '3-4 seconds', optionD: '5+ seconds', correctAnswer: 'C', explanation: 'At highway speeds, maintain at least a 3-4 second following distance, more in bad weather.' },
  { topic: 'Highway Driving', questionText: 'When should you use your turn signal before a highway lane change?', optionA: 'You don\'t need to on highways', optionB: 'Just before moving', optionC: 'Several seconds before moving', optionD: 'After checking mirrors', correctAnswer: 'C', explanation: 'Always signal several seconds before changing lanes on a highway to give other drivers time to react.' },
  { topic: 'Highway Driving', questionText: 'When exiting the highway, when should you reduce your speed?', optionA: 'Before entering the exit ramp', optionB: 'After entering the exit ramp', optionC: 'Once on local roads', optionD: 'At the stop sign', correctAnswer: 'B', explanation: 'Maintain highway speed until you enter the exit ramp, then reduce speed. Braking on the highway disrupts traffic.' },
  // Parking Regulations
  { topic: 'Parking Regulations', questionText: 'How far from a fire hydrant must you park?', optionA: '5 feet', optionB: '10 feet', optionC: '15 feet', optionD: '20 feet', correctAnswer: 'C', explanation: 'You must park at least 15 feet from a fire hydrant to ensure fire trucks can access it.' },
  { topic: 'Parking Regulations', questionText: 'How close to an intersection can you park?', optionA: '15 feet', optionB: '20 feet', optionC: '25 feet', optionD: '30 feet', correctAnswer: 'B', explanation: 'You cannot park within 20 feet of an intersection or crosswalk.' },
  { topic: 'Parking Regulations', questionText: 'When parking downhill without a curb, which direction should your wheels face?', optionA: 'Straight ahead', optionB: 'Left (away from traffic)', optionC: 'Right (toward traffic)', optionD: 'It doesn\'t matter', correctAnswer: 'C', explanation: 'Without a curb, turn wheels to the right so if the car rolls, it moves off the road away from traffic.' },
  { topic: 'Parking Regulations', questionText: 'What does a yellow curb indicate?', optionA: 'No parking, no stopping', optionB: 'Short-term loading only', optionC: 'Handicap parking', optionD: 'No parking anytime', correctAnswer: 'B', explanation: 'A yellow curb typically means a loading zone with limited stopping time. No parking for regular vehicles.' },
  { topic: 'Parking Regulations', questionText: 'Where is it never legal to park?', optionA: 'On a residential street', optionB: 'In front of a driveway', optionC: 'In a parking garage', optionD: 'On a cul-de-sac', correctAnswer: 'B', explanation: 'You cannot park in front of a driveway — it blocks access and is always illegal.' },
  // Sharing the Road
  { topic: 'Sharing the Road', questionText: 'When passing a bicyclist, you should give at least:', optionA: '1 foot of space', optionB: '2 feet of space', optionC: '3 feet of space', optionD: '4 feet of space', correctAnswer: 'C', explanation: 'Missouri law requires drivers to give bicyclists at least 3 feet of clearance when passing.' },
  { topic: 'Sharing the Road', questionText: 'When must you stop for a school bus with flashing red lights?', optionA: 'Only if behind the bus', optionB: 'On both sides of the road unless on a divided highway', optionC: 'Only if children are visible', optionD: 'Only in school zones', correctAnswer: 'B', explanation: 'You must stop for a school bus with flashing red lights in both directions unless separated by a physical median.' },
  { topic: 'Sharing the Road', questionText: 'What should you do when approaching a pedestrian in a crosswalk?', optionA: 'Honk to alert them', optionB: 'Speed past quickly', optionC: 'Yield and stop to let them cross', optionD: 'Drive around them', correctAnswer: 'C', explanation: 'Pedestrians in crosswalks always have the right of way. You must stop and wait for them to cross safely.' },
  { topic: 'Sharing the Road', questionText: 'What is the "door zone" when passing parked cars?', optionA: 'A parking space entrance', optionB: 'The area where car doors may open into traffic', optionC: 'A drive-through area', optionD: 'The loading zone', correctAnswer: 'B', explanation: 'The door zone is the area where car doors could open into your path. Give parked cars extra space to avoid dooring.' },
  { topic: 'Sharing the Road', questionText: 'Large trucks have blind spots:', optionA: 'Only directly behind them', optionB: 'Only on their left side', optionC: 'In front, behind, and on both sides', optionD: 'Only when backing up', correctAnswer: 'C', explanation: 'Large trucks have significant blind spots (no-zones) in front, behind, and on both sides — especially the right side.' },
  { topic: 'Sharing the Road', questionText: 'If a motorcycle is sharing your lane, you should:', optionA: 'Honk to make them move', optionB: 'Give them a full lane of space', optionC: 'Pass them quickly', optionD: 'Follow closely', correctAnswer: 'B', explanation: 'Motorcycles are entitled to a full lane of space. Never share a lane with or crowd a motorcycle.' },
  { topic: 'Sharing the Road', questionText: 'What is lane splitting?', optionA: 'Dividing the road with cones', optionB: 'A motorcycle driving between lanes of traffic', optionC: 'Merging two lanes into one', optionD: 'Passing on the right', correctAnswer: 'B', explanation: 'Lane splitting is when a motorcycle rides between lanes of slow or stopped traffic. It is illegal in Missouri.' },
  { topic: 'Sharing the Road', questionText: 'When should you dim your high beams?', optionA: 'Never on rural roads', optionB: 'Within 500 feet of oncoming traffic or 300 feet behind another vehicle', optionC: 'Only in the city', optionD: 'Only when asked by other drivers', correctAnswer: 'B', explanation: 'Missouri law requires dimming high beams within 500 feet of an oncoming vehicle or 300 feet when following another vehicle.' },
  { topic: 'Sharing the Road', questionText: 'Who has the right of way when a driver and pedestrian reach an intersection at the same time?', optionA: 'The driver', optionB: 'The pedestrian', optionC: 'Whoever got there first', optionD: 'The faster-moving party', correctAnswer: 'B', explanation: 'Pedestrians always have the right of way at intersections and crosswalks.' },
  { topic: 'Sharing the Road', questionText: 'What should you do when a funeral procession is passing?', optionA: 'Ignore it and proceed normally', optionB: 'Yield to the entire procession', optionC: 'Only yield to the hearse', optionD: 'Honk to get them to move', correctAnswer: 'B', explanation: 'A funeral procession has the right of way. You should yield to the entire procession, not just part of it.' },
  // Roundabouts
  { topic: 'Roundabouts', questionText: 'When entering a roundabout, you must yield to:', optionA: 'Vehicles exiting the roundabout', optionB: 'Vehicles already in the roundabout', optionC: 'No one — just enter', optionD: 'Vehicles on your right', correctAnswer: 'B', explanation: 'Always yield to vehicles already circulating in the roundabout. Enter only when there is a safe gap.' },
  { topic: 'Roundabouts', questionText: 'In a roundabout, traffic flows:', optionA: 'Clockwise', optionB: 'Counterclockwise', optionC: 'Either direction', optionD: 'In a figure-eight', correctAnswer: 'B', explanation: 'In the United States, traffic in roundabouts flows counterclockwise around the central island.' },
  { topic: 'Roundabouts', questionText: 'Which lane should you use to turn left at a two-lane roundabout?', optionA: 'Right lane', optionB: 'Left lane', optionC: 'Either lane', optionD: 'There is no left turn', correctAnswer: 'B', explanation: 'For left turns (or U-turns) in a two-lane roundabout, use the left lane and exit at your desired road.' },
  // Pavement Markings
  { topic: 'Pavement Markings', questionText: 'A double solid yellow center line means:', optionA: 'Passing is permitted in both directions', optionB: 'No passing in either direction', optionC: 'Passing is permitted when safe', optionD: 'Divided highway ahead', correctAnswer: 'B', explanation: 'A double solid yellow center line means no passing is allowed in either direction.' },
  { topic: 'Pavement Markings', questionText: 'What do white arrows painted on the road mean?', optionA: 'Decorative only', optionB: 'Lanes designated for specific directions', optionC: 'Bicycle lane markings', optionD: 'Passing zone', correctAnswer: 'B', explanation: 'White arrows indicate which direction(s) you may travel in a specific lane.' },
  { topic: 'Pavement Markings', questionText: 'What does a yellow "X" signal above a lane mean?', optionA: 'Speed up', optionB: 'Lane closed — exit the lane', optionC: 'HOV lane', optionD: 'Rail crossing', correctAnswer: 'B', explanation: 'A red or yellow X above a lane on a variable message sign means the lane is closed and you must exit it.' },
  { topic: 'Pavement Markings', questionText: 'What is a "gore area" at highway exits?', optionA: 'A rest stop', optionB: 'The triangular painted area between the highway and exit ramp', optionC: 'The acceleration lane', optionD: 'A truck weigh station', correctAnswer: 'B', explanation: 'The gore area is the painted (usually striped) triangular area between the main highway and the exit ramp. Never drive in it.' },
  { topic: 'Pavement Markings', questionText: 'Solid white lines between lanes mean:', optionA: 'Lane changes are not allowed', optionB: 'Lane changes are discouraged but not prohibited', optionC: 'Passing is allowed', optionD: 'Bicycle lane', correctAnswer: 'B', explanation: 'Solid white lines discourage lane changes but do not prohibit them. Use caution if you must cross them.' },
  // Point System and Violations
  { topic: 'Point System and Violations', questionText: 'How many points lead to a Missouri driver\'s license suspension?', optionA: '8 points in 18 months', optionB: '10 points in 18 months', optionC: '12 points in 12 months', optionD: '15 points in 12 months', correctAnswer: 'A', explanation: 'In Missouri, accumulating 8 or more points within 18 months will result in license suspension.' },
  { topic: 'Point System and Violations', questionText: 'How many points does a speeding violation add to your Missouri record?', optionA: '1-2 points', optionB: '2-3 points', optionC: '3-4 points', optionD: '5 points', correctAnswer: 'B', explanation: 'Speeding violations add 2-3 points depending on the severity. Excessive speeding (26+ over) adds 3 points.' },
  { topic: 'Point System and Violations', questionText: 'What happens to points on your Missouri driving record over time?', optionA: 'They never expire', optionB: 'They are halved after 1 year', optionC: 'They decrease 1 point per year without violations', optionD: 'They reset after 2 years', correctAnswer: 'C', explanation: 'Missouri reduces points by 1/3 after 12 consecutive months without a violation, and removes all points after 36 months.' },
  { topic: 'Point System and Violations', questionText: 'What is the consequence of driving without insurance in Missouri?', optionA: 'Warning only', optionB: 'Fine only', optionC: 'Fine and license suspension', optionD: 'No consequence', correctAnswer: 'C', explanation: 'Driving without insurance in Missouri results in fines and suspension of your driver\'s license and vehicle registration.' },
  { topic: 'Point System and Violations', questionText: 'Running a red light in Missouri adds how many points?', optionA: '1 point', optionB: '2 points', optionC: '3 points', optionD: '4 points', correctAnswer: 'B', explanation: 'Running a red light adds 2 points to your Missouri driving record.' },
  { topic: 'Point System and Violations', questionText: 'What is the penalty for a first-time DWI in Missouri?', optionA: 'Warning and fine', optionB: 'Fine only', optionC: 'Up to 6 months in jail, fines, and license suspension', optionD: 'Community service only', correctAnswer: 'C', explanation: 'A first DWI in Missouri can result in up to 6 months in jail, fines up to $500, and 90-day license suspension.' },
  { topic: 'Point System and Violations', questionText: 'How many points is reckless driving worth in Missouri?', optionA: '3 points', optionB: '4 points', optionC: '6 points', optionD: '8 points', correctAnswer: 'B', explanation: 'Reckless driving adds 4 points to your Missouri driving record.' },
  { topic: 'Point System and Violations', questionText: 'What happens if you accumulate 12+ points in Missouri?', optionA: '30-day suspension', optionB: '60-day suspension', optionC: '1-year revocation', optionD: 'Permanent revocation', correctAnswer: 'C', explanation: 'Accumulating 12 or more points within 12 months results in a 1-year license revocation in Missouri.' },
  // Hand Signals
  { topic: 'Hand Signals', questionText: 'What does it mean when a driver extends their left arm straight out the window?', optionA: 'Slowing down', optionB: 'Right turn', optionC: 'Left turn', optionD: 'Stop', correctAnswer: 'C', explanation: 'Extending your left arm straight out the window indicates a left turn.' },
  { topic: 'Hand Signals', questionText: 'What does it mean when a driver extends their left arm upward at a 90-degree angle?', optionA: 'Left turn', optionB: 'Right turn', optionC: 'Slowing down', optionD: 'Stop', correctAnswer: 'B', explanation: 'Left arm bent upward at 90 degrees (like an L shape) indicates a right turn.' },
  { topic: 'Hand Signals', questionText: 'What does it mean when a driver extends their left arm downward at a 90-degree angle?', optionA: 'Left turn', optionB: 'Right turn', optionC: 'Slowing or stopping', optionD: 'Hazard warning', correctAnswer: 'C', explanation: 'Left arm bent downward at 90 degrees indicates slowing down or stopping.' },
]

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.quizResult.deleteMany()
  await prisma.quizQuestion.deleteMany()
  await prisma.skillProgress.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.phase.deleteMany()

  // Seed phases and skills
  for (const phase of phases) {
    const createdPhase = await prisma.phase.create({
      data: {
        orderIndex: phase.orderIndex,
        title: phase.title,
        description: phase.description,
        skills: {
          create: phase.skills.map((skill, index) => ({
            orderIndex: index + 1,
            title: skill.title,
            description: skill.description,
          })),
        },
      },
    })
    console.log(`Created phase: ${createdPhase.title}`)
  }

  // Seed quiz questions
  await prisma.quizQuestion.createMany({ data: quizQuestions })
  console.log(`Created ${quizQuestions.length} quiz questions`)

  console.log('Seeding complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
