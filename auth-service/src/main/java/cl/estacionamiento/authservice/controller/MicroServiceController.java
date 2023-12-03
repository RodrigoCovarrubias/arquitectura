package cl.estacionamiento.authservice.controller;

import cl.estacionamiento.authservice.services.MicroServices;

import java.net.http.HttpResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

@RestController("/auth")
public class MicroServiceController {

    @Autowired
    MicroServices microServices;

    @PostMapping("/estacionamientos")
    public Object ServiceName(@RequestBody JsonNode json) {
        return microServices.estacionamientos(json);
    }

    @PostMapping("/contar-plazas")
    public Object obtenerTotalPlazas(@RequestBody JsonNode json) {
        return microServices.obtenerTotalPlazas(json);
    }

    @GetMapping("/mis-estacionamientos")
    public String misEstacionamientos(@RequestHeader("Authorization") String authHeader) {
        return microServices.misEstacionamientos();
    }

    @PostMapping("/arrendar")
    public ResponseEntity<String> arrendar(@RequestBody JsonNode json){
        return microServices.arrendar(json);
    }

    @PostMapping("/persona/info")
    public Object getPersonaByEmail(@RequestBody JsonNode json){
        return microServices.getPersonaByEmail(json);
    }

    @PostMapping("/info/estacionamientos")
        public Object infoEstacionamiento(@RequestBody JsonNode json){
        return microServices.infoEstacionamiento(json);
    }

    @PostMapping("/finalizar/arriendo")
        public Object finalizarArriendo(@RequestBody JsonNode json){
        return microServices.finalizarArriendo(json);
    }
     @PostMapping("/liberar/plaza")
    public Object liberarPlaza(@RequestBody JsonNode json) {
        return microServices.liberarPlaza(json);
    }
     @PostMapping("/arriendo/pagar")
    public Object pagarArriendo(@RequestBody JsonNode json) {
        return microServices.pagarArriendo(json);
    }
}
