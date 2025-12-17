package com.college.eventapp.controller;

import com.college.eventapp.model.Role;
import com.college.eventapp.model.User;
import com.college.eventapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    UserRepository userRepository;

    @GetMapping("/pending-colleges")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<User> getPendingColleges() {
        return userRepository.findByRoleAndIsApproved(Role.COLLEGE, false);
    }

    @PostMapping("/approve/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> approveCollege(@PathVariable String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getRole() == Role.COLLEGE) {
                user.setApproved(true);
                userRepository.save(user);
                return ResponseEntity.ok("College Approved Successfully");
            }
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/reject/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> rejectCollege(@PathVariable String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getRole() == Role.COLLEGE) {
                userRepository.deleteById(id); // Delete the user
                return ResponseEntity.ok("College Rejected (Account Deleted)");
            }
        }
        return ResponseEntity.notFound().build();
    }
}
