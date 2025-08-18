package com.examly.springapp.repository;

import com.examly.springapp.model.Contract;

import org.hibernate.annotations.processing.Find;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ContractRepository extends JpaRepository<Contract, Long> {

    @Query("SELECT c FROM Contract c WHERE c.proposal.clientId = :clientId")
    List<Contract> findByClientId(Long clientId);

    @Query("SELECT c FROM Contract c WHERE c.proposal.freelancer.id = :freelancerId")
    List<Contract> findByFreelancerId(Long freelancerId);

    Optional<Contract> findByProposalProjectId(Long projectId);

}
