package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.Date;
import java.util.List;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(min = 5)
    private String title;

    @NotBlank
    private String description;

    @Min(10)
    private double minBudget;

    @Min(10)
    private double maxBudget;

    @Future
    @Temporal(TemporalType.DATE)
    private Date deadline;

    @ElementCollection
    @Size(min = 1)
    private List<String> skills;

    @NotNull
    private Long clientId;

}
