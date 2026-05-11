// ===== FAVICON TRANSPARENT =====
(function() {
  var img = new Image();
  img.onload = function() {
    var c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 64, 64);
    ctx.drawImage(img, 0, 0, 64, 64);
    var d = ctx.getImageData(0, 0, 64, 64);
    for (var i = 0; i < d.data.length; i += 4) {
      if (d.data[i] < 25 && d.data[i+1] < 25 && d.data[i+2] < 25) d.data[i+3] = 0;
    }
    ctx.putImageData(d, 0, 0);
    var lnk = document.querySelector("link[rel='icon']") || document.createElement('link');
    lnk.rel = 'icon'; lnk.type = 'image/png';
    lnk.href = c.toDataURL('image/png');
    document.head.appendChild(lnk);
  };
  img.src = 'images/logo.png';
})();

// ===== MENU MOBILE =====
function toggleMenu() {
  var nav = document.getElementById('navLinks');
  var btn = document.querySelector('.mobile-menu-btn');
  nav.classList.toggle('open');
  btn.textContent = nav.classList.contains('open') ? '✕' : '☰';
}

// ===== SMOOTH SCROLL =====
function smoothTo(id) {
  var el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
  var nav = document.getElementById('navLinks');
  nav.classList.remove('open');
  document.querySelector('.mobile-menu-btn').textContent = '☰';
}

// ===== NAV ACTIVE AU SCROLL =====
var sections = document.querySelectorAll('section.page');
var navLinks = document.querySelectorAll('.nav-links a');

document.getElementById('nav-accueil').classList.add('active');

var navObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      navLinks.forEach(function(a) { a.classList.remove('active'); });
      var active = document.getElementById('nav-' + e.target.id);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.15, rootMargin: '-70px 0px -60% 0px' });

sections.forEach(function(s) { navObserver.observe(s); });

// ===== GALERIES =====
var galleryState = { a: 0, b: 0 };

function goSlide(id, idx) {
  var slider = document.getElementById('gallery-' + id);
  var slides = slider.querySelectorAll('.gallery-slide');
  var dots = document.querySelectorAll('#dots-' + id + ' .gallery-dot');
  slides[galleryState[id]].classList.remove('active');
  dots[galleryState[id]].classList.remove('active');
  galleryState[id] = (idx + slides.length) % slides.length;
  slides[galleryState[id]].classList.add('active');
  dots[galleryState[id]].classList.add('active');
}

function slideGallery(id, dir) { goSlide(id, galleryState[id] + dir); }

function openGallery(id) {
  var el = document.getElementById('gallery-' + id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

setInterval(function() { slideGallery('a', 1); }, 4500);
setInterval(function() { slideGallery('b', 1); }, 5200);

// ===== SWIPE TACTILE GALERIES =====
['a','b'].forEach(function(id) {
  var el = document.getElementById('gallery-' + id);
  if (!el) return;
  var startX = 0;
  el.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', function(e) {
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) slideGallery(id, diff > 0 ? 1 : -1);
  }, { passive: true });
});

// ===== FADE IN AU SCROLL =====
var fadeObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) e.target.classList.add('visible');
    else e.target.classList.remove('visible');
  });
}, { threshold: 0.08 });

document.querySelectorAll('.section-about, .studio-section, .studio-tarif-block, .mixage-block, .page-header, .tarifs-intro').forEach(function(el) {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});

// ===== LIGHTBOX =====
var lbImgs = [], lbIdx = 0;

function openLightbox(imgEl) {
  // Pas de lightbox sur mobile
  if (window.innerWidth < 768) return;
  var slider = imgEl.closest('.gallery-slider');
  lbImgs = Array.from(slider.querySelectorAll('img')).map(function(i) { return i.src; });
  lbIdx = Array.from(slider.querySelectorAll('img')).indexOf(imgEl);
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

document.addEventListener('keydown', function(e) {
  var lb = document.getElementById('lightbox');
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox({ target: lb });
  if (e.key === 'ArrowLeft') lbNav(-1);
  if (e.key === 'ArrowRight') lbNav(1);
});

// ===== FORMULAIRE =====
function sendForm() {
  var prenom = document.getElementById('prenom').value.trim();
  var nom = document.getElementById('nom').value.trim();
  var service = document.getElementById('service').value;
  var message = document.getElementById('message').value.trim();
  if (!prenom || !nom || !service || !message) {
    showToast('Veuillez remplir tous les champs.', 'error'); return;
  }
  var subject = encodeURIComponent('Demande — ' + service);
  var body = encodeURIComponent('Bonjour,\n\nNom : ' + prenom + ' ' + nom + '\nService : ' + service + '\n\nMessage :\n' + message + '\n\nCordialement,\n' + prenom + ' ' + nom);
  window.location.href = 'mailto:lacapsulestudio@gmail.com?subject=' + subject + '&body=' + body;
  showToast('Ouverture de votre messagerie...', 'success');
}

function showToast(msg, type) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (type || '');
  setTimeout(function() { t.className = 'toast'; }, 3500);
}
