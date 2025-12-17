// MongoDB initialization script for public_services_db

// Switch to the target database
db = db.getSiblingDB('public_services_db');

// -------------------------------------------------------
// 1. Insert Services
// -------------------------------------------------------

const services = [
  {
    service_code: "TAX001",
    name: "Income Tax Filing",
    description: "File your annual income tax return",
    detailed_description: "Complete income tax filing service for individuals and businesses.",
    type: "TAX_CERTIFICATE",
    category: "TAXATION",
    required_docs: ["ID Proof", "Income Documents", "Bank Statements"],
    processing_time_days: 7,
    fees: 50.00,
    eligibility_criteria: ["Must be a resident", "Income above minimum threshold"],
    available_online: true,
    online_portal_url: "https://tax-portal.example.com",
    is_active: true,
    created_date: new Date(),
    last_updated: new Date()
  },
  {
    service_code: "LIC001",
    name: "Business License Renewal",
    description: "Renew your business license",
    detailed_description: "Annual business license renewal service.",
    type: "BUSINESS_REGISTRATION",
    category: "BUSINESS",
    required_docs: ["Current License", "Tax Certificate", "Insurance Proof"],
    processing_time_days: 5,
    fees: 75.00,
    eligibility_criteria: ["Active business license", "Tax compliant"],
    available_online: false,
    is_active: true,
    created_date: new Date(),
    last_updated: new Date()
  },
  {
    service_code: "PERM001",
    name: "Building Permit Application",
    description: "Apply for construction building permits",
    detailed_description: "Submit building permit applications with inspection scheduling.",
    type: "BUILDING_PERMIT",
    category: "CONSTRUCTION",
    required_docs: ["Site Plans", "Architectural Drawings", "Land Deed", "Environmental Assessment"],
    processing_time_days: 15,
    fees: 200.00,
    eligibility_criteria: ["Verified land ownership", "Zoning compliance"],
    available_online: true,
    online_portal_url: "https://permits.example.com",
    is_active: true,
    created_date: new Date(),
    last_updated: new Date()
  },
  {
    service_code: "CERT001",
    name: "Birth Certificate Issuance",
    description: "Request official birth certificates",
    detailed_description: "Apply for certified copies of birth certificates.",
    type: "BIRTH_CERTIFICATE",
    category: "CIVIL_REGISTRY",
    required_docs: ["Valid ID", "Application Form"],
    processing_time_days: 3,
    fees: 20.00,
    eligibility_criteria: ["Original registration must exist"],
    available_online: false,
    is_active: true,
    created_date: new Date(),
    last_updated: new Date()
  },
  {
    service_code: "PASS001",
    name: "Passport Application",
    description: "Apply for passport services",
    detailed_description: "Application, issuance, and renewal services with verification.",
    type: "PASSPORT_RENEWAL",
    category: "IDENTIFICATION",
    required_docs: ["Birth Certificate", "Citizenship Proof", "Address Proof", "Photos"],
    processing_time_days: 30,
    fees: 150.00,
    eligibility_criteria: ["Citizen", "Adult or guardian approval"],
    available_online: false,
    is_active: true,
    created_date: new Date(),
    last_updated: new Date()
  },
  {
    service_code: "DEATH001",
    name: "Death Certificate Issuance",
    description: "Request official death certificates",
    detailed_description: "Apply for certified copies of death certificates.",
    type: "DEATH_CERTIFICATE",
    category: "CIVIL_REGISTRY",
    required_docs: ["Valid ID", "Proof of Relationship", "Death Notification"],
    processing_time_days: 5,
    fees: 25.00,
    eligibility_criteria: ["Legal guardian or immediate family"],
    available_online: false,
    is_active: true,
    created_date: new Date(),
    last_updated: new Date()
  }
];

db.government_services.insertMany(services);

// -------------------------------------------------------
// 2. Retrieve service IDs as strings
// -------------------------------------------------------

const TAX001 = db.government_services.findOne({ service_code: "TAX001" })._id.toString();
const LIC001 = db.government_services.findOne({ service_code: "LIC001" })._id.toString();
const PERM001 = db.government_services.findOne({ service_code: "PERM001" })._id.toString();
const CERT001 = db.government_services.findOne({ service_code: "CERT001" })._id.toString();
const PASS001 = db.government_services.findOne({ service_code: "PASS001" })._id.toString();
const DEATH001 = db.government_services.findOne({ service_code: "DEATH001" })._id.toString();

// -------------------------------------------------------
// 3. Insert Service Locations using cached IDs
// -------------------------------------------------------

db.service_locations.insertMany([
  {
    locationCode: "LOC001",
    name: "Central City Office",
    address: "123 Government Plaza, Suite 100",
    city: "Central City",
    state: "State A",
    zipCode: "12345",
    phone: "(555) 123-4567",
    mail: "central@example.gov",
    website: "https://central.example.gov",
    operating_hours: [
      "Monday-Friday: 9:00 AM - 5:00 PM",
      "Saturday: 10:00 AM - 2:00 PM",
      "Sunday: Closed"
    ],
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    available_services: [TAX001, CERT001, PASS001, DEATH001]
  },
  {
    locationCode: "LOC002",
    name: "North District Office",
    address: "456 Public Services Blvd",
    city: "North Valley",
    state: "State A",
    zipCode: "12346",
    phone: "(555) 234-5678",
    mail: "north@example.gov",
    website: "https://north.example.gov",
    operating_hours: [
      "Monday-Friday: 8:00 AM - 6:00 PM",
      "Saturday: 9:00 AM - 1:00 PM",
      "Sunday: Closed"
    ],
    coordinates: { latitude: 40.7580, longitude: -73.9855 },
    available_services: [LIC001, PERM001, TAX001]
  },
  {
    locationCode: "LOC003",
    name: "South District Office",
    address: "789 Service Center Lane",
    city: "South Bay",
    state: "State B",
    zipCode: "54321",
    phone: "(555) 345-6789",
    mail: "south@example.gov",
    website: "https://south.example.gov",
    operating_hours: [
      "Monday-Friday: 9:00 AM - 5:00 PM",
      "Saturday: Closed",
      "Sunday: Closed"
    ],
    coordinates: { latitude: 40.6501, longitude: -73.9496 },
    available_services: [CERT001, PERM001, DEATH001]
  },
  {
    locationCode: "LOC004",
    name: "East County Office",
    address: "321 Commerce Street",
    city: "East County",
    state: "State C",
    zipCode: "67890",
    phone: "(555) 456-7890",
    mail: "east@example.gov",
    website: "https://east.example.gov",
    operating_hours: [
      "Monday-Friday: 10:00 AM - 4:00 PM",
      "Saturday: 10:00 AM - 2:00 PM",
      "Sunday: Closed"
    ],
    coordinates: { latitude: 40.7282, longitude: -74.0076 },
    available_services: [LIC001, PASS001, TAX001]
  }
]);

print("✅ Successfully initialized public_services_db");
print("   - government_services: 6 documents");
print("   - service_locations: 4 documents");
