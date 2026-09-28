const API_BASE_URL = "http://localhost:8080";


const registerForm =
    document.getElementById("registerForm");


registerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const userData = {

            name:
                document.getElementById("name").value,

            email:
                document.getElementById("email").value,

            password:
                document.getElementById("password").value,

            phone:
                document.getElementById("phone").value,

            dateOfBirth:
                document.getElementById("dateOfBirth").value,

            gender:
                document.getElementById("gender").value,

            address:
                document.getElementById("address").value
        };


        const message =
            document.getElementById("message");


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/api/auth/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(userData)
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                message.innerText =
                    result.message ||
                    "Registration failed";

                message.style.color = "red";

                return;
            }


            // Save token
            localStorage.setItem(
                "token",
                result.data.token
            );


            localStorage.setItem(
                "user",
                JSON.stringify(result.data)
            );


            message.innerText =
                "Registration successful!";

            message.style.color = "green";


            setTimeout(function () {

                window.location.href =
                    "dashboard.html";

            }, 800);


        } catch (error) {

            console.error(error);

            message.innerText =
                "Unable to connect to server";

            message.style.color = "red";
        }

    }
);