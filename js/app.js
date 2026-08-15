// Inicialización de Supabase
const SUPABASE_URL = "https://TU_SUPABASE_URL.supabase.co"; // Reemplazar con tu URL
const SUPABASE_KEY = "TU_SUPABASE_ANON_KEY"; // Reemplazar con tu Key pública
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

document.addEventListener("DOMContentLoaded", () => {
  let currentScreen = 1;
  const totalScreens = 4;

  const form = document.getElementById("multiStepForm");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");
  const btnSubmit = document.getElementById("btnSubmit");
  const toast = document.getElementById("toast");

  // Manejo de visibilidad para campos condicionales
  form.addEventListener("change", (e) => {
    if (e.target.name === "organizacion") {
      const field = document.getElementById("field-organizaciones");
      if (e.target.value === "Sí") {
        field.classList.remove("hidden");
      } else {
        field.classList.add("hidden");
      }
    }

    if (e.target.name === "clubLeo") {
      const field = document.getElementById("field-club-leo");
      if (e.target.value === "Sí") {
        field.classList.remove("hidden");
      } else {
        field.classList.add("hidden");
      }
    }
  });

  // Navegación
  btnNext.addEventListener("click", () => {
    if (validateScreen(currentScreen)) {
      if (currentScreen < totalScreens) {
        currentScreen++;
        updateScreenView();
      }
    }
  });

  btnPrev.addEventListener("click", () => {
    if (currentScreen > 1) {
      currentScreen--;
      updateScreenView();
    }
  });

  function updateScreenView() {
    // Actualizar pantallas
    document.querySelectorAll(".screen").forEach((screen, idx) => {
      screen.classList.toggle("active", idx + 1 === currentScreen);
    });

    // Actualizar Stepper
    document.querySelectorAll(".stepper .step").forEach((step, idx) => {
      const stepNum = idx + 1;
      step.classList.toggle("active", stepNum === currentScreen);
      step.classList.toggle("completed", stepNum < currentScreen);
    });

    // Actualizar botones
    btnPrev.disabled = currentScreen === 1;

    if (currentScreen === totalScreens) {
      btnNext.classList.add("hidden");
      btnSubmit.classList.remove("hidden");
    } else {
      btnNext.classList.remove("hidden");
      btnSubmit.classList.add("hidden");
    }
  }

  // Validación por pantalla
  function validateScreen(screenNumber) {
    let valid = true;
    clearErrors();

    const screenEl = document.getElementById(`screen-${screenNumber}`);
    const formData = collectFormData();

    if (screenNumber === 1) {
      const reqs = ["nombreCompleto", "cedula", "fechaNacimiento", "talle", "ciudad"];
      reqs.forEach((field) => {
        if (!formData[field]) {
          markInputError(screenEl.querySelector(`[name="${field}"]`), "Este campo es requerido.");
          valid = false;
        }
      });
    }

    if (screenNumber === 2) {
      if (!formData.whatsapp) {
        markInputError(screenEl.querySelector('[name="whatsapp"]'), "Ingresá tu WhatsApp.");
        valid = false;
      }
      if (!formData.email || !formData.email.includes("@")) {
        markInputError(screenEl.querySelector('[name="email"]'), "Ingresá un correo válido.");
        valid = false;
      }
    }

    if (screenNumber === 3) {
      if (!formData.organizacion) {
        showToast("Seleccioná si formás parte de alguna organización.");
        valid = false;
      } else if (formData.organizacion === "Sí") {
        const organizaciones = form.querySelector('[name="forma_parte_organizacion"]');
        if (!organizaciones || !organizaciones.value.trim()) {
          markInputError(organizaciones, "Contanos de cuál/es formás parte.");
          valid = false;
        }
      }

      if (!formData.clubLeo) {
        showToast("Seleccioná si formás parte del Club Leo.");
        valid = false;
      } else if (formData.clubLeo === "Sí") {
        const clubLeoNombre = form.querySelector('[name="clubLeoNombre"]');
        if (!clubLeoNombre || !clubLeoNombre.value.trim()) {
          markInputError(clubLeoNombre, "Ingresá el nombre de tu Club Leo.");
          valid = false;
        }
        if (!formData.distrito) {
          showToast("Seleccioná tu Distrito.");
          valid = false;
        }
      }
    }

    if (screenNumber === 4) {
      if (!formData.traslado) {
        showToast("Seleccioná cómo pensás trasladarte.");
        valid = false;
      }
      if (!formData.compromiso_participacion || !formData.compromiso_reglamento) {
        showToast("Debes aceptar los compromisos para continuar.");
        valid = false;
      }
    }

    return valid;
  }

  function markInputError(inputEl, message) {
    if (!inputEl) return;
    
    // Si es radio button, marcar el contenedor
    if (inputEl.length) {
      inputEl = inputEl[0].closest(".form-group");
    } else {
      inputEl.classList.add("input-error");
    }

    const parent = inputEl.closest(".form-group") || inputEl.parentElement;
    let err = parent.querySelector(".field-error-msg");
    if (!err) {
      err = document.createElement("div");
      err.className = "field-error-msg";
      parent.appendChild(err);
    }
    err.textContent = message;
  }

  function clearErrors() {
    document.querySelectorAll(".input-error").forEach((el) => el.classList.remove("input-error"));
    document.querySelectorAll(".field-error-msg").forEach((el) => el.remove());
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 3000);
  }

  function collectFormData() {
    const data = {};
    const elements = form.querySelectorAll("input, textarea, select");

    elements.forEach((el) => {
      if (!el.name) return;

      if (el.type === "radio") {
        if (el.checked) data[el.name] = el.value;
      } else if (el.type === "checkbox") {
        data[el.name] = el.checked;
      } else {
        data[el.name] = el.value;
      }
    });

    return data;
  }

  // Envío de Formulario a Supabase
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateScreen(currentScreen)) return;

    btnSubmit.disabled = true;
    btnSubmit.textContent = "Guardando...";

    const formData = collectFormData();

    try {
      if (!supabase) {
        throw new Error("Supabase no está configurado correctamente.");
      }

      const { data, error } = await supabase
        .from("recreo_registros")
        .insert([formData]);

      if (error) throw error;

      showToast("¡Inscripción completada con éxito! 🎉");
      form.reset();
      currentScreen = 1;
      updateScreenView();
    } catch (err) {
      console.error("Error al guardar:", err);
      showToast("Ocurrió un error al enviar tu inscripción. Intentalo de nuevo.");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = "¡Enviar Inscripción! 🚀";
    }
  });
});