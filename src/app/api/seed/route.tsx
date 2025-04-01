import { NextResponse } from 'next/server';
import { faker } from '@faker-js/faker';
import { connectDB } from '@/lib/mongodb';

import Doctor from '@/models/Doctor';
import Nurse from '@/models/Nurse';
import Patient from '@/models/Patient';
import Appointment from '@/models/Appointment';
import Insurance from '@/models/Insurance';

const allWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export async function GET() {
  await connectDB();

  // Optional: clear existing data
  // await Promise.all([
  //   Doctor.deleteMany(),
  //   Nurse.deleteMany(),
  //   Patient.deleteMany(),
  //   Appointment.deleteMany(),
  //   Insurance.deleteMany(),
  // ]);

  // Seed Doctors
  const doctors = await Doctor.insertMany(
    Array.from({ length: 10 }).map(() => {
      const availableDays = faker.helpers.arrayElements(allWeekdays, faker.number.int({ min: 3, max: 6 }));
      const shift = faker.helpers.arrayElement(['Day', 'Night', 'Custom']);
      const visitStartHour = shift === 'Night'
        ? faker.number.int({ min: 18, max: 20 })
        : faker.number.int({ min: 8, max: 11 });

      const visitEndHour = visitStartHour + faker.number.int({ min: 4, max: 6 });

      return {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        specialty: faker.helpers.arrayElement(['Cardiology', 'Neurology', 'Oncology', 'Pediatrics']),
        department: faker.helpers.arrayElement(['A', 'B', 'C']),
        licenseNumber: faker.string.alphanumeric(8),
        yearsOfExperience: faker.number.int({ min: 3, max: 30 }),
        bio: faker.lorem.sentence(),
        shift,
        availableDays,
        visitStartTime: `${visitStartHour.toString().padStart(2, '0')}:00`,
        visitEndTime: `${visitEndHour.toString().padStart(2, '0')}:00`,
      };
    })
  );

  // Seed Nurses
  const nurses = await Nurse.insertMany(
    Array.from({ length: 8 }).map((_, i) => {
      const shift = i < 4 ? 'Day' : 'Night';
      const availableDays = faker.helpers.arrayElements(allWeekdays, faker.number.int({ min: 3, max: 6 }));
      const shiftStartHour = shift === 'Night'
        ? faker.number.int({ min: 18, max: 20 })
        : faker.number.int({ min: 7, max: 10 });
      const shiftEndHour = shiftStartHour + faker.number.int({ min: 4, max: 6 });

      return {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        department: faker.helpers.arrayElement(['General', 'ER', 'ICU']),
        licenseNumber: faker.string.alphanumeric(8),
        shift,
        availableDays,
        shiftStartTime: `${shiftStartHour.toString().padStart(2, '0')}:00`,
        shiftEndTime: `${shiftEndHour.toString().padStart(2, '0')}:00`,
      };
    })
  );

  // Seed Patients
  const patients = await Patient.insertMany(
    Array.from({ length: 20 }).map(() => ({
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      dateOfBirth: faker.date.birthdate(),
      gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
      address: faker.location.streetAddress(),
      emergencyContact: faker.phone.number(),
      medicalHistory: [faker.lorem.word(), faker.lorem.word()],
      insuranceDocs: [],
    }))
  );

  // Seed Appointments
  await Appointment.insertMany(
    Array.from({ length: 15 }).map(() => ({
      patient: faker.helpers.arrayElement(patients)._id,
      doctor: faker.helpers.arrayElement(doctors)._id,
      nurse: faker.helpers.arrayElement(nurses)._id,
      appointmentDate: faker.date.soon({ days: 5 }),
      reason: faker.lorem.words(3),
      status: faker.helpers.arrayElement(['Scheduled', 'Completed', 'Cancelled']),
    }))
  );

  // Seed Insurance with realistic file paths
  await Insurance.insertMany(
    Array.from({ length: 10 }).map(() => {
      const fileName = `${Date.now()}-${faker.string.alphanumeric(6)}.pdf`;
      return {
        patient: faker.helpers.arrayElement(patients)._id,
        providerName: faker.company.name(),
        policyNumber: faker.finance.accountNumber(),
        validTill: faker.date.future(),
        filePath: `/uploads/insurance/${fileName}`,
      };
    })
  );

  return NextResponse.json({ message: 'Healthcare database seeded with fake data ✅' });
}
