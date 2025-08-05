package com.examly.springapp.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.examly.springapp.model.Contract;

public interface ContractRepository extends JpaRepository<Contract, Long> {
    Optional<Contract> findByProposalId(Long proposalId);
}
