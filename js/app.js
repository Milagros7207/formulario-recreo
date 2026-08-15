/* =========================================================
   RECREO — APP.JS
   ========================================================= */

// =========================================================
// SUPABASE
// =========================================================

const SUPABASE_URL = "https://gdyjouqlbchxnionizbj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkeWpvdXFsYmNoeG5pb25pemJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4ODU4MTQsImV4cCI6MjEwMTQ2MTgxNH0.80EPEAz3NZ0K7cOIM1_B3rG62GE1ZvLjEbydTLEAhVk";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
supabaseClient
  .from("recreo_registros")
  .select("*")
  .limit(1)
  .then(result => {
    console.log("========== PRUEBA SUPABASE ==========");
    console.log(result);
    console.log("======================================");
  });

// =========================================================
// ELEMENTOS PRINCIPALES
// =========================================================

const screens = [...document.querySelectorAll(".screen")];
const progressFill = document.querySelector(".progress-fill");
const progressDots = [...document.querySelectorAll(".progress-dots span")];
const stepNumber = document.querySelector(".step-copy strong");

const form = document.querySelector("#recreoForm");

let currentScreen = 0;


// =========================================================
// DATOS DEL FORMULARIO
// =========================================================

const formData = {
  organizacion: null,
  clubLeo: null,
  distrito: null,
  habilidades: []
};


// =========================================================
// MOSTRAR PANTALLA
// =========================================================

function showScreen(index) {
  if (index < 0 || index >= screens.length) return;

  screens.forEach((screen, i) => {
    screen.classList.toggle("active", i === index);
  });

  currentScreen = index;

  updateProgress();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// =========================================================
// PROGRESO
// =========================================================

function updateProgress() {
  const total = screens.length;

  const percentage =
    total <= 1
      ? 100
      : (currentScreen / (total - 1)) * 100;

  if (progressFill) {
    progressFill.style.width = `${percentage}%`;
  }

  progressDots.forEach((dot, index) => {
    dot.classList.toggle(
      "active",
      index === currentScreen
    );

    dot.classList.toggle(
      "completed",
      index < currentScreen
    );
  });

  if (stepNumber) {
    stepNumber.textContent =
      `${currentScreen + 1}/${total}`;
  }
}


// =========================================================
// BOTONES SIGUIENTE
// =========================================================

document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", () => {

    if (!validateCurrentScreen()) {
      return;
    }

    showScreen(currentScreen + 1);
  });
});


// =========================================================
// BOTONES ATRÁS
// =========================================================

document.querySelectorAll("[data-back]").forEach(button => {
  button.addEventListener("click", () => {
    showScreen(currentScreen - 1);
  });
});


// =========================================================
// VALIDACIÓN DE PANTALLA
// =========================================================

function validateCurrentScreen() {

  const screen = screens[currentScreen];

  if (!screen) return true;

  const requiredInputs =
    [...screen.querySelectorAll(
      "input[required], textarea[required]"
    )];

  let valid = true;

  requiredInputs.forEach(input => {

    if (!input.value.trim()) {

      input.classList.add("input-error");

      valid = false;

    } else {

      input.classList.remove("input-error");

    }

  });

  // Validación de radios obligatorios
  const radioGroups = {};

  screen
    .querySelectorAll(
      'input[type="radio"][required]'
    )
    .forEach(radio => {

      if (!radioGroups[radio.name]) {
        radioGroups[radio.name] = [];
      }

      radioGroups[radio.name].push(radio);
    });

  Object.values(radioGroups).forEach(group => {

    const checked = group.some(
      radio => radio.checked
    );

    if (!checked) {
      valid = false;
    }

  });

  if (!valid) {
    showToast("Completá los campos obligatorios antes de continuar.");
  }

  return valid;
}


// =========================================================
// REMOVER ERROR AL ESCRIBIR
// =========================================================

document.addEventListener("input", event => {

  if (
    event.target.matches(
      "input, textarea"
    )
  ) {
    event.target.classList.remove(
      "input-error"
    );
  }

});


// =========================================================
// OPCIONES DE ELECCIÓN
// =========================================================

