package com.examly.springapp.service;

import com.examly.springapp.model.Contract;
import com.examly.springapp.repository.ContractRepository;
import com.examly.springapp.repository.ProposalRepository;
import com.examly.springapp.exception.ResourceNotFoundException;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContractService {

    @Autowired
    private ContractRepository contractRepo;

    @Autowired
    private ProposalRepository proposalRepo;

    public Contract createContract(Contract contract) {
        proposalRepo.findById(contract.getProposalId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Proposal not found with ID: " + contract.getProposalId()));

        if (contractRepo.findByProposalId(contract.getProposalId()).isPresent()) {
            throw new IllegalStateException("Contract already exists for this proposal");
        }

        return contractRepo.save(contract);
    }

    public List<Contract> getAllContract(){
        return contractRepo.findAll();
    }
}
