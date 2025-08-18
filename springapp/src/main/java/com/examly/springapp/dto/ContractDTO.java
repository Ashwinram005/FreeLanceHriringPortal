package com.examly.springapp.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContractDTO {
    private Long id;
    private Long proposalId;
    private String description;
    private String status; 
}
