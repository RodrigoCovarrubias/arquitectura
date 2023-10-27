package cl.estacionamiento.authservice.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.estacionamiento.authservice.model.Persona;
import cl.estacionamiento.authservice.repositories.PersonaRepository;

@Service
public class JpaUserDetailsService implements UserDetailsService {

    @Autowired
    private PersonaRepository personaRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<Persona> o = personaRepository.findByEmail(username);

        if (!o.isPresent()) {
            throw new UsernameNotFoundException("Username inexistetne");
        }

        Persona persona = o.orElseThrow();
        List<GrantedAuthority> authorities = persona.getTipo().stream()
                .map(t -> new SimpleGrantedAuthority(t.getNombreTipo())).collect(Collectors.toList());

        return new User(persona.getEmail(), persona.getPassword(), true, true,
                true,
                true, authorities);
    }

}
