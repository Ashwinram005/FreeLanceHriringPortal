package com.examly.springapp.controller;

import com.examly.springapp.dto.MilestoneDTO;
import com.examly.springapp.service.MilestoneService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/milestones")
@CrossOrigin(origins = "*")

public class MilestoneController {

    private final MilestoneService milestoneService;

    public MilestoneController(MilestoneService milestoneService) {
        this.milestoneService = milestoneService;
    }

    @PostMapping
    public MilestoneDTO createMilestone(@RequestBody MilestoneDTO dto) {
        return milestoneService.createMilestone(dto);
    }

    @GetMapping
    public List<MilestoneDTO> getAllMilestones() {
        return milestoneService.getAllMilestones();
    }

    @GetMapping("/{id}")
    public MilestoneDTO getMilestoneById(@PathVariable Long id) {
        return milestoneService.getMilestoneById(id);
    }

    @PutMapping("/{id}")
    public MilestoneDTO updateMilestone(@PathVariable Long id, @RequestBody MilestoneDTO dto) {
        return milestoneService.updateMilestone(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteMilestone(@PathVariable Long id) {
        milestoneService.deleteMilestone(id);
    }

    @GetMapping("/contract/{contractId}")
    public List<MilestoneDTO> getByContractId(@PathVariable Long contractId) {
        return milestoneService.getByContractId(contractId);
    }

    @GetMapping("/project/{projectId}")
    public List<MilestoneDTO> getByProjectId(@PathVariable Long projectId) {
        return milestoneService.getByProjectId(projectId);
    }

    @DeleteMapping("/{id}/file")
public ResponseEntity<String> deleteMilestoneFile(@PathVariable Long id) {
    milestoneService.deleteMilestoneFile(id);
    return ResponseEntity.ok("File deleted successfully");
}

}
