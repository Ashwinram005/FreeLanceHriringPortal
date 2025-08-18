package com.examly.springapp.controller;

import com.examly.springapp.dto.ContractDTO;
import com.examly.springapp.service.ContractService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contracts")
@CrossOrigin(origins = "*")
public class ContractController {

    private final ContractService contractService;

    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @PostMapping
    public ContractDTO createContract(@RequestBody ContractDTO dto) {
        return contractService.createContract(dto);
    }

    @GetMapping
    public List<ContractDTO> getAllContracts() {
        return contractService.getAllContracts();
    }

    @GetMapping("/{id}")
    public ContractDTO getContractById(@PathVariable Long id) {
        return contractService.getContractById(id);
    }

    @PutMapping("/{id}")
    public ContractDTO updateContract(@PathVariable Long id, @RequestBody ContractDTO dto) {
        return contractService.updateContract(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteContract(@PathVariable Long id) {
        contractService.deleteContract(id);
    }

    @GetMapping("/client/{clientId}")
    public List<ContractDTO> getByClientId(@PathVariable Long clientId) {
        return contractService.getByClientId(clientId);
    }

    @GetMapping("/freelancer/{freelancerId}")
    public List<ContractDTO> getByFreelancerId(@PathVariable Long freelancerId) {
        return contractService.getByFreelancerId(freelancerId);
    }

    @GetMapping("/project/{projectId}")
    public ContractDTO getByProjectId(@PathVariable Long projectId) {
        return contractService.getByProjectId(projectId);
    }

}
