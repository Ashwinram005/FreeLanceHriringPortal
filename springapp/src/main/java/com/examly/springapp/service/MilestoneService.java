package com.examly.springapp.service;

import com.examly.springapp.dto.MilestoneDTO;
import com.examly.springapp.model.Contract;
import com.examly.springapp.model.Milestone;
import com.examly.springapp.repository.ContractRepository;
import com.examly.springapp.repository.MilestoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final ContractRepository contractRepository;

    public MilestoneService(MilestoneRepository milestoneRepository, ContractRepository contractRepository) {
        this.milestoneRepository = milestoneRepository;
        this.contractRepository = contractRepository;
    }

    public MilestoneDTO createMilestone(MilestoneDTO dto) {
        Contract contract = contractRepository.findById(dto.getContractId())
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        Milestone milestone = new Milestone();
        milestone.setContract(contract);
        milestone.setDescription(dto.getDescription());
        milestone.setStatus(Milestone.Status.valueOf(dto.getStatus()));

        Milestone saved = milestoneRepository.save(milestone);
        return mapToDTO(saved);
    }

    public List<MilestoneDTO> getAllMilestones() {
        return milestoneRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public MilestoneDTO getMilestoneById(Long id) {
        return milestoneRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
    }

    public MilestoneDTO updateMilestone(Long id, MilestoneDTO dto) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));

        milestone.setDescription(dto.getDescription());
        milestone.setStatus(Milestone.Status.valueOf(dto.getStatus()));

        return mapToDTO(milestoneRepository.save(milestone));
    }

    public void deleteMilestone(Long id) {
        milestoneRepository.deleteById(id);
    }

    public List<MilestoneDTO> getByContractId(Long contractId) {
        return milestoneRepository.findByContractId(contractId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<MilestoneDTO> getByProjectId(Long projectId) {
        return milestoneRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void deleteMilestoneFile(Long id) {
    Milestone milestone = milestoneRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Milestone not found"));

    milestone.setFileName(null); 
    milestone.setFilePath(null); 
    milestoneRepository.save(milestone);
}

    private MilestoneDTO mapToDTO(Milestone milestone) {
        return new MilestoneDTO(
                milestone.getId(),
                milestone.getContract().getId(),
                milestone.getDescription(),
                milestone.getStatus().name(),
                milestone.getFileName(),
                milestone.getFilePath()       
                );
    }
}
