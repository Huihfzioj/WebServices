package com.example.CivilRegistry.WS;

import com.example.CivilRegistry.Model.*;
import com.example.CivilRegistry.Repositories.BirthCertificateRepository;
import com.example.CivilRegistry.Repositories.CitizenRepository;
import com.example.CivilRegistry.Repositories.DeathCertificateRepository;
import com.example.CivilRegistry.Repositories.MarriageCertificateRepository;
import jakarta.jws.WebService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@WebService(endpointInterface = "com.example.CivilRegistry.WS.CivilRegistryWS",
        targetNamespace = "http://civilregistry.example.com/ws",
        serviceName = "CivilRegistryService")
@AllArgsConstructor

public class CivilRegistryWSImpl implements CivilRegistryWS {

    @Autowired
    private final CitizenRepository citizenRepo;
    @Autowired
    private final BirthCertificateRepository birthRepo;
    @Autowired
    private final MarriageCertificateRepository marriageRepo;
    @Autowired
    private final DeathCertificateRepository deathRepo;

    // ---------- Citizen ----------
    @Override
    @Transactional(readOnly = true)
    public CitizenWS getCitizen(Long id) {
        Citizen c = citizenRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));
        return toCitizenWS(c);
    }

    @Transactional(readOnly = true)
    @Override
    public CitizenWS getCitizenByNationalId(String nationalId) {
        Citizen c = citizenRepo.findByNationalId(nationalId)
                .orElseThrow(() -> new EntityNotFoundException("Citizen not found with nationalId: " + nationalId));
        return toCitizenWS(c);
    }

    @Transactional(readOnly = true)
    @Override
    public List<CitizenWS> getAllCitizens() {
        return citizenRepo.findAll().stream()
                .map(this::toCitizenWS)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CitizenWS createCitizen(CitizenWS request) {
        Citizen c = new Citizen();
        c.setNationalId(request.getNationalId());
        c.setFirstName(request.getFirstName());
        c.setLastName(request.getLastName());
        if(request.getBirthDate() != null) c.setBirthDate(LocalDate.parse(request.getBirthDate()));
        c.setBirthPlace(request.getBirthPlace());
        c.setFatherName(request.getFatherName());
        c.setMotherName(request.getMotherName());
        c.setGender(Gender.valueOf(request.getGender()));
        c = citizenRepo.save(c);
        return toCitizenWS(c);
    }

    @Transactional
    @Override
    public CitizenWS updateCitizen(CitizenWS request) {
        Citizen c = citizenRepo.findByNationalId(request.getNationalId())
                .orElseThrow(() -> new RuntimeException("Citizen not found"));

        c.setFirstName(request.getFirstName());
        c.setLastName(request.getLastName());
        if (request.getBirthDate() != null)
            c.setBirthDate(LocalDate.parse(request.getBirthDate()));
        c.setBirthPlace(request.getBirthPlace());
        c.setFatherName(request.getFatherName());
        c.setMotherName(request.getMotherName());
        c.setGender(Gender.valueOf(request.getGender()));

        citizenRepo.save(c);
        return toCitizenWS(c);
    }

    @Transactional
    @Override
    public boolean deleteCitizen(String nationalId) {
        Citizen c = citizenRepo.findByNationalId(nationalId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));

        citizenRepo.delete(c);
        return true;
    }

    // ---------- Birth ----------
    @Override
    @Transactional(readOnly = true)
    public BirthCertificateWS getBirthCertificate(Long id) {
        BirthCertificate b = birthRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        return toBirthWS(b);
    }

    @Override
    @Transactional
    public BirthCertificateWS createBirthCertificate(BirthCertificateWS request) {

        LocalDate regDate = LocalDate.parse(request.getRegistrationDate());
        validatePastOrToday(regDate, "Registration date");

        // Child birth date
        LocalDate childBirthDate = LocalDate.parse(request.getChild().getBirthDate());
        validatePastOrToday(childBirthDate, "Child birth date");

        BirthCertificate cert = new BirthCertificate();
        cert.setCertificateNumber(request.getCertificateNumber());
        cert.setRegistrationDate(regDate);

        CitizenWS childWS = request.getChild();
        Citizen child = citizenRepo.findByNationalId(childWS.getNationalId()).orElse(null);

        if (child == null) {
            child = new Citizen();
            child.setNationalId(childWS.getNationalId());
            child.setFirstName(childWS.getFirstName());
            child.setLastName(childWS.getLastName());
            child.setBirthDate(childBirthDate);
            child.setBirthPlace(childWS.getBirthPlace());
            child.setFatherName(childWS.getFatherName());
            child.setMotherName(childWS.getMotherName());
            child.setGender(Gender.valueOf(childWS.getGender()));

            child = citizenRepo.save(child);
        }

        cert.setChild(child);
        BirthCertificate saved = birthRepo.save(cert);
        return toBirthWS(saved);
    }

    @Transactional
    @Override
    public boolean deleteBirthCertificate(Long id) {
        birthRepo.deleteById(id);
        return true;
    }


    // ---------- Marriage ----------
    @Override
    @Transactional(readOnly = true)
    public MarriageCertificateWS getMarriageCertificate(Long id) {
        MarriageCertificate m = marriageRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        return toMarriageWS(m);
    }

    @Override
    @Transactional
    public MarriageCertificateWS createMarriageCertificate(MarriageCertificateWS request) {

        // --- Validate registration date ---
        LocalDate regDate = LocalDate.parse(request.getRegistrationDate());
        validatePastOrToday(regDate, "Registration date");

        // --- Validate marriage date ---
        LocalDate marriageDate = LocalDate.parse(request.getMarriageDate());
        validatePastOrToday(marriageDate, "Marriage date");

        Citizen s1 = citizenRepo.findByNationalId(request.getNationalIdOfSpouse1())
                .orElseThrow(() -> new RuntimeException("Spouse 1 not found"));

        Citizen s2 = citizenRepo.findByNationalId(request.getNationalIdOfSpouse2())
                .orElseThrow(() -> new RuntimeException("Spouse 2 not found"));

        // --- Age check ---
        validateAdult(s1, "Spouse 1");
        validateAdult(s2, "Spouse 2");

        // --- Ensure neither is dead ---
        ensureNotDead(s1);
        ensureNotDead(s2);

        MarriageCertificate m = new MarriageCertificate();
        m.setCertificateNumber(request.getCertificateNumber());
        m.setRegistrationDate(regDate);
        m.setMarriageDate(marriageDate);
        m.setSpouse1(s1);
        m.setSpouse2(s2);
        m.setMarriageLocation(request.getMarriageLocation());

        m = marriageRepo.save(m);
        return toMarriageWS(m);
    }


    // ---------- Death ----------
    @Override
    @Transactional(readOnly = true)
    public DeathCertificateWS getDeathCertificate(Long id) {
        DeathCertificate d = deathRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        return toDeathWS(d);
    }

    @Override
    @Transactional
    public DeathCertificateWS createDeathCertificate(DeathCertificateWS request) {

        LocalDate regDate = LocalDate.parse(request.getRegistrationDate());
        validatePastOrToday(regDate, "Registration date");

        LocalDate deathDate = LocalDate.parse(request.getDeathDate());
        validatePastOrToday(deathDate, "Death date");

        Citizen c = citizenRepo.findByNationalId(request.getNationalID())
                .orElseThrow(() -> new RuntimeException("Citizen not found"));

        DeathCertificate d = new DeathCertificate();
        d.setCertificateNumber(request.getCertificateNumber());
        d.setRegistrationDate(regDate);
        d.setDeathDate(deathDate);
        d.setCitizen(c);
        d.setPlaceOfDeath(request.getPlaceOfDeath());
        d.setCauseOfDeath(request.getCauseOfDeath());

        d = deathRepo.save(d);
        return toDeathWS(d);
    }

    // ---------- converters ----------
    private CitizenWS toCitizenWS(Citizen c) {
        CitizenWS ws = new CitizenWS();
        ws.setId(c.getId());  // <-- add this
        ws.setNationalId(c.getNationalId());
        ws.setFirstName(c.getFirstName());
        ws.setLastName(c.getLastName());
        ws.setBirthDate(c.getBirthDate() != null ? c.getBirthDate().toString() : null);
        ws.setBirthPlace(c.getBirthPlace());
        ws.setFatherName(c.getFatherName());
        ws.setMotherName(c.getMotherName());
        ws.setGender(c.getGender().name());
        return ws;
    }

    private BirthCertificateWS toBirthWS(BirthCertificate b) {
        BirthCertificateWS ws = new BirthCertificateWS();
        ws.setCertificateNumber(b.getCertificateNumber());
        if(b.getRegistrationDate()!=null) ws.setRegistrationDate(b.getRegistrationDate().toString());
        ws.setChild(toCitizenWS(b.getChild()));
        if(b.getChild().getBirthDate()!=null) ws.getChild().setBirthDate(b.getChild().getBirthDate().toString());
        ws.getChild().setBirthPlace(b.getChild().getBirthPlace());
        ws.getChild().setFatherName(b.getChild().getFatherName());
        ws.getChild().setMotherName(b.getChild().getMotherName());
        return ws;
    }

    private MarriageCertificateWS toMarriageWS(MarriageCertificate m) {
        MarriageCertificateWS ws = new MarriageCertificateWS();
        ws.setCertificateNumber(m.getCertificateNumber());
        if(m.getRegistrationDate()!=null) ws.setRegistrationDate(m.getRegistrationDate().toString());
        ws.setNationalIdOfSpouse1(m.getSpouse1().getNationalId());
        ws.setNationalIdOfSpouse2(m.getSpouse2().getNationalId());
        if(m.getMarriageDate()!=null) ws.setMarriageDate(m.getMarriageDate().toString());
        ws.setMarriageLocation(m.getMarriageLocation());
        return ws;
    }

    private DeathCertificateWS toDeathWS(DeathCertificate d) {
        DeathCertificateWS ws = new DeathCertificateWS();
        ws.setCertificateNumber(d.getCertificateNumber());
        if(d.getRegistrationDate()!=null) ws.setRegistrationDate(d.getRegistrationDate().toString());
        ws.setNationalID(d.getCitizen().getNationalId());
        if(d.getDeathDate()!=null) ws.setDeathDate(d.getDeathDate().toString());
        ws.setPlaceOfDeath(d.getPlaceOfDeath());
        ws.setCauseOfDeath(d.getCauseOfDeath());
        return ws;
    }
    // ------------ VALIDATION HELPERS ------------

    private void validatePastOrToday(LocalDate date, String fieldName) {
        if (date.isAfter(LocalDate.now()))
            throw new RuntimeException(fieldName + " cannot be in the future.");
    }

    private int calculateAge(LocalDate birthDate) {
        return LocalDate.now().getYear() - birthDate.getYear() -
                (LocalDate.now().getDayOfYear() < birthDate.getDayOfYear() ? 1 : 0);
    }

    private void validateAdult(Citizen citizen, String label) {
        int age = calculateAge(citizen.getBirthDate());
        if (age < 18) {
            throw new RuntimeException(label + " must be at least 18. Current age: " + age);
        }
    }

    private void ensureNotDead(Citizen citizen) {
        boolean hasDeathCert = deathRepo.existsByCitizen(citizen);
        if (hasDeathCert) {
            throw new RuntimeException("Operation not allowed. Citizen " + citizen.getNationalId() + " is deceased.");
        }
    }

}
