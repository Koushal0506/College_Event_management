package com.college.eventapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "events")
public class Event {
    @Id
    private String id;
    private String title;
    private String category; // Technical, Cultural, Sports, Workshop
    private String description;
    private String collegeId; // The User ID of the college who created it
    private String collegeName; // Denormalized for easier display
    private Date eventDate;
    private String venue;
    private Integer maxParticipants;
    private boolean allowExternalStudents = true;
    private String image; // URL to image/poster (optional)
    
    // Status: UPCOMING, ONGOING, COMPLETED
    private String status = "UPCOMING";

    public Event() {
    }

    public Event(String id, String title, String category, String description, String collegeId, String collegeName, Date eventDate, String venue, Integer maxParticipants, boolean allowExternalStudents, String image, String status) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.description = description;
        this.collegeId = collegeId;
        this.collegeName = collegeName;
        this.eventDate = eventDate;
        this.venue = venue;
        this.maxParticipants = maxParticipants;
        this.allowExternalStudents = allowExternalStudents;
        this.image = image;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCollegeId() {
        return collegeId;
    }

    public void setCollegeId(String collegeId) {
        this.collegeId = collegeId;
    }

    public String getCollegeName() {
        return collegeName;
    }

    public void setCollegeName(String collegeName) {
        this.collegeName = collegeName;
    }

    public Date getEventDate() {
        return eventDate;
    }

    public void setEventDate(Date eventDate) {
        this.eventDate = eventDate;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public Integer getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public boolean isAllowExternalStudents() {
        return allowExternalStudents;
    }

    public void setAllowExternalStudents(boolean allowExternalStudents) {
        this.allowExternalStudents = allowExternalStudents;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
