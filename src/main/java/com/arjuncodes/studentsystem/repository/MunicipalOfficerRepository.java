package com.arjuncodes.studentsystem.repository;

import com.arjuncodes.studentsystem.model.MunicipalOfficer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MunicipalOfficerRepository extends JpaRepository<MunicipalOfficer, Integer> {
    MunicipalOfficer findByUsername(String username);
}