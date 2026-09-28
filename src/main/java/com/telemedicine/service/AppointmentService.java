package com.telemedicine.service;

import com.telemedicine.entity.Appointment;
import com.telemedicine.entity.AppointmentStatus;
import com.telemedicine.exception.ResourceNotFoundException;
import com.telemedicine.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository) {

        this.appointmentRepository = appointmentRepository;
    }

    public Appointment createAppointment(
            Appointment appointment) {

        boolean alreadyBooked =
                appointmentRepository
                        .existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                                appointment.getDoctorId(),
                                appointment.getAppointmentDate(),
                                appointment.getAppointmentTime(),
                                AppointmentStatus.CANCELLED);

        if (alreadyBooked) {

            throw new IllegalStateException(
                    "Doctor is already booked for this time");
        }

        appointment.setStatus(AppointmentStatus.PENDING);

        return appointmentRepository.save(appointment);
    }

    public Appointment getAppointmentById(Long id) {

        return appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Appointment not found with id: "
                                        + id));
    }

    public List<Appointment> getPatientAppointments(
            Long patientId) {

        return appointmentRepository
                .findByPatientId(patientId);
    }

    public List<Appointment> getDoctorAppointments(
            Long doctorId) {

        return appointmentRepository
                .findByDoctorId(doctorId);
    }

    public Appointment confirmAppointment(Long id) {

        Appointment appointment =
                getAppointmentById(id);

        appointment.setStatus(
                AppointmentStatus.CONFIRMED);

        return appointmentRepository.save(appointment);
    }

    public Appointment cancelAppointment(Long id) {

        Appointment appointment =
                getAppointmentById(id);

        appointment.setStatus(
                AppointmentStatus.CANCELLED);

        return appointmentRepository.save(appointment);
    }
}