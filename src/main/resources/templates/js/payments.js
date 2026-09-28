const API_BASE_URL = "http://localhost:8080";


// ========================================
// AUTH CHECK
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
// LOAD PAYMENTS
// ========================================

async function loadPayments() {

    const tableBody =
        document.getElementById(
            "paymentsTableBody"
        );


    try {

        const response = await fetch(

            `${API_BASE_URL}/api/payments/patient/${patientId}`,

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

            tableBody.innerHTML = `

                <tr>

                    <td colspan="6"
                        class="empty-cell">

                        ${result.message ||
                        "Unable to load payments."}

                    </td>

                </tr>

            `;

            return;

        }


        const payments =
            result.data || [];


        updatePaymentStatistics(
            payments
        );


        if (payments.length === 0) {

            tableBody.innerHTML = `

                <tr>

                    <td colspan="6"
                        class="empty-cell">

                        <div class="payment-empty">

                            <div class="empty-icon">
                                💳
                            </div>

                            <h3>
                                No Payments Found
                            </h3>

                            <p>
                                Your payment history
                                will appear here.
                            </p>

                            <br>

                            <a href="appointments.html"
                               class="primary-btn">

                                View Appointments

                            </a>

                        </div>

                    </td>

                </tr>

            `;

            return;

        }


        // Latest payment first

        payments.sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        );


        renderPayments(payments);


    } catch (error) {

        console.error(error);


        tableBody.innerHTML = `

            <tr>

                <td colspan="6"
                    class="empty-cell">

                    <h3>
                        Server connection failed
                    </h3>

                    <p>
                        Please make sure Spring Boot
                        is running on port 8080.
                    </p>

                </td>

            </tr>

        `;

    }

}



// ========================================
// UPDATE STATISTICS
// ========================================

function updatePaymentStatistics(
    payments
) {


    const total =
        payments.length;


    const successful =
        payments.filter(
            payment =>
                payment.status === "SUCCESS"
        ).length;


    const pending =
        payments.filter(
            payment =>
                payment.status === "PENDING"
        ).length;


    const totalAmount =
        payments
            .filter(
                payment =>
                    payment.status === "SUCCESS"
            )
            .reduce(
                (sum, payment) =>
                    sum + Number(payment.amount || 0),
                0
            );


    document.getElementById(
        "totalPayments"
    ).innerText = total;


    document.getElementById(
        "successfulPayments"
    ).innerText = successful;


    document.getElementById(
        "pendingPayments"
    ).innerText = pending;


    document.getElementById(
        "totalAmount"
    ).innerText =
        totalAmount.toFixed(2);

}



// ========================================
// RENDER PAYMENTS
// ========================================

function renderPayments(payments) {


    const tableBody =
        document.getElementById(
            "paymentsTableBody"
        );


    tableBody.innerHTML = "";


    payments.forEach(payment => {


        const row =
            document.createElement("tr");


        const transactionId =
            payment.transactionId ||
            "Not generated";


        const formattedAmount =
            Number(payment.amount || 0)
                .toFixed(2);


        const paymentMethod =
            formatPaymentMethod(
                payment.paymentMethod
            );


        const statusClass =
            getPaymentStatusClass(
                payment.status
            );


        const formattedDate =
            formatDateTime(
                payment.createdAt
            );


        row.innerHTML = `

            <td>

                <div class="transaction-info">

                    <strong>
                        ${transactionId}
                    </strong>

                    <span>
                        Payment #${payment.id}
                    </span>

                </div>

            </td>


            <td>

                <span class="appointment-id">

                    #${payment.appointmentId}

                </span>

            </td>


            <td>

                <strong class="payment-amount">

                    ₹${formattedAmount}

                </strong>

            </td>


            <td>

                <span class="payment-method">

                    ${paymentMethod}

                </span>

            </td>


            <td>

                <span class="
                    payment-status
                    ${statusClass}
                ">

                    ${payment.status}

                </span>

            </td>


            <td>

                <span class="payment-date">

                    ${formattedDate}

                </span>

            </td>

        `;


        tableBody.appendChild(row);

    });

}



// ========================================
// FORMAT PAYMENT METHOD
// ========================================

function formatPaymentMethod(
    method
) {

    switch (method) {

        case "UPI":
            return "UPI";

        case "CARD":
            return "Card";

        case "NET_BANKING":
            return "Net Banking";

        default:
            return method || "-";

    }

}



// ========================================
// STATUS CSS CLASS
// ========================================

function getPaymentStatusClass(
    status
) {

    switch (status) {

        case "SUCCESS":
            return "payment-success";

        case "PENDING":
            return "payment-pending";

        case "FAILED":
            return "payment-failed";

        case "REFUNDED":
            return "payment-refunded";

        default:
            return "";

    }

}



// ========================================
// FORMAT DATE + TIME
// ========================================

function formatDateTime(
    dateTime
) {

    if (!dateTime) {
        return "-";
    }


    const date =
        new Date(dateTime);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    )
    + " "
    +
    date.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

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

loadPayments();