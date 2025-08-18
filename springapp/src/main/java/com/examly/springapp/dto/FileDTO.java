package com.examly.springapp.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileDTO {
    private Long id;
    private Long projectId;
    private String fileName;
    private String fileUrl;
}
