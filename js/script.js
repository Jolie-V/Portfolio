// js/script.js

// Smooth navigation with offset for sticky header
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    if (targetId === "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;
    const offset = 75;
    const elementPosition = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: "smooth"
    });
  });
});

// Carousel auto-rotation for project cards (main page)
document.querySelectorAll(".carousel").forEach(carousel => {
  const slides = Array.from(carousel.querySelectorAll("img"));
  if (!slides.length) return;
  let current = 0;
  slides.forEach((img, idx) => {
    img.classList.remove("active");
    if (idx === 0) img.classList.add("active");
    img.onerror = function() {
      if (!this.src.includes('fallback')) {
        this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'%3E%3Crect width='400' height='240' fill='%23d4c9b2'/%3E%3Ctext x='50%25' y='50%25' fill='%230F596C' font-size='18' text-anchor='middle'%3Epreview%3C/text%3E%3C/svg%3E";
      }
    };
  });
  setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 3800);
});

// Project details – with techStack property
const projectsData = {
  project1: {
    title: "DOCUTRACK: Document Tracking System",
    description: "DocuTrack is a web-based document tracking system designed during my 3-month internship with LGU - Ligao City. It enables offices, departments, and external partners to create, route, receive, accept, and monitor documents in a transparent, paper-less workflow. It features QR code generation and scanning for faster transactions.",
    techStack: ["HTML", "PHP", "CSS", "JavaScript", "PostgreSQL"],
    images: [
      "assets/project1/1.png",
      "assets/project1/2.png",
      "assets/project1/3.png",
      "assets/project1/4.png",
      "assets/project1/5.png"
    ]
  },
  project2: {
    title: "CardZap: AI-Powered File Converter Tool for Interactive Learning",
    description: "This Web Application was created for my Undergraduate Capstone Project. CardZap is a web application that transforms PDF, Word, and text files into AI-generated flashcards. By parsing user-provided text or documents, the application automatically summarizes content and generates engaging, customizable study cards.",
    techStack: ["React 19", "Vite", "CSS", "TypeScript"],
    images: [
      "assets/project2/1.jpg",
      "assets/project2/2.jpg",
      "assets/project2/3.jpg"
    ]
  }
};

// Modal elements
const modal = document.getElementById("projectModal");
const closeModalBtn = document.getElementById("closeModal");
const modalCarouselDiv = document.getElementById("modalCarousel");
const modalDescDiv = document.getElementById("modalDescription");

let currentModalImages = [];
let currentModalIndex = 0;
let autoSlideInterval = null;
let isCarouselHovered = false;

function stopAutoSlide() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
}

function startAutoSlide() {
  if (autoSlideInterval) stopAutoSlide();
  if (!currentModalImages.length) return;
  autoSlideInterval = setInterval(() => {
    if (!isCarouselHovered && document.querySelector("#modalSlidesContainer img")) {
      changeModalSlide(1);
    }
  }, 4000);
}

function changeModalSlide(delta) {
  if (!currentModalImages.length) return;
  const slides = document.querySelectorAll("#modalSlidesContainer img");
  if (!slides.length) return;
  slides[currentModalIndex].style.opacity = "0";
  currentModalIndex = (currentModalIndex + delta + currentModalImages.length) % currentModalImages.length;
  slides[currentModalIndex].style.opacity = "1";
}

function buildModalCarousel(images) {
  stopAutoSlide();
  
  modalCarouselDiv.innerHTML = `
    <div class="modal-carousel-container" id="modalCarouselContainer">
      <div class="modal-slides" id="modalSlidesContainer"></div>
      <button class="modal-nav-btn modal-nav-prev" id="modalPrevBtn">‹</button>
      <button class="modal-nav-btn modal-nav-next" id="modalNextBtn">›</button>
    </div>
  `;
  
  const slidesContainer = document.getElementById("modalSlidesContainer");
  slidesContainer.innerHTML = '';
  images.forEach((src, idx) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `project slide ${idx + 1}`;
    img.style.position = "absolute";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    img.style.top = "0";
    img.style.left = "0";
    img.style.opacity = idx === currentModalIndex ? "1" : "0";
    img.style.transition = "opacity 0.3s ease";
    img.onerror = function() {
      if (!this.src.includes('fallback')) {
        this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e2d9c8'/%3E%3Ctext x='50%25' y='50%25' fill='%230F596C' font-size='18' text-anchor='middle'%3Eimage unavailable%3C/text%3E%3C/svg%3E";
      }
    };
    slidesContainer.appendChild(img);
  });
  slidesContainer.style.position = "relative";
  slidesContainer.style.height = "380px";

  const prevBtn = document.getElementById("modalPrevBtn");
  const nextBtn = document.getElementById("modalNextBtn");
  if (prevBtn) {
    prevBtn.onclick = (e) => {
      e.stopPropagation();
      changeModalSlide(-1);
      stopAutoSlide();
      startAutoSlide();
    };
  }
  if (nextBtn) {
    nextBtn.onclick = (e) => {
      e.stopPropagation();
      changeModalSlide(1);
      stopAutoSlide();
      startAutoSlide();
    };
  }
  
  const container = document.getElementById("modalCarouselContainer");
  if (container) {
    container.addEventListener("mouseenter", () => {
      isCarouselHovered = true;
      stopAutoSlide();
    });
    container.addEventListener("mouseleave", () => {
      isCarouselHovered = false;
      startAutoSlide();
    });
  }
  
  startAutoSlide();
}

function openModal(projectKey) {
  const data = projectsData[projectKey];
  if (!data) return;
  
  currentModalImages = data.images.slice();
  currentModalIndex = 0;
  
  const techTagsHtml = data.techStack && data.techStack.length
    ? `<div class="tech-tags">${data.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}</div>`
    : '';
  
  modalDescDiv.innerHTML = `
    <h2>${data.title}</h2>
    <p>${data.description}</p>
    ${techTagsHtml}
  `;
  
  buildModalCarousel(currentModalImages);
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("show");
  document.body.style.overflow = "";
  stopAutoSlide();
  modalCarouselDiv.innerHTML = '';
  isCarouselHovered = false;
}

// Attach click event to project cards (excluding disabled)
document.querySelectorAll(".project-card:not(.disabled)").forEach(card => {
  card.onclick = (e) => {
    e.stopPropagation();
    const projectId = card.getAttribute("data-project");
    if (projectId && projectsData[projectId]) {
      openModal(projectId);
    }
  };
});

closeModalBtn.onclick = closeModal;
window.onclick = (e) => {
  if (e.target === modal) closeModal();
};