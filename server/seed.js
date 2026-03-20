require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI not found in .env');
  process.exit(1);
}

// ── Realistic data pools ──────────────────────────────────────────────────────

const FIRST_NAMES = [
  'Aria',
  'Maya',
  'Zoe',
  'Nadia',
  'Priya',
  'Sofia',
  'Elena',
  'Layla',
  'Chloe',
  'Aisha',
];
const LAST_NAMES = [
  'Patel',
  'Kim',
  'Nguyen',
  'Rivera',
  'Chen',
  'Okafor',
  'Sharma',
  'Lopez',
  'Hassan',
  'Park',
];

const ALL_SYMPTOMS = [
  'Fatigue',
  'Headache',
  'Cramps',
  'Bloating',
  'Nausea',
  'Brain fog',
  'Joint pain',
  'Anxiety',
  'Insomnia',
  'Skin flare',
];

const FLOW_OPTIONS = ['None', 'Light', 'Medium', 'Heavy', 'Spotting'];

const MEAL_POOLS = [
  ['Oatmeal with berries', 'Grilled chicken salad', 'Lentil soup with bread'],
  ['Greek yogurt parfait', 'Turkey wrap', 'Salmon with roasted vegetables'],
  ['Avocado toast', 'Quinoa bowl', 'Stir-fried tofu with rice'],
  ['Smoothie bowl', 'Hummus with pita', 'Pasta with marinara sauce'],
  ['Overnight oats', 'Vegetable curry', 'Baked cod with sweet potato'],
  ['Scrambled eggs', 'Caesar salad', 'Black bean tacos'],
  ['Banana pancakes', 'Sushi rolls', 'Minestrone soup'],
  ['Chia pudding', 'Caprese sandwich', 'Grilled shrimp with quinoa'],
];

