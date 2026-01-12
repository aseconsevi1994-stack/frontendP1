// login.js — versión corregida y con debug
const API_URL = "http://localhost:5000";
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// Oculta el mensaje de error cuando el usuario empieza a escribir
[usernameInput, passwordInput].forEach(inp => {
  inp.addEventListener("input", () => errorMessage.classList.add("d-none"));
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  errorMessage.classList.add("d-none");

  if (!username || !password) {
    errorMessage.textContent = "⚠️ Todos los campos son obligatorios.";
    errorMessage.classList.remove("d-none");
    return;
  }

  // Mostrar en consola lo que se enviará (debug)
  console.log("➡️ Enviando login", { username, password });

  try {
    const res = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    console.log("⬅️ Código HTTP:", res.status, res.statusText);
    const ct = res.headers.get("content-type") || "";
    let body;

    // Manejo seguro del body (JSON o texto)
    if (ct.includes("application/json")) {
      body = await res.json();
    } else {
      body = { message: await res.text() };
    }
    console.log("⬅️ Body:", body);

    // ✅ Tu backend devuelve accessToken y refreshToken
    if (res.ok && body.accessToken) {
      // Guardamos los tokens
      localStorage.setItem("token", body.accessToken);
      localStorage.setItem("refreshToken", body.refreshToken);

      console.log("✅ Tokens guardados en localStorage");

      // Redirigimos al panel de admin
      window.location.href = "admin.html";
      return;
    }

    // Si no es ok, mostramos mensaje del servidor
    const serverMsg = body.message || body.error || JSON.stringify(body) || "Usuario o contraseña incorrectos.";
    errorMessage.textContent = `(${res.status}) ${serverMsg}`;
    errorMessage.classList.remove("d-none");

  } catch (err) {
    console.error("⚠️ Error en la petición:", err);
    errorMessage.textContent = "Error al conectar con el servidor. Revisa que el backend esté corriendo y CORS esté permitido.";
    errorMessage.classList.remove("d-none");
  }
});
