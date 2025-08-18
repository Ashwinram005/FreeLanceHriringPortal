package com.examly.springapp.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProposalDTO {
    private Long id;
    private Long projectId;
    private Long freelancerId;
    private Long clientId;
    private Double bidAmount;
    private String status; 
}
