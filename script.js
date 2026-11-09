/* ===== EDIT YOUR LINKS HERE ===== */
const CONFIG = {
  whatsappNumber: "+27 67 847 7634",
  instagram: "https://instagram.com/im.michx_",
  contactFormUrl: ""               // e.g. a Formspree URL. Leave "" for demo mode
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Booking, WhatsApp and Instagram links */
let selectedService = "";
const bookingMessage = () => `Hi ! i would like to book${selectedService ? ` ${selectedService} lashes` : " lashes"}`;
const gmailCompose = message => `https://mail.google.com/mail/?view=cm&fs=1&to=micahnurse60%40gmail.com&su=${encodeURIComponent("Lash appointment booking")}&body=${encodeURIComponent(message)}`;
const whatsappLink = message => `https://wa.me/${CONFIG.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
$$("[data-wa]").forEach(a => a.href = whatsappLink(bookingMessage()));
$$("[data-ig]").forEach(a => a.href = CONFIG.instagram);
$$("[data-email-book]").forEach(a => a.href = gmailCompose(bookingMessage()));
const bookingWhatsApp = $("[data-book-wa]");
const bookingInstagram = $("[data-book-ig]");
const bookingStatus = $("#booking-status");
function updateBookingOptions() {
  const message = bookingMessage();
  $$("[data-email-book]").forEach(a => a.href = gmailCompose(message));
  bookingWhatsApp.href = whatsappLink(message);
  bookingStatus.textContent = selectedService ? `Booking request: ${message}` : "";
}
$$("[data-service-book]").forEach(button => button.addEventListener("click", () => {
  selectedService = button.closest("[data-service]").dataset.service;
  updateBookingOptions();
}));
bookingInstagram.addEventListener("click", async () => {
  const message = bookingMessage();
  try {
    await navigator.clipboard.writeText(message);
    bookingStatus.textContent = `Booking message copied. Paste it into the Instagram chat: ${message}`;
  } catch {
    bookingStatus.textContent = `Send this message in the Instagram chat: ${message}`;
  }
});
updateBookingOptions();
$("#yr").textContent = new Date().getFullYear();

/* Loader + hero entrance */
addEventListener("load", () => {
  setTimeout(() => {
    const loader = $("#loader");
    if (reduce) {
      loader.classList.add("done");
      document.body.classList.add("ready");
      return;
    }
    loader.classList.add("opening");
    setTimeout(() => {
      loader.classList.add("done");
      document.body.classList.add("ready");
    }, 1250);
  }, reduce ? 0 : 900);
});

/* Navbar: solid on scroll, progress bar */
const nav = $("#nav"), bar = $("#progress");
function onScroll() {
  nav.classList.toggle("solid", scrollY > 40);
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + "%";
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Mobile menu */
const burger = $("#burger"), menu = $("#menu");
function setMenu(open) {
  menu.classList.toggle("open", open);
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
$$("#menu a").forEach(a => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", e => e.key === "Escape" && setMenu(false));

/* Scroll reveal with stagger */
$$(".grid, .gallery").forEach(g => $$(".reveal", g).forEach((el, i) => el.style.setProperty("--d", (i % 3) * 0.12 + "s")));
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.15 });
$$(".reveal").forEach(el => io.observe(el));

/* Floating hearts (a few, gentle) */
if (!reduce) {
  const box = $("#hearts");
  const spawn = () => {
    if (document.hidden) return;
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("class", "fh");
    s.innerHTML = '<use href="#heart"/>';
    const size = 12 + Math.random() * 16;
    s.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;animation-duration:${9 + Math.random() * 8}s`;
    box.appendChild(s);
    setTimeout(() => s.remove(), 18000);
  };
  setInterval(spawn, 2200);
}

/* Light parallax on hero decorations */
if (!reduce) {
  const items = $$(".hero .deco, .hero .glow");
  addEventListener("scroll", () => {
    if (scrollY > innerHeight) return;
    items.forEach((el, i) => el.style.marginTop = -scrollY * (0.05 + i * 0.03) + "px");
  }, { passive: true });
}

/* Contact form validation */
const form = $("#form"), status = $("#status");
function check(input, ok, msg) {
  input.parentElement.classList.toggle("invalid", !ok);
  $("small", input.parentElement).textContent = ok ? "" : msg;
  return ok;
}
form.addEventListener("submit", async e => {
  e.preventDefault();
  const n = check($("#fn"), $("#fn").value.trim().length > 1, "Please enter your name.");
  const m = check($("#fe"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#fe").value), "Please enter a valid email.");
  const t = check($("#fm"), $("#fm").value.trim().length > 4, "Please write a short message.");
  if (!(n && m && t)) { status.textContent = ""; return; }
  if (!CONFIG.contactFormUrl) {
    status.textContent = "Form is valid, but not connected yet. Add a form service URL in script.js.";
    return;
  }
  try {
    const res = await fetch(CONFIG.contactFormUrl, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
    if (!res.ok) throw new Error();
    status.textContent = "Thank you! Your message has been sent ♡";
    form.reset();
  } catch { status.textContent = "Something went wrong. Please message us on WhatsApp."; }
});