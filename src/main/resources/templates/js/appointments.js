const API_BASE_URL = "http://localhost:8080";

const token = localStorage.getItem("token");
const userString = localStorage.getItem("user");


// ================================
// AUTH CHECK
// ================================

if (!token || !userString) {
    window.location.href = "login.html";
}

const user = JSON.parse(userString);

const patientId = user.userId;

document.getElementById("userName").innerText = user.name;


// ================================
// LOAD APPOINTMENTS
// ================================

async function loadAppointments() {

    const container =
        document.getElementById("appointmentsContainer");

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/appointments/patient/${patientId}`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const result = await response.json();


        if (!response.ok) {

            container.innerHTML = `
                <div class="empty-state">
                    <h3>Unable to load appointments</h3>
                    <p>${result.message || "Something went wrong."}</p>
                </div>
            `;

            return;
        }


        const appointments = result.data || [];


        updateStatistics(appointments);


        if (appointments.length === 0) {

            container.innerHTML = `
                <div class="empty-state">

                    <h3>No appointments found</h3>

                    <p>
                        You haven't booked any appointments yet.
                    </p>

                    <br>

                    <a href="doctors.html"
                       class="primary-btn">
                        Find a Doctor
                    </a>

                </div>
            `;

            return;
        }


        // Sort latest appointment first

        appointments.sort((a, b) => {

            const dateA =
                new Date(`${a.appointmentDate}T${a.appointmentTime}`);

            const dateB =
                new Date(`${b.appointmentDate}T${b.appointmentTime}`);

            return dateA - dateB;
        });


        // Fetch doctor details

        const enrichedAppointments =
            await Promise.all(

                appointments.map(async appointment => {

                    try {

                        const doctorResponse =
                            await fetch(
                                `${API_BASE_URL}/api/doctors/${appointment.doctorId}`,
                                {
                                    headers: {
                                        "Authorization":
                                            `Bearer ${token}`
                                    }
                                }
                            );


                        const doctorResult =
                            await doctorResponse.json();


                        return {
                            ...appointment,
                            doctor: doctorResult.data || null
                        };

                    } catch (error) {

                        return {
                            ...appointment,
                            doctor: null
                        };
                    }

                })
            );


        renderAppointments(enrichedAppointments);

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="empty-state">

                <h3>Server connection failed</h3>

                <p>
                    Please make sure Spring Boot is running.
                </p>

            </div>
        `;
    }
}


// ================================
// STATISTICS
// ================================

function updateStatistics(appointments) {

    const total =
        appointments.length;

    const pending =
        appointments.filter(
            a => a.status === "PENDING"
        ).length;

    const confirmed =
        appointments.filter(
            a => a.status === "CONFIRMED"
        ).length;

    const completed =
        appointments.filter(
            a => a.status === "COMPLETED"
        ).length;


    document.getElementById("totalAppointments")
        .innerText = total;

    document.getElementById("pendingAppointments")
        .innerText = pending;

    document.getElementById("confirmedAppointments")
        .innerText = confirmed;

    document.getElementById("completedAppointments")
        .innerText = completed;
}


// ================================
// RENDER APPOINTMENTS
// ================================

function renderAppointments(appointments) {

    const container =
        document.getElementById("appointmentsContainer");


    container.innerHTML = "";


    appointments.forEach(appointment => {

        const doctor =
            appointment.doctor;


        const doctorName =
            doctor
                ? doctor.name
                : `Doctor #${appointment.doctorId}`;


        const specialization =
            doctor
                ? doctor.specialization
                : "Medical Specialist";


        const fee =
            doctor
                ? doctor.consultationFee
                : null;


        const formattedDate =
            formatDate(appointment.appointmentDate);


        const formattedTime =
            formatTime(appointment.appointmentTime);


        const statusClass =
            getStatusClass(appointment.status);


        const card =
            document.createElement("div");

        card.className = "appointment-card";


        card.innerHTML = `

            <div class="appointment-header">

                <h2>
                    ${doctorName}
                </h2>

                <span class="status-badge ${statusClass}">
                    ${appointment.status}
                </span>

            </div>


            <div class="appointment-details">

                <div class="detail-row">

                    <span class="detail-label">
                        Specialization
                    </span>

                    <span class="detail-value">
                        ${specialization}
                    </span>

                </div>


                <div class="detail-row">

                    <span class="detail-label">
                        Date
                    </span>

                    <span class="detail-value">
                        ${formattedDate}
                    </span>

                </div>


                <div class="detail-row">

                    <span class="detail-label">
                        Time
                    </span>

                    <span class="detail-value">
                        ${formattedTime}
                    </span>

                </div>


                <div class="detail-row">

                    <span class="detail-label">
                        Reason
                    </span>

                    <span class="detail-value">
                        ${appointment.reason}
                    </span>

                </div>


                ${
                    fee !== null
                    ?
                    `
                    <div class="detail-row">

                        <span class="detail-label">
                            Consultation Fee
                        </span>

                        <span class="detail-value">
                            ₹${fee}
                        </span>

                    </div>
                    `
                    :
                    ""
                }

            </div>


            <div class="appointment-actions">

                ${getActionButtons(appointment, fee)}

            </div>

        `;


        container.appendChild(card);

    });
}


// ================================
// ACTION BUTTONS
// ================================

