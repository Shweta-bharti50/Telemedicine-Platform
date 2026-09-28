package com.telemedicine.service;

import com.telemedicine.dto.ConsultationRequest;
import com.telemedicine.dto.ConsultationResponse;
import com.telemedicine.entity.Consultation;
import com.telemedicine.entity.ConsultationStatus;
import com.telemedicine.exception.ResourceNotFoundException;
import com.telemedicine.repository.ConsultationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConsultationService {

    private final ConsultationRepository consultationRepository;

    public ConsultationService(
            ConsultationRepository consultationRepository) {

        this.consultationRepository = consultationRepository;
    }

    // CREATE
    public ConsultationResponse createConsultation(
            ConsultationRequest request) {

        // One appointment should have only one consultation
        if (consultationRepository
                .findByAppointmentId(request.getAppointmentId())
                .isPresent()) {

            throw new IllegalStateException(
                    "Consultation already exists for this appointment"
            );
        }

        Consultation consultation = new Consultation();

        consultation.setAppointmentId(
                request.getAppointmentId());

        consultation.setPatientId(
                request.getPatientId());

        consultation.setDoctorId(
                request.getDoctorId());

        consultation.setSymptoms(
                request.getSymptoms());

        consultation.setDiagnosis(
                request.getDiagnosis());

        consultation.setNotes(
                request.getNotes());

        consultation.setPrescription(
                request.getPrescription());

        consultation.setConsultationDate(
                LocalDateTime.now());

        consultation.setStatus(
                ConsultationStatus.IN_PROGRESS);

        Consultation saved =
                consultationRepository.save(consultation);

        return mapToResponse(saved);
    }

    // GET BY ID
    public ConsultationResponse getConsultationById(
            Long id) {

        Consultation consultation =
                consultationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Consultation not found with id: "
                                                + id));

        return mapToResponse(consultation);
    }

    // GET PATIENT CONSULTATIONS
    public List<ConsultationResponse>
    getPatientConsultations(Long patientId) {

        return consultationRepository
                .findByPatientId(patientId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // GET DOCTOR CONSULTATIONS
    public List<ConsultationResponse>
    getDoctorConsultations(Long doctorId) {

        return consultationRepository
                .findByDoctorId(doctorId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // UPDATE
    public ConsultationResponse updateConsultation(
            Long id,
            ConsultationRequest request) {

        Consultation consultation =
                consultationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Consultation not found with id: "
                                                + id));

        consultation.setSymptoms(
                request.getSymptoms());

        consultation.setDiagnosis(
                request.getDiagnosis());

        consultation.setNotes(
                request.getNotes());

        consultation.setPrescription(
                request.getPrescription());

        Consultation updated =
                consultationRepository.save(consultation);

        return mapToResponse(updated);
    }

    // COMPLETE CONSULTATION
    public ConsultationResponse completeConsultation(
            Long id) {

        Consultation consultation =
                consultationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Consultation not found with id: "
                                                + id));

        consultation.setStatus(
                ConsultationStatus.COMPLETED);

        Consultation updated =
                consultationRepository.save(consultation);

        return mapToResponse(updated);
    }

    // CANCEL CONSULTATION
    public ConsultationResponse cancelConsultation(
            Long id) {

        Consultation consultation =
                consultationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Consultation not found with id: "
                                                + id));

        consultation.setStatus(
                ConsultationStatus.CANCELLED);

        Consultation updated =
                consultationRepository.save(consultation);

        return mapToResponse(updated);
    }

    // ENTITY → RESPONSE DTO
    private ConsultationResponse mapToResponse(
            Consultation consultation) {

        return new ConsultationResponse(
                consultation.getId(),
                consultation.getAppointmentId(),
                consultation.getPatientId(),
                consultation.getDoctorId(),
                consultation.getSymptoms(),
                consultation.getDiagnosis(),
                consultation.getNotes(),
                consultation.getPrescription(),
                consultation.getConsultationDate(),
                consultation.getStatus(),
                consultation.getCreatedAt()
        );
    }
}