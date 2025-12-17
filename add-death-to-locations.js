// Get the Death Certificate service ID
var deathCertId = db.government_services.findOne({ service_code: "DEATH001" })._id.toString();

// Update Central City Office (LOC001) to include Death Certificate
db.service_locations.updateOne(
  { locationCode: "LOC001" },
  { $addToSet: { available_services: deathCertId } }
);

// Update South District Office (LOC003) to include Death Certificate
db.service_locations.updateOne(
  { locationCode: "LOC003" },
  { $addToSet: { available_services: deathCertId } }
);

print("✅ Updated service locations to include DEATH_CERTIFICATE service");
