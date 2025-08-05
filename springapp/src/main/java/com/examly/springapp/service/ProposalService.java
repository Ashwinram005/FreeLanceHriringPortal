package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.exception.ConflictException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Proposal;
import com.examly.springapp.repository.ProjectRepository;
import com.examly.springapp.repository.ProposalRepository;

@Service
public class ProposalService {

    @Autowired
    private ProjectRepository projectrepository;

    @Autowired
    private ProposalRepository proposalrespository;

    public Proposal submitProposal(Proposal proposal) {

        if(proposal.getProjectId()==null){
            throw new ResourceNotFoundException("Project ID cannot null");
        }

        if(!projectrepository.existsById(proposal.getProjectId())){
            throw new ResourceNotFoundException("Project not found with ID: "+proposal.getProjectId());
        }

        boolean exists=proposalrespository.existsByProjectIdAndFreelancerId(proposal.getProjectId(),proposal.getFreelancerId());
        if(exists)
        throw new ConflictException("You have already submitted a proposal for this project");
        return proposalrespository.save(proposal);
    }

}
