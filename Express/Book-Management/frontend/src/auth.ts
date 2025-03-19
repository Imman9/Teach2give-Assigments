const api1: string = "http://localhost:3000";

// Save Token to Local Storage
function saveToken(token: string): void {
  localStorage.setItem("token", token);
}

//  Handle Login
document.getElementById("login")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = (document.getElementById("loginEmail") as HTMLInputElement)
    .value;
  const password = (
    document.getElementById("loginPassword") as HTMLInputElement
  ).value;

  try {
    const response = await fetch(`${api1}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token); // Save the token
      localStorage.setItem("userId", data.user.user_id); //save user_id
      localStorage.setItem("role", data.user.role_id); // Save the role
      window.location.href = "home.html"; // Redirect to home page
    } else {
      alert(data.error || "Login failed");
    }
  } catch (err) {
    console.error("Error during login:", err);
    alert("Server error");
  }
});

//  Handle Signup
document.getElementById("signup")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = (document.getElementById("signupName") as HTMLInputElement)
    .value;
  const email = (document.getElementById("signupEmail") as HTMLInputElement)
    .value;
  const password = (
    document.getElementById("signupPassword") as HTMLInputElement
  ).value;

  try {
    const response = await fetch(`${api1}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role_id: 2 }), // Assuming role_id 2 is for regular users
    });

    const data = await response.json();
    if (response.ok) {
      alert("Signup successful! Please login.");
      (document.getElementById("showLogin") as HTMLElement).click(); // Switch to login form
    } else {
      alert(data.error || "Signup failed");
    }
  } catch (err) {
    console.error("Error during signup:", err);
    alert("Server error");
  }
});

//  Toggle Between Login and Signup Forms
document.getElementById("showSignup")?.addEventListener("click", (e) => {
  e.preventDefault();
  (document.getElementById("loginForm") as HTMLDivElement).style.display =
    "none";
  (document.getElementById("signupForm") as HTMLDivElement).style.display =
    "block";
});

document.getElementById("showLogin")?.addEventListener("click", (e) => {
  e.preventDefault();
  (document.getElementById("signupForm") as HTMLDivElement).style.display =
    "none";
  (document.getElementById("loginForm") as HTMLDivElement).style.display =
    "block";
});
