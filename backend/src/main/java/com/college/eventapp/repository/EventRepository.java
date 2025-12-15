package com.college.eventapp.repository;

import com.college.eventapp.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface EventRepository extends MongoRepository<Event, String> {
    List<Event> findByCollegeId(String collegeId);
    List<Event> findByStatus(String status);
    List<Event> findByCategory(String category);
}
