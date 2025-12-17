package com.college.eventapp.repository;

import com.college.eventapp.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    
    List<User> findByRoleAndIsApproved(com.college.eventapp.model.Role role, boolean isApproved);
}
