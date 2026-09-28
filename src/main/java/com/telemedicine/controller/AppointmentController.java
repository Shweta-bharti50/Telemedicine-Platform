package com.telemedicine.controller;

import com.telemedicine.entity.Appointment;
import com.telemedicine.service.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(
            AppointmentService appointmentService) {

        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(
            @RequestBody Appointment appointment) {

        return new ResponseEntity<>(
                appointmentService
                        .createAppointment(appointment),
                HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointment(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                appointmentService
                        .getAppointmentById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>>
    getPatientAppointments(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                appointmentService
                        .getPatientAppointments(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>>
    getDoctorAppointments(
            @PathVariable Long doctorId) {

        return ResponseEntity.ok(
                appointmentService
                        .getDoctorAppointments(doctorId));
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<Appointment>
    confirmAppointment(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                appointmentService
                        .confirmAppointment(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Appointment>
    cancelAppointment(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                appointmentService
                        .cancelAppointment(id));
    }
}