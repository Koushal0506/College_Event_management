package com.college.eventapp.repository;

import com.college.eventapp.model.Registration;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends MongoRepository<Registration, String> {
    List<Registration> findByStudentId(String studentId);
    List<Registration> findByEventId(String eventId);
    Optional<Registration> findByEventIdAndStudentId(String eventId, String studentId);
}
