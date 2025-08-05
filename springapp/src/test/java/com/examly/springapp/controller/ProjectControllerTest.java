package com.examly.springapp.controller;

import com.examly.springapp.model.Project;
import com.examly.springapp.repository.ProjectRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Calendar;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ProjectControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        projectRepository.deleteAll();
    }

    @Test
    public void testCreateProject() throws Exception {
        Project project = new Project();
        project.setTitle("E-commerce Website Development");
        project.setDescription("Looking for a skilled developer to build a responsive e-commerce website with product catalog, shopping cart, and payment integration.");
        project.setMinBudget(1000.0);
        project.setMaxBudget(3000.0);
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, 15);
        project.setDeadline(cal.getTime());
        project.setSkills(Arrays.asList("React","Node.js","MongoDB"));
        project.setClientId(101L);

        mockMvc.perform(post("/api/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(project)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("E-commerce Website Development"));

        List<Project> list = projectRepository.findAll();
        assertThat(list).hasSize(1);
    }

    @Test
    public void testGetProjectById() throws Exception {
        // Setup project
        Project project = new Project();
        project.setTitle("E-commerce Website Development");
        project.setDescription("Some description.");
        project.setMinBudget(1000.0);
        project.setMaxBudget(3000.0);
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, 10);
        project.setDeadline(cal.getTime());
        project.setSkills(Arrays.asList("React"));
        project.setClientId(101L);
        project = projectRepository.save(project);

        mockMvc.perform(get("/api/projects/" + project.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(project.getId()))
                .andExpect(jsonPath("$.title").value("E-commerce Website Development"));
    }

    @Test
    public void testGetProjectById_NotFound() throws Exception {
        mockMvc.perform(get("/api/projects/99999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Project not found with ID: 99999"));
    }

    @Test
    public void testValidationErrors() throws Exception {
        Project project = new Project();
        project.setTitle("abc"); // less than min 5
        project.setDescription(""); // required
        project.setMinBudget(5.0); // less than 10
        project.setMaxBudget(5.0); // less than 10
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, -15); // past date
        project.setDeadline(cal.getTime());
        project.setSkills(Arrays.asList()); // empty
        project.setClientId(101L);

        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(project)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }
}
