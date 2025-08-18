package com.examly.springapp.controller;

import com.examly.springapp.dto.UserDTOs;
import com.examly.springapp.model.User;
import com.examly.springapp.service.UserService;
import com.examly.springapp.config.JwtUtil;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<UserDTOs.UserResponseDTO> registerUser(
            @RequestBody UserDTOs.UserRegisterDTO registerDTO) {
        UserDTOs.UserResponseDTO responseDTO = userService.registerUser(registerDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTOs.UserResponseDTO> loginUser(
            @RequestBody UserDTOs.UserLoginDTO loginDTO) {

        User user = userService.validateUser(loginDTO.getEmail(), loginDTO.getPassword());

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        
        UserDTOs.UserResponseDTO responseDTO = new UserDTOs.UserResponseDTO();
        responseDTO.setId(user.getId());
        responseDTO.setName(user.getName());
        responseDTO.setEmail(user.getEmail());
        responseDTO.setRole(user.getRole().name());
        responseDTO.setToken(token); // JWT token

        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/users")
public ResponseEntity<List<UserDTOs.UserResponseDTO>> getAllUsers() {
    List<UserDTOs.UserResponseDTO> users = userService.getAllUsers();
    return ResponseEntity.ok(users);
}


        @GetMapping("/users/{id}")
    public ResponseEntity<UserDTOs.UserResponseDTO> getUserById(@PathVariable Long id) {
        UserDTOs.UserResponseDTO user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    
}
