// public/js/perfil.js

document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("user");
  let user = null;

  try {
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  // Si no hay usuario → mandar a login
  if (!user || !user._id) {
    window.location.href = "inicio_sesion.html";
    return;
  }

  const apiBase = "/api/users";

  const $email      = document.getElementById("perfil-email");
  const $nombre     = document.getElementById("perfil-nombre");
  const $run        = document.getElementById("perfil-run");
  const $nacimiento = document.getElementById("perfil-nacimiento");
  const $sexo       = document.getElementById("perfil-sexo");
  const $telefono   = document.getElementById("perfil-telefono");
  const $direccion  = document.getElementById("perfil-direccion");
  const $comuna     = document.getElementById("perfil-comuna");
  const $provincia  = document.getElementById("perfil-provincia");
  const $region     = document.getElementById("perfil-region");

  const $perfilForm = document.getElementById("perfil-form");
  const $alertOk    = document.getElementById("perfil-alert-success");
  const $alertErr   = document.getElementById("perfil-alert-error");

  const $btnEdit       = document.getElementById("btn-perfil-edit");
  const $btnSave       = document.getElementById("btn-perfil-save");
  const $btnSaveMobile = document.getElementById("btn-perfil-save-mobile");

  const editableInputs = Array.from(
    document.querySelectorAll(".perfil-editable")
  );

  function setEditing(isEditing) {
    editableInputs.forEach((el) => {
      el.disabled = !isEditing;
    });

    // Botones de edición/guardado
    if (isEditing) {
      $btnEdit.classList.add("d-none");
      $btnSave.classList.remove("d-none");
      if ($btnSaveMobile) $btnSaveMobile.classList.remove("d-none");
    } else {
      $btnEdit.classList.remove("d-none");
      $btnSave.classList.add("d-none");
      if ($btnSaveMobile) $btnSaveMobile.classList.add("d-none");
    }
  }

  function showPerfilAlert(ok) {
    if (ok) {
      $alertOk.classList.remove("d-none");
      $alertErr.classList.add("d-none");
      setTimeout(() => $alertOk.classList.add("d-none"), 2000);
    } else {
      $alertErr.classList.remove("d-none");
      $alertOk.classList.add("d-none");
    }
  }

  // Cargar datos completos del usuario
  async function loadProfile() {
    try {
      const res = await fetch(`${apiBase}/${user._id}`);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();

      $email.value      = data.email || "";
      $nombre.value     = data.name || "";
      $run.value        = data.run || "";
      $telefono.value   = data.telefono || "";
      $direccion.value  = data.direccion || "";
      $comuna.value     = data.comuna || "";
      $provincia.value  = data.provincia || "";
      $region.value     = data.region || "";
      $sexo.value       = data.sexo || "";

      if (data.birthDate) {
        const d = new Date(data.birthDate);
        const iso = d.toISOString().slice(0, 10);
        $nacimiento.value = iso;
      } else {
        $nacimiento.value = "";
      }

      // Al cargar, modo solo lectura
      setEditing(false);
    } catch (err) {
      console.error("Error cargando perfil:", err);
      showPerfilAlert(false);
    }
  }

  // Click en "Editar"
  $btnEdit.addEventListener("click", () => {
    setEditing(true);
    if ($nombre) $nombre.focus();
  });

  // Guardar cambios perfil
  $perfilForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    $alertOk.classList.add("d-none");
    $alertErr.classList.add("d-none");

    const payload = {
      name:      $nombre.value.trim(),
      run:       $run.value.trim(),
      birthDate: $nacimiento.value || null,
      sexo:      $sexo.value || "",
      telefono:  $telefono.value.trim(),
      direccion: $direccion.value.trim(),
      comuna:    $comuna.value.trim(),
      provincia: $provincia.value.trim(),
      region:    $region.value.trim(),
    };

    try {
      const res = await fetch(`${apiBase}/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const updated = await res.json();

      // actualizar info básica guardada en localStorage
      localStorage.setItem("user", JSON.stringify(updated));
      user = updated;

      setEditing(false);
      showPerfilAlert(true);
    } catch (err) {
      console.error("Error guardando perfil:", err);
      showPerfilAlert(false);
    }
  });

  // Inicializar
  loadProfile();
});
