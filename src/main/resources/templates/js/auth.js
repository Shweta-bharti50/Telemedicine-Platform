const API_BASE_URL = "http://localhost:8080";


const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document.getElementById("email").value;

            const password =
                document.getElementById("password").value;


            const message =
                document.getElementById("message");


            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/api/auth/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email: email,
                                password: password
                            })
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    message.innerText =
                        result.message ||
                        "Login failed";

                    message.style.color = "red";

                    return;
                }


                // Save JWT
                localStorage.setItem(
                    "token",
                    result.data.token
                );


                // Save user information
                localStorage.setItem(
                    "user",
                    JSON.stringify(result.data)
                );


                message.innerText =
                    "Login successful!";

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

}