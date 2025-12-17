// Seed service locations and government services into public_services_db
db = db.getSiblingDB('public_services_db');

// Insert government services first
const services = db.governmentService.insertMany([
  {
    serviceCode: 'SVC001',
    name: 'Passport Renewal',
    description: 'Renewal of passport document',
    detailedDescription: 'Complete passport renewal service for citizens',
    type: 'PASSPORT_RENEWAL',
    category: 'IDENTIFICATION',
    requiredDocuments: ['Old Passport', 'ID Card', 'Photo'],
    processingTimeDays: 10,
    fees: 75.0,
    eligibilityCriteria: ['Valid ID', 'Current passport'],
    availableOnline: true,
    onlinePortalUrl: 'https://passport.gov.tn',
    isActive: true,
    createdDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  },
  {
    serviceCode: 'SVC002',
    name: 'Birth Certificate',
    description: 'Birth certificate issuance',
    detailedDescription: 'Official birth certificate for civil registry',
    type: 'BIRTH_CERTIFICATE',
    category: 'CIVIL_REGISTRY',
    requiredDocuments: ['ID Card', 'Birth Declaration'],
    processingTimeDays: 3,
    fees: 10.0,
    eligibilityCriteria: ['Parent or guardian'],
    availableOnline: false,
    isActive: true,
    createdDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  }
]);

const serviceIds = Object.values(services.insertedIds).map(id => id.toString());

// Insert service locations
db.serviceLocation.insertMany([
  {
    locationCode: 'LOC001',
    name: 'Central Municipal Office',
    address: '123 Avenue de la République',
    city: 'Tunis',
    state: 'Tunis',
    zipCode: '1000',
    phone: '+216 71 000 000',
    mail: 'contact@municipality-tunis.tn',
    website: 'https://tunis.gov.tn',
    operatingHours: ['Mon-Fri: 8:00-16:00'],
    coordinates: { latitude: 36.8065, longitude: 10.1815 },
    availableServiceIds: [serviceIds[0]]
  },
  {
    locationCode: 'LOC002',
    name: 'Civil Registry Sfax',
    address: '45 Rue Habib Bourguiba',
    city: 'Sfax',
    state: 'Sfax',
    zipCode: '3000',
    phone: '+216 74 000 111',
    mail: 'registry@sfax.gov.tn',
    website: 'https://sfax.gov.tn',
    operatingHours: ['Mon-Thu: 8:00-17:00', 'Fri: 8:00-13:00'],
    coordinates: { latitude: 34.7406, longitude: 10.7603 },
    availableServiceIds: [serviceIds[1]]
  }
]);

print('Seeded government services:', db.governmentService.countDocuments());
print('Seeded service locations:', db.serviceLocation.countDocuments());
