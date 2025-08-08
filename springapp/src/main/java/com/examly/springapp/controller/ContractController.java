package com.examly.springapp.controller;

import com.examly.springapp.model.Contract;
import com.examly.springapp.service.ContractService;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    @Autowired
    private ContractService contractService;

    @PostMapping
    public ResponseEntity<Contract> create(@Valid @RequestBody Contract contract) {
        Contract saved = contractService.createContract(contract);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Contract> getAllContract(){
        return contractService.getAllContract();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Contract> updateDate(@RequestBody Contract contract,@PathVariable Long id){
        Contract upd= contractService.updateDate(contract, id);
        return ResponseEntity.ok(upd);
    }
}
