package cl.estacionamiento.authservice.repositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import cl.estacionamiento.authservice.model.Persona;

public interface PersonaRepository extends CrudRepository<Persona, Long> {

    Optional<Persona> findByEmail(String email);

}
