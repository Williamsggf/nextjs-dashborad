import bcrypt from "bcryptjs";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function seedUsers() {
  await sql`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT true
    );
  `;
}

async function seedCompanies() {
  await sql`
    CREATE TABLE IF NOT EXISTS companies (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      name VARCHAR(255) NOT NULL,
      cnpj VARCHAR(14) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

async function seedAddresses() {
  await sql`
    CREATE TABLE IF NOT EXISTS addresses (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      company_id UUID REFERENCES companies(id) NOT NULL,
      street VARCHAR(255) NOT NULL,
      number VARCHAR(9) NOT NULL,
      complement VARCHAR(255),
      district VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      state VARCHAR(2) NOT NULL,
      zip_code VARCHAR(9) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

async function seedDepartments() {
  await sql`
    CREATE TABLE IF NOT EXISTS departments (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      company_id UUID REFERENCES companies(id) NOT NULL,
      user_id UUID REFERENCES users(id) NOT NULL,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

async function seedStaff() {
  await sql`
    CREATE TABLE IF NOT EXISTS staff (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      department_id UUID REFERENCES departments(id) NOT NULL,
      user_id UUID REFERENCES users(id) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

async function seedTimeLogs() {
  await sql`
    CREATE TABLE IF NOT EXISTS time_logs (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      type VARCHAR(20) NOT NULL CHECK (type IN (
        'check_in',
        'break_start',
        'break_end',
        'check_out'
      )),
      date DATE NOT NULL,
      time TIME NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

async function seedInvoices() {
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

async function seedCustomers() {
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(7) NOT NULL UNIQUE, -- ex: '2025-04'
      amount INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export async function GET() {
  try {
/*     await seedUsers();
    await seedCompanies();
    await seedAddresses(); */
    await seedDepartments();
    await seedStaff();
    await seedTimeLogs();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json({ error }, { status: 500 });
  }
}
