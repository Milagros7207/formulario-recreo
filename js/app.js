/* =========================================================
   RECREO — APP.JS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("recreoForm");
  const screens = [...document.querySelectorAll(".screen")];

  const progressFill = document.getElementById("progressFill");
  const progressPercent = document.getElementById("progressPercent");
  const stepLabel = document.getElementById("stepLabel");
  const progressDots = [...document.querySelectorAll(".progress-dots span")];

  const transitionOverlay = document.getElementById("transitionOverlay");
  const successScreen = document.getElementById("successScreen");
  const closeSuccess = document.getElementById("closeSuccess");
  const toast = document.getElementById("toast");
  const confetti = document.getElementById("confetti");

  let currentScreen = 0;

  const totalScreens = screens.length;

  /* =========================================================
     DATOS DEL FORMULARIO
     ========================================================= */

  const formData = {
    organizacion: "",
    clubLeo: "",
    distrito: "",
    habilidades: []
  };

  /* =========================================================
     ETIQUETAS DE PROGRESO
     ========================================================= */

  const stepLabels = [
    "ENTRADA",
    "CONOCERTE",
    "TU MUNDO",
    "EXPECTATIVAS",
    "LA MOCHILA",
    "RECREADOR/A",
    "PREPARATE",
    "COMPROMISO"
  ];

  /* =========================================================
     MOSTRAR PANTALLA
     ========================================================= */

  function showScreen(index, animate = true) {
    if (index < 0 || index >= totalScreens) return;

    screens.forEach((screen, i) => {
      screen.classList.toggle("active", i === index);
    });

    currentScreen = index;

    const percent =
      totalScreens <= 1
        ? 0
        : Math.round((index / (totalScreens - 1)) * 100);

    if (progressFill) {
      progressFill.style.width = `${percent}%`;
    }

    if (progressPercent) {
      progressPercent.textContent = `${percent}%`;
    }

    if (stepLabel) {
      stepLabel.textContent = stepLabels[index] || `PASO ${index + 1}`;
    }

    progressDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
      dot.classList.toggle("completed", i < index);
    });

    window.scrollTo({
      top: 0,
      behavior: animate ? "smooth" : "auto"
    });
  }

  /* =========================================================
     TRANSICIÓN
     ========================================================= */

  function goToScreen(index) {
    if (index === currentScreen) return;

    if (transitionOverlay) {
      transitionOverlay.classList.add("show");

      setTimeout(() => {
        showScreen(index);

        setTimeout(() => {
          transitionOverlay.classList.remove("show");
        }, 250);
      }, 300);
    } else {
      showScreen(index);
    }
  }

  /* =========================================================
     TOAST
     ========================================================= */

  let toastTimer;

  function showToast(message) {
    if (!toast) return;

    clearTimeout(toastTimer);

    toast.textContent = message;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  /* =========================================================
     LIMPIAR ERRORES
     ========================================================= */

  function clearErrors(container = document) {
    container.querySelectorAll(".input-error").forEach((input) => {
      input.classList.remove("input-error");
    });

    container.querySelectorAll(".field-error").forEach((error) => {
      error.remove();
    });
  }

  function markInputError(input, message = "Este campo es obligatorio.") {
    if (!input) return;

    input.classList.add("input-error");

    const parent = input.closest(".field-card, .textarea-card");

    if (parent && !parent.querySelector(".field-error")) {
      const error = document.createElement("small");
      error.className = "field-error";
      error.textContent = message;
      parent.appendChild(error);
    }
  }

  /* =========================================================
     VALIDACIÓN DE PANTALLAS
     ========================================================= */

  function validateScreen(index) {
    clearErrors(screens[index]);

    const screen = screens[index];

    if (!screen) return true;

    /* -----------------------------------------
       PANTALLA 02 — DATOS PERSONALES
       ----------------------------------------- */

    if (index === 1) {
      const requiredFields = [
        {
          id: "nombre",
          message: "Ingresá tu nombre y apellido."
        },
        {
          id: "cedula",
          message: "Ingresá tu número de cédula."
        },
        {
          id: "telefono",
          message: "Ingresá tu número de celular o WhatsApp."
        },
        {
          id: "ciudad",
          message: "Ingresá tu ciudad."
        }
      ];

      let valid = true;

      requiredFields.forEach(({ id, message }) => {
        const input = document.getElementById(id);

        if (!input || !input.value.trim()) {
          markInputError(input, message);
          valid = false;
        }
      });

      if (!valid) {
        showToast("Completá los campos obligatorios.");
      }

      return valid;
    }

    /* -----------------------------------------
       PANTALLA 03 — ORGANIZACIÓN / CLUB LEO
       ----------------------------------------- */

    if (index === 2) {
      let valid = true;

      if (!formData.organizacion) {
        showToast("Indicá si formás parte de alguna organización.");
        valid = false;
      }

      if (!formData.clubLeo) {
        showToast("Indicá si formás parte de un Club Leo.");
        valid = false;
      }

      if (
        formData.organizacion === "Sí"
      ) {
        const organizaciones =
          form.querySelector('[name="organizaciones"]');

        if (!organizaciones || !organizaciones.value.trim()) {
          markInputError(
            organizaciones,
            "Contanos de cuál/es formás parte."
          );
          valid = false;
        }
      }

      if (formData.clubLeo === "Sí") {
        const clubLeoNombre =
          form.querySelector('[name="clubLeoNombre"]');

        if (!clubLeoNombre || !clubLeoNombre.value.trim()) {
          markInputError(
            clubLeoNombre,
            "Ingresá el nombre de tu Club Leo."
          );
          valid = false;
        }

        if (!formData.distrito) {
          showToast("Seleccioná tu Distrito.");
          valid = false;
        }
      }

      return valid;
    }

    /* -----------------------------------------
       PANTALLA 04 — EXPECTATIVAS
       ----------------------------------------- */

    if (index === 3) {
      const expectativas =
        form.querySelector('[name="expectativas"]');

      if (!expectativas || !expectativas.value.trim()) {
        markInputError(
          expectativas,
          "Contanos qué esperás de RECREO."
        );

        showToast("Completá tu expectativa.");
        return false;
      }

      return true;
    }

    return true;
  }

  /* =========================================================
     BOTONES SIGUIENTE
     ========================================================= */

  document.querySelectorAll("[data-next]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!validateScreen(currentScreen)) return;

      if (currentScreen < totalScreens - 1) {
        goToScreen(currentScreen + 1);
      }
    });
  });

  /* =========================================================
     BOTONES VOLVER
     ========================================================= */

  document.querySelectorAll("[data-prev]").forEach((button) => {
    button.addEventListener("click", () => {
      if (currentScreen > 0) {
        goToScreen(currentScreen - 1);
      }
    });
  });

  /* =========================================================
     ELECCIONES SÍ / NO
     ========================================================= */

  document.querySelectorAll(".choice-card").forEach((button) => {
    button.addEventListener("click", () => {
      const choice = button.dataset.choice;
      const value = button.dataset.value;

      document
        .querySelectorAll(
          `.choice-card[data-choice="${choice}"]`
        )
        .forEach((item) => {
          item.classList.remove("selected");
        });

      button.classList.add("selected");

      formData[choice] = value;

      /* Organización */

      if (choice === "organizacion") {
        const conditional =
          document.getElementById("orgConditional");

        if (conditional) {
          conditional.classList.toggle(
            "show",
            value === "Sí"
          );
        }

        if (value === "No") {
          const input =
            form.querySelector('[name="organizaciones"]');

          if (input) {
            input.value = "";
            input.classList.remove("input-error");
          }
        }
      }

      /* Club Leo */

      if (choice === "clubLeo") {
        const conditional =
          document.getElementById("leoConditional");

        if (conditional) {
          conditional.classList.toggle(
            "show",
            value === "Sí"
          );
        }

        if (value === "No") {
          const clubInput =
            form.querySelector('[name="clubLeoNombre"]');

          if (clubInput) {
            clubInput.value = "";
            clubInput.classList.remove("input-error");
          }

          formData.distrito = "";

          document
            .querySelectorAll(".district")
            .forEach((district) => {
              district.classList.remove("selected");
            });
        }
      }
    });
  });

  /* =========================================================
     DISTRITOS
     ========================================================= */

  document.querySelectorAll(".district").forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".district")
        .forEach((district) => {
          district.classList.remove("selected");
        });

      button.classList.add("selected");

      formData.distrito = button.dataset.value;
    });
  });

  /* =========================================================
     HABILIDADES / MOCHILA
     ========================================================= */

  document.querySelectorAll(".skill-card").forEach((button) => {
    button.addEventListener("click", () => {
      const skill = button.dataset.skill;

      button.classList.toggle("selected");

      if (button.classList.contains("selected")) {
        if (!formData.habilidades.includes(skill)) {
          formData.habilidades.push(skill);
        }
      } else {
        formData.habilidades =
          formData.habilidades.filter(
            (item) => item !== skill
          );
      }
    });
  });

  /* =========================================================
     CHIPS DE IDEAS
     ========================================================= */

  document.querySelectorAll(".idea-chip").forEach((button) => {
    button.addEventListener("click", () => {
      const targetName = button.dataset.insert;
      const text = button.dataset.text;

      const textarea =
        form.querySelector(`[name="${targetName}"]`);

      if (!textarea) return;

      if (textarea.value.trim()) {
        textarea.value += ` ${text}`;
      } else {
        textarea.value = text;
      }

      textarea.focus();
    });
  });

  /* =========================================================
     QUITAR ERROR AL ESCRIBIR
     ========================================================= */

  form.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("input-error");

      const parent =
        input.closest(".field-card, .textarea-card");

      if (parent) {
        const error =
          parent.querySelector(".field-error");

        if (error) error.remove();
      }
    });
  });

  /* =========================================================
     OBTENER DATOS
     ========================================================= */

  function collectFormData() {
    const data = {};

    const formElements = form.querySelectorAll(
      "input, textarea, select"
    );

    formElements.forEach((element) => {
      if (!element.name) return;

      if (element.type === "checkbox") {
        if (!data[element.name]) {
          data[element.name] = [];
        }

        if (element.checked) {
          data[element.name].push(element.value);
        }

        return;
      }

      data[element.name] = element.value.trim();
    });

    data.organizacion = formData.organizacion;
    data.clubLeo = formData.clubLeo;
    data.distrito = formData.distrito;
    data.habilidades = [...formData.habilidades];

    data.fechaEnvio = new Date().toISOString();

    return data;
  }

  /* =========================================================
     ENVÍO DEL FORMULARIO
     ========================================================= */

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateScreen(currentScreen)) return;

    const compromisos =
      form.querySelectorAll(
        'input[name="compromiso"]:checked'
      );

    if (compromisos.length === 0) {
      showToast(
        "Aceptá al menos un compromiso para continuar."
      );
      return;
    }

    const data = collectFormData();

    console.log("Datos de inscripción:", data);

    /*
      ========================================================
      IMPORTANTE PARA BASE DE DATOS

      Acá es donde tenés que conectar tu backend.

      Ejemplo:

      const response = await fetch("TU_URL_API", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error("Error al guardar");
      }

      ========================================================
    */

    try {
      /*
       * Si todavía no colocaste la URL de tu backend,
       * dejamos el formulario funcionando localmente.
       *
       * Cuando tengas tu endpoint, reemplazá esta parte
       * por el fetch indicado arriba.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      showSuccessScreen(data);

    } catch (error) {
      console.error(error);

      showToast(
        "No pudimos enviar la inscripción. Intentá nuevamente."
      );
    }
  });

  /* =========================================================
     PANTALLA FINAL
     ========================================================= */

  function showSuccessScreen(data) {
    /*
     * IMPORTANTE:
     * No modificamos .success-mascot.
     *
     * El HTML ya contiene:
     *
     * <img src="assets/recreo-logo.png">
     *
     * Por eso aparece solamente el logo de RECREO.
     */

    if (successScreen) {
      successScreen.classList.add("show");
      successScreen.setAttribute("aria-hidden", "false");
    }

    createConfetti();

    console.log(
      "Inscripción completada:",
      data
    );
  }

  /* =========================================================
     CONFETI
     ========================================================= */

  function createConfetti() {
    if (!confetti) return;

    confetti.innerHTML = "";

    const symbols = [
      "🎉",
      "✨",
      "🎨",
      "🧸",
      "🎲",
      "🪁",
      "💜",
      "🌈"
    ];

    const amount = 35;

    for (let i = 0; i < amount; i++) {
      const piece = document.createElement("span");

      piece.textContent =
        symbols[Math.floor(Math.random() * symbols.length)];

      piece.style.position = "absolute";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.top = `${-10 - Math.random() * 20}%`;
      piece.style.fontSize =
        `${16 + Math.random() * 18}px`;
      piece.style.animation =
        `confettiFall ${3 + Math.random() * 3}s linear forwards`;
      piece.style.animationDelay =
        `${Math.random() * 1.5}s`;

      confetti.appendChild(piece);
    }
  }

  /* =========================================================
     ANIMACIÓN DEL CONFETI
     ========================================================= */

  const confettiStyle =
    document.createElement("style");

  confettiStyle.textContent = `
    @keyframes confettiFall {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
      }

      10% {
        opacity: 1;
      }

      100% {
        transform:
          translateY(115vh)
          rotate(720deg);
        opacity: 0;
      }
    }
  `;

  document.head.appendChild(confettiStyle);

  /* =========================================================
   CERRAR PANTALLA FINAL Y VOLVER AL INICIO
   ========================================================= */

if (closeSuccess) {
  closeSuccess.addEventListener("click", () => {

    // Ocultar la pantalla final
    successScreen.classList.remove("show");
    successScreen.setAttribute("aria-hidden", "true");

    // Volver a la primera pantalla
    showScreen(0, false);

    // Volver arriba de todo
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

  /* =========================================================
     INICIO
     ========================================================= */

  showScreen(0, false);
});
function launchConfetti() {
  const confetti = document.getElementById("confetti");

  if (!confetti) return;

  confetti.innerHTML = "";

  const colors = [
    "#ff6b35",
    "#ffc857",
    "#7b61ff",
    "#ff5c8a",
    "#65c466",
    "#4da6ff"
  ];

  for (let i = 0; i < 100; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti-piece";

    piece.style.left = Math.random() * 100 + "%";
    piece.style.background =
      colors[Math.floor(Math.random() * colors.length)];

    piece.style.animationDuration =
      2.5 + Math.random() * 2.5 + "s";

    piece.style.animationDelay =
      Math.random() * 0.8 + "s";

    piece.style.transform =
      `rotate(${Math.random() * 360}deg)`;

    confetti.appendChild(piece);
  }

  setTimeout(() => {
    confetti.innerHTML = "";
  }, 6000);
}
// Cargar librería de Supabase
const supabase = supabase.createClient(
    'https://gdyjouqlbchxnionizbj.supabase.co', 
    'sb_publishable_Pw78XnAc6Sb-wFEZ60-wVdQ_85f24...' // Tu llave pública de Supabase
);

const formulario = document.querySelector('form');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Recolectar todos los inputs de texto y selección normal por su atributo 'name'
    const datos = {
        nombre_apellido: document.querySelector('[name="nombre"]').value,
        cedula_identidad: document.querySelector('[name="cedula"]').value,
        celular_whatsapp: document.querySelector('[name="celular"]').value,
        instagram: document.querySelector('[name="instagram"]').value,
        ciudad_procedencia: document.querySelector('[name="ciudad"]').value,
        forma_parte_organizacion: document.querySelector('[name="organizacion"]')?.value || '',
        cual_organizacion: document.querySelector('[name="forma_parte_organizacion"]')?.value || '',
        forma_parte_club_leo: document.querySelector('[name="clubLeo"]')?.value || '',
        nombre_club_leo: document.querySelector('[name="clubleo"]')?.value || '',
        distrito_leo: document.querySelector('[name="distrito"]')?.value || '',
        expectativas_recreo: document.querySelector('[name="expectativas"]')?.value || '',
        que_te_gustaria_aportar: document.querySelector('[name="aportar"]')?.value || '',
        habilidades_mochila: document.querySelector('[name="habilidad"]')?.value || '',
        otra_habilidad_mochila: document.querySelector('[name="otraMochila"]')?.value || '',
        
        // Juntar todos los checkboxes marcados de "compromiso" en un solo texto separado por comas
        compromisos_aceptados: Array.from(document.querySelectorAll('input[name="compromiso"]:checked'))
            .map(cb => cb.value)
            .join(', ')
    };

    const { data, error } = await supabase.from('recreo_registros').insert([datos]);

    if (error) {
        alert('Error al enviar: ' + error.message);
    } else {
        alert('¡Inscripción enviada con éxito!');
        formulario.reset();
    }
});