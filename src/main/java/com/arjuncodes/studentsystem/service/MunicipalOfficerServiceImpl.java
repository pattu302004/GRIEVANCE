package com.arjuncodes.studentsystem.service;

import com.arjuncodes.studentsystem.model.MunicipalOfficer;
import com.arjuncodes.studentsystem.repository.MunicipalOfficerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MunicipalOfficerServiceImpl implements MunicipalOfficerService {
    @Autowired
    private MunicipalOfficerRepository municipalOfficerRepository;

    @Override
    public MunicipalOfficer findByUsername(String username) {
        return municipalOfficerRepository.findByUsername(username);
    }
}