package com.telemedicine.service;

import com.telemedicine.dto.PaymentRequest;
import com.telemedicine.dto.PaymentResponse;
import com.telemedicine.entity.Payment;
import com.telemedicine.entity.PaymentStatus;
import com.telemedicine.exception.ResourceNotFoundException;
import com.telemedicine.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    // Constructor injection
    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    // CREATE PAYMENT
    public PaymentResponse createPayment(PaymentRequest request) {

        boolean alreadyPaid =
                paymentRepository.existsByAppointmentIdAndStatus(
                        request.getAppointmentId(),
                        PaymentStatus.SUCCESS
                );

        if (alreadyPaid) {
            throw new IllegalStateException(
                    "Payment already completed for this appointment"
            );
        }

        Payment payment = new Payment();

        payment.setAppointmentId(request.getAppointmentId());
        payment.setPatientId(request.getPatientId());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());

        payment.setTransactionId(
                "TXN-" + UUID.randomUUID()
        );

        payment.setStatus(PaymentStatus.PENDING);

        Payment savedPayment =
                paymentRepository.save(payment);

        return mapToResponse(savedPayment);
    }


    // GET PAYMENT BY ID
    public PaymentResponse getPaymentById(Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found with id: " + id
                        )
                );

        return mapToResponse(payment);
    }


    // GET PAYMENT BY APPOINTMENT
    public PaymentResponse getPaymentByAppointmentId(
            Long appointmentId) {

        Payment payment =
                paymentRepository.findByAppointmentId(appointmentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Payment not found for appointment: "
                                                + appointmentId
                                )
                        );

        return mapToResponse(payment);
    }


    // GET PATIENT PAYMENT HISTORY
    public List<PaymentResponse> getPaymentsByPatientId(
            Long patientId) {

        return paymentRepository
                .findByPatientId(patientId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // PAYMENT SUCCESS
    public PaymentResponse markPaymentSuccess(Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found with id: " + id
                        )
                );

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            throw new IllegalStateException(
                    "Payment is already successful"
            );
        }

        if (payment.getStatus() == PaymentStatus.REFUNDED) {
            throw new IllegalStateException(
                    "Refunded payment cannot be marked successful"
            );
        }

        payment.setStatus(PaymentStatus.SUCCESS);

        Payment updatedPayment =
                paymentRepository.save(payment);

        return mapToResponse(updatedPayment);
    }


    // PAYMENT FAILED
    public PaymentResponse markPaymentFailed(Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found with id: " + id
                        )
                );

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            throw new IllegalStateException(
                    "Successful payment cannot be marked as failed"
            );
        }

        payment.setStatus(PaymentStatus.FAILED);

        Payment updatedPayment =
                paymentRepository.save(payment);

        return mapToResponse(updatedPayment);
    }


    // ENTITY -> RESPONSE DTO
    private PaymentResponse mapToResponse(Payment payment) {

        return new PaymentResponse(
                payment.getId(),
                payment.getAppointmentId(),
                payment.getPatientId(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getTransactionId(),
                payment.getStatus(),
                payment.getCreatedAt(),
                payment.getUpdatedAt()
        );
    }
}