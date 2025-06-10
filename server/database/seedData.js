import db from './init.js';

export function seedDatabase() {
  try {
    // Check if data already exists
    const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (existingUsers.count > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }

    console.log('Seeding database with sample data...');

    // Sample donors
    const donors = [
      {
        email: 'donor1@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'donor',
        first_name: 'John',
        last_name: 'Smith',
        phone: '555-0101',
        date_of_birth: '1985-03-15',
        gender: 'male',
        blood_type: 'O+',
        location_city: 'New York',
        location_state: 'NY',
        location_country: 'United States',
        is_active: 1,
        is_eligible: 1
      },
      {
        email: 'donor2@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'donor',
        first_name: 'Sarah',
        last_name: 'Johnson',
        phone: '555-0102',
        date_of_birth: '1990-07-22',
        gender: 'female',
        blood_type: 'A+',
        location_city: 'Los Angeles',
        location_state: 'CA',
        location_country: 'United States',
        is_active: 1,
        is_eligible: 1
      },
      {
        email: 'donor3@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'donor',
        first_name: 'Michael',
        last_name: 'Brown',
        phone: '555-0103',
        date_of_birth: '1988-11-10',
        gender: 'male',
        blood_type: 'B+',
        location_city: 'Chicago',
        location_state: 'IL',
        location_country: 'United States',
        is_active: 1,
        is_eligible: 1
      }
    ];

    // Sample recipients
    const recipients = [
      {
        email: 'recipient1@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'recipient',
        first_name: 'Emily',
        last_name: 'Davis',
        phone: '555-0201',
        date_of_birth: '1992-05-18',
        gender: 'female',
        blood_type: 'A+',
        location_city: 'New York',
        location_state: 'NY',
        location_country: 'United States',
        is_active: 1,
        is_eligible: 1
      },
      {
        email: 'recipient2@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'recipient',
        first_name: 'David',
        last_name: 'Wilson',
        phone: '555-0202',
        date_of_birth: '1987-09-25',
        gender: 'male',
        blood_type: 'O+',
        location_city: 'Boston',
        location_state: 'MA',
        location_country: 'United States',
        is_active: 1,
        is_eligible: 1
      }
    ];

    // Insert users
    const insertUser = db.prepare(`
      INSERT INTO users (
        email, password, role, first_name, last_name, phone, date_of_birth,
        gender, blood_type, location_city, location_state, location_country,
        is_active, is_eligible
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const userIds = [];
    
    [...donors, ...recipients].forEach(user => {
      const result = insertUser.run(
        user.email, user.password, user.role, user.first_name, user.last_name,
        user.phone, user.date_of_birth, user.gender, user.blood_type,
        user.location_city, user.location_state, user.location_country,
        user.is_active, user.is_eligible
      );
      userIds.push({ id: result.lastInsertRowid, role: user.role, blood_type: user.blood_type });
    });

    // Sample donations
    const donorIds = userIds.filter(u => u.role === 'donor');
    const donations = [
      {
        donor_id: donorIds[0].id,
        type: 'blood',
        blood_type: 'O+',
        quantity: 2,
        unit: 'units',
        urgency: 'normal',
        status: 'available'
      },
      {
        donor_id: donorIds[1].id,
        type: 'blood',
        blood_type: 'A+',
        quantity: 1,
        unit: 'units',
        urgency: 'high',
        status: 'available'
      },
      {
        donor_id: donorIds[2].id,
        type: 'organ',
        organ_type: 'kidney',
        quantity: 1,
        unit: 'units',
        urgency: 'critical',
        status: 'available'
      }
    ];

    const insertDonation = db.prepare(`
      INSERT INTO donations (
        donor_id, type, organ_type, blood_type, quantity, unit, urgency, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const donationIds = [];
    donations.forEach(donation => {
      const result = insertDonation.run(
        donation.donor_id, donation.type, donation.organ_type || null,
        donation.blood_type || null, donation.quantity, donation.unit,
        donation.urgency, donation.status
      );
      donationIds.push(result.lastInsertRowid);
    });

    // Sample requests
    const recipientIds = userIds.filter(u => u.role === 'recipient');
    const requests = [
      {
        recipient_id: recipientIds[0].id,
        type: 'blood',
        blood_type: 'A+',
        quantity: 1,
        unit: 'units',
        urgency: 'high',
        status: 'active',
        medical_justification: 'Emergency surgery required due to accident'
      },
      {
        recipient_id: recipientIds[1].id,
        type: 'blood',
        blood_type: 'O+',
        quantity: 2,
        unit: 'units',
        urgency: 'normal',
        status: 'active',
        medical_justification: 'Scheduled surgery for chronic condition'
      }
    ];

    const insertRequest = db.prepare(`
      INSERT INTO requests (
        recipient_id, type, organ_type, blood_type, quantity, unit,
        urgency, status, medical_justification
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const requestIds = [];
    requests.forEach(request => {
      const result = insertRequest.run(
        request.recipient_id, request.type, request.organ_type || null,
        request.blood_type || null, request.quantity, request.unit,
        request.urgency, request.status, request.medical_justification
      );
      requestIds.push(result.lastInsertRowid);
    });

    // Create some matches
    const insertMatch = db.prepare(`
      INSERT INTO matches (
        donation_id, request_id, compatibility_score, distance_km, status
      ) VALUES (?, ?, ?, ?, ?)
    `);

    // Match A+ donation with A+ request
    insertMatch.run(donationIds[1], requestIds[0], 95, 25, 'pending');
    
    // Match O+ donation with O+ request
    insertMatch.run(donationIds[0], requestIds[1], 90, 50, 'pending');

    console.log('Database seeded successfully with sample data');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}