function getActionButtons(appointment, fee) {

    let buttons = "";


    if (
        appointment.status === "PENDING" ||
        appointment.status === "CONFIRMED"
    ) {

        buttons += `
            <button
                class="cancel-btn"
                onclick="cancelAppointment(${appointment.id})">

                Cancel Appointment

            </button>
        `;
    }


    if (
        appointment.status === "CONFIRMED" &&
        fee !== null
    ) {

        buttons += `
            <button
                class="pay-btn"
                onclick="openPaymentModal(
                    ${appointment.id},
                    '${escapeHtml(
                        appointment.doctor
                            ? appointment.doctor.name
                            : "Doctor"
                    )}',
                    '${appointment.appointmentDate}',
                    '${appointment.appointmentTime}',
                    ${fee}
                )">

                💳 Pay Now

            </button>
        `;
    }


    if (appointment.status === "COMPLETED") {

        buttons += `
            <a
                href="consultations.html"
                class="view-btn">

                View Consultation

            </a>
        `;
    }


    if (appointment.status === "PENDING") {

        buttons += `
            <span class="view-btn">
                Waiting for confirmation
            </span>
        `;
    }


    return buttons;
}


// ================================
// CANCEL APPOINTMENT
// ================================

async function cancelAppointment(appointmentId) {

    const confirmed =
        confirm(
            "Are you sure you want to cancel this appointment?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/appointments/${appointmentId}/cancel`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            showMessage(
                result.message ||
                "Unable to cancel appointment.",
                "red"
            );

            return;
        }


        showMessage(
            "Appointment cancelled successfully.",
            "green"
        );


        loadAppointments();

    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to connect to server.",
            "red"
        );
    }
}


// ================================
// PAYMENT MODAL
// ================================

function openPaymentModal(
    appointmentId,
    doctorName,
    appointmentDate,
    appointmentTime,
    amount
) {

    document.getElementById("paymentModal")
        .style.display = "block";


    document.getElementById("paymentAppointmentId")
        .value = appointmentId;


    document.getElementById("paymentAmountValue")
        .value = amount;


    document.getElementById("paymentDoctor")
        .innerText = doctorName;


    document.getElementById("paymentAppointment")
        .innerText =
            `${formatDate(appointmentDate)}
             at
             ${formatTime(appointmentTime)}`;


    document.getElementById("paymentAmount")
        .innerText = amount;


    document.getElementById("paymentMessage")
        .innerText = "";
}


function closePaymentModal() {

    document.getElementById("paymentModal")
        .style.display = "none";
}


// Close modal when clicking outside

window.onclick = function(event) {

    const modal =
        document.getElementById("paymentModal");

    if (event.target === modal) {
        closePaymentModal();
    }
};


// ================================
// PAYMENT
// ================================

const paymentForm =
    document.getElementById("paymentForm");


paymentForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const appointmentId =
            Number(
                document.getElementById(
                    "paymentAppointmentId"
                ).value
            );


        const amount =
            Number(
                document.getElementById(
                    "paymentAmountValue"
                ).value
            );


        const paymentMethod =
            document.getElementById(
                "paymentMethod"
            ).value;


        const paymentMessage =
            document.getElementById(
                "paymentMessage"
            );


        if (!paymentMethod) {

            paymentMessage.innerText =
                "Please select a payment method.";

            paymentMessage.style.color = "red";

            return;
        }


        try {

            // Create payment

            const response =
                await fetch(
                    `${API_BASE_URL}/api/payments`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({

                            appointmentId:
                                appointmentId,

                            patientId:
                                patientId,

                            amount:
                                amount,

                            paymentMethod:
                                paymentMethod
                        })
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                paymentMessage.innerText =
                    result.message ||
                    "Payment failed.";

                paymentMessage.style.color =
                    "red";

                return;
            }


            const payment =
                result.data;


            // Mark payment as successful
            // This is a MOCK payment flow.

            const successResponse =
                await fetch(
                    `${API_BASE_URL}/api/payments/${payment.id}/success`,
                    {
                        method: "PUT",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`
                        }
                    }
                );


            if (!successResponse.ok) {

                paymentMessage.innerText =
                    "Payment created but status update failed.";

                paymentMessage.style.color =
                    "orange";

                return;
            }


            paymentMessage.innerText =
                "Payment successful!";

            paymentMessage.style.color =
                "green";


            setTimeout(() => {

                closePaymentModal();

                window.location.href =
                    "payments.html";

            }, 1000);


        } catch (error) {

            console.error(error);

            paymentMessage.innerText =
                "Unable to connect to server.";

            paymentMessage.style.color =
                "red";
        }

    }
);


// ================================
// HELPERS
// ================================

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(dateString + "T00:00:00");


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function formatTime(timeString) {

    if (!timeString) {
        return "-";
    }


    const parts =
        timeString.split(":");


    const hours =
        Number(parts[0]);


    const minutes =
        Number(parts[1]);


    const date =
        new Date();

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


function getStatusClass(status) {

    switch (status) {

        case "PENDING":
            return "status-pending";

        case "CONFIRMED":
            return "status-confirmed";

        case "CANCELLED":
            return "status-cancelled";

        case "COMPLETED":
            return "status-completed";

        default:
            return "";
    }
}


function showMessage(message, color) {

    const element =
        document.getElementById("message");

    element.innerText = message;

    element.style.color = color;


    setTimeout(() => {

        element.innerText = "";

    }, 3000);
}


function escapeHtml(value) {

    return String(value)
        .replace(/'/g, "\\'");
}


// ================================
// LOGOUT
// ================================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href =
        "login.html";
}


// ================================
// INITIAL LOAD
// ================================

loadAppointments();