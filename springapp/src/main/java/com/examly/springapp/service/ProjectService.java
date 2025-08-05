package com.examly.springapp.service;

import com.examly.springapp.model.Project;
import com.examly.springapp.repository.ProjectRepository;
import com.examly.springapp.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepo;

    public Project saveProject(Project p) {
        return projectRepo.save(p);
    }

    public Project getById(Long id) {
        return projectRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + id));
    }

    public List<Project> getAllProjects() {
        return projectRepo.findAll();
    }
}
