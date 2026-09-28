package com.telemedicine.service;

import com.telemedicine.entity.Doctor;
import com.telemedicine.exception.ResourceNotFoundException;
import com.telemedicine.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public Doctor createDoctor(Doctor doctor) {

        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {

        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long id) {

        return doctorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Doctor not found with id: " + id));
    }

    public List<Doctor> searchBySpecialization(
            String specialization) {

        return doctorRepository
                .findBySpecializationIgnoreCase(specialization);
    }

    public Doctor updateDoctor(Long id, Doctor doctor) {

        Doctor existingDoctor = getDoctorById(id);

        existingDoctor.setName(doctor.getName());
        existingDoctor.setPhone(doctor.getPhone());
        existingDoctor.setSpecialization(
                doctor.getSpecialization());
        existingDoctor.setQualification(
                doctor.getQualification());
        existingDoctor.setExperience(
                doctor.getExperience());
        existingDoctor.setConsultationFee(
                doctor.getConsultationFee());
        existingDoctor.setAvailability(
                doctor.getAvailability());
        existingDoctor.setStatus(
                doctor.getStatus());

        return doctorRepository.save(existingDoctor);
    }

    public void deleteDoctor(Long id) {

        Doctor doctor = getDoctorById(id);

        doctorRepository.delete(doctor);
    }
}