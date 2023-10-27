package cl.estacionamiento.authservice.auth;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

import io.jsonwebtoken.io.IOException;

public class SimpleGrantedAuthorityJsonCreator extends JsonDeserializer<SimpleGrantedAuthority> {

    @Override
    public SimpleGrantedAuthority deserialize(JsonParser jp, DeserializationContext ctxt)
            throws IOException, java.io.IOException {
        JsonNode node = jp.getCodec().readTree(jp);
        String authority = node.get("authority").asText();
        return new SimpleGrantedAuthority(authority);
    }

}
