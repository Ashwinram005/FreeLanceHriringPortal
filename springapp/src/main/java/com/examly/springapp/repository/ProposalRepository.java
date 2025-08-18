package com.examly.springapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.Proposal;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {
   Optional<Proposal> findByProjectIdAndFreelancerId(Long projectId, Long freelancerId);

   List<Proposal> findByProject_Client_Id(Long clientId);
   List<Proposal> findByFreelancerId(Long freelancerId);
   
}
