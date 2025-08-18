package com.examly.springapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.dto.ProjectDTO;
import com.examly.springapp.dto.ProposalDTO;
import com.examly.springapp.service.ProposalService;

@RestController
@RequestMapping("/proposal")
@CrossOrigin(origins = "*")
public class ProposalController {

    @Autowired
    private ProposalService proposalService;

    @PostMapping
    public ResponseEntity<ProposalDTO> createProposal(@RequestBody ProposalDTO proposal){
        ProposalDTO created=proposalService.createProposal(proposal);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List> getAllProposal() {
        List<ProposalDTO> proposal=proposalService.getAllProposal();
        return ResponseEntity.ok(proposal);
    }

    @GetMapping("{id}")
    public ResponseEntity<ProposalDTO> getProposalById(@PathVariable Long id){
        ProposalDTO proposal=proposalService.getProposalById(id);
        return ResponseEntity.ok(proposal);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<ProposalDTO>> getProposalsByClientId(@PathVariable Long clientId) {
        List<ProposalDTO> proposals = proposalService.getProposalsByClientId(clientId);
        return ResponseEntity.ok(proposals);
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<ProposalDTO>> getProposalsByFreelancerId(@PathVariable Long freelancerId) {
        List<ProposalDTO> proposals = proposalService.getProposalsByFreelancerId(freelancerId);
        return ResponseEntity.ok(proposals);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProposalDTO> updateProposal(
            @PathVariable Long id,
            @RequestBody ProposalDTO proposalDTO) {
        ProposalDTO updated = proposalService.updateProposal(id, proposalDTO);
        return ResponseEntity.ok(updated);
    }

}
