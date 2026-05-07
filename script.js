// ===== FADE IN SECTIONS (bidirectionnel) =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      } else {
        e.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section-about, .section-contact, .studio-section, .studio-tarif-block, .mixage-block, .tarif-header, .hero-content, .page-header, .tarifs-intro').forEach(el => {
    el.classList.add('fade-in-section');
    observer.observe(el);
  });

  // ===== NAV ACTIVE ON SCROLL =====
  const sections = document.querySelectorAll('section.page');
  const navLinks = document.querySelectorAll('.nav-links a');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.getElementById('nav-' + e.target.id);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.1, rootMargin: '-70px 0px -60% 0px' });
  sections.forEach(s => navObserver.observe(s));
  // Accueil actif par défaut
  document.getElementById('nav-accueil').classList.add('active');

  // ===== PAGE ROUTING (kept for openGallery) =====
  const pages = ['accueil', 'studios', 'tarifs'];

  // showPage removed — one-page mode

  // ===== LIGHTBOX =====
  let lbImgs = [];
  let lbIdx = 0;

  function openLightbox(imgEl) {
    // Collect all gallery images from the same gallery
    const slide = imgEl.closest('.gallery-slider');
    lbImgs = Array.from(slide.querySelectorAll('img')).map(i => i.src);
    lbIdx = Array.from(slide.querySelectorAll('img')).indexOf(imgEl);
    document.getElementById('lightbox-img').src = lbImgs[lbIdx];
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox(e) {
    if (!e || e.target === document.getElementById('lightbox') || e.target.classList.contains('lightbox-close')) {
      document.getElementById('lightbox').classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function lbNav(dir) {
    lbIdx = (lbIdx + dir + lbImgs.length) % lbImgs.length;
    document.getElementById('lightbox-img').src = lbImgs[lbIdx];
  }

  document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox({target: lb});
    if (e.key === 'ArrowLeft') lbNav(-1);
    if (e.key === 'ArrowRight') lbNav(1);
  });


  function smoothTo(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    document.getElementById('navLinks').classList.remove('open');
  }


  // ===== GALLERY SLIDERS =====
  const galleryState = { a: 0, b: 0 };

  function goSlide(id, idx) {
    const slider = document.getElementById('gallery-' + id);
    const slides = slider.querySelectorAll('.gallery-slide');
    const dots = document.querySelectorAll('#dots-' + id + ' .gallery-dot');
    slides[galleryState[id]].classList.remove('active');
    dots[galleryState[id]].classList.remove('active');
    galleryState[id] = (idx + slides.length) % slides.length;
    slides[galleryState[id]].classList.add('active');
    dots[galleryState[id]].classList.add('active');
  }

  function slideGallery(id, dir) {
    goSlide(id, galleryState[id] + dir);
  }

  function openGallery(id) {
    const section = document.getElementById('gallery-' + id);
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Auto-slide
  setInterval(() => { slideGallery('a', 1); }, 4000);
  setInterval(() => { slideGallery('b', 1); }, 5000);

  // ===== CONTACT FORM =====
  function sendForm() {
    const prenom = document.getElementById('prenom').value.trim();
    const nom = document.getElementById('nom').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    if (!prenom || !nom || !service || !message) {
      showToast('Veuillez remplir tous les champs.', 'error');
      return;
    }

    const subject = encodeURIComponent(`Demande de réservation — ${service}`);
    const body = encodeURIComponent(
      `Bonjour,\n\nNom : ${prenom} ${nom}\nService : ${service}\n\nMessage :\n${message}\n\nCordialement,\n${prenom} ${nom}`
    );

    window.location.href = `mailto:lacapsulestudio@gmail.com?subject=${subject}&body=${body}`;
    showToast('Ouverture de votre messagerie...', 'success');
  }

  function showToast(msg, type = '') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show ' + type;
    setTimeout(() => t.className = 'toast', 3500);
  }