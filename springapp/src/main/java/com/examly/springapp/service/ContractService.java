package com.examly.springapp.service;

import com.examly.springapp.dto.ContractDTO;
import com.examly.springapp.model.Contract;
import com.examly.springapp.model.Proposal;
import com.examly.springapp.repository.ContractRepository;
import com.examly.springapp.repository.ProposalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContractService {

    private final ContractRepository contractRepository;
    private final ProposalRepository proposalRepository;

    public ContractService(ContractRepository contractRepository, ProposalRepository proposalRepository) {
        this.contractRepository = contractRepository;
        this.proposalRepository = proposalRepository;
    }

    public ContractDTO createContract(ContractDTO dto) {
        Proposal proposal = proposalRepository.findById(dto.getProposalId())
                .orElseThrow(() -> new RuntimeException("Proposal not found with ID: " + dto.getProposalId()));

        Contract contract = new Contract();
        contract.setProposal(proposal);
        contract.setDescription(dto.getDescription());
        contract.setStatus(Contract.Status.valueOf(dto.getStatus().toUpperCase()));

        return mapToDTO(contractRepository.save(contract));
    }

    public List<ContractDTO> getAllContracts() {
        return contractRepository.findAll()
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public ContractDTO getContractById(Long id) {
        return contractRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Contract not found with ID: " + id));
    }

    public ContractDTO updateContract(Long id, ContractDTO dto) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found with ID: " + id));

        contract.setDescription(dto.getDescription());
        contract.setStatus(Contract.Status.valueOf(dto.getStatus().toUpperCase()));

        return mapToDTO(contractRepository.save(contract));
    }

    public void deleteContract(Long id) {
        if (!contractRepository.existsById(id)) {
            throw new RuntimeException("Contract not found with ID: " + id);
        }
        contractRepository.deleteById(id);
    }

    public List<ContractDTO> getByClientId(Long clientId) {
        return contractRepository.findByClientId(clientId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<ContractDTO> getByFreelancerId(Long freelancerId) {
        return contractRepository.findByFreelancerId(freelancerId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public ContractDTO getByProjectId(Long projectId) {
        Contract contract = contractRepository.findByProposalProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Contract not found for project ID: " + projectId));
        return mapToDTO(contract);
    }

    private ContractDTO mapToDTO(Contract contract) {
        return new ContractDTO(
                contract.getId(),
                contract.getProposal().getId(),
                contract.getDescription(),
                contract.getStatus().name()
        );
    }
}
