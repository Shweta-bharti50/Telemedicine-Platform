package com.telemedicine.dto;

import java.time.LocalDateTime;

import com.telemedicine.entity.ConsultationStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationResponse {

    private Long id;

    private Long appointmentId;

    private Long patientId;

    private Long doctorId;

    private String symptoms;

    private String diagnosis;

    private String notes;

    private String prescription;

    private LocalDateTime consultationDate;

    private ConsultationStatus status;

    private LocalDateTime createdAt;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getAppointmentId() {
		return appointmentId;
	}

	public void setAppointmentId(Long appointmentId) {
		this.appointmentId = appointmentId;
	}

	public Long getPatientId() {
		return patientId;
	}

	public void setPatientId(Long patientId) {
		this.patientId = patientId;
	}

	public Long getDoctorId() {
		return doctorId;
	}

	public void setDoctorId(Long doctorId) {
		this.doctorId = doctorId;
	}

	public String getSymptoms() {
		return symptoms;
	}

	public void setSymptoms(String symptoms) {
		this.symptoms = symptoms;
	}

	public String getDiagnosis() {
		return diagnosis;
	}

	public void setDiagnosis(String diagnosis) {
		this.diagnosis = diagnosis;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public String getPrescription() {
		return prescription;
	}

	public void setPrescription(String prescription) {
		this.prescription = prescription;
	}

	public LocalDateTime getConsultationDate() {
		return consultationDate;
	}

	public void setConsultationDate(LocalDateTime consultationDate) {
		this.consultationDate = consultationDate;
	}

	public ConsultationStatus getStatus() {
		return status;
	}

	public void setStatus(ConsultationStatus status) {
		this.status = status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public ConsultationResponse(Long id, Long appointmentId, Long patientId, Long doctorId, String symptoms,
			String diagnosis, String notes, String prescription, LocalDateTime consultationDate,
			ConsultationStatus status, LocalDateTime createdAt) {
		super();
		this.id = id;
		this.appointmentId = appointmentId;
		this.patientId = patientId;
		this.doctorId = doctorId;
		this.symptoms = symptoms;
		this.diagnosis = diagnosis;
		this.notes = notes;
		this.prescription = prescription;
		this.consultationDate = consultationDate;
		this.status = status;
		this.createdAt = createdAt;
	}

	public ConsultationResponse() {
		super();
	}
}