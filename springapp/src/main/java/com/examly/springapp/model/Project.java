package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "projects")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

  
    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    @NotNull
    private User client;

    @Size(min = 5, message = "Title must be at least 5 characters")
    private String title;

    @NotBlank(message = "Description cannot be blank")
    @Column(columnDefinition = "TEXT")
    private String description;

    @Min(value = 10, message = "Minimum budget must be at least 10")
    private Double minBudget;

    @Min(value = 10, message = "Maximum budget must be at least 10")
    private Double maxBudget;

    @Future(message = "Deadline must be in the future")
    @Temporal(TemporalType.DATE)
    private Date deadline;

    @ElementCollection
    @Size(min = 1, message = "At least one skill is required")
    private List<String> skills;

    @Enumerated(EnumType.STRING)
    private Status status = Status.OPEN; 

    public enum Status {
        OPEN, IN_PROGRESS, CLOSED
    }
}
