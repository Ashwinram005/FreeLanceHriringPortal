package com.examly.springapp.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;
import com.examly.springapp.dto.ContractDTO;

import com.examly.springapp.dto.ProjectDTO;
import com.examly.springapp.dto.ProposalDTO;
import com.examly.springapp.model.Proposal;
import com.examly.springapp.model.Contract;
import com.examly.springapp.model.Project;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.ProposalRepository;
import com.examly.springapp.repository.ProjectRepository;
import com.examly.springapp.repository.UserRepository;

@Service
public class ProposalService {

    @Autowired
    private ProposalRepository proposalRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContractService contractService;

    public ProposalDTO createProposal(ProposalDTO proposalDTO) {

        boolean exists = proposalRepository
        .findByProjectIdAndFreelancerId(proposalDTO.getProjectId(), proposalDTO.getFreelancerId())
        .isPresent();
        if (exists) {
            throw new IllegalArgumentException("You have already submitted a proposal for this project.");
        }
        Proposal proposal = convertToEntity(proposalDTO);   
        Proposal saved = proposalRepository.save(proposal);
        return convertToDTO(saved);
    }

    public List<ProposalDTO> getAllProposal(){
        List<Proposal> proposal = proposalRepository.findAll();
        return proposal.stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
    }

    public ProposalDTO getProposalById(Long id) {
        Proposal proposal=proposalRepository.findById(id)
            .orElseThrow(()-> new IllegalArgumentException("proposal not found"));
        
        return convertToDTO(proposal);
    }

    public List<ProposalDTO> getProposalsByClientId(Long clientId) {
        List<Proposal> proposals = proposalRepository.findByProject_Client_Id(clientId);
        return proposals.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProposalDTO> getProposalsByFreelancerId(Long freelancerId) {
        return proposalRepository.findByFreelancerId(freelancerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    public ProposalDTO updateProposal(Long id, ProposalDTO dto) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Proposal not found"));

        if (dto.getBidAmount() != null) {
            proposal.setBidAmount(dto.getBidAmount());
        }
        if (dto.getStatus() != null) {
            try {
                proposal.setStatus(Proposal.Status.valueOf(dto.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status: " + dto.getStatus());
            }
        }

        Proposal saved = proposalRepository.save(proposal);
        return convertToDTO(saved);
    }


    public ProposalDTO acceptProposal(Long proposalId, String contractDescription) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new IllegalArgumentException("Proposal not found"));

        proposal.setStatus(Proposal.Status.ACCEPTED);
        proposalRepository.save(proposal);
        projectService.updateStatus(proposal.getProject().getId(), Project.Status.IN_PROGRESS.name());

        ContractDTO contractDTO = new ContractDTO();
        contractDTO.setProposalId(proposal.getId());
        contractDTO.setDescription(contractDescription);
        contractDTO.setStatus(Contract.Status.PENDING.name());
        contractService.createContract(contractDTO);

        return convertToDTO(proposal);
    }   
public List<ProposalDTO> getProposalsByClientId(Long clientId, int page, int size) {
    PageRequest pageable = PageRequest.of(page, size);
    return proposalRepository.findByProject_Client_Id(clientId, pageable)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    private Proposal convertToEntity(ProposalDTO dto) {
        Proposal proposal = new Proposal();
        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        User freelancer = userRepository.findById(dto.getFreelancerId())
                .orElseThrow(() -> new IllegalArgumentException("Freelancer not found"));

        if (freelancer.getRole() != User.Role.FREELANCER) {
            throw new IllegalArgumentException("Only users with FREELANCER role can submit a proposal.");
        }

        proposal.setProject(project);
        proposal.setFreelancer(freelancer);
        proposal.setClientId(project.getClient().getId());
        proposal.setBidAmount(dto.getBidAmount());
        if (dto.getStatus() != null) {
            try {
                proposal.setStatus(Proposal.Status.valueOf(dto.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status value: " + dto.getStatus());
            }
        } else {
            proposal.setStatus(Proposal.Status.PENDING);
        }
        return proposal;
    }

    private ProposalDTO convertToDTO(Proposal proposal) {
        ProposalDTO dto = new ProposalDTO();
        dto.setId(proposal.getId());
        dto.setProjectId(proposal.getProject().getId());
        dto.setFreelancerId(proposal.getFreelancer().getId());
        dto.setClientId(proposal.getClientId());
        dto.setBidAmount(proposal.getBidAmount());
        dto.setStatus(proposal.getStatus().name());
        return dto;
    }

}

