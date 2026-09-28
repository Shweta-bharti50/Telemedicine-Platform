package com.telemedicine.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.telemedicine.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long>{

	Optional<Patient> findByEmail(String email);
}