const MEDICATIONS = [
  { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', reminderTime: '08:00' },
  { name: 'Vitamin D3', dosage: '2000 IU', frequency: 'Once daily', reminderTime: '09:00' },
  { name: 'Spironolactone', dosage: '100mg', frequency: 'Once daily', reminderTime: '20:00' },
  { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed', reminderTime: '12:00' },
  { name: 'Levothyroxine', dosage: '50mcg', frequency: 'Once daily (AM)', reminderTime: '07:00' },
  { name: 'Iron Supplement', dosage: '65mg', frequency: 'Once daily', reminderTime: '13:00' },
  { name: 'Magnesium', dosage: '400mg', frequency: 'Before bedtime', reminderTime: '21:30' },
  { name: 'Omega-3', dosage: '1000mg', frequency: 'Once daily', reminderTime: '08:30' },
];

const MED_NOTES = [
  'Take with food to reduce stomach upset.',
  'Avoid taking with calcium-rich foods.',
  'Store at room temperature away from light.',
  'Do not exceed recommended dose.',
  'Take on an empty stomach for best absorption.',
  'May cause drowsiness — avoid driving after taking.',
];

const DOCTOR_NAMES = [
  'Dr. Rachel Chen',
  'Dr. Priya Nair',
  'Dr. James Okafor',
  'Dr. Sofia Martinez',
  'Dr. Emily Tanaka',
  'Dr. David Kim',
];

const SPECIALTIES = [
  'Gynecologist',
  'Endocrinologist',
  'General Practitioner',
  'Rheumatologist',
  'Dermatologist',
  'Psychiatrist',
];

const VISIT_NOTES = [
  'Routine check-up. Blood pressure normal. Recommended continued monitoring.',
  'Follow-up on hormone panel results. Adjusted dosage as discussed.',
  'Discussed fatigue and sleep issues. Ordered thyroid panel.',
  'Reviewed lab work. Vitamin D levels low — supplementation increased.',
  'Annual physical. Weight stable. Reviewed medication adherence.',
  'Discussed PCOS management plan. Lifestyle changes recommended.',
  'Skin flare assessment. Prescribed topical treatment for 4 weeks.',
  'Mental health check-in. Sleep hygiene tips provided.',
];

const PRESCRIPTIONS_POOL = [
  ['Metformin 500mg', 'Vitamin D3 2000 IU'],
  ['Spironolactone 100mg'],
  ['Levothyroxine 50mcg', 'Iron Supplement 65mg'],
  ['Ibuprofen 400mg as needed'],
  ['Magnesium 400mg', 'Omega-3 1000mg'],
  [],
];

// ── Utility helpers ───────────────────────────────────────────────────────────

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function dateStr(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function dateObj(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

// ── Main seed function ────────────────────────────────────────────────────────

async function seed() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();

    // Collections
    const usersCol = db.collection('users');
    const logsCol = db.collection('daily_logs');
    const medsCol = db.collection('medications');
    const adherenceCol = db.collection('adherence_logs');
    const visitsCol = db.collection('doctor_visits');

    // ── Clear existing seed data ──────────────────────────────────────────────
    console.log('Clearing previous seed data...');

    // Find existing seed users (tagged with isSeed: true) or users with seed emails
    const existingSeedUsers = await usersCol.find({ isSeed: true }).toArray();
    const seedUserIds = existingSeedUsers.map((u) => u._id);

    if (seedUserIds.length > 0) {
      await logsCol.deleteMany({ userId: { $in: seedUserIds } });
      await medsCol.deleteMany({ userId: { $in: seedUserIds } });
      await adherenceCol.deleteMany({ userId: { $in: seedUserIds } });
      await visitsCol.deleteMany({ userId: { $in: seedUserIds } });
      await usersCol.deleteMany({ _id: { $in: seedUserIds } });
      console.log(`Cleared data for ${seedUserIds.length} previous seed users.`);
    }

    // ── Hash the shared password ──────────────────────────────────────────────
    const passwordHash = bcrypt.hashSync('HealIO2024!', 10);

    // ── Create 5 synthetic users ──────────────────────────────────────────────
    const userData = [];
    for (let i = 0; i < 5; i++) {
      const firstName = FIRST_NAMES[i];
      const lastName = LAST_NAMES[i];
      userData.push({
        _id: new ObjectId(),
        firstName,
        lastName,
        username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@healio.demo`,
        password: passwordHash,
        isSeed: true,
        createdAt: dateObj(220 + i),
      });
    }

    const usersResult = await usersCol.insertMany(userData);
    console.log(`Inserted ${usersResult.insertedCount} users`);

    // ── Per-user data generation ──────────────────────────────────────────────
    const allLogs = [];
    const allMeds = [];
    const allAdherence = [];
    const allVisits = [];

    for (const user of userData) {
      const userId = user._id;

      // ── 210 daily logs ──────────────────────────────────────────────────────
      for (let d = 0; d < 210; d++) {
        const symptomCount = rand(0, 4);
        const symptoms = pickRandom(ALL_SYMPTOMS, symptomCount);
        const mealSet = MEAL_POOLS[d % MEAL_POOLS.length];
        const flowIdx = rand(0, FLOW_OPTIONS.length - 1);

        allLogs.push({
          userId,
          date: dateStr(d),
          mood: rand(1, 10),
          energy: rand(1, 10),
          sleep: rand(4, 12),
          pain: rand(1, 10),
          cramp: rand(1, 10),
          symptoms,
          meals: mealSet,
          flow: FLOW_OPTIONS[flowIdx],
          notes:
            d % 7 === 0
              ? 'Feeling a bit off today. Took it easy and stayed hydrated.'
              : d % 5 === 0
                ? 'Good energy levels today. Completed workout and meal prepped.'
                : '',
          createdAt: dateObj(d),
        });
      }

      // ── 5 medications ───────────────────────────────────────────────────────
      const chosenMeds = pickRandom(MEDICATIONS, 5);
      const userMedDocs = chosenMeds.map((med, idx) => ({
        _id: new ObjectId(),
        userId,
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        reminderTime: med.reminderTime,
        notes: MED_NOTES[idx % MED_NOTES.length],
        active: idx < 4, // 4 active, 1 inactive
        createdAt: dateObj(200 - idx * 10),
      }));
      allMeds.push(...userMedDocs);

      // ── 42 adherence logs per medication (5 meds × 42 days = 210 per user) ──
      for (const med of userMedDocs) {
        for (let d = 0; d < 42; d++) {
          allAdherence.push({
            userId,
            medId: med._id,
            date: dateStr(d),
            taken: Math.random() > 0.15, // ~85% adherence rate
            createdAt: dateObj(d),
          });
        }
      }

      // ── 6 doctor visits ─────────────────────────────────────────────────────
      for (let v = 0; v < 6; v++) {
        const visitDaysAgo = 30 + v * 28;
        const followUpDays = visitDaysAgo - 28;
        const doctorIdx = v % DOCTOR_NAMES.length;
        const specialtyIdx = v % SPECIALTIES.length;
        const prescriptions = PRESCRIPTIONS_POOL[v % PRESCRIPTIONS_POOL.length];

        allVisits.push({
          userId,
          doctorName: DOCTOR_NAMES[doctorIdx],
          specialty: SPECIALTIES[specialtyIdx],
          visitDate: dateStr(visitDaysAgo),
          notes: VISIT_NOTES[v % VISIT_NOTES.length],
          prescriptions,
          followUpDate: followUpDays > 0 ? dateStr(followUpDays) : null,
          createdAt: dateObj(visitDaysAgo),
        });
      }
    }

    // ── Bulk insert all records ───────────────────────────────────────────────
    const logsResult = await logsCol.insertMany(allLogs);
    const medsResult = await medsCol.insertMany(allMeds);
    const adherenceResult = await adherenceCol.insertMany(allAdherence);
    const visitsResult = await visitsCol.insertMany(allVisits);

    // ── Summary ──────────────────────────────────────────────────────────────
    const totalRecords =
      usersResult.insertedCount +
      logsResult.insertedCount +
      medsResult.insertedCount +
      adherenceResult.insertedCount +
      visitsResult.insertedCount;

    console.log('\n=== Seed Complete ===');
    console.log(`  Users:          ${usersResult.insertedCount}`);
    console.log(
      `  Daily logs:     ${logsResult.insertedCount}  (${userData.length} users × 210 days)`
    );
    console.log(
      `  Medications:    ${medsResult.insertedCount}  (${userData.length} users × 5 meds)`
    );
    console.log(
      `  Adherence logs: ${adherenceResult.insertedCount}  (${userData.length} users × 5 meds × 42 days)`
    );
    console.log(
      `  Doctor visits:  ${visitsResult.insertedCount}  (${userData.length} users × 6 visits)`
    );
    console.log(`  ─────────────────────────────`);
    console.log(`  TOTAL RECORDS:  ${totalRecords}`);
    console.log('\nSeed users created:');
    userData.forEach((u) => {
      console.log(`  ${u.email}  /  password: HealIO2024!`);
    });
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB.');
  }
}

seed();
