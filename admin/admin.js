const API_URL = "http://localhost:5000";
const token = localStorage.getItem("token");

// Redirección si no hay login
if (!token) {
  alert("⚠️ No hay sesión iniciada. Ingresa primero en login.html");
  window.location.href = "login.html";
}

// Elementos
const messageDiv = document.getElementById("message");
const form = document.getElementById("newsForm");
const newsId = document.getElementById("newsId");
const titleInput = document.getElementById("title");
const summaryInput = document.getElementById("summary");
const contentInput = document.getElementById("content");
const imageInput = document.getElementById("image");

// Mostrar mensajes
function showMessage(text, type = "success") {
  messageDiv.textContent = text;
  messageDiv.className = "alert alert-" + type;
  messageDiv.classList.remove("d-none");
  setTimeout(() => messageDiv.classList.add("d-none"), 4000);
}

// Guardar noticia
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    e.stopPropagation();
    form.classList.add("was-validated");
    return;
  }

  const id = newsId.value;
  const formData = new FormData();
  formData.append("title", titleInput.value.trim());
  formData.append("summary", summaryInput.value.trim());
  formData.append("content", contentInput.value.trim());
  
 if (imageInput.files[0]) {
  formData.append("image", imageInput.files[0]);  // 👈 usa "image"
}

  console.log("➡️ FormData to send:");
  for (let pair of formData.entries()) {
    console.log("  " + pair[0], pair[1]);
  }

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/admin/news/${id}` : `${API_URL}/admin/news`;

  try {
    const res = await fetch(url, {
      method,
      headers: { "Authorization": "Bearer " + token },
      body: formData
    });

    if (!res.ok) throw new Error(await res.text());

    showMessage("✅ Noticia guardada correctamente");
    form.reset();
    form.classList.remove("was-validated");
    newsId.value = "";
    loadNews();
  } catch (err) {
    console.error("[create/edit] HTTP Error", err);
    showMessage("❌ Error creando noticia: " + err.message, "danger");
  }
});

// Cargar noticias
async function loadNews() {
  try {
    const res = await fetch(`${API_URL}/api/news`);
    if (!res.ok) throw new Error(await res.text());

    const news = await res.json();
    const list = document.getElementById("newsList");
    list.innerHTML = "";

    if (news.length === 0) {
      list.innerHTML = `<p class="text-muted">No hay noticias todavía</p>`;
      return;
    }

    news.forEach(n => {
      const div = document.createElement("div");
      div.classList.add("col-md-6", "col-lg-4");
      div.innerHTML = `
        <div class="card news-card h-100 shadow-sm">
          ${n.imageUrl ? `<img src="${n.imageUrl}" class="news-img" alt="Imagen noticia">` : ""}
          <div class="card-body">
            <h5 class="card-title fw-bold">${n.title}</h5>
            <p class="card-text text-muted"><em>${n.summary}</em></p>
            <p class="small">${n.content.substring(0, 100)}...</p>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-sm btn-warning" onclick="editNews('${n._id}','${n.title}','${n.summary}',\`${n.content}\`)">
              <i class="bi bi-pencil"></i> Editar
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteNews('${n._id}')">
              <i class="bi bi-trash"></i> Eliminar
            </button>
          </div>
        </div>
      `;
      list.appendChild(div);
    });
  } catch (err) {
    showMessage("❌ Error cargando noticias: " + err.message, "danger");
  }
}

// Editar noticia
function editNews(id, title, summary, content) {
  newsId.value = id;
  titleInput.value = title;
  summaryInput.value = summary;
  contentInput.value = content;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Eliminar noticia
async function deleteNews(id) {
  if (!confirm("¿Seguro que quieres eliminar esta noticia?")) return;

  try {
    const res = await fetch(`${API_URL}/admin/news/${id}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) throw new Error(await res.text());

    showMessage("✅ Noticia eliminada");
    loadNews();
  } catch (err) {
    showMessage("❌ Error eliminando noticia: " + err.message, "danger");
  }
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

// Inicial
loadNews();
