package com.telemedicine.repository;

import com.telemedicine.entity.Payment;
import com.telemedicine.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByAppointmentId(Long appointmentId);

    List<Payment> findByPatientId(Long patientId);

    boolean existsByAppointmentIdAndStatus(
            Long appointmentId,
            PaymentStatus status
    );
}