document.querySelectorAll(".choice-card").forEach(card => {

  card.addEventListener("click", () => {

    const group =
      card.closest(".choice-grid");

    if (!group) return;

    group
      .querySelectorAll(".choice-card")
      .forEach(item => {
        item.classList.remove("selected");
      });

    card.classList.add("selected");

    const input =
      card.querySelector("input");

    if (input) {
      input.checked = true;
      input.dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      );
    }

  });

});


// =========================================================
// ORGANIZACIÓN
// =========================================================

document
  .querySelectorAll(
    '[data-choice="organizacion"]'
  )
  .forEach(button => {

    button.addEventListener("click", () => {

      const value =
        button.dataset.value;

      formData.organizacion =
        value;

      // Marcar opción seleccionada
      document
        .querySelectorAll(
          '[data-choice="organizacion"]'
        )
        .forEach(item => {
          item.classList.remove(
            "selected"
          );
        });

      button.classList.add(
        "selected"
      );

      // Mostrar / ocultar campo
      const conditional =
        document.querySelector(
          "#orgConditional"
        );

      if (conditional) {

        conditional.classList.toggle(
          "show",
          value === "Sí"
        );

      }

    });

  });


// =========================================================
// CLUB LEO
// =========================================================

document
  .querySelectorAll(
    '[data-choice="clubLeo"]'
  )
  .forEach(button => {

    button.addEventListener("click", () => {

      const value =
        button.dataset.value;

      formData.clubLeo =
        value;

      // Marcar opción seleccionada
      document
        .querySelectorAll(
          '[data-choice="clubLeo"]'
        )
        .forEach(item => {
          item.classList.remove(
            "selected"
          );
        });

      button.classList.add(
        "selected"
      );

      // Mostrar / ocultar campo
      const conditional =
        document.querySelector(
          "#leoConditional"
        );

      if (conditional) {

        conditional.classList.toggle(
          "show",
          value === "Sí"
        );

      }

    });

  });


// =========================================================
// DISTRITO
// =========================================================

document
  .querySelectorAll(".district")
  .forEach(button => {

    button.addEventListener("click", () => {

      document
        .querySelectorAll(".district")
        .forEach(item => {
          item.classList.remove(
            "selected"
          );
        });

      button.classList.add("selected");

      formData.distrito =
        button.dataset.district ||
        button.textContent.trim();

    });

  });


// =========================================================
// HABILIDADES
// =========================================================

document
  .querySelectorAll(".skill-card")
  .forEach(card => {

    card.addEventListener("click", () => {

      const skill =
        card.dataset.skill ||
        card.querySelector("b")?.textContent.trim();

      card.classList.toggle("selected");

      if (!skill) return;

      if (card.classList.contains("selected")) {

        if (
          !formData.habilidades.includes(skill)
        ) {
          formData.habilidades.push(skill);
        }

      } else {

        formData.habilidades =
          formData.habilidades.filter(
            item => item !== skill
          );

      }

    });

  });


// =========================================================
// CHIPS DE IDEAS
// =========================================================

document
  .querySelectorAll(".idea-chip")
  .forEach(chip => {

    chip.addEventListener("click", () => {

      const text =
        chip.textContent.trim();

      const textarea =
        document.querySelector(
          'textarea[name="que_te_gustaria_aportar"]'
        ) ||
        document.querySelector(
          "#que_te_gustaria_aportar"
        );

      if (!textarea) return;

      if (!textarea.value.trim()) {
        textarea.value = text;
      } else {
        textarea.value +=
          `, ${text}`;
      }

      textarea.dispatchEvent(
        new Event("input", {
          bubbles: true
        })
      );

    });

  });


// =========================================================
// RECOLECTAR DATOS
// =========================================================

