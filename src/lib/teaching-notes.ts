// Teaching notes mapped by skill title (partial match supported)
// These are instructor guides imported from reference/driving_skills_teaching_notes.json

export const teachingNotesLookup: Record<string, string> = {
  // Phase 1: Basic Safety & Vehicle Familiarity - Pre-Drive Safety Checks
  "Adjust seat position": "Have your teen sit in the driver's seat with the car off. They should be able to press the brake pedal fully to the floor while their knee remains slightly bent. Their back should rest against the seat back, not leaning forward. They should see the road clearly over the steering wheel without straining. Adjust the seat height if available. This is critical - improper seat position causes fatigue and reduces control.",
  
  "Adjust all mirrors": "Teach the 'BGE' method: the rearview mirror should frame the Back window, side mirrors should show a sliver of your car and mostly the Ground next to you with the horizon at the middle, and eliminate blind spots by angling out further than expected. Have them practice checking each mirror from the driving position. They should be able to see behind and beside without moving their head much.",
  
  "Check seatbelt fits properly": "The lap belt should sit low across the hips/pelvis, not the stomach. The shoulder belt should cross the chest and shoulder, not the neck. If it crosses their neck, adjust the height or seat position. Make seatbelt use non-negotiable from day one - it's a life-saving habit. Explain that it takes 1 second to buckle and could save their life.",
  
  "Locate and test turn signals, hazard lights, wipers": "With the car on but not running, have them find and operate each control without looking down. Turn signals: left side of steering column (down=left, up=right). Hazards: usually a red triangle button. Wipers: right side of column. Practice until it becomes muscle memory. They'll need to use these while watching the road.",
  
  "Find parking brake location and operation": "Show whether it's a foot pedal (left of brake), hand lever (between seats), or electronic button. Practice engaging and releasing it. Explain it's essential for parking on hills and as a backup if the main brake fails. Have them practice until they can do it without looking. Test their understanding by having them explain when to use it.",
  
  "Identify gas, brake, and clutch pedals": "Right pedal is always gas, middle is always brake. Left pedal is clutch (manual only). Have them identify each with their hand, then practice right foot position - hovering over brake when not accelerating. Teach them to never use two feet in an automatic. Practice the 'heel-toe' position where their heel stays on the floor and they pivot their foot between pedals.",
  
  "Check doors are properly closed and locked": "Walk around the car together to check all doors. Show them how to verify the door indicator lights on the dashboard. Explain that an open door while driving is dangerous and illegal. Practice locking/unlocking from inside. Teach them to check the backseat before entering - safety awareness starts here.",

  // Phase 1: Basic Vehicle Controls
  "Start and turn off engine safely": "For keyless: Brake must be pressed, then push start button. For keyed: Insert key, foot on brake, turn to start. To turn off: Put in Park, engage parking brake, then turn off. Practice this sequence 5-10 times in the driveway until it's automatic. Explain the safety interlock that prevents starting in gear.",
  
  "Understand gear selector": "P=Park (parked, engine can start), R=Reverse (backward), N=Neutral (coasting, no power), D=Drive (forward), L or 2/1=Low gears (hills, engine braking). Must press brake to shift from Park. Practice shifting through all gears while stationary. Explain that you should only shift to Reverse or Park when fully stopped.",
  
  "Practice smooth acceleration and braking while stationary": "In Park with engine on, have them gently press the gas pedal to feel engine response. Listen to the RPM changes. Then practice brake pressure - light tap vs. firm press. Explain smooth inputs prevent lurching. This builds pedal feel before the car moves. Have them practice progressive pressure: light, medium, firm.",
  
  "Use parking brake correctly": "Practice the full sequence: Park, parking brake on, engine off. To leave: Start engine, brake pressed, parking brake off, shift to Drive. Repeat 5+ times. Explain it's the 'emergency brake' backup and prevents roll on hills. On a slight incline in your driveway, show them how the parking brake holds the car.",
  
  "Operate windshield wipers and lights": "Wipers: Show intermittent, slow, fast settings. Practice switching speeds. Lights: Off, parking lights, headlights, high beams. Find the high beam indicator on dash (blue). Practice turning on headlights and wipers together (common in rain). Make it second nature before driving in traffic.",
  
  "Adjust climate controls without looking away from road": "Start with car stationary. Locate heat/AC, fan speed, defrost. Practice adjusting by feel. Then practice while you drive (they watch road). Finally, they practice while driving in parking lot. Explain that distracted driving kills - every control must become automatic through practice.",

  // Phase 2: Fundamental Driving Skills - Vehicle Movement Basics
  "Smooth starts from complete stop": "In empty parking lot: From complete stop in Drive, release brake slowly, then gradually add gas. Common mistake is too much gas too fast. Practice starts until there's no head jerk. Count: '1-2-3 release brake, 1-2 add gas.' Do 10 repetitions minimum. Praise smooth starts, point out harsh ones.",
  
  "Gradual, controlled acceleration": "Once moving, practice maintaining steady gas pressure. Have them accelerate from 5 to 15 mph smoothly over 5 seconds. They should feel the gentle push, not a jerk. Use a speedometer check every 2 seconds. This teaches throttle control. Most new drivers are jerky - smooth acceleration is a learned skill.",
  
  "Progressive braking to smooth stops": "Approach a parking space marker. Have them identify the stopping point early. Begin gentle brake pressure 3 car lengths away, increase as you slow, then ease off slightly at the end to avoid a jerk. This is 'progressive braking.' Practice 15+ stops. The goal is passengers can't tell when you stopped.",
  
  "Straight line driving at consistent speed": "Paint a mental path through parking lot lanes. Keep eyes UP and far ahead, not at the hood. Hands at 9-and-3 or 10-and-2. Small steering corrections. Pick a target (sign/cone) far ahead and drive straight to it at 10 mph. Most new drivers fixate on what's close - teach them to look where they want to go.",
  
  "Gentle steering inputs and corrections": "Teach 'push-pull' steering: hands stay on wheel, push with one hand, pull with other. No hand-over-hand yet. Make small corrections (1-2 inches of wheel movement) rather than big jerks. Practice driving between cones set 10 feet apart. Goal: smooth, predictable path. Explain that passengers feel every steering input.",
  
  "Proper following distance judgment": "While you drive in the parking lot, demonstrate: pick a marker, when the car ahead passes it, count '1-Mississippi, 2-Mississippi, 3-Mississippi.' Your car should reach the marker after 3. If not, you're too close. Have them practice identifying safe gaps. In parking lot, this feels long - that's good. Explain this prevents rear-end crashes.",

  // Phase 2: Parking Fundamentals
  "Forward parking between lines": "Set up two cones as a parking space. Approach slowly (5 mph). When their body is between the lines, straighten wheel and pull in. Stop before hitting the curb/cone. Practice from different angles. Common mistakes: too fast, turning too early/late, crooked parking. Do 10 reps minimum. Celebrate straight parking jobs.",
  
  "Reverse parking": "This is harder and safer than forward parking (easier to exit). Stop when their door aligns with the space. Turn wheel fully toward space, back slowly, watching mirrors. Straighten when car is angled in, center between lines. Go VERY slow. Practice 5 times, then compare ease of exiting vs. forward parking.",
  
  "Parallel parking basics": "This takes lots of practice. Pull alongside the front car, 1 foot away. When mirrors align, stop. Turn wheel right (full), back until you see the back car's headlights in your mirror. Straighten wheel, back until almost in. Turn wheel left (full), back into space. Adjust forward/back to center. Practice with cones 25 feet apart at least 10 times.",
  
  "Angle parking": "Common in shopping areas. Approach with your car between two spaces. When your mirror passes the line of the space you want, turn in smoothly. Aim to center between lines. Practice at 5 mph. This is easier than straight parking but requires good spatial awareness. Do 5-8 repetitions.",
  
  "Safe distance from other vehicles": "When parking, teach 'door clearance' - leave 3-4 feet from other cars so doors can open. When stopped behind someone, you should see their rear tires touching the pavement - this is safe following distance at stops. Practice judging these distances in empty lots first.",

  // Phase 3: Traffic Navigation - Intersection Skills
  "Complete stops at stop signs": "Approach at 15 mph, begin braking 100 feet away. Come to COMPLETE stop - count '1-Mississippi' - wheels not rolling. Stop so you can see the stop line or where the crosswalk would be. Look left-right-left. Then proceed. Practice at same stop sign 5 times. Point out rolling stops by other drivers as what NOT to do.",
  
  "Yield right-of-way correctly": "Yield = Let others go first. At yield signs, slow down, check for traffic, and only proceed when clear. Teach specific scenarios: Left turns yield to oncoming traffic. Vehicles on the right go first at 4-way stops. At T-intersections, through traffic has right-of-way. Practice each scenario. When in doubt, yield.",
  
  "Traffic light response": "Green = Go (but check intersection is clear first). Yellow = Stop if you can safely, go if you can't stop safely. Red = Stop completely behind line, wait for green. Practice approaching lights at various distances. Have them call out decisions: 'Yellow light, too close to stop, proceeding through.' Decision-making is key.",
  
  "Safe gap judgment for turns": "Teach the 6-second rule for turns: If an oncoming car is more than 6 seconds away, you can safely turn. Practice: 'That car is at the sign (point), count to 6, is it here yet? No, safe to turn.' Start conservative (7-8 seconds) and reduce as confidence builds. Better to wait than get hit.",
  
  "Left turns with oncoming traffic": "Most dangerous maneuver for new drivers. Position in left-turn lane or center of lane. Signal. Check oncoming traffic. When safe gap appears (6+ seconds), look at where you're going (not at oncoming cars) and turn smoothly. Practice at quiet intersections first, then busier ones. Never assume cars will stop for you.",
  
  "Right turns on red": "Come to COMPLETE stop at red light. Check for 'No Turn on Red' sign. Look left for oncoming traffic, right for pedestrians. When clear, turn into nearest lane. Treat it like a stop sign. Practice at multiple intersections. Point out where it's prohibited (signs, cross traffic, pedestrians).",

  // Phase 3: Lane Management
  "Stay centered in lane": "Eyes far ahead (12 seconds = about a block). Your peripheral vision keeps you centered. Look through the windshield where you want the car to go. Don't stare at the lane lines or hood. Practice on straight roads, then curves. Use the center of the windshield frame as a guide. Small corrections only.",
  
  "Check mirrors every 5-8 seconds": "Establish a pattern: rearview, left mirror, rearview, right mirror, repeat. Just a 1-second glance each. Count out loud '5-6-7-8-check' until it's habit. This keeps situational awareness. Quiz them: 'What color is the car behind us?' They should know without looking. Takes 2-3 drives to become automatic.",
  
  "Signal before turns": "In city: signal at least 3 seconds before turn (about 100 feet at 25 mph). On highway: much earlier (300+ feet). Teach them to count: '1-Mississippi, 2-Mississippi, 3-Mississippi, now turn.' Signal tells others your intentions. Practice signaling well before turns until it's automatic. Better too early than too late.",
  
  "Shoulder checks before changing lanes": "Mirrors don't show everything - blind spots exist. Before lane change: Check mirror, signal, shoulder check (quick look over shoulder), then move if clear. Practice in parking lot: have them note a car beside them, then try to see it in mirrors alone. Can't do it. Now shoulder check - there it is. This prevents crashes.",
  
  "Merge smoothly with traffic flow": "Merging requires speed matching. On entrance ramps, accelerate to match traffic speed before entering. Check mirrors, signal, shoulder check, merge into gap. Don't slow down in merge lane. Don't cut off others. Find a gap that's 4+ seconds. Practice: 'Speed up, find gap, signal, check blind spot, merge.' Smooth confidence takes practice.",

  // Phase 4: Intermediate Traffic Skills - Speed Management
  "Match traffic flow safely": "If speed limit is 40 but everyone's doing 35, do 35. If everyone's doing 45, do 42-43 (near limit). Going much slower or faster than traffic is dangerous. Teach them to observe traffic, check speedometer often. The goal is to blend in, not stand out. Practice on multi-lane roads at various times of day.",
  
  "Adjust speed for conditions": "Speed limit is for ideal conditions. In rain, reduce by 5-10 mph. In heavy rain, reduce by 10-15 mph. In fog, go as slow as needed to see. Wet leaves, construction, glare - all require slower speeds. Practice this judgement by asking: 'Given these conditions, what's a safe speed?' Help them think through the decision.",
  
  "Use cruise control on appropriate roads": "Cruise control maintains steady speed on highways without pedal work. Show them how to set it, adjust it, and cancel it. Practice on uncrowded highways. Explain when NOT to use it: rain, curves, hills, heavy traffic. Must be comfortable with gas/brake first. This prevents speeding tickets and improves fuel economy.",
  
  "Recognize and respond to speed limit changes": "Speed limit signs appear before the change. Watch for them constantly. Entering town? Slow down before the sign, not after. Leaving town? Accelerate after the sign. Practice identifying signs early (100+ yards ahead). Many teens miss speed changes - it's a major ticket cause. Make it a game: who sees the next sign first?",
  
  "Safe speeds for curves and hills": "Yellow advisory signs show recommended curve speed. Take them seriously - they're based on physics. Slow BEFORE the curve, not during it. On hills, gravity affects speed: accelerate going up, brake less going down. Practice this on winding roads. Point out when others go too fast and lose control in curves.",

  // Phase 4: Advanced Intersection Navigation
  "Multi-lane intersections": "Choose your lane early (1/4 mile before). Right lane exits right, left lane goes straight or left, middle lane goes straight. Signal in advance. Don't change lanes in intersection. Stay in your lane through the turn. Practice at major intersections during low traffic. Walk through it first if needed.",
  
  "Protected vs unprotected left turns": "Protected = green arrow, oncoming traffic has red. Go! Unprotected = circular green, yield to oncoming traffic. Wait in intersection, turn when safe. Flashing yellow arrow = yield and turn when clear. Practice both types. Point out the difference at various intersections. Some lights are protected-THEN-permissive.",
  
  "Roundabout entry and exit": "Slow down approaching (15-20 mph). Yield to traffic already in circle. Look left. When clear, enter and stay in your lane. Signal right to exit. Don't stop in roundabout unless traffic ahead stops. Practice during off-peak hours. Many drivers fear these - master them and they're safer than intersections.",
  
  "Complex traffic light patterns": "Some intersections have multiple signals: one for through traffic, one for turns. Teach them to identify which applies to them. Practice at intersections with multiple signal heads. If confused, default to most restrictive signal. Point out complex patterns during your drives. This prevents running reds accidentally.",
  
  "Pedestrian and cyclist awareness at intersections": "Before ANY turn, check crosswalks for pedestrians and cyclists. They have right-of-way. Look twice - they're easy to miss. Watch for pedestrians approaching crosswalk, not just in it. Check right before right turns, left before left turns. Practice at busy pedestrian areas. One saved life justifies extra caution.",

  // Phase 5: Highway Entry and Exit
  "Acceleration lane merging": "Use ENTIRE acceleration lane to match highway speed. Most crashes happen when drivers merge too slowly. Accelerate firmly (not dangerously). Check mirrors constantly. Look for a gap 4+ seconds big. Signal, shoulder check, merge smoothly. Practice on shorter ramps, then longer ones. Confidence comes with repetition.",
  
  "Match traffic speed before merging": "If highway traffic is doing 65 mph, you should be doing 60-65 when you merge. Merging at 45 mph is dangerous and causes crashes. Use the acceleration lane's full length. Check speedometer: highway speed minus 5 mph is ideal merge speed. Practice during light traffic first.",
  
  "Safe following distances at highway speeds": "At 60+ mph, use the 3-4 second rule. Pick a marker, count when lead car passes it. You should reach it after 3-4 seconds. This gives reaction time and stopping distance. Most tailgating happens on highways. Practice identifying safe gaps. Point out tailgaters as examples of what not to do.",
  
  "Exit ramp preparation and execution": "Know your exit 1 mile ahead. Move to right lane 1/2 mile before. Signal 500 feet before exit. Check mirror, then exit. DO NOT slow down until in deceleration lane. Check exit ramp speed sign (often 25-45 mph). Brake in the ramp, not on highway. Practice multiple exits.",
  
  "Lane positioning for upcoming exits": "If exit is on right, be in right lane at least 1/2 mile ahead. If left exit (rare), be in left lane. Don't wait until last second to change lanes. GPS should announce exit with time to prepare. Practice planning ahead: 'Exit in 2 miles, I'll move right after passing this truck.'",

  // Phase 5: Highway Maintenance
  "Consistent speed control": "On highway, maintain steady speed using cruise control or steady gas pressure. Don't speed up and slow down randomly - it's unsafe and wastes gas. Check speedometer every 10-15 seconds. Practice holding 60 mph (or limit) for several miles. Consistency makes you predictable to other drivers.",
  
  "Passing slower vehicles safely": "Check mirrors. Signal left. Shoulder check. Move to passing lane when clear. Pass quickly but legally. Signal right. Move back when you see passed vehicle in rearview mirror. Never pass on right unless traffic is stopped. Practice passing slower vehicles on multi-lane highways. Passing is highest-risk highway maneuver.",
  
  "Being passed by faster vehicles": "When someone passes you, maintain your speed. Don't speed up - that's illegal and dangerous. Don't slow down unless they're merging too close. Stay in your lane. Let aggressive drivers go - they're not your problem. Practice staying calm when passed. Your ego isn't worth a crash.",
  
  "Construction zone navigation": "Slow to posted work zone speed (usually 20 mph reduction). Merge early when lanes end - don't wait until cones force you. Watch for workers and equipment. Fines double in work zones. Stay off phone completely. Practice increased attention. Construction zones have high crash rates.",
  
  "Rest stop and service area access": "Identify rest area signs 1 mile ahead. Move to right lane. Signal. Use deceleration lane to slow down. Entering: watch for pedestrians. Exiting: use acceleration lane to build speed before merging. Practice 2-3 rest stops on a highway trip. These breaks are essential for long drives.",

  // Phase 6: Weather Driving
  "Rain driving": "First rain is most dangerous (oil on roads). Reduce speed by 5-10 mph. Increase following distance to 4-5 seconds. Avoid puddles (hydroplaning risk). Turn on headlights. If wipers are on, lights should be on. Test brakes gently in safe area. Practice in light rain first, then moderate rain. Never drive through deep water.",
  
  "Fog navigation": "Use low beams, NOT high beams (they reflect back). Slow down drastically - if you can't see 500 feet, go 25 mph or less. Follow the right edge line. Increase following distance to 5-6 seconds. Use fog lights if equipped. Pull over if visibility is near zero. Practice in light fog first.",
  
  "Snow and ice basics": "In Missouri winters: Black ice forms below 35°F on bridges first. Double or triple following distance. Accelerate/brake/turn very gently. If sliding, steer where you want to go and ease off gas. Practice in empty parking lot after snow. ABS brakes: press and hold, don't pump. This takes professional instruction.",
  
  "Hot weather considerations": "Check tire pressure monthly (especially summer). Underinflated tires can blow out. Watch temperature gauge - if overheating, pull over safely. Use AC sparingly on very hot days if engine struggles. Keep coolant topped off. Park in shade when possible. Summer is actually harder on cars than winter.",
  
  "Wind compensation techniques": "Strong crosswinds push the car sideways. Grip wheel firmly. Make small steering corrections into the wind. Slow down in extreme winds (30+ mph gusts). Be extra cautious on bridges and open areas. Large trucks create wind blasts when passing. Practice maintaining lane position in moderate wind first.",

  // Phase 6: Low Visibility Conditions
  "Night driving with proper light use": "Turn on headlights 30 minutes before sunset. Use high beams on dark roads with no oncoming traffic. Dim to low beams when within 500 feet of oncoming cars or following within 300 feet. Clean windshield and lights regularly. Reduce speed 5-10 mph at night. Practice in familiar areas first, then unfamiliar roads.",
  
  "Dawn and dusk adaptation": "Dawn and dusk have worst lighting - shadows make hazards hard to see. Turn on headlights. Use sun visor. Slow down slightly. Watch for deer (most active at dawn/dusk). Extra caution at intersections. Practice driving during these times to build confidence in changing light conditions.",
  
  "Driving into sun glare": "Use sun visor. Slow down if you can't see clearly. Increase following distance. Don't stare at sun. Use sunglasses. If blinded, slow down and pull over if needed. Clean windshield inside and out (smears make glare worse). Practice maintaining lane position when partially blinded by sun.",
  
  "Heavy rain visibility techniques": "Max wipers, headlights on. If you can't see road ahead, slow way down or pull over. Don't use hazards while driving (illegal in Missouri). Follow taillights ahead but maintain safe distance. Defog windshield. Pull over under overpass if visibility near zero. Practice decision-making: drive or wait?",
  
  "Proper use of high and low beam headlights": "Low beams: city driving, traffic present, rain/fog/snow. High beams: dark rural roads, no oncoming traffic. Switch to low when: within 500 feet of oncoming car, within 300 feet behind another car. Practice switching quickly. High beams help you see further, but blind others if misused.",

  // Phase 7: Hazard Recognition
  "Scan for potential dangers constantly": "Use a 12-15 second visual lead - look ahead about a block. Scan left-right-mirrors-ahead constantly. Watch for brake lights, cars pulling out, pedestrians, road debris. Develop a 'sixth sense' for danger. Practice calling out hazards: 'Ball in street, kid might follow.' This becomes automatic with practice.",
  
  "Identify aggressive or impaired drivers": "Warning signs: weaving, varying speed, tailgating, angry gestures, running lights/signs. Stay far away from these drivers. Don't engage or respond to aggression. Note their plate and call *55 if dangerous. Pull over if being followed. Practice identifying erratic drivers and creating space.",
  
  "Recognize road surface hazards": "Watch for: potholes, gravel, oil slicks (rainbow sheen), water puddles, ice patches, debris. Scan far ahead so you have time to avoid them. If unavoidable, slow down before hitting them, don't swerve suddenly. Practice calling out surface hazards during drives.",
  
  "Anticipate pedestrian and cyclist movements": "Assume pedestrians/cyclists might do something unexpected. Watch for: people near street, cyclists wobbling, kids playing, people on phones, people between parked cars. Give wide berth. Slow down near them. Make eye contact when possible. Practice defensive driving around vulnerable road users.",
  
  "Spot mechanical problems in other vehicles": "Warning signs: smoking, dragging parts, flat tire, driver struggling to control car. Give these vehicles extra space. Be prepared for them to stop suddenly. Practice observing other vehicles for problems. This situational awareness prevents crashes.",

  // Phase 7: Emergency Responses
  "Tire blowout recovery": "If tire blows: Grip wheel firmly. DON'T brake hard. DON'T jerk wheel. Ease off gas. Let car slow naturally. Steer straight. When slow (30 mph), brake gently. Pull off road safely. This is counter-intuitive - practice the procedure mentally. Consider professional skid training for hands-on practice.",
  
  "Brake failure response": "If brakes fail: Pump brake pedal rapidly (may build pressure). Shift to lower gear (engine braking). Apply parking brake gradually. Look for escape route (uphill, empty lane). Warn others with horn/flashers. This is rare with modern cars but know the procedure. Practice mentally.",
  
  "Steering failure compensation": "If steering fails (extremely rare): Take foot off gas. Activate hazards. Use slight brake pressure to slow. Look for safe place to coast to stop. Don't panic. Most 'failures' are power steering only - you can still steer with muscle. Practice turning wheel with car off to feel the difference.",
  
  "Skid recovery techniques": "If rear wheels skid: Ease off gas. Steer where you want to go (not where you're sliding). Don't brake hard. Don't overcorrect. If front wheels skid: Ease off gas. Steer straight until traction returns. This takes practice - consider professional skid school on wet skid pad.",
  
  "Safe pullover for emergencies": "Signal right. Check mirrors. Pull as far right as possible (ideally off pavement). Activate hazards. If on highway, stay in car with seatbelt on (safer than standing outside). Call for help. Place triangles 100 feet back if you have them. Practice pulling over in various scenarios.",

  // Phase 7: Vehicle Breakdown Procedures
  "Safe roadside stopping": "If car breaks down: Get as far off road as possible. Turn wheels away from traffic (if hit from behind, car rolls away from road). Activate hazards. Exit passenger side if possible. Stand away from car behind guardrail. Never stand in road or between car and traffic.",
  
  "Hazard light activation": "Red triangle button activates hazards (all turn signals flash). Use when: stopped on roadside, emergency situation, warning others. Practice finding and activating without looking. Know that hazards drain battery if left on long. Turn on immediately when pulling over for breakdown.",
  
  "Emergency triangle or flare placement": "If you have reflective triangles: place one 10 feet behind car, one 100 feet back, one 200 feet back (farther on highways). This warns approaching traffic. Flares: light and place 100+ feet back. Most drivers don't have these - consider buying a safety kit with triangles.",
  
  "When and how to call for help": "Call *55 for highway patrol, or 911 for local police/emergency. Give location (mile marker, exit, landmarks). Describe problem and danger level. Stay in car or behind guardrail. Have your phone charged. Consider roadside assistance membership (AAA, etc.). Practice making a mock emergency call.",
  
  "Basic tire changing knowledge": "Know jack location and how to use it. Practice in driveway once. Loosen lugs before jacking, tighten after. Jack on solid ground. If unsafe location, call for help instead. Many modern cars have inflator kit instead of spare. Check your car's equipment. YouTube has good videos - watch together.",

  // Phase 8: Route Planning and Navigation
  "GPS and map reading while driving safely": "Set GPS before driving. Glance at it only 1 second at a time. Use audio directions primarily. If you miss a turn, let GPS recalculate - never turn around dangerously. Practice using GPS in familiar areas first. Teach them to preview route before starting. Phone should be mounted, never handheld.",
  
  "Alternative route planning": "Know 2-3 ways to common destinations (school, work, home). If main route is blocked/slow, use alternate. Practice discussing route options: 'Highway is fast but busy. Side streets are slower but calmer. Which should we take?' Decision-making is key to independent driving.",
  
  "Unfamiliar area navigation": "In unfamiliar areas: Slow down. Pay extra attention to signs. Don't make sudden turns. If lost, pull over safely to check directions. Practice by deliberately driving somewhere new together. Discuss strategies: 'I don't know this area. What should I do differently?'",
  
  "Parking in crowded areas": "Crowded lots require extra caution: drive slowly (5-10 mph), watch for backing cars, pedestrians, and car doors opening. Park farther away for easier spaces. Avoid peak times when learning. Practice at mall during low-traffic times first. Point out bad parking lot driving during regular visits.",
  
  "Time management for trips": "Plan to arrive 10-15 minutes early. Account for traffic, parking time, walking. Use GPS time estimate plus 20%. Better to arrive early than rush and drive dangerously. Practice calculating trip time: 'We leave at 2:00, arrive at 2:40, event starts at 3:00. Good?' This prevents rushed driving.",

  // Phase 8: Passenger and Distraction Management
  "Maintaining focus with friends in car": "Friends are HUGE distraction. Practice with one quiet friend first. Set rules: moderate volume, no horseplay, driver focuses on road. If passengers are distracting, tell them to stop. Pull over if needed. Discuss crash statistics with teen passengers. Missouri has GDL passenger limits - follow them.",
  
  "Cell phone discipline": "Missouri law: No handheld phone use under 21. Even hands-free is distracting. Best practice: phone silent and out of reach while driving. Calls can wait. Texts can wait. Practice leaving phone in back seat or in 'do not disturb' mode. Model this behavior yourself. One text isn't worth a life.",
  
  "Music and entertainment system control": "Set music/playlist before driving. Learn controls by feel. Quick glances (1 second) only when needed. On highway, preset stations and use steering wheel controls. Never browse phone for music while driving. If passengers adjust music, that's fine. Practice controlling music without looking at screen.",
  
  "Eating/drinking while driving safely": "Best practice: don't eat while driving. If you must: simple foods only (nothing requiring two hands), drinks in cupholder with straw/lid. Stop eating when traffic gets complex. Never eat during critical maneuvers. Practice coffee sipping at stop lights only. Food mess causes crashes.",
  
  "Managing multiple passengers": "Missouri GDL: first 6 months of intermediate license = max 1 non-family under 19. After 6 months = max 3. Extra passengers multiply crash risk 3-4x. As parent, you can set stricter rules. Practice with family members before allowing friends. Discuss expectations before first friend ride.",

  // Phase 8: Advanced Judgment Calls
  "When NOT to drive": "Teach them to recognize when they're unfit to drive: very tired, emotional, sick, distracted by life events. Drowsy driving kills as much as drunk driving. Encourage them to call you for ride - no questions asked, no punishment. Practice decision-making: 'You're exhausted after late shift. Drive or call for ride?'",
  
  "Recognizing personal skill limitations": "Teach humility: 'I'm not comfortable with this yet' is mature, not weak. Don't drive in conditions beyond your skill: heavy snow, dense fog, aggressive traffic. Build skills gradually. Discuss scenarios: 'Blizzard warning tonight. Should you drive to friend's house?' Right answer: No, reschedule.",
  
  "Refusing rides from impaired drivers": "Critical life skill: NEVER ride with impaired driver, even if it's their only way home. Call for ride, use Uber, call you. Discuss scenarios and practice saying 'No, I'll call for ride.' Promise no punishment for calling you. Many teens die because they didn't want to 'make a scene.'",
  
  "Highway vs local route decisions": "Highway is faster but more intense. Local roads are slower but calmer. Teach them to choose based on: comfort level, traffic, time pressure, weather. Practice decision-making: 'Rush hour traffic on highway or slow local roads?' Discuss pros/cons. Good judgement develops over time.",
  
  "Weather-related driving decisions": "Sometimes best decision is DON'T DRIVE. Severe weather (ice, blizzard, flooding) = stay home. If caught in bad weather, pull over safely and wait. Practice evaluating weather: check forecast, road conditions. Discuss: 'Freezing rain tonight. Should you go to that party?' Mature answer: Stay home.",
};

// Function to find teaching notes by skill title (partial match)
export function findTeachingNotes(skillTitle: string): string | null {
  // Try exact match first
  if (teachingNotesLookup[skillTitle]) {
    return teachingNotesLookup[skillTitle];
  }
  
  // Try partial match (skill title contains or is contained by key)
  const normalizedTitle = skillTitle.toLowerCase();
  for (const [key, notes] of Object.entries(teachingNotesLookup)) {
    const normalizedKey = key.toLowerCase();
    if (normalizedTitle.includes(normalizedKey) || normalizedKey.includes(normalizedTitle)) {
      return notes;
    }
  }
  
  return null;
}

