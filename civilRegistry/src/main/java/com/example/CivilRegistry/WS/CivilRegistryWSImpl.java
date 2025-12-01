package com.example.CivilRegistry.WS;

import com.example.CivilRegistry.Model.*;
import com.example.CivilRegistry.Repositories.BirthCertificateRepository;
import com.example.CivilRegistry.Repositories.CitizenRepository;
import com.example.CivilRegistry.Repositories.DeathCertificateRepository;
import com.example.CivilRegistry.Repositories.MarriageCertificateRepository;
import jakarta.jws.WebService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

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
        BirthCertificate b = new BirthCertificate();
        b.setCertificateNumber(request.getCertificateNumber());
        if (request.getRegistrationDate()!=null) b.setRegistrationDate(LocalDate.parse(request.getRegistrationDate()));
        if (request.getBirthDate()!=null) b.setBirthDate(LocalDate.parse(request.getBirthDate()));

        Citizen child = null;
        if (request.getChild() != null && request.getChild().getId() != null) {
            child = citizenRepo.findById(request.getChild().getId())
                    .orElseThrow(() -> new RuntimeException("Child not found"));
        } else if (request.getChild() != null && request.getChild().getNationalId() != null) {
            child = citizenRepo.findByNationalId(request.getChild().getNationalId())
                    .orElseThrow(() -> new RuntimeException("Child not found by nationalId"));
        } else {
            throw new RuntimeException("Child info missing");
        }
        b.setChild(child);
        b.setBirthPlace(request.getBirthPlace());
        b.setFatherName(request.getFatherName());
        b.setMotherName(request.getMotherName());
        b = birthRepo.save(b);
        return toBirthWS(b);
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
        MarriageCertificate m = new MarriageCertificate();
        m.setCertificateNumber(request.getCertificateNumber());
        if (request.getRegistrationDate()!=null) m.setRegistrationDate(LocalDate.parse(request.getRegistrationDate()));
        if (request.getMarriageDate()!=null) m.setMarriageDate(LocalDate.parse(request.getMarriageDate()));

        Citizen s1 = citizenRepo.findById(request.getSpouse1().getId()).orElseThrow(() -> new RuntimeException("spouse1 not found"));
        Citizen s2 = citizenRepo.findById(request.getSpouse2().getId()).orElseThrow(() -> new RuntimeException("spouse2 not found"));
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
        DeathCertificate d = new DeathCertificate();
        d.setCertificateNumber(request.getCertificateNumber());
        if (request.getRegistrationDate()!=null) d.setRegistrationDate(LocalDate.parse(request.getRegistrationDate()));
        if (request.getDeathDate()!=null) d.setDeathDate(LocalDate.parse(request.getDeathDate()));

        Citizen c = citizenRepo.findById(request.getCitizen().getId()).orElseThrow(() -> new RuntimeException("citizen not found"));
        d.setCitizen(c);
        d.setPlaceOfDeath(request.getPlaceOfDeath());
        d.setCauseOfDeath(request.getCauseOfDeath());
        d = deathRepo.save(d);
        return toDeathWS(d);
    }

    // ---------- converters ----------
    private CitizenWS toCitizenWS(Citizen c) {
        CitizenWS ws = new CitizenWS();
        ws.setId(c.getId());
        ws.setNationalId(c.getNationalId());
        ws.setFirstName(c.getFirstName());
        ws.setLastName(c.getLastName());
        if(c.getBirthDate()!=null) ws.setBirthDate(c.getBirthDate().toString());
        ws.setBirthPlace(c.getBirthPlace());
        ws.setFatherName(c.getFatherName());
        ws.setMotherName(c.getMotherName());
        ws.setGender(c.getGender().name());
        return ws;
    }

    private BirthCertificateWS toBirthWS(BirthCertificate b) {
        BirthCertificateWS ws = new BirthCertificateWS();
        ws.setId(b.getId());
        ws.setCertificateNumber(b.getCertificateNumber());
        if(b.getRegistrationDate()!=null) ws.setRegistrationDate(b.getRegistrationDate().toString());
        ws.setChild(toCitizenWS(b.getChild()));
        if(b.getBirthDate()!=null) ws.setBirthDate(b.getBirthDate().toString());
        ws.setBirthPlace(b.getBirthPlace());
        ws.setFatherName(b.getFatherName());
        ws.setMotherName(b.getMotherName());
        return ws;
    }

    private MarriageCertificateWS toMarriageWS(MarriageCertificate m) {
        MarriageCertificateWS ws = new MarriageCertificateWS();
        ws.setId(m.getId());
        ws.setCertificateNumber(m.getCertificateNumber());
        if(m.getRegistrationDate()!=null) ws.setRegistrationDate(m.getRegistrationDate().toString());
        ws.setSpouse1(toCitizenWS(m.getSpouse1()));
        ws.setSpouse2(toCitizenWS(m.getSpouse2()));
        if(m.getMarriageDate()!=null) ws.setMarriageDate(m.getMarriageDate().toString());
        ws.setMarriageLocation(m.getMarriageLocation());
        return ws;
    }

    private DeathCertificateWS toDeathWS(DeathCertificate d) {
        DeathCertificateWS ws = new DeathCertificateWS();
        ws.setId(d.getId());
        ws.setCertificateNumber(d.getCertificateNumber());
        if(d.getRegistrationDate()!=null) ws.setRegistrationDate(d.getRegistrationDate().toString());
        ws.setCitizen(toCitizenWS(d.getCitizen()));
        if(d.getDeathDate()!=null) ws.setDeathDate(d.getDeathDate().toString());
        ws.setPlaceOfDeath(d.getPlaceOfDeath());
        ws.setCauseOfDeath(d.getCauseOfDeath());
        return ws;
    }
}
