package com.examly.springapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.Milestone;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, Long>{

     List<Milestone> findByContractId(Long contractId);
     @Query("SELECT m FROM Milestone m WHERE m.contract.proposal.project.id = :projectId")
     List<Milestone> findByProjectId(@Param("projectId") Long projectId);


}
