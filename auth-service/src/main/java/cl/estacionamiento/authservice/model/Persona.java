package cl.estacionamiento.authservice.model;

import java.util.List;

import org.hibernate.annotations.ManyToAny;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(schema = "dbo", name = "persona")

public class Persona {

    @Id
    @Column(name = "idpersona")
    private Long id;

    @Column(name = "email")
    private String email;

    @Column(name = "contrasena")
    private String password;

    @ManyToMany
    @JoinTable(name = "tipo_persona", schema = "dbo", joinColumns = @JoinColumn(name = "idpersona"), inverseJoinColumns = @JoinColumn(name = "idtipo"), uniqueConstraints = {
            @UniqueConstraint(columnNames = { "idpersona", "idtipo" }) })
    private List<Tipo> tipo;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Tipo> getTipo() {
        return tipo;
    }

    public void setTipo(List<Tipo> tipo) {
        this.tipo = tipo;
    }

}
