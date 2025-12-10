db.government_services.updateOne(
  { service_code: "DEATH001" },
  { $set: { category: "CIVIL_REGISTRY" } }
);
