package com.college.eventapp.controller;

import com.college.eventapp.model.Event;
import com.college.eventapp.model.Registration;
import com.college.eventapp.repository.EventRepository;
import com.college.eventapp.repository.RegistrationRepository;
import com.college.eventapp.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    EventRepository eventRepository;

    @Autowired
    RegistrationRepository registrationRepository;

    // Get all events (Public or Student accessible)
    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Create Event (College only)
    @PostMapping
    @PreAuthorize("hasAuthority('COLLEGE') or hasAuthority('ADMIN')")
    public ResponseEntity<?> createEvent(@RequestBody Event event, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (!userDetails.isApproved()) {
            return ResponseEntity.status(403).body("Your account is pending approval. Please contact Admin.");
        }
        event.setCollegeId(userDetails.getId());
        // If collegeName not provided, we could fetch it, but let's assume UI sends it or we rely on userDetails
        // But UserDetails mostly has username/email.
        // For simplicity, let's trust the input or update it later.
        event.setStatus("UPCOMING");
        eventRepository.save(event);
        return ResponseEntity.ok(event);
    }
    
    // Get My Events (College)
    @GetMapping("/my")
    @PreAuthorize("hasAuthority('COLLEGE')")
    public List<Event> getMyEvents(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return eventRepository.findByCollegeId(userDetails.getId());
    }

    // Register for Event (Student)
    @PostMapping("/{id}/register")
    @PreAuthorize("hasAuthority('STUDENT')")
    public ResponseEntity<?> registerForEvent(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (registrationRepository.findByEventIdAndStudentId(id, userDetails.getId()).isPresent()) {
            return ResponseEntity.badRequest().body("Already registered for this event");
        }
        
        Optional<Event> eventOpt = eventRepository.findById(id);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Event event = eventOpt.get();
        
        Registration registration = new Registration();
        registration.setEventId(id);
        registration.setStudentId(userDetails.getId());
        registration.setStudentName(userDetails.getUsername());
        // For college name we'd need to fetch the User entity details, skipping for speed
        
        registrationRepository.save(registration);
        return ResponseEntity.ok("Registered successfully");
    }
    
    // Get My Registrations (Student)
    @GetMapping("/my-registrations")
    @PreAuthorize("hasAuthority('STUDENT')")
    public List<Registration> getMyRegistrations(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return registrationRepository.findByStudentId(userDetails.getId());
    }
    
    // Delete Event (College or Admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('COLLEGE') or hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteEvent(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Optional<Event> event = eventRepository.findById(id);
        if (event.isPresent()) {
            // Check ownership
            if (userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN")) 
                || event.get().getCollegeId().equals(userDetails.getId())) {
                eventRepository.deleteById(id);
                return ResponseEntity.ok("Event deleted");
            } else {
                return ResponseEntity.status(403).body("Not authorized to delete this event");
            }
        }
        return ResponseEntity.notFound().build();
    }
}
