package com.example.CivilRegistry.WS;

import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;

@WebService(targetNamespace = "http://civilregistry.example.com/ws")
public interface CivilRegistryWS {

    @WebMethod
    BirthCertificateWS getBirthCertificate(@WebParam(name = "id") Long id);

    @WebMethod
    BirthCertificateWS createBirthCertificate(@WebParam(name = "request") BirthCertificateWS request);

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

    @WebMethod
    CitizenWS createCitizen(@WebParam(name = "request") CitizenWS request);


}
