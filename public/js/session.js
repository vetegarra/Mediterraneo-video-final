// public/js/session.js

document.addEventListener("DOMContentLoaded", () => {
  const navSlot = document.getElementById("session-nav");
  if (!navSlot) return;

  const raw = localStorage.getItem("user");
  let user = null;

  try {
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  // Si NO hay usuario logueado → mostrar enlaces de login/registro
  if (!user) {
    navSlot.classList.remove("dropdown");
    navSlot.innerHTML = `
      <a class="nav-link" href="inicio_sesion.html">Iniciar sesión</a>
    `;
    return;
  }

  // Hay usuario logueado → dropdown con opciones
  const displayName = user.name && user.name.trim()
    ? user.name.trim()
    : user.email || "Usuario";

  navSlot.classList.add("dropdown");
  navSlot.innerHTML = `
    <a class="nav-link dropdown-toggle" href="#" id="userDropdown"
       role="button" data-bs-toggle="dropdown" aria-expanded="false">
      ${displayName}
    </a>
    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
      <li><a class="dropdown-item" href="perfil.html">Mi perfil</a></li>
      <li><a class="dropdown-item" href="cupones.html">Mis cupones</a></li>
      ${
        user.role === "Administrador"
          ? '<li><a class="dropdown-item" href="admin_dashboard.html">Panel de administración</a></li>'
          : ""
      }
      <li><hr class="dropdown-divider"></li>
      <li><button class="dropdown-item" id="btn-logout" type="button">Cerrar sesión</button></li>
    </ul>
  `;

  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "inicio_sesion.html";
    });
  }
});
