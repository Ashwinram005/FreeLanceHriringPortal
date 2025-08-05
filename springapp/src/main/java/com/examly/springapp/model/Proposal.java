package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Proposal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Project ID is required")
    private Long projectId;
    
    @NotNull(message = "Freelancer ID is required")
    private Long freelancerId;

    @Min(value=1,message="Bid amount must be positive")
    private double bidAmount;
    
    @NotBlank(message="Proposal text is required")
    private String proposalText;
    
    @Min(value=1,message="Estimated Days must be positive")
    private int estimatedDays;

}
