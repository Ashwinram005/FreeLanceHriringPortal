package com.examly.springapp.controller;
import com.examly.springapp.dto.ProjectDTO;
import com.examly.springapp.service.ProjectService;

import org.springframework.web.bind.annotation.RequestBody;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody @Valid ProjectDTO projectDTO) {
        ProjectDTO savedProject = projectService.createProject(projectDTO);
        return ResponseEntity.ok(savedProject);
    }
    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects(){
        List<ProjectDTO> projects=projectService.getAllProject();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id){
        ProjectDTO project=projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id,
            @RequestBody @Valid ProjectDTO projectDTO) {

        ProjectDTO updated = projectService.updateProject(id, projectDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ProjectDTO> deleteProject(@PathVariable Long id){
        ProjectDTO delete=projectService.deleteProject(id);
        return ResponseEntity.ok(delete);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByClientId(@PathVariable Long clientId) {
        List<ProjectDTO> projects = projectService.getProjectsByClientId(clientId);
        return ResponseEntity.ok(projects);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ProjectDTO> updateProjectStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        ProjectDTO updated = projectService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }
    
}