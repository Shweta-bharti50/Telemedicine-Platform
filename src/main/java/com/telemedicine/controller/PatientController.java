package com.telemedicine.controller;

import com.telemedicine.common.ApiResponse;
import com.telemedicine.dto.PatientRequest;
import com.telemedicine.dto.PatientResponse;
import com.telemedicine.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PatientResponse>> createPatient(
            @Valid @RequestBody PatientRequest request) {

        PatientResponse response =
                patientService.createPatient(request);

        return new ResponseEntity<>(
                new ApiResponse<>(
                        true,
                        "Patient created successfully",
                        response,
                        LocalDateTime.now()
                ),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PatientResponse>>>
    getAllPatients() {

        List<PatientResponse> patients =
                patientService.getAllPatients();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Patients fetched successfully",
                        patients,
                        LocalDateTime.now()
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientResponse>>
    getPatientById(@PathVariable Long id) {

        PatientResponse patient =
                patientService.getPatientById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Patient fetched successfully",
                        patient,
                        LocalDateTime.now()
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientResponse>>
    updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody PatientRequest request) {

        PatientResponse patient =
                patientService.updatePatient(id, request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Patient updated successfully",
                        patient,
                        LocalDateTime.now()
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>>
    deletePatient(@PathVariable Long id) {

        patientService.deletePatient(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Patient deleted successfully",
                        null,
                        LocalDateTime.now()
                )
        );
    }
}