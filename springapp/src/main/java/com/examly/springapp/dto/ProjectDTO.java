package com.examly.springapp.dto;

import lombok.*;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDTO {
    private Long id;
    private Long clientId; 
    private String title;
    private String description;
    private Double minBudget;
    private Double maxBudget;
    private Date deadline;
    private List<String> skills;
    private String status;
}
