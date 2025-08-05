package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.Date;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long proposalId;

    @Future
    @Temporal(TemporalType.DATE)
    private Date startDate;

    @NotBlank
    private String paymentTerms;

}
