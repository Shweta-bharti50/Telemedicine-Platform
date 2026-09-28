package com.telemedicine.controller;

import com.telemedicine.common.ApiResponse;
import com.telemedicine.dto.ConsultationRequest;
import com.telemedicine.dto.ConsultationResponse;
import com.telemedicine.service.ConsultationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    private final ConsultationService consultationService;

    public ConsultationController(
            ConsultationService consultationService) {

        this.consultationService = consultationService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<
            ApiResponse<ConsultationResponse>>
    createConsultation(
            @Valid @RequestBody
            ConsultationRequest request) {

        ConsultationResponse response =
                consultationService
                        .createConsultation(request);

        return new ResponseEntity<>(
                new ApiResponse<>(
                        true,
                        "Consultation created successfully",
                        response,
                        LocalDateTime.now()
                ),
                HttpStatus.CREATED
        );
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<ConsultationResponse>>
    getConsultation(
            @PathVariable Long id) {

        ConsultationResponse response =
                consultationService
                        .getConsultationById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Consultation fetched successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // PATIENT HISTORY
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<
            ApiResponse<List<ConsultationResponse>>>
    getPatientConsultations(
            @PathVariable Long patientId) {

        List<ConsultationResponse> consultations =
                consultationService
                        .getPatientConsultations(patientId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Patient consultation history fetched successfully",
                        consultations,
                        LocalDateTime.now()
                )
        );
    }

    // DOCTOR HISTORY
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<
            ApiResponse<List<ConsultationResponse>>>
    getDoctorConsultations(
            @PathVariable Long doctorId) {

        List<ConsultationResponse> consultations =
                consultationService
                        .getDoctorConsultations(doctorId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Doctor consultation history fetched successfully",
                        consultations,
                        LocalDateTime.now()
                )
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<
            ApiResponse<ConsultationResponse>>
    updateConsultation(
            @PathVariable Long id,
            @Valid @RequestBody
            ConsultationRequest request) {

        ConsultationResponse response =
                consultationService
                        .updateConsultation(id, request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Consultation updated successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // COMPLETE
    @PutMapping("/{id}/complete")
    public ResponseEntity<
            ApiResponse<ConsultationResponse>>
    completeConsultation(
            @PathVariable Long id) {

        ConsultationResponse response =
                consultationService
                        .completeConsultation(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Consultation completed successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }

    // CANCEL
    @PutMapping("/{id}/cancel")
    public ResponseEntity<
            ApiResponse<ConsultationResponse>>
    cancelConsultation(
            @PathVariable Long id) {

        ConsultationResponse response =
                consultationService
                        .cancelConsultation(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Consultation cancelled successfully",
                        response,
                        LocalDateTime.now()
                )
        );
    }
}