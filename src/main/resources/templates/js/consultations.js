const API_BASE_URL = "http://localhost:8080";


// ========================================
// AUTH
// ========================================

const token = localStorage.getItem("token");

const userString = localStorage.getItem("user");


if (!token || !userString) {

    window.location.href = "login.html";

}


const user = JSON.parse(userString);

const patientId = user.userId;


document.getElementById("userName").innerText =
    user.name;



// ========================================
// LOAD CONSULTATIONS
// ========================================

async function loadConsultations() {

    const container =
        document.getElementById(
            "consultationsContainer"
        );


    try {

        const response = await fetch(

            `${API_BASE_URL}/api/consultations/patient/${patientId}`,

            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }

        );


        const result =
            await response.json();


        if (!response.ok) {

            container.innerHTML = `

                <div class="empty-state">

                    <h3>
                        Unable to load consultations
                    </h3>

                    <p>
                        ${result.message ||
                        "Something went wrong."}
                    </p>

                </div>

            `;

            return;
        }


        const consultations =
            result.data || [];


        updateStatistics(
            consultations
        );


        if (consultations.length === 0) {

            container.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🩺
                    </div>

                    <h3>
                        No Consultations Found
                    </h3>

                    <p>
                        Your consultation records
                        will appear here.
                    </p>

                    <br>

                    <a href="appointments.html"
                       class="primary-btn">

                        View Appointments

                    </a>

                </div>

            `;

            return;
        }


        // Latest consultation first

        consultations.sort(
            (a, b) =>
                new Date(
                    b.consultationDate ||
                    b.createdAt
                )
                -
                new Date(
                    a.consultationDate ||
                    a.createdAt
                )
        );


        // Fetch doctor information

        const enriched =
            await Promise.all(

                consultations.map(
                    async consultation => {

                        try {

                            const response =
                                await fetch(

                                    `${API_BASE_URL}/api/doctors/${consultation.doctorId}`,

                                    {
                                        headers: {
                                            "Authorization":
                                                `Bearer ${token}`
                                        }
                                    }

                                );


                            const result =
                                await response.json();


                            return {
                                ...consultation,
                                doctor:
                                    result.data || null
                            };

                        } catch (error) {

                            return {
                                ...consultation,
                                doctor: null
                            };

                        }

                    }
                )

            );


        renderConsultations(
            enriched
        );


    } catch (error) {

        console.error(error);


        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    Server connection failed
                </h3>

                <p>
                    Please make sure Spring Boot
                    is running.
                </p>

            </div>

        `;

    }

}



// ========================================
// STATISTICS
// ========================================

function updateStatistics(
    consultations
) {

    const total =
        consultations.length;


    const scheduled =
        consultations.filter(
            c =>
                c.status === "SCHEDULED"
        ).length;


    const completed =
        consultations.filter(
            c =>
                c.status === "COMPLETED"
        ).length;


    const active =
        consultations.filter(
            c =>
                c.status === "IN_PROGRESS"
        ).length;


    document.getElementById(
        "totalConsultations"
    ).innerText = total;


    document.getElementById(
        "scheduledConsultations"
    ).innerText = scheduled;


    document.getElementById(
        "completedConsultations"
    ).innerText = completed;


    document.getElementById(
        "activeConsultations"
    ).innerText = active;

}



// ========================================
// RENDER
// ========================================

function renderConsultations(
    consultations
) {

    const container =
        document.getElementById(
            "consultationsContainer"
        );


    container.innerHTML = "";


    consultations.forEach(
        consultation => {

            const doctor =
                consultation.doctor;


            const doctorName =
                doctor
                    ? doctor.name
                    : `Doctor #${consultation.doctorId}`;


            const specialization =
                doctor
                    ? doctor.specialization
                    : "Medical Specialist";


            const date =
                formatDate(
                    consultation.consultationDate ||
                    consultation.createdAt
                );


            const statusClass =
                getStatusClass(
                    consultation.status
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "consultation-card";


            card.innerHTML = `

                <div class="consultation-header">

                    <div>

                        <h2>
                            ${doctorName}
                        </h2>

                        <p>
                            ${specialization}
                        </p>

                    </div>


                    <span class="
                        consultation-status
                        ${statusClass}
                    ">

                        ${consultation.status}

                    </span>

                </div>


                <div class="consultation-info">

                    <div>

                        <span>
                            📅 Date
                        </span>

                        <strong>
                            ${date}
                        </strong>

                    </div>


                    <div>

                        <span>
                            🆔 Consultation ID
                        </span>

                        <strong>
                            #${consultation.id}
                        </strong>

                    </div>


                    <div>

                        <span>
                            📋 Appointment ID
                        </span>

                        <strong>
                            #${consultation.appointmentId}
                        </strong>

                    </div>

                </div>


                <div class="diagnosis-preview">

                    <span>
                        Diagnosis
                    </span>

                    <p>

                        ${
                            consultation.diagnosis
                                ? consultation.diagnosis
                                : "Diagnosis not available yet."
                        }

                    </p>

                </div>


                <div class="consultation-actions">

                    <button
                        class="view-btn"
                        onclick="viewConsultation(
                            ${consultation.id}
                        )">

                        View Details

                    </button>


                    ${
                        consultation.prescription
                        ?
                        `
                        <button
                            class="prescription-btn"
                            onclick="viewConsultation(
                                ${consultation.id}
                            )">

                            💊 Prescription

                        </button>
                        `
                        :
                        ""
                    }

                </div>

            `;


            container.appendChild(card);

        }
    );

}



