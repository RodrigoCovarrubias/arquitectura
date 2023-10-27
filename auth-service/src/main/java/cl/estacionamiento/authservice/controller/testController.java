package cl.estacionamiento.authservice.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping(value = "auth")
public class testController {

    @GetMapping(value = "/listarestacionamientos")
    public String postMethodName() {

        return "Hola mundo";
    }

}
