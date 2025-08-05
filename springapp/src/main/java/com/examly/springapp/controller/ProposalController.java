package com.examly.springapp.controller;

import com.examly.springapp.model.Proposal;
import com.examly.springapp.service.ProposalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/proposals")
public class ProposalController {

    @Autowired
    private ProposalService proposalService;

    @PostMapping
    public ResponseEntity<Proposal> submitProposal(@Valid @RequestBody Proposal proposal) {
        Proposal saved = proposalService.submitProposal(proposal);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
