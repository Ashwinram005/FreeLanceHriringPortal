package com.examly.springapp.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.dto.ProjectDTO;
import com.examly.springapp.model.Project;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.ProjectRepository;
import com.examly.springapp.repository.UserRepository;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public ProjectDTO createProject(ProjectDTO dto) {
        User client = userRepository.findById(dto.getClientId())
            .orElseThrow(() -> new IllegalArgumentException("Client not found"));

        if (client.getRole() != User.Role.CLIENT&&client.getRole() != User.Role.ADMIN) {
            throw new IllegalArgumentException("User is not a client");
        }

        Project project = convertToEntity(dto, client);

        Project saved = projectRepository.save(project);

        return convertToDTO(saved);
    }

    public List<ProjectDTO> getAllProject(){
        List<Project> projects = projectRepository.findAll();
    return projects.stream()
                   .map(this::convertToDTO)
                   .collect(Collectors.toList());
    }
 
    public ProjectDTO getProjectById(Long id){
        Project project=projectRepository.findById(id)
            .orElseThrow(()-> new IllegalArgumentException("No project"));
        return convertToDTO(project);
    }

    public ProjectDTO updateProject(Long id, ProjectDTO dto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + id));

        if (dto.getClientId() != null) {
            User client = userRepository.findById(dto.getClientId())
                    .orElseThrow(() -> new IllegalArgumentException("Client not found"));

            if (client.getRole() != User.Role.CLIENT) {
                throw new IllegalArgumentException("User is not a client");
            }
            project.setClient(client);
        }

        if (dto.getTitle() != null) project.setTitle(dto.getTitle());
        if (dto.getDescription() != null) project.setDescription(dto.getDescription());
        if (dto.getMinBudget() != null) project.setMinBudget(dto.getMinBudget());
        if (dto.getMaxBudget() != null) project.setMaxBudget(dto.getMaxBudget());
        if (dto.getDeadline() != null) project.setDeadline(dto.getDeadline());
        if (dto.getSkills() != null && !dto.getSkills().isEmpty()) project.setSkills(dto.getSkills());

        if (dto.getStatus() != null) {
            try {
                project.setStatus(Project.Status.valueOf(dto.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status value: " + dto.getStatus());
            }
        }

        Project updated = projectRepository.save(project);
        return convertToDTO(updated);
    }


    public ProjectDTO updateStatus(Long projectId, String status) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        
        try {
            project.setStatus(Project.Status.valueOf(status.toUpperCase())); // ✅ convert to enum
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status value: " + status);
        }
        
        Project saved = projectRepository.save(project);
        return convertToDTO(saved);
    }



    public ProjectDTO deleteProject(Long id){
        Project project=projectRepository.findById(id)
            .orElseThrow(()->new IllegalArgumentException("Project not found"));

        projectRepository.deleteById(id);
        return convertToDTO(project);
    }

    public List<ProjectDTO> getProjectsByClientId(Long clientId) {
        List<Project> projects = projectRepository.findByClient_Id(clientId);
        return projects.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
    }

    
    private Project convertToEntity(ProjectDTO dto, User client) {
        Project project = new Project();
        project.setClient(client);
        project.setTitle(dto.getTitle());
        project.setDescription(dto.getDescription());
        project.setMinBudget(dto.getMinBudget());
        project.setMaxBudget(dto.getMaxBudget());
        project.setDeadline(dto.getDeadline());
        project.setSkills(dto.getSkills());

        if (dto.getStatus() != null) {
            project.setStatus(Project.Status.valueOf(dto.getStatus()));
        } else {
            project.setStatus(Project.Status.OPEN);
        }
        return project;
    }

        private ProjectDTO convertToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setClientId(project.getClient().getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setMinBudget(project.getMinBudget());
        dto.setMaxBudget(project.getMaxBudget());
        dto.setDeadline(project.getDeadline());
        dto.setSkills(project.getSkills());
        dto.setStatus(project.getStatus().name());
        
        return dto;
    }

}