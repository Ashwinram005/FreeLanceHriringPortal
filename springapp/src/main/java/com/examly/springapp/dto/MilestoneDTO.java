package com.examly.springapp.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MilestoneDTO {
    private Long id;
    private Long contractId;
    private String description;
    private String status; 
    private String fileName;  // NEW
    private String filePath;  
}
