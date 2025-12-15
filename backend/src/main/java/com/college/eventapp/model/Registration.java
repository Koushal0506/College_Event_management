package com.college.eventapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "registrations")
public class Registration {
    @Id
    private String id;
    private String eventId;
    private String studentId;
    private String studentName; // Denormalized
    private String studentCollege; // Denormalized
    private Date registrationDate = new Date();
    private String status = "REGISTERED"; // PENDING, REGISTERED, CANCELLED

    public Registration() {
    }

    public Registration(String id, String eventId, String studentId, String studentName, String studentCollege, Date registrationDate, String status) {
        this.id = id;
        this.eventId = eventId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentCollege = studentCollege;
        this.registrationDate = registrationDate;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentCollege() {
        return studentCollege;
    }

    public void setStudentCollege(String studentCollege) {
        this.studentCollege = studentCollege;
    }

    public Date getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
