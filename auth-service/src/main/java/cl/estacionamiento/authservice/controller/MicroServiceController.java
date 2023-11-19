package cl.estacionamiento.authservice.controller;

import cl.estacionamiento.authservice.services.MicroServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController("/auth")
public class MicroServiceController {

    @Autowired
    MicroServices microServices;

    @GetMapping("/estacionamientos")
    public String ServiceName(String url) {
        return microServices.estacionamientos();
    }

    @GetMapping("/contar-plazas")
    public String obtenerTotalPlazas() {
        return microServices.obtenerTotalPlazas();
    }

    @GetMapping("/mis-estacionamientos")
    public String misEstacionamientos(@RequestHeader("Authorization") String authHeader) {
        return microServices.misEstacionamientos();
    }

}
