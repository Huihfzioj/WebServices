package com.example.CivilRegistry.WS;

import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@WebService(targetNamespace = "http://civilregistry.example.com/ws")
public interface CivilRegistryWS {

    @Transactional
    CitizenWS updateCitizen(CitizenWS request);

    @Transactional
    boolean deleteCitizen(@WebParam(name = "nationalId") String nationalId);

    @WebMethod
    BirthCertificateWS getBirthCertificate(@WebParam(name = "id") Long id);

    @WebMethod
    BirthCertificateWS createBirthCertificate(@WebParam(name = "request") BirthCertificateWS request);

    @Transactional
    boolean deleteBirthCertificate(@WebParam(name = "id") Long id);

    @WebMethod
    MarriageCertificateWS getMarriageCertificate(@WebParam(name = "id") Long id);

    @WebMethod
    MarriageCertificateWS createMarriageCertificate(@WebParam(name = "request") MarriageCertificateWS request);

    @WebMethod
    DeathCertificateWS getDeathCertificate(@WebParam(name = "id") Long id);

    @WebMethod
    DeathCertificateWS createDeathCertificate(@WebParam(name = "request") DeathCertificateWS request);

    @WebMethod
    CitizenWS getCitizen(@WebParam(name = "id") Long id);

    @Transactional(readOnly = true)
    CitizenWS getCitizenByNationalId(@WebParam(name = "nationalId")String nationalId);

    @Transactional(readOnly = true)
    List<CitizenWS> getAllCitizens();

    @WebMethod
    CitizenWS createCitizen(@WebParam(name = "request") CitizenWS request);


}
