package cl.estacionamiento.authservice.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MicroServices {

    @Autowired
    private  RestTemplate restTemplate;

    public String ServiceName(String url){
        return restTemplate.getForObject(url,String.class);
    }






}