function collectFormData() {

  const getValue = (...selectors) => {

    for (const selector of selectors) {

      const element =
        form?.querySelector(selector) ||
        document.querySelector(selector);

      if (element) {
        return element.value.trim() || null;
      }

    }

    return null;
  };


  // Compromisos
  const compromisos = [
    ...document.querySelectorAll(
      'input[name="compromiso"]:checked'
    )
  ].map(input => input.value);


  // Habilidades
  const habilidades =
    [...formData.habilidades];


  return {

    nombre_apellido:
      getValue(
        '[name="nombre_apellido"]',
        "#nombre_apellido",
        '[name="nombre"]'
      ),

    cedula_identidad:
      getValue(
        '[name="cedula_identidad"]',
        "#cedula_identidad",
        '[name="cedula"]'
      ),

    celular_whatsapp:
      getValue(
        '[name="celular_whatsapp"]',
        "#celular_whatsapp",
        '[name="telefono"]'
      ),

    instagram:
      getValue(
        '[name="instagram"]',
        "#instagram"
      ),

    ciudad_procedencia:
      getValue(
        '[name="ciudad_procedencia"]',
        "#ciudad_procedencia",
        '[name="ciudad"]'
      ),

    "forma_parte_organización":
      formData.organizacion,

    forma_parte_club_leo:
      formData.clubLeo,

    nombre_club_leo:
      getValue(
        '[name="nombre_club_leo"]',
        "#nombre_club_leo"
      ),

    distrito_leo:
      formData.distrito,

    expectativas_recreo:
      getValue(
        '[name="expectativas_recreo"]',
        "#expectativas_recreo",
        '[name="expectativas"]'
      ),

    que_te_gustaria_aportar:
      getValue(
        '[name="que_te_gustaria_aportar"]',
        "#que_te_gustaria_aportar",
        '[name="aporte"]'
      ),

    habilidades_mochila:
      habilidades.length > 0
        ? habilidades
        : null,

    otra_habilidad_mochila:
      getValue(
        '[name="otra_habilidad_mochila"]',
        "#otra_habilidad_mochila",
        '[name="otra_habilidad"]'
      ),

    compromisos_aceptados:
      compromisos.length > 0
        ? compromisos
        : null
  };
}


// =========================================================
// ENVIAR A SUPABASE
// =========================================================

async function submitRegistration() {
  const data = collectFormData();

  console.log("Datos que se enviarán a Supabase:", data);

  try {
    const { error } = await supabaseClient
      .from("recreo_registros")
      .insert([data]);

    if (error) {
      console.error("Supabase respondió con error:", error);

      showToast(
        "No pudimos enviar la inscripción. Intentá nuevamente."
      );

      return;
    }

    console.log("Inscripción guardada correctamente.");

    showSuccessScreen();

  } catch (error) {
    console.error("ERROR COMPLETO:", error);

    showToast(
      "No pudimos enviar la inscripción. Intentá nuevamente."
    );
  }
}

// =========================================================
// ENVÍO DEL FORMULARIO
// =========================================================

if (form) {

  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      const button =
        form.querySelector(
          'button[type="submit"]'
        );

      if (button) {
        button.disabled = true;
        button.dataset.originalText =
          button.textContent;

        button.textContent =
          "ENVIANDO...";
      }

      try {

        await submitRegistration();

      } finally {

        if (button) {

          button.disabled = false;

          button.textContent =
            button.dataset.originalText ||
            "CONFIRMAR INSCRIPCIÓN";

        }

      }

    }
  );

}


// =========================================================
// PANTALLA FINAL
// =========================================================

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


// =========================================================
// CONFETI
// =========================================================

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


// =========================================================
// ANIMACIÓN DEL CONFETI
// =========================================================

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

// =========================================================
// CONFETI
// =========================================================

function createConfetti() {
  const container = document.querySelector(".confetti");

  if (!container) return;

  container.innerHTML = "";

  const pieces = 100;

  for (let i = 0; i < pieces; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti-piece";

    piece.style.left = `${Math.random() * 100}%`;

    piece.style.animationDuration =
      `${3 + Math.random() * 4}s`;

    piece.style.animationDelay =
      `${Math.random() * 1.5}s`;

    piece.style.transform =
      `rotate(${Math.random() * 360}deg)`;

    container.appendChild(piece);
  }
}


// =========================================================
// TOAST
// =========================================================

let toastTimeout;

function showToast(message) {

  const toast =
    document.querySelector(
      ".toast"
    );

  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent =
    message;

  toast.classList.add(
    "show"
  );

  clearTimeout(
    toastTimeout
  );

  toastTimeout =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    }, 4000);
}


// =========================================================
// INICIO
// =========================================================

showScreen(0);

console.log(
  "RECREO app.js cargado correctamente."
);
document.querySelector(".success-screen .btn")?.addEventListener("click", () => {
  window.location.reload();
});