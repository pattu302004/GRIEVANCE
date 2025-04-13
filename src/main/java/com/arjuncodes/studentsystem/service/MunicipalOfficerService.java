package com.arjuncodes.studentsystem.service;

import com.arjuncodes.studentsystem.model.MunicipalOfficer;

public interface MunicipalOfficerService {
    MunicipalOfficer findByUsername(String username);
}