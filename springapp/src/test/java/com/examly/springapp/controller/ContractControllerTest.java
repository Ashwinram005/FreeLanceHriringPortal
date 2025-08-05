package com.examly.springapp.controller;

import com.examly.springapp.model.Contract;
import com.examly.springapp.model.Proposal;
import com.examly.springapp.model.Project;
import com.examly.springapp.repository.ContractRepository;
import com.examly.springapp.repository.ProposalRepository;
import com.examly.springapp.repository.ProjectRepository;
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
public class ContractControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private ContractRepository contractRepository;
    @Autowired
    private ProposalRepository proposalRepository;
    @Autowired
    private ProjectRepository projectRepository;

    @BeforeEach
    public void setup() {
        contractRepository.deleteAll();
        proposalRepository.deleteAll();
        projectRepository.deleteAll();
    }

    @Test
    public void testCreateContract() throws Exception {
        // Save a Project
        Project project = new Project();
        project.setTitle("Contract Test");
        project.setDescription("Contract test desc sufficient long.");
        project.setMinBudget(100.0);
        project.setMaxBudget(400.0);
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, 10);
        project.setDeadline(cal.getTime());
        project.setSkills(Arrays.asList("Java"));
        project.setClientId(101L);
        project = projectRepository.save(project);
        // Save a Proposal
        Proposal proposal = new Proposal();
        proposal.setProjectId(project.getId());
        proposal.setFreelancerId(333L);
        proposal.setBidAmount(200.0);
        proposal.setProposalText("This proposal should be long enough for test validation 1234567890 qwertyuiopasdfghjkl111111.");
        proposal.setEstimatedDays(15);
        proposal = proposalRepository.save(proposal);
        // Create Contract
        Contract contract = new Contract();
        contract.setProposalId(proposal.getId());
        Calendar cal2 = Calendar.getInstance();
        cal2.add(Calendar.DAY_OF_MONTH, 1);
        contract.setStartDate(cal2.getTime());
        contract.setPaymentTerms("Milestone");

        mockMvc.perform(post("/api/contracts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contract)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.paymentTerms").value("Milestone"));

        List<Contract> contracts = contractRepository.findAll();
        assertThat(contracts).hasSize(1);
    }

    @Test
    public void testCreateContract_ProposalNotFound() throws Exception {
        Contract contract = new Contract();
        contract.setProposalId(99999L);
        Calendar cal2 = Calendar.getInstance();
        cal2.add(Calendar.DAY_OF_MONTH, 1);
        contract.setStartDate(cal2.getTime());
        contract.setPaymentTerms("Fixed");

        mockMvc.perform(post("/api/contracts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contract)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Proposal not found with ID: 99999"));
    }

    @Test
    public void testCreateContract_AlreadyExists() throws Exception {
        // Save a Project
        Project project = new Project();
        project.setTitle("Contract Test");
        project.setDescription("Contract test desc sufficient long.");
        project.setMinBudget(100.0);
        project.setMaxBudget(400.0);
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, 10);
        project.setDeadline(cal.getTime());
        project.setSkills(Arrays.asList("Java"));
        project.setClientId(101L);
        project = projectRepository.save(project);
        // Save a Proposal
        Proposal proposal = new Proposal();
        proposal.setProjectId(project.getId());
        proposal.setFreelancerId(333L);
        proposal.setBidAmount(150.0);
        proposal.setProposalText("Another sufficiently long contract proposal for validation qwertyuiopp.");
        proposal.setEstimatedDays(22);
        proposal = proposalRepository.save(proposal);
        // Create a contract
        Contract contract = new Contract();
        contract.setProposalId(proposal.getId());
        Calendar cal2 = Calendar.getInstance();
        cal2.add(Calendar.DAY_OF_MONTH, 1);
        contract.setStartDate(cal2.getTime());
        contract.setPaymentTerms("Hourly");
        contractRepository.save(contract);

        // Attempt again
        Contract contract2 = new Contract();
        contract2.setProposalId(proposal.getId());
        contract2.setStartDate(cal2.getTime());
        contract2.setPaymentTerms("Hourly");

        mockMvc.perform(post("/api/contracts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contract2)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Contract already exists for this proposal"));
    }

    @Test
    public void testCreateContract_Validation() throws Exception {
        Contract contract = new Contract();
        contract.setProposalId(null);
        contract.setPaymentTerms("SomethingElse");
        Calendar cal2 = Calendar.getInstance();
        cal2.add(Calendar.DAY_OF_MONTH, -1); // past date
        contract.setStartDate(cal2.getTime());

        mockMvc.perform(post("/api/contracts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contract)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }
}
