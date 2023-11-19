package cl.estacionamiento.authservice.auth.filters;

import java.io.IOException;
import java.util.Arrays;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

import cl.estacionamiento.authservice.auth.SimpleGrantedAuthorityJsonCreator;
import cl.estacionamiento.authservice.auth.TokenJwtConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtValidationFilter extends BasicAuthenticationFilter {

    public JwtValidationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);

    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        String headers = request.getHeader("Authorization");

        if (headers == null || !headers.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = headers.replace("Bearer ", "");

        try {
            ObjectMapper mapper = new ObjectMapper();
            SimpleModule module = new SimpleModule();
            module.addDeserializer(SimpleGrantedAuthority.class, new SimpleGrantedAuthorityJsonCreator());
            mapper.registerModule(module);
            Claims claims = Jwts
                    .parser()
                    .setSigningKey(TokenJwtConfig.SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String username = claims.getSubject();
            String authoritiesClaim = claims.get("authorities", String.class);
            if (authoritiesClaim == null) {
                throw new JwtException("No authorities claim found in token");
            }

            SimpleGrantedAuthority[] authorities = mapper.readValue(authoritiesClaim, SimpleGrantedAuthority[].class);
            System.out.println(Arrays.toString(authorities));

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, null,
                    Arrays.asList(authorities));

            SecurityContext context = SecurityContextHolder.getContext();
            SecurityContextHolder.getContext().setAuthentication(authentication);
            chain.doFilter(request, response);
            return;
        } catch (JwtException e) {
            System.out.println(e.getMessage());
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("No autorizado");
            return;
        }
    }

}