// ========================================
// VIEW DETAILS
// ========================================

async function viewConsultation(
    consultationId
) {

    const modal =
        document.getElementById(
            "consultationModal"
        );


    const details =
        document.getElementById(
            "consultationDetails"
        );


    modal.style.display =
        "block";


    details.innerHTML = `

        <div class="loading">

            Loading consultation details...

        </div>

    `;


    try {

        const response =
            await fetch(

                `${API_BASE_URL}/api/consultations/${consultationId}`,

                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }

            );


        const result =
            await response.json();


        if (!response.ok) {

            details.innerHTML = `

                <p class="error-message">

                    ${result.message ||
                    "Unable to load consultation."}

                </p>

            `;

            return;
        }


        const consultation =
            result.data;


        details.innerHTML = `

            <div class="consultation-detail-box">


                <div class="detail-section">

                    <h3>
                        Consultation Information
                    </h3>


                    <p>

                        <strong>
                            Consultation ID:
                        </strong>

                        #${consultation.id}

                    </p>


                    <p>

                        <strong>
                            Appointment ID:
                        </strong>

                        #${consultation.appointmentId}

                    </p>


                    <p>

                        <strong>
                            Date:
                        </strong>

                        ${
                            formatDate(
                                consultation.consultationDate ||
                                consultation.createdAt
                            )
                        }

                    </p>


                    <p>

                        <strong>
                            Status:
                        </strong>

                        <span class="
                            consultation-status
                            ${getStatusClass(
                                consultation.status
                            )}
                        ">

                            ${consultation.status}

                        </span>

                    </p>

                </div>



                <div class="detail-section">

                    <h3>
                        Symptoms
                    </h3>

                    <p>
                        ${
                            consultation.symptoms ||
                            "No symptoms recorded."
                        }
                    </p>

                </div>



                <div class="detail-section">

                    <h3>
                        Diagnosis
                    </h3>

                    <p>
                        ${
                            consultation.diagnosis ||
                            "Diagnosis not available."
                        }
                    </p>

                </div>



                <div class="detail-section">

                    <h3>
                        Doctor's Notes
                    </h3>

                    <p>
                        ${
                            consultation.notes ||
                            "No notes available."
                        }
                    </p>

                </div>



                <div class="detail-section prescription-box">

                    <h3>
                        💊 Prescription
                    </h3>

                    <p>
                        ${
                            consultation.prescription ||
                            "No prescription available."
                        }
                    </p>

                </div>

            </div>

        `;


    } catch (error) {

        console.error(error);


        details.innerHTML = `

            <p class="error-message">

                Unable to connect to server.

            </p>

        `;

    }

}



// ========================================
// CLOSE MODAL
// ========================================

function closeConsultationModal() {

    document.getElementById(
        "consultationModal"
    ).style.display = "none";

}


window.onclick = function(event) {

    const modal =
        document.getElementById(
            "consultationModal"
        );


    if (event.target === modal) {

        closeConsultationModal();

    }

};



// ========================================
// HELPERS
// ========================================

function formatDate(
    dateString
) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}



function getStatusClass(
    status
) {

    switch (status) {

        case "SCHEDULED":
            return "consultation-scheduled";

        case "IN_PROGRESS":
            return "consultation-progress";

        case "COMPLETED":
            return "consultation-completed";

        case "CANCELLED":
            return "consultation-cancelled";

        default:
            return "";

    }

}



// ========================================
// LOGOUT
// ========================================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href =
        "login.html";

}



// ========================================
// INITIAL LOAD
// ========================================

loadConsultations();