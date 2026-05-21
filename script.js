document.addEventListener("DOMContentLoaded", () => {
  // Initial state memory for reservations
  let reservations = [
    {
      id: "res-1",
      space: "Laboratório de Redes (Lab 1)",
      prof: "Prof. Alberto Mateus",
      day: "Segunda-feira",
      shift: "Tarde",
      purpose: "Configuração de Roteadores CISCO",
      approved: true
    },
    {
      id: "res-2",
      space: "Auditório Principal",
      prof: "Profa. Gabriela Costa",
      day: "Quarta-feira",
      shift: "Manhã",
      purpose: "Palestra de Integração Hackathon",
      approved: true
    },
    {
      id: "res-3",
      space: "Quadra Poliesportiva",
      prof: "Prof. Ítalo Garcia",
      day: "Sexta-feira",
      shift: "Manhã",
      purpose: "Treinamento de Jogos Escolares",
      approved: true
    },
    {
      id: "res-4",
      space: "Sala Multimídia",
      prof: "Profa. Julia Oliveira",
      day: "Terça-feira",
      shift: "Noite",
      purpose: "Apresentação de Projetos Web",
      approved: true
    },
    {
      id: "res-7",
      space: "Sala de Aula 10",
      prof: "Prof. Marcos Souza",
      day: "Quinta-feira",
      shift: "Manhã",
      purpose: "Aula Teórica de Protocolos de Rede",
      approved: true
    },
    // Initial Pending Requests
    {
      id: "res-5",
      space: "Laboratório de Redes (Lab 1)",
      prof: "Prof. Samuel Augusto",
      day: "Terça-feira",
      shift: "Manhã",
      purpose: "Aula de Cabeamento Estruturado",
      approved: false
    },
    {
      id: "res-6",
      space: "Sala Multimídia",
      prof: "Profa. Mariana Stefany",
      day: "Quinta-feira",
      shift: "Tarde",
      purpose: "Exibição de Documentário de Redes",
      approved: false
    },
    {
      id: "res-8",
      space: "Laboratório de Informática (Lab 2)",
      prof: "Profa. Ana Carolina",
      day: "Quarta-feira",
      shift: "Tarde",
      purpose: "Lógica de Programação com Portugol",
      approved: false
    }
  ];

  // DOM elements
  const calendarBody = document.getElementById("calendar-body");
  const reservationForm = document.getElementById("reservation-form");
  const pendingListElement = document.getElementById("pending-list-element");
  const pendingCounter = document.getElementById("pending-counter");
  const filterButtons = document.querySelectorAll(".filter-btn");

  let activeFilter = "todos";

  // Days and shifts mappings
  const days = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira"
  ];
  const shifts = ["Manhã", "Tarde", "Noite"];

  // Initialize view
  renderCalendar();
  renderPendingList();
  updateLiveWidgets();

  // --- Filtering calendar ---
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.getAttribute("data-space");
      renderCalendar();
    });
  });

  // --- Form submission ---
  if (reservationForm) {
    reservationForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const profName = document.getElementById("prof-name").value.trim();
      const spaceSelect = document.getElementById("space-select").value;
      const daySelect = document.getElementById("day-select").value;
      const shiftSelect = document.getElementById("shift-select").value;
      const bookingPurpose = document.getElementById("booking-purpose").value.trim();

      if (!profName || !bookingPurpose) {
        showToast("Por favor, preencha todos os campos do formulário.", true);
        return;
      }

      // Check conflict with APPROVED reservations
      const hasConflict = reservations.some(res => 
        res.approved &&
        res.space === spaceSelect &&
        res.day === daySelect &&
        res.shift === shiftSelect
      );

      if (hasConflict) {
        showToast(`Conflito de Horário! O espaço "${spaceSelect}" já está reservado na ${daySelect} no turno da ${shiftSelect}.`, true);
        return;
      }

      // Check conflict with PENDING reservations from the same teacher (prevent spamming same request)
      const hasPendingConflict = reservations.some(res => 
        !res.approved &&
        res.space === spaceSelect &&
        res.day === daySelect &&
        res.shift === shiftSelect &&
        res.prof.toLowerCase() === profName.toLowerCase()
      );

      if (hasPendingConflict) {
        showToast("Você já enviou uma solicitação idêntica que está aguardando aprovação.", true);
        return;
      }

      // Create booking request
      const newRequest = {
        id: "res-" + Date.now(),
        space: spaceSelect,
        prof: profName,
        day: daySelect,
        shift: shiftSelect,
        purpose: bookingPurpose,
        approved: false
      };

      reservations.push(newRequest);
      renderPendingList();
      showToast("Solicitação de reserva enviada para a coordenação!");
      reservationForm.reset();
    });
  }

  // --- Render Calendar ---
  function renderCalendar() {
    if (!calendarBody) return;
    calendarBody.innerHTML = "";

    days.forEach(day => {
      const row = document.createElement("tr");

      // Day Column
      const dayCell = document.createElement("td");
      dayCell.textContent = day;
      row.appendChild(dayCell);

      // Shift Columns
      shifts.forEach(shift => {
        const shiftCell = document.createElement("td");

        // Filter approved reservations for this day & shift
        const matchingBookings = reservations.filter(res => 
          res.approved &&
          res.day === day &&
          res.shift === shift &&
          (activeFilter === "todos" || res.space === activeFilter)
        );

        if (matchingBookings.length > 0) {
          matchingBookings.forEach(booking => {
            const bookingDiv = document.createElement("div");
            bookingDiv.className = "cell-reservation";
            
            // Format inside the cells
            if (activeFilter === "todos") {
              bookingDiv.innerHTML = `
                <strong>${booking.space}</strong>
                <span class="prof-tag">${booking.prof}</span>
                <span class="purpose-tag">${booking.purpose}</span>
              `;
            } else {
              bookingDiv.innerHTML = `
                <span class="prof-tag">${booking.prof}</span>
                <span class="purpose-tag">${booking.purpose}</span>
              `;
            }
            shiftCell.appendChild(bookingDiv);
          });
        } else {
          const freeDiv = document.createElement("div");
          freeDiv.className = "cell-free";
          freeDiv.textContent = "Disponível";
          shiftCell.appendChild(freeDiv);
        }

        row.appendChild(shiftCell);
      });

      calendarBody.appendChild(row);
    });
  }

  // --- Render Pending Approvals List ---
  function renderPendingList() {
    if (!pendingListElement || !pendingCounter) return;
    
    const pendingItems = reservations.filter(res => !res.approved);
    pendingCounter.textContent = `${pendingItems.length} pendente(s)`;

    if (pendingItems.length === 0) {
      pendingListElement.innerHTML = `<li class="pending-placeholder">Nenhuma solicitação pendente no momento.</li>`;
      return;
    }

    pendingListElement.innerHTML = "";
    pendingItems.forEach(item => {
      const li = document.createElement("li");
      li.className = "pending-card";

      li.innerHTML = `
        <div class="pending-info">
          <h4>${item.space}</h4>
          <div class="pending-details">
            <span>👤 ${item.prof}</span>
            <span>📅 ${item.day}</span>
            <span>🕒 Turno: ${item.shift}</span>
          </div>
          <p class="pending-purpose"><strong>Objetivo:</strong> ${item.purpose}</p>
        </div>
        <div class="pending-actions">
          <button class="btn-approve" data-id="${item.id}">Aprovar</button>
          <button class="btn-reject" data-id="${item.id}">Rejeitar</button>
        </div>
      `;

      // Wire up buttons
      li.querySelector(".btn-approve").addEventListener("click", () => approveRequest(item.id));
      li.querySelector(".btn-reject").addEventListener("click", () => rejectRequest(item.id));

      pendingListElement.appendChild(li);
    });
  }

  // --- Actions ---
  function approveRequest(id) {
    const booking = reservations.find(res => res.id === id);
    if (!booking) return;

    // Double check conflict just in case (someone might have approved a conflict manually or timing issue)
    const hasConflict = reservations.some(res => 
      res.approved &&
      res.space === booking.space &&
      res.day === booking.day &&
      res.shift === booking.shift
    );

    if (hasConflict) {
      showToast(`Impossível aprovar! Esse horário já foi reservado e aprovado anteriormente por outro docente.`, true);
      // Remove conflicts from pending if requested
      return;
    }

    booking.approved = true;
    renderCalendar();
    renderPendingList();
    updateLiveWidgets();
    showToast(`Reserva do(a) ${booking.prof} para o ${booking.space} foi aprovada!`);
  }

  function rejectRequest(id) {
    const index = reservations.findIndex(res => res.id === id);
    if (index === -1) return;
    
    const booking = reservations[index];
    reservations.splice(index, 1);
    renderPendingList();
    showToast(`Solicitação do(a) ${booking.prof} foi recusada.`, true);
  }

  // --- Update status list (widget in hero) ---
  function updateLiveWidgets() {
    // Determine status of environments right now (e.g. today's simulation. Let's make it reflect approved reservations)
    // Redes Lab 1, Auditório, Quadra, Sala Multimídia
    const environments = [
      { name: "Lab 1 (Redes)", key: "Laboratório de Redes (Lab 1)" },
      { name: "Lab 2 (Info)", key: "Laboratório de Informática (Lab 2)" },
      { name: "Auditório", key: "Auditório Principal" },
      { name: "Quadra", key: "Quadra Poliesportiva" },
      { name: "Sala Multimídia", key: "Sala Multimídia" },
      { name: "Sala de Aula 10", key: "Sala de Aula 10" }
    ];

    const terminalContent = document.querySelector(".terminal-content");
    if (!terminalContent) return;

    terminalContent.innerHTML = "";
    environments.forEach(env => {
      // Check if there is ANY approved reservation today (let's say Monday is today, or check if it has any bookings overall)
      const hasBooking = reservations.some(res => res.approved && res.space === env.key);
      const badgeClass = hasBooking ? "reserved" : "free";
      const statusText = hasBooking ? "Ocupado" : "Livre";

      const line = document.createElement("p");
      line.className = "term-line";
      line.innerHTML = `
        <span><span class="term-prompt">&bull;</span> ${env.name}:</span>
        <span class="badge-tag-small ${badgeClass}">${statusText}</span>
      `;
      terminalContent.appendChild(line);
    });
  }

  // --- Custom Toast Notification ---
  function showToast(message, isError = false) {
    // Remove existing toast if visible
    const existingToast = document.querySelector(".toast");
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = `toast ${isError ? 'error' : ''}`;
    toast.innerHTML = `
      <span>${isError ? '⚠️' : '✅'}</span>
      <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Trigger reflow/animation
    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    // Hide after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
});
