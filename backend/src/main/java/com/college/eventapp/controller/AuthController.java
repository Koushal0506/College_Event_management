package com.college.eventapp.controller;

import com.college.eventapp.config.JwtUtils;
import com.college.eventapp.dto.JwtResponse;
import com.college.eventapp.dto.LoginRequest;
import com.college.eventapp.dto.MessageResponse;
import com.college.eventapp.dto.SignupRequest;
import com.college.eventapp.model.Role;
import com.college.eventapp.model.User;
import com.college.eventapp.repository.UserRepository;
import com.college.eventapp.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        
        String roleStr = signUpRequest.getRole();
        Role role = Role.STUDENT; // Default
        
        if (roleStr != null) {
            try {
                role = Role.valueOf(roleStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Default to STUDENT if invalid
            }
        }
        
        user.setRole(role);
        
        // Handle specifics
        if (role == Role.STUDENT) {
            user.setCollegeName(signUpRequest.getCollegeName());
            user.setBranch(signUpRequest.getBranch());
            user.setYear(signUpRequest.getYear());
        } else if (role == Role.COLLEGE) {
            user.setCollegeName(signUpRequest.getName()); // College name is the user name basically
            user.setLocation(signUpRequest.getLocation());
            user.setContactEmail(signUpRequest.getContactEmail());
            user.setApproved(false); // Colleges usually need approval
        }

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
