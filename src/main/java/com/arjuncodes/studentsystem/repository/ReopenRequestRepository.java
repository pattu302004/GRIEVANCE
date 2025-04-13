package com.arjuncodes.studentsystem.repository;


import com.arjuncodes.studentsystem.model.ReopenRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReopenRequestRepository extends JpaRepository<ReopenRequest, Long> {
}