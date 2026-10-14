/* ErektoMax landing — zachowanie strony.
   Dane i ustawienia: js/config.js, dokumenty prawne: js/docs.js */

const $ = (id) => document.getElementById(id);

/* ---------- 1. Dane produktu i rabat ---------- */
function fillProductData() {
  document.querySelectorAll("[data-product]").forEach((el) => {
    el.textContent = PRODUCT[el.dataset.product];
  });
  const discount = Math.round((1 - PRODUCT.price / PRODUCT.lowestPrice) * 100);
  if (discount > 0 && discount < 100) {
    document.querySelectorAll(".deal-badge, .hero-badge").forEach((el) => {
      el.textContent = `-${discount}%`;
    });
  }
}

/* ---------- 2. Cookies, analityka i Meta Pixel ---------- */
const CONSENT_KEY = "cookie-consent"; // '1' = zgoda, '0' = odmowa
const cookieBanner = $("cookie-banner");
window.dataLayer = window.dataLayer || [];
let trackingAllowed = false;

function readConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}
function saveConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* tryb prywatny */
  }
}

// Standardowy kod Meta Pixel (fbevents.js), uruchamiany po zgodzie
function loadMetaPixel() {
  if (window.fbq) return;
  const fbq = (window.fbq = function () {
    fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
  });
  if (!window._fbq) window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  fbq("init", META_PIXEL_ID);
  fbq("track", "PageView");
}

function trackEvent(name) {
  if (trackingAllowed) window.dataLayer.push({ event: name });
}

function enableTracking() {
  trackingAllowed = true;
  loadMetaPixel();
  trackEvent("page_view");
}

function initCookies() {
  const consent = readConsent();
  if (consent === "1") enableTracking();
  if (consent === null) cookieBanner.classList.add("is-open");

  cookieBanner.addEventListener("click", (e) => {
    const choice = e.target.dataset.consent;
    if (choice === undefined) return;
    saveConsent(choice);
    cookieBanner.classList.remove("is-open");
    if (choice === "1") enableTracking();
  });
  $("cookie-settings").addEventListener("click", () => cookieBanner.classList.add("is-open"));
}

/* ---------- 3. Maska telefonu: +48 000 000 000 ---------- */
const phoneInput = $("phone-input");

function formatPhone() {
  let digits = phoneInput.value.replace(/\D/g, "");
  if (digits.startsWith("48")) digits = digits.slice(2); // prefiks jest już w polu
  digits = digits.slice(0, 9);
  phoneInput.value = "+48 " + (digits.match(/.{1,3}/g) || []).join(" ");
}
const getPhoneDigits = () => phoneInput.value.replace(/\D/g, "").slice(2);

/* ---------- 4. Formularz zgłoszenia ---------- */
const leadForm = $("lead-form");
let isSubmitting = false;

function validateForm() {
  const nameOk = $("name-input").value.trim().length >= 2;
  const phoneOk = getPhoneDigits().length === 9;
  $("name-error").textContent = nameOk ? "" : "Podaj imię";
  $("phone-error").textContent = phoneOk ? "" : "Podaj poprawny numer telefonu";
  return nameOk && phoneOk;
}

function buildPayload() {
  const utm = {};
  new URLSearchParams(location.search).forEach((value, key) => {
    if (key.startsWith("utm_")) utm[key] = value;
  });
  return {
    product: PRODUCT.name,
    price: PRODUCT.price,
    name: $("name-input").value.trim(),
    phone: "+48" + getPhoneDigits(),
    page: location.origin + location.pathname,
    utm,
  };
}

async function sendLead(payload) {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}

async function handleSubmit(event) {
  event.preventDefault();
  if (isSubmitting || !validateForm()) return;
  isSubmitting = true;
  $("submit-btn").disabled = true;
  $("form-result").innerHTML = "";

  try {
    await sendLead(buildPayload());
    leadForm.innerHTML =
      '<div class="form-message is-success">Dziękujemy! Otrzymaliśmy Twoje zgłoszenie. Skontaktujemy się z Tobą w sprawie zamówienia</div>';
    trackEvent("lead_success");
    if (window.fbq) fbq("track", "Lead"); // zdarzenie Lead w Meta Pixel
  } catch {
    $("form-result").innerHTML =
      '<div class="form-message is-error">Nie udało się wysłać formularza. Spróbuj ponownie</div>';
    isSubmitting = false;
    $("submit-btn").disabled = false;
  }
}

/* ---------- 5. Dolny przycisk na mobile (chowa się przy formularzu) ---------- */
function initStickyCta() {
  const sticky = $("sticky-cta");
  new IntersectionObserver((entries) => {
    sticky.classList.toggle("is-hidden", entries[0].isIntersecting);
  }).observe($("form"));
}

/* ---------- 6. Opinie klientów (blok pojawia się, gdy REVIEWS nie jest puste) ---------- */
function renderReviews() {
  if (!REVIEWS.length) return;
  const list = $("reviews-list");

  REVIEWS.forEach((review) => {
    const card = document.createElement("div");
    card.className = "review-card";

    if (review.photo) {
      const avatar = new Image();
      avatar.src = review.photo;
      avatar.alt = "";
      avatar.className = "review-avatar";
      card.append(avatar);
    }
    if (review.rating) {
      const stars = document.createElement("div");
      stars.className = "review-stars";
      stars.textContent = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
      card.append(stars);
    }
    const text = document.createElement("p");
    text.textContent = review.text;
    card.append(text);

    const author = [review.name, review.date].filter(Boolean).join(" · ");
    if (author) {
      const label = document.createElement("b");
      label.textContent = author;
      card.append(label);
    }
    list.append(card);
  });
  $("reviews").hidden = false;
}

/* ---------- 7. Dokumenty prawne w oknie ---------- */
function initLegalDocs() {
  const modal = $("doc-modal");
  const content = $("doc-content");
  const close = () => modal.classList.remove("is-open");

  document.querySelectorAll("[data-doc]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const doc = LEGAL_DOCS[link.dataset.doc];
      content.innerHTML = "";
      const title = document.createElement("h3");
      title.textContent = doc.title;
      content.append(title);
      doc.sections.forEach(([heading, text]) => {
        const h = document.createElement("h4");
        const p = document.createElement("p");
        h.textContent = heading;
        p.textContent = text;
        content.append(h, p);
      });
      modal.classList.add("is-open");
    });
  });
  $("doc-close").addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* ---------- 8. Animacja pojawiania się przy przewijaniu ---------- */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }),
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
  );
  const selector = "h2, .card, .step, details, .review-card, .ingredients-mix img, .deal, form, .pack-wrap";
  document.querySelectorAll(`section:not(.hero) :is(${selector})`).forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 3) * 90}ms`;
    observer.observe(el);
  });
}

/* ---------- Start ---------- */
fillProductData();
renderReviews();
initCookies();
initStickyCta();
initLegalDocs();
initScrollReveal();
phoneInput.addEventListener("input", formatPhone);
phoneInput.addEventListener("focus", () => {
  if (phoneInput.value.length < 4) phoneInput.value = "+48 ";
});
leadForm.addEventListener("submit", handleSubmit);
