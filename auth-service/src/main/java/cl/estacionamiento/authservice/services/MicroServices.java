package cl.estacionamiento.authservice.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MicroServices {

    @Autowired
    private RestTemplate restTemplate;
    private static final String url = "http://localhost:8091";

    public String estacionamientos() {
        return restTemplate.getForObject(url + "/estacionamientos", String.class);
    }

    public String obtenerTotalPlazas() {
        return restTemplate.getForObject(url + "/contar-plazas", String.class);
    }

    public String misEstacionamientos() {
        return restTemplate.getForObject(url + "/mis-estacionamientos", String.class);
    }

}
