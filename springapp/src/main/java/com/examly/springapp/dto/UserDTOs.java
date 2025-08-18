package com.examly.springapp.dto;

import lombok.*;

public class UserDTOs {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserRegisterDTO {
        private String name;
        private String email;
        private String password; 
        private String role;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserLoginDTO {
        private String email;
        private String password;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserResponseDTO {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String token;
    }

}
