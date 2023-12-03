package cl.estacionamiento.authservice.services;

import java.net.http.HttpResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;




import com.fasterxml.jackson.databind.JsonNode;

@Service
public class MicroServices {

    @Autowired
    private RestTemplate restTemplate;
    private static final String url = "http://localhost:8091";

    public Object estacionamientos(JsonNode json) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<JsonNode> request = new HttpEntity<>(json, headers);

        return restTemplate.postForObject(url + "/estacionamientos", request, Object.class);
        
    }

    public Object obtenerTotalPlazas(JsonNode json) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<JsonNode> request = new HttpEntity<>(json, headers);

        return restTemplate.postForObject(url +  "/contar-plazas", request, Object.class);
    }

    public String misEstacionamientos() {
        return restTemplate.getForObject(url + "/mis-estacionamientos", String.class);
    }

    public ResponseEntity<String> arrendar(JsonNode json) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<JsonNode> request = new HttpEntity<>(json, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                
            url + "/arrendar",
            HttpMethod.POST,
            request,
            String.class
        );
        System.out.println(response);
        return response;
    }



    public Object getPersonaByEmail(JsonNode json) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<JsonNode> request = new HttpEntity<>(json, headers);

        return restTemplate.postForObject(url + "/persona/info", request, Object.class);
    }

     public Object infoEstacionamiento(JsonNode json) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<JsonNode> request = new HttpEntity<>(json, headers);

        return restTemplate.postForObject(url + "/info/estacionamientos", request, Object.class);
    }

      public Object finalizarArriendo(JsonNode json) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<JsonNode> request = new HttpEntity<>(json, headers);

        return restTemplate.postForObject(url +  "/finalizar/arriendo", request, Object.class);
    }
       public Object liberarPlaza(JsonNode json) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<JsonNode> request = new HttpEntity<>(json, headers);

        return restTemplate.postForObject(url +  "/liberar/plaza", request, Object.class);
    }
       public Object pagarArriendo(JsonNode json) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<JsonNode> request = new HttpEntity<>(json, headers);

        return restTemplate.postForObject(url +  "/arriendo/pagar", request, Object.class);
    }

}
