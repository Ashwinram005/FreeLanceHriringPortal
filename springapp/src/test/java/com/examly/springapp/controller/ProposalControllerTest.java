package com.examly.springapp.controller;

import com.examly.springapp.model.Project;
import com.examly.springapp.model.Proposal;
import com.examly.springapp.repository.ProjectRepository;
import com.examly.springapp.repository.ProposalRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ProposalControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ProposalRepository proposalRepository;

    @BeforeEach
    public void setup() {
        proposalRepository.deleteAll();
        projectRepository.deleteAll();
    }

    @Test
    public void testSubmitProposal() throws Exception {
        // Save a Project for Proposal
        Project project = new Project();
        project.setTitle("Test Project");
        project.setDescription("This is the project description and should be long enough to meet requirement.");
        project.setMinBudget(100.0);
        project.setMaxBudget(200.0);
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, 5);
        project.setDeadline(cal.getTime());
        project.setSkills(Arrays.asList("Spring"));
        project.setClientId(101L);
        project = projectRepository.save(project);

        Proposal proposal = new Proposal();
        proposal.setProjectId(project.getId());
        proposal.setFreelancerId(201L);
        proposal.setBidAmount(120.0);
        proposal.setProposalText("I have extensive experience in this type of project... more words to reach 50 characters.");
        proposal.setEstimatedDays(10);

        mockMvc.perform(post("/api/proposals")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(proposal)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.proposalText").exists());

        List<Proposal> props = proposalRepository.findAll();
        assertThat(props).hasSize(1);
    }

    @Test
    public void testSubmitProposal_ProjectNotFound() throws Exception {
        Proposal proposal = new Proposal();
        proposal.setProjectId(99999L);
        proposal.setFreelancerId(201L);
        proposal.setBidAmount(120.0);
        proposal.setProposalText("Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor.");
        proposal.setEstimatedDays(10);

        mockMvc.perform(post("/api/proposals")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(proposal)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Project not found with ID: 99999"));
    }

    @Test
    public void testSubmitProposal_AlreadyExists() throws Exception {
        Project project = new Project();
        project.setTitle("Test Project");
        project.setDescription("This is the project description and should be long enough to meet requirement.");
        project.setMinBudget(100.0);
        project.setMaxBudget(200.0);
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, 5);
        project.setDeadline(cal.getTime());
        project.setSkills(Arrays.asList("Spring"));
        project.setClientId(101L);
        project = projectRepository.save(project);

        Proposal proposal1 = new Proposal();
        proposal1.setProjectId(project.getId());
        proposal1.setFreelancerId(123L);
        proposal1.setBidAmount(120.0);
        proposal1.setProposalText("I have a rich background in similar projects and can deliver on time! qwertyuioplkjhgfdsaxc");
        proposal1.setEstimatedDays(10);
        proposalRepository.save(proposal1);

        Proposal proposal2 = new Proposal();
        proposal2.setProjectId(project.getId());
        proposal2.setFreelancerId(123L);
        proposal2.setBidAmount(100.0);
        proposal2.setProposalText("Lorem ipsum is sufficiently long for the test case scenario submission!1234567890");
        proposal2.setEstimatedDays(7);

        mockMvc.perform(post("/api/proposals")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(proposal2)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("You have already submitted a proposal for this project"));
    }

    @Test
    public void testSubmitProposal_Validation() throws Exception {
        Proposal proposal = new Proposal();
        proposal.setProjectId(null);
        proposal.setFreelancerId(201L);
        proposal.setBidAmount(0.0);
        proposal.setProposalText("short");
        proposal.setEstimatedDays(0);

        mockMvc.perform(post("/api/proposals")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(proposal)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }
}
