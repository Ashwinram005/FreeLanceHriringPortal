package com.examly.springapp.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.examly.springapp.model.Proposal;

public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    Optional<Proposal> findByProjectIdAndFreelancerId(Long projectId, Long freelancerId);

    boolean existsByProjectIdAndFreelancerId(Long projectId,Long freelancerId);
}
