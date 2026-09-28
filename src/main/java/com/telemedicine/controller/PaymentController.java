package com.telemedicine.controller;

import com.telemedicine.common.ApiResponse;
import com.telemedicine.dto.PaymentRequest;
import com.telemedicine.dto.PaymentResponse;
import com.telemedicine.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    // Constructor Injection
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // CREATE PAYMENT
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<PaymentResponse> createPayment(
            @Valid @RequestBody PaymentRequest request) {

        PaymentResponse response =
                paymentService.createPayment(request);

        return new ApiResponse<>(
                true,
                "Payment created successfully",
                response,
                LocalDateTime.now()
        );
    }

    // GET PAYMENT
    @GetMapping("/{id}")
    public ApiResponse<PaymentResponse> getPaymentById(
            @PathVariable Long id) {

        PaymentResponse response =
                paymentService.getPaymentById(id);

        return new ApiResponse<>(
                true,
                "Payment fetched successfully",
                response,
                LocalDateTime.now()
        );
    }

    // GET PAYMENT BY APPOINTMENT
    @GetMapping("/appointment/{appointmentId}")
    public ApiResponse<PaymentResponse> getPaymentByAppointment(
            @PathVariable Long appointmentId) {

        PaymentResponse response =
                paymentService.getPaymentByAppointmentId(appointmentId);

        return new ApiResponse<>(
                true,
                "Payment fetched successfully",
                response,
                LocalDateTime.now()
        );
    }

    // GET PATIENT PAYMENT HISTORY
    @GetMapping("/patient/{patientId}")
    public ApiResponse<List<PaymentResponse>> getPatientPayments(
            @PathVariable Long patientId) {

        List<PaymentResponse> response =
                paymentService.getPaymentsByPatientId(patientId);

        return new ApiResponse<>(
                true,
                "Patient payment history fetched successfully",
                response,
                LocalDateTime.now()
        );
    }

    // PAYMENT SUCCESS
    @PutMapping("/{id}/success")
    public ApiResponse<PaymentResponse> markPaymentSuccess(
            @PathVariable Long id) {

        PaymentResponse response =
                paymentService.markPaymentSuccess(id);

        return new ApiResponse<>(
                true,
                "Payment successful",
                response,
                LocalDateTime.now()
        );
    }

    // PAYMENT FAILED
    @PutMapping("/{id}/fail")
    public ApiResponse<PaymentResponse> markPaymentFailed(
            @PathVariable Long id) {

        PaymentResponse response =
                paymentService.markPaymentFailed(id);

        return new ApiResponse<>(
                true,
                "Payment marked as failed",
                response,
                LocalDateTime.now()
        );
    }
}