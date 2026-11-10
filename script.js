/* ===== EDIT YOUR LINKS HERE ===== */
const CONFIG = {
  whatsappNumber: "+27 67 847 7634",
  instagram: "https://instagram.com/im.michx_",
  // Leave empty to use the private, rule-based assistant. Never put an API key here.
  // If configured, this URL receives the visitor's chat messages.
  aiEndpoint: "",
  bookingUrls: {
    default: "https://calendly.com/YOUR-LINK",
    classic: "",
    hybrid: "",
    volume: "",
    cateye: "",
    anime: "",
    mega: "",
    fill: "",
    removal: ""
  }
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
  const subject = `Website message from ${$("#fn").value.trim()}`;
  const body = [
    `Name: ${$("#fn").value.trim()}`,
    `Email: ${$("#fe").value.trim()}`,
    "",
    $("#fm").value.trim()
  ].join("\n");
  const composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=micahnurse60%40gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(composeUrl, "_blank", "noopener");
  status.textContent = "Gmail opened with your message ready. Review it and press Send to deliver.";
});

/* ===== Lash Assistant: editable rule-based knowledge ===== */
const KNOWLEDGE = {
  styles: {
    classic: {
      label: "Classic",
      keywords: ["classic", "natural", "mascara", "subtle"],
      answer: "Classic uses one extension on each suitable natural lash for a soft, mascara-like finish. It is lovely if you prefer a polished, natural look. The current page lists a full set at R50. Extensions shed with your natural lash cycle; retention varies, and fills are commonly discussed around every 2–3 weeks. The appointment duration is not listed, so please confirm it with Micha."
    },
    hybrid: {
      label: "Hybrid",
      keywords: ["hybrid", "mixed", "texture"],
      answer: "Hybrid mixes classic extensions with volume fans for a textured look between natural and full. It can suit someone who wants a little more fullness without going all the way to a dense volume set. The current page lists a full set at R50. Retention varies with your lash cycle and aftercare; fills are commonly discussed around every 2–3 weeks. Duration is not listed, so please ask Micha."
    },
    volume: {
      label: "Volume",
      keywords: ["volume", "fluffy", "full", "glamorous"],
      answer: "Volume uses lightweight fans for a fuller, fluffy, more glamorous look. It may suit you if you like noticeable fullness; Micha can check your natural lashes in person and tailor the set. The current page lists a full set at R50. Natural shedding and retention vary; fills are commonly discussed around every 2–3 weeks. Appointment duration is not listed, so confirm with Micha."
    },
    mega: {
      label: "Mega Volume",
      keywords: ["mega", "mega volume", "dramatic", "bold"],
      answer: "Mega Volume is the boldest, densest option here, with a dramatic, very full finish. It may suit someone who loves a statement look, but Micha should first check whether your natural lashes are suitable. Mega Volume pricing and appointment duration are not listed on the current page; please message Micha for a quote and suitability advice. Lash retention varies, and fills are commonly discussed around every 2–3 weeks."
    },
    catEye: {
      label: "Cat-eye",
      keywords: ["cat eye", "cateye", "outer corner", "winged"],
      answer: "A cat-eye is a lash map: lengths build toward the outer corners for an elongated, winged effect. The page lists Cateye at R50 for a full set. Micha can adjust the map to your eye shape and chosen lash style. Appointment duration is not listed, so please confirm it with her."
    },
    anime: {
      label: "Anime",
      keywords: ["anime", "doll", "spiky", "wispy"],
      answer: "Anime lashes use deliberate wispy, spiky lengths for a bold, doll-like look. The current page lists Anime at R60 for a full set. Micha can discuss how dramatic to make the spikes. Appointment duration is not listed, so please confirm it with her."
    }
  },
  intents: [
    { id: "camera", keywords: ["use camera", "camera", "take a photo", "take photo", "take a picture", "selfie"], answer: "Sure! I can open the camera so you can take a photo. Camera permission is requested only after you press the button below." },
    { id: "fills", keywords: ["fill", "refill", "infill", "maintenance", "how often"], answer: "Fills refresh grown-out or shed extensions. Many clients discuss a fill about every 2–3 weeks, but lash growth and retention differ for everyone. Fill prices and appointment durations are not listed on the current page; ask Micha what timing and service she recommends for your set." },
    { id: "removal", keywords: ["removal", "remove", "take off", "remover"], answer: "Please ask Micha about safe professional removal and the current removal price, which is not listed on the page. Avoid pulling or cutting extensions yourself, as that can damage your natural lashes." },
    { id: "prices", keywords: ["price", "prices", "cost", "how much", "rate"], answer: "The current page lists full sets at R50 for Classic, Hybrid, Volume and Cateye, and R60 for Anime. Mega Volume, fills, removals and appointment durations are not listed yet, so please ask Micha to confirm before booking." },
    { id: "aftercare", keywords: ["aftercare", "care", "shower", "wash", "sleep", "wet", "oil"], answer: "Follow the product-specific aftercare Micha gives you. In general, be gentle, avoid rubbing or pulling, keep the lash line clean as directed, and avoid oil-based products near the extensions if Micha advises that for her adhesive. Ask her before using products you are unsure about." },
    { id: "prepare", keywords: ["prepare", "before appointment", "before my appointment", "come with", "makeup"], answer: "Come with clean lashes and avoid mascara or oily products around your eyes before your appointment, unless Micha has given you different instructions. You can message her if you have questions about contact lenses or anything else to prepare." },
    { id: "allergies", keywords: ["allergy", "allergic", "patch test", "sensitive", "reaction"], answer: "Please tell Micha about any previous reactions or sensitivities before booking, and ask whether a patch test is appropriate and how far in advance it is needed. A patch test cannot guarantee there will be no reaction. If you have eye irritation or symptoms, seek advice from a qualified health professional; this assistant cannot give medical advice." },
    { id: "hours", keywords: ["hours", "opening", "open", "closed", "when are you"], answer: "The website lists business hours as Monday to Friday, 10:00–16:00 South Africa time (UTC+2). Saturday and Sunday are listed as closed." },
    { id: "location", keywords: ["location", "address", "where", "directions", "parking"], answer: "I can't find a studio address on the current website, and I don't want to guess. Please message Micha on WhatsApp to confirm the location and directions." },
    { id: "contact", keywords: ["contact", "whatsapp", "message", "talk to micha", "instagram", "email"], answer: "You can reach Micha on WhatsApp at +27 67 847 7634, Instagram @im.michx_, or micahnurse60@gmail.com. Choose the WhatsApp button below to open a message." },
    { id: "booking", keywords: ["availability", "available", "appointment", "book", "booking", "times", "calendar"], answer: "I can help you check availability. Which service are you interested in?" }
  ]
};

/* The assistant keeps only in-memory chat state. No chat or photo is stored. */
const assistantPanel = $("#assistant-panel");
const assistantToggle = $("#assistant-toggle");
const assistantClose = $("#assistant-close");
const assistantBackdrop = $("#assistant-backdrop");
const chatMessages = $("#chat-messages");
const chatForm = $("#chat-form");
const chatInput = $("#chat-input");
const chatPrivacy = $("#chat-privacy");
const chatStarters = $("#chat-starters");
const chatMoreStarters = $("#chat-more-starters");
const chatExtraStarters = $("#chat-extra-starters");
const tryonAssessment = $("#tryon-assessment");
const bookingService = $("#booking-service");
const bookingName = $("#booking-name");
const bookingEmail = $("#booking-email");
const bookingSummary = $("#booking-summary");
const assistantBookingStatus = $("#assistant-booking-status");
const assistantState = {
  messages: [],
  style: "Classic",
  service: "",
  name: "",
  email: "",
  focusBeforeOpen: null,
  bodyOverflow: ""
};
let chatBusy = false;
if (CONFIG.aiEndpoint.trim()) {
  chatPrivacy.textContent = "Your photo stays on this device. Chat text is sent to the configured assistant endpoint. This is not medical advice.";
}

const CHAT_SERVICES = ["Classic", "Hybrid", "Volume", "Cateye", "Anime"];
const normalized = text => String(text).toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const chatTokens = text => normalized(text).split(" ").filter(word => word.length > 2);

function editDistanceAtMostOne(a, b) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, differences = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++differences > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else { i++; j++; }
  }
  if (i < a.length || j < b.length) differences++;
  return differences <= 1;
}

function keywordScore(message, keywords) {
  const cleanMessage = normalized(message);
  const words = chatTokens(message);
  return keywords.reduce((score, keyword) => {
    const cleanKeyword = normalized(keyword);
    if (cleanMessage.includes(cleanKeyword)) return score + (cleanKeyword.includes(" ") ? 4 : 2);
    const matchingWord = cleanKeyword.split(" ").some(target =>
      words.some(word => word === target || (word.length >= 5 && target.length >= 5 && editDistanceAtMostOne(word, target)))
    );
    return score + (matchingWord ? 1 : 0);
  }, 0);
}

function detectStyle(message) {
  let best = null, bestScore = 0;
  Object.entries(KNOWLEDGE.styles).forEach(([key, style]) => {
    const score = keywordScore(message, style.keywords);
    if (score > bestScore) { best = { key, style, score }; bestScore = score; }
  });
  return bestScore >= 2 ? best : null;
}

function whatsappUrl(message) {
  return whatsappLink(message);
}

function addChatMessage(text, sender, action) {
  const message = document.createElement("div");
  message.className = `chat-message ${sender === "user" ? "user-message" : "assistant-message"}`;
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  message.appendChild(paragraph);
  if (action) {
    const link = document.createElement("a");
    link.textContent = action.label;
    if (action.url) {
      link.href = action.url;
      link.target = "_blank";
      link.rel = "noopener";
    } else {
      link.href = "#";
      link.addEventListener("click", event => {
        event.preventDefault();
        action.run();
      });
    }
    message.appendChild(link);
  }
  chatMessages.appendChild(message);
  requestAnimationFrame(() => { chatMessages.scrollTop = chatMessages.scrollHeight; });
  return message;
}

function addTypingIndicator() {
  const indicator = document.createElement("div");
  indicator.className = "chat-message assistant-message typing-indicator";
  indicator.setAttribute("aria-label", "Assistant is typing");
  indicator.innerHTML = "<span></span><span></span><span></span>";
  chatMessages.appendChild(indicator);
  requestAnimationFrame(() => { chatMessages.scrollTop = chatMessages.scrollHeight; });
  return indicator;
}

function dismissChatStarters() {
  chatStarters.hidden = true;
}

function addServiceQuickChoices() {
  const holder = document.createElement("div");
  holder.className = "quick-replies";
  holder.setAttribute("aria-label", "Choose a service");
  CHAT_SERVICES.forEach(service => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = service;
    button.addEventListener("click", () => {
      dismissChatStarters();
      setSelectedService(service);
      addChatMessage(service, "user");
      addChatMessage(`Lovely choice. I have ${service} selected. You can check live times now.`, "assistant", {
        label: "Check available times",
        run: () => openBookingPane()
      });
      holder.remove();
    });
    holder.appendChild(button);
  });
  chatMessages.appendChild(holder);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getRuleBasedReply(text) {
  const suggestionScore = keywordScore(text, ["which lash style suits me", "what style suits me", "recommend a style", "suggest a style"]);
  if (suggestionScore >= 2) {
    return {
      text: "I can offer a fun visual guide from a front-facing photo, or explain each style so you can choose. The photo guide runs on your device; Micha will confirm what suits your natural lashes in person.",
      action: { label: "Try a style on my photo", run: () => openTryonPane() }
    };
  }
  const style = detectStyle(text);
  if (style) {
    if (["classic", "hybrid", "volume", "mega"].includes(style.key)) {
      assistantState.style = style.style.label;
      setTryonStyle(style.style.label);
    } else if (style.key === "catEye" || style.key === "anime") {
      assistantState.lashMap = style.key === "catEye" ? "cat-eye" : "doll";
      setTryonStyle(style.key === "catEye" ? "Cateye" : "Anime");
    }
    return {
      text: style.style.answer,
      action: { label: "Try this style on a photo", run: () => openTryonPane() }
    };
  }
  const best = KNOWLEDGE.intents
    .map(intent => ({ intent, score: keywordScore(text, intent.keywords) }))
    .sort((a, b) => b.score - a.score)[0];
  if (!best || best.score < 2) {
    return {
      text: "I'm not sure, want to message Micha on WhatsApp?",
      action: { label: "Message Micha on WhatsApp", url: whatsappUrl(`Hi Micha, I have a question about my lashes.`) }
    };
  }
  if (best.intent.id === "booking") {
    return { text: best.intent.answer, action: { label: "Choose a service", run: addServiceQuickChoices } };
  }
  if (best.intent.id === "camera") {
    return {
      text: best.intent.answer,
      action: {
        label: "Open camera",
        run: () => {
          openTryonPane();
          startTryonCamera();
        }
      }
    };
  }
  if (best.intent.id === "contact") {
    return { text: best.intent.answer, action: { label: "Message Micha on WhatsApp", url: whatsappUrl("Hi Micha, I would love to ask about lashes.") } };
  }
  if (best.intent.id === "location") {
    return { text: best.intent.answer, action: { label: "Ask Micha for the address", url: whatsappUrl("Hi Micha, could you please share your studio location and directions?") } };
  }
  return { text: best.intent.answer };
}

function captureChatDetails(text) {
  const emailMatch = text.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
  if (emailMatch) {
    assistantState.email = emailMatch[0];
    bookingEmail.value = emailMatch[0];
  }
  const nameMatch = text.match(/\b(?:my name is|i am|i'm)\s+([a-z][a-z'-]*(?:\s+[a-z][a-z'-]*){0,2})/i);
  if (nameMatch) {
    assistantState.name = nameMatch[1].trim().replace(/\s+/g, " ");
    bookingName.value = assistantState.name;
  }
}

async function getAssistantReply() {
  const fallbackMessage = "The online assistant connection isn't available right now, so I'll use Micha's website information instead.";
  if (CONFIG.aiEndpoint.trim()) {
    try {
      const response = await fetch(CONFIG.aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: assistantState.messages, selectedStyle: assistantState.style })
      });
      if (!response.ok) throw new Error(`Assistant endpoint returned ${response.status}`);
      const data = await response.json();
      if (typeof data.reply !== "string" || !data.reply.trim()) throw new Error("Assistant endpoint response must contain a non-empty reply string");
      return { text: data.reply.trim() };
    } catch (error) {
      console.error("Lash assistant endpoint failed; using local answers.", error);
      const fallback = getRuleBasedReply(assistantState.messages[assistantState.messages.length - 1].content);
      return { text: `${fallbackMessage} ${fallback.text}`, action: fallback.action };
    }
  }
  return getRuleBasedReply(assistantState.messages[assistantState.messages.length - 1].content);
}

async function sendChat(text) {
  const cleanText = text.trim();
  if (!cleanText || chatBusy) return;
  chatBusy = true;
  dismissChatStarters();
  const sendButton = chatForm.querySelector('button[type="submit"]');
  sendButton.disabled = true;
  addChatMessage(cleanText, "user");
  assistantState.messages.push({ role: "user", content: cleanText });
  captureChatDetails(cleanText);
  chatInput.value = "";
  const selectedStyle = detectStyle(cleanText);
  if (selectedStyle && ["classic", "hybrid", "volume", "mega"].includes(selectedStyle.key)) {
    assistantState.style = selectedStyle.style.label;
    setTryonStyle(selectedStyle.style.label);
  }
  const typing = addTypingIndicator();
  await new Promise(resolve => setTimeout(resolve, reduce ? 0 : 350));
  try {
    const reply = await getAssistantReply();
    typing.remove();
    addChatMessage(reply.text, "assistant", reply.action);
    assistantState.messages.push({ role: "assistant", content: reply.text });
  } catch (error) {
    typing.remove();
    console.error("Lash assistant could not create a reply.", error);
    const reply = "I hit a snag answering that. You can message Micha directly instead.";
    addChatMessage(reply, "assistant", { label: "Message Micha on WhatsApp", url: whatsappUrl("Hi Micha, I have a question about my lashes.") });
    assistantState.messages.push({ role: "assistant", content: reply });
  } finally {
    sendButton.disabled = false;
    chatBusy = false;
  }
}

/* Chat panel keyboard, focus and reduced-motion behavior. */
function focusableAssistantElements() {
  return [...assistantPanel.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),a[href],[tabindex]:not([tabindex="-1"])')]
    .filter(element => !element.closest("[hidden]") && element.getClientRects().length);
}

function openAssistant() {
  if (!assistantPanel.hidden) return;
  assistantState.focusBeforeOpen = document.activeElement;
  assistantState.bodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  assistantPanel.hidden = false;
  assistantBackdrop.hidden = false;
  assistantToggle.setAttribute("aria-expanded", "true");
  chatInput.focus();
}

function closeAssistant() {
  if (assistantPanel.hidden) return;
  stopCamera();
  assistantPanel.hidden = true;
  assistantBackdrop.hidden = true;
  assistantToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = assistantState.bodyOverflow;
  if (assistantState.focusBeforeOpen && assistantState.focusBeforeOpen.focus) assistantState.focusBeforeOpen.focus();
  else assistantToggle.focus();
}

const assistantPanes = {
  chat: { tab: $("#assistant-chat-tab"), pane: $("#assistant-chat") },
  tryon: { tab: $("#assistant-tryon-tab"), pane: $("#assistant-tryon") },
  booking: { tab: $("#assistant-booking-tab"), pane: $("#assistant-booking") }
};

function setAssistantPane(name, focusSelector) {
  if (name !== "tryon") stopCamera();
  Object.entries(assistantPanes).forEach(([key, item]) => {
    const active = key === name;
    item.tab.setAttribute("aria-selected", String(active));
    item.pane.hidden = !active;
  });
  if (focusSelector) $(focusSelector).focus();
}

function openTryonPane() {
  setAssistantPane("tryon", "#tryon-camera");
  if (!assistantPanel.hidden) return;
  openAssistant();
  setAssistantPane("tryon", "#tryon-camera");
}

function openBookingPane() {
  setAssistantPane("booking", "#booking-service");
  if (!assistantPanel.hidden) return;
  openAssistant();
  setAssistantPane("booking", "#booking-service");
}

assistantToggle.addEventListener("click", openAssistant);
assistantClose.addEventListener("click", closeAssistant);
assistantBackdrop.addEventListener("click", closeAssistant);
assistantPanel.addEventListener("keydown", event => {
  if (event.key !== "Tab") return;
  const elements = focusableAssistantElements();
  if (!elements.length) { event.preventDefault(); return; }
  const first = elements[0], last = elements[elements.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
addEventListener("keydown", event => {
  if (event.key === "Escape" && !assistantPanel.hidden) closeAssistant();
});
Object.entries(assistantPanes).forEach(([name, item]) => item.tab.addEventListener("click", () => setAssistantPane(name)));
chatMoreStarters.addEventListener("click", () => {
  const expanded = chatMoreStarters.getAttribute("aria-expanded") === "true";
  chatMoreStarters.setAttribute("aria-expanded", String(!expanded));
  chatMoreStarters.textContent = expanded ? "More" : "Less";
  chatExtraStarters.hidden = expanded;
});
$$("[data-quick]").forEach(button => button.addEventListener("click", () => {
  dismissChatStarters();
  const prompt = button.dataset.quick;
  if (prompt === "Try lashes on my photo") { openTryonPane(); return; }
  if (prompt === "Check availability") {
    if (!assistantState.service) {
      addChatMessage("Of course! Which service would you like to book?", "assistant", { label: "Choose a service", run: addServiceQuickChoices });
      return;
    }
    openBookingPane();
    return;
  }
  if (prompt === "Talk to Micha") {
    addChatMessage("Of course. This opens a WhatsApp message to Micha.", "assistant", { label: "Message Micha on WhatsApp", url: whatsappUrl("Hi Micha, I would love to chat about lashes.") });
    return;
  }
  sendChat(prompt);
}));
chatForm.addEventListener("submit", event => {
  event.preventDefault();
  sendChat(chatInput.value);
});
chatInput.addEventListener("input", () => {
  chatInput.style.height = "auto";
  chatInput.style.height = `${Math.min(chatInput.scrollHeight, 112)}px`;
});
chatInput.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

/* ===== On-device photo try-on ===== */
const tryonFile = $("#tryon-file");
const tryonVideo = $("#tryon-video");
const tryonCamera = $("#tryon-camera");
const tryonCapture = $("#tryon-capture");
const tryonStage = $("#tryon-stage");
const tryonImage = $("#tryon-image");
const tryonCanvas = $("#tryon-overlay");
const tryonContext = tryonCanvas.getContext("2d");
const tryonCompare = $("#tryon-compare");
const tryonCompareWrap = $("#tryon-compare-wrap");
const tryonManual = $("#tryon-manual");
const tryonDownload = $("#tryon-download");
let faceLandmarkerPromise = null;
let detectedEyes = null;
let currentPhotoUrl = "";
let cameraStream = null;

const STYLE_RENDER = {
  "Classic": { spacing: 6, strands: 1, length: .075, width: .004 },
  "Hybrid": { spacing: 4.4, strands: 2, length: .09, width: .0045 },
  "Volume": { spacing: 3.2, strands: 3, length: .105, width: .005 },
  "Cateye": { spacing: 4.4, strands: 2, length: .09, width: .0045, lashMap: "cat-eye" },
  "Anime": { spacing: 3.2, strands: 3, length: .105, width: .005, lashMap: "doll" }
};

function setTryonStyle(styleName) {
  if (!STYLE_RENDER[styleName]) return;
  assistantState.style = styleName;
  if (STYLE_RENDER[styleName].lashMap) assistantState.lashMap = STYLE_RENDER[styleName].lashMap;
  $$("[data-tryon-style]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.tryonStyle === styleName)));
  tryonManual.dataset.style = styleName.toLowerCase().replace(/\s/g, "-");
  $(".manual-eyes").dataset.style = styleName.toLowerCase().replace(/\s/g, "-");
  if (detectedEyes) {
    drawLashOverlay();
    tryonDownload.disabled = false;
  } else {
    tryonDownload.disabled = true;
    tryonAssessment.textContent = `${styleName} selected. Add a clear, front-facing photo for the on-device preview, or use this illustration as a manual style guide.`;
  }
}

$$("[data-tryon-style]").forEach(button => button.addEventListener("click", () => setTryonStyle(button.dataset.tryonStyle)));
tryonCompare.addEventListener("input", () => tryonCanvas.style.setProperty("--compare", `${100 - Number(tryonCompare.value)}%`));

function getFaceLandmarker() {
  if (!faceLandmarkerPromise) {
    faceLandmarkerPromise = (async () => {
      const vision = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/+esm");
      const files = await vision.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm");
      return vision.FaceLandmarker.createFromOptions(files, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "CPU"
        },
        runningMode: "IMAGE",
        numFaces: 1
      });
    })().catch(error => {
      faceLandmarkerPromise = null;
      throw error;
    });
  }
  return faceLandmarkerPromise;
}

function stopCamera() {
  if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
  cameraStream = null;
  tryonVideo.srcObject = null;
  tryonVideo.hidden = true;
  tryonCapture.hidden = true;
  tryonCamera.hidden = false;
  tryonCamera.textContent = currentPhotoUrl ? "Retake photo" : "Use camera";
}

function resizedPhotoBlob(source, width, height) {
  return new Promise((resolve, reject) => {
    const scale = Math.min(1, 1024 / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d");
    if (!context) { reject(new Error("Your browser could not prepare the photo.")); return; }
    context.drawImage(source, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Your browser could not prepare the photo.")), "image/jpeg", .9);
  });
}

async function loadTryonPhoto(blob) {
  stopCamera();
  tryonAssessment.textContent = "Preparing your photo on this device…";
  tryonDownload.disabled = true;
  detectedEyes = null;
  const sourceUrl = URL.createObjectURL(blob);
  const sourceImage = new Image();
  try {
    await new Promise((resolve, reject) => {
      sourceImage.onload = resolve;
      sourceImage.onerror = () => reject(new Error("That image could not be opened. Try a JPEG or PNG photo."));
      sourceImage.src = sourceUrl;
    });
    const smaller = await resizedPhotoBlob(sourceImage, sourceImage.naturalWidth, sourceImage.naturalHeight);
    const nextUrl = URL.createObjectURL(smaller);
    if (currentPhotoUrl) URL.revokeObjectURL(currentPhotoUrl);
    currentPhotoUrl = nextUrl;
    await new Promise((resolve, reject) => {
      tryonImage.onload = resolve;
      tryonImage.onerror = () => reject(new Error("Your resized photo could not be displayed."));
      tryonImage.src = nextUrl;
    });
    tryonStage.hidden = false;
    delete tryonStage.dataset.detected;
    tryonCompareWrap.hidden = true;
    tryonCanvas.width = tryonImage.naturalWidth;
    tryonCanvas.height = tryonImage.naturalHeight;
    tryonCanvas.style.setProperty("--compare", `${100 - Number(tryonCompare.value)}%`);
    sizeTryonPreview();
    tryonManual.hidden = true;
    tryonStage.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
    await assessTryonPhoto();
  } catch (error) {
    tryonAssessment.textContent = `${error.message} You can still compare styles manually below.`;
    tryonManual.hidden = false;
    console.error("Photo try-on could not process the selected image.", error);
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

function pointAt(landmarks, index) {
  const point = landmarks[index];
  return { x: point.x * tryonCanvas.width, y: point.y * tryonCanvas.height };
}

function averagePoints(points) {
  return points.reduce((result, point) => ({ x: result.x + point.x / points.length, y: result.y + point.y / points.length }), { x: 0, y: 0 });
}

function pointDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function buildEye(landmarks, outerIndex, innerIndex, upperIndices, upperCenterIndices, lowerCenterIndices) {
  const contour = upperIndices.map(index => pointAt(landmarks, index));
  const outer = pointAt(landmarks, outerIndex);
  const inner = pointAt(landmarks, innerIndex);
  const upperCenter = averagePoints(upperCenterIndices.map(index => pointAt(landmarks, index)));
  const lowerCenter = averagePoints(lowerCenterIndices.map(index => pointAt(landmarks, index)));
  return {
    contour,
    outer,
    inner,
    width: pointDistance(outer, inner),
    height: pointDistance(upperCenter, lowerCenter)
  };
}

async function assessTryonPhoto() {
  tryonAssessment.textContent = "Loading the on-device face guide…";
  let landmarker;
  try {
    landmarker = await getFaceLandmarker();
  } catch (error) {
    console.error("On-device face guide could not load.", error);
    tryonAssessment.textContent = "The face-guide library could not load (you may be offline). Your photo stays here. Choose a style manually below, or try again with an internet connection.";
    tryonManual.dataset.style = assistantState.style.toLowerCase().replace(/\s/g, "-");
    tryonManual.hidden = false;
    return;
  }
  try {
    await new Promise(resolve => requestAnimationFrame(resolve));
    const detectionStarted = performance.now();
    const result = landmarker.detect(tryonImage);
    const detectionDuration = performance.now() - detectionStarted;
    if (!result.faceLandmarks || !result.faceLandmarks.length) {
      tryonAssessment.textContent = "I couldn't find a face. Try better lighting, face the camera, and keep both eyes visible. You can still choose a style manually.";
      tryonManual.hidden = false;
      return;
    }
    const landmarks = result.faceLandmarks[0];
    const eyes = [
      buildEye(landmarks, 33, 133, [33, 160, 159, 158, 157, 173, 133], [159, 158], [145, 153]),
      buildEye(landmarks, 263, 362, [263, 387, 386, 385, 384, 398, 362], [386, 385], [374, 380])
    ];
    if (eyes.some(eye => eye.width < 1 || eye.height / eye.width < .075)) {
      tryonAssessment.textContent = "Your eyes look closed or are hard to see in this photo. Try a clear photo with both eyes open and facing the camera.";
      tryonManual.hidden = false;
      return;
    }
    detectedEyes = eyes;
    tryonStage.dataset.detected = "true";
    tryonCompareWrap.hidden = false;
    tryonManual.hidden = false;
    const averageWidth = (eyes[0].width + eyes[1].width) / 2;
    const aspectRatio = averageWidth / ((eyes[0].height + eyes[1].height) / 2);
    const spacingRatio = pointDistance(eyes[0].inner, eyes[1].inner) / averageWidth;
    const tilt = ((eyes[0].inner.y - eyes[0].outer.y) / eyes[0].width + (eyes[1].inner.y - eyes[1].outer.y) / eyes[1].width) / 2;
    const suggestedStyle = aspectRatio < 2.2 ? "Classic" : aspectRatio > 3.35 && tilt > .035 ? "Cateye" : aspectRatio > 3.35 || spacingRatio > .9 ? "Hybrid" : "Volume";
    const suggestedMap = suggestedStyle === "Cateye" ? "cat-eye" : tilt < -.055 ? "doll" : spacingRatio > 1.15 ? "natural" : "wispy";
    const tiltCategory = tilt > .055 ? "upturned" : tilt < -.055 ? "downturned" : "straight";
    const tiltText = tiltCategory === "upturned" ? "upturned (slightly lifted) outer corners" : tiltCategory === "downturned" ? "downturned (slightly lower) outer corners" : "a straight, fairly level outer-corner line";
    const spacingText = spacingRatio > 1.15 ? "a little more space between the eyes" : spacingRatio < .78 ? "eyes that sit a little closer together" : "balanced eye spacing";
    const shapeText = aspectRatio < 2.2 ? "a rounder eye opening" : aspectRatio > 3.35 ? "a more elongated eye opening" : "balanced eye proportions";
    assistantState.style = suggestedStyle;
    assistantState.lashMap = suggestedMap;
    setTryonStyle(suggestedStyle);
    const slowDeviceNote = detectionDuration > 2500 ? " It took a little longer on this device, but your photo was still processed locally." : "";
    tryonAssessment.textContent = `For fun, this guide suggests ${suggestedStyle} with a ${suggestedMap} map: it noticed ${shapeText}, ${tiltText} and ${spacingText}. This is only a visual guide; Micha will confirm in person.${slowDeviceNote}`;
    drawLashOverlay();
    tryonDownload.disabled = false;
  } catch (error) {
    detectedEyes = null;
    tryonDownload.disabled = true;
    tryonAssessment.textContent = "The face guide had trouble reading this photo. Try better lighting and a front-facing photo, or choose a style manually.";
    console.error("On-device face assessment failed.", error);
  }
}

function drawSingleEye(eye, settings) {
  const contour = eye.contour;
  const lengths = [];
  let total = 0;
  for (let index = 1; index < contour.length; index++) {
    const segmentLength = pointDistance(contour[index - 1], contour[index]);
    lengths.push(segmentLength);
    total += segmentLength;
  }
  if (!total) return;
  const lineCount = Math.max(8, Math.floor(total / settings.spacing));
  tryonContext.lineCap = "round";
  tryonContext.lineJoin = "round";
  tryonContext.strokeStyle = "rgba(10, 10, 10, 0.78)";
  tryonContext.lineWidth = Math.max(.65, eye.width * settings.width);
  for (let index = 0; index <= lineCount; index++) {
    const t = index / lineCount;
    let remaining = t * total, segment = 0;
    while (segment < lengths.length - 1 && remaining > lengths[segment]) {
      remaining -= lengths[segment];
      segment++;
    }
    const start = contour[segment], end = contour[segment + 1];
    const ratio = lengths[segment] ? remaining / lengths[segment] : 0;
    const root = { x: start.x + (end.x - start.x) * ratio, y: start.y + (end.y - start.y) * ratio };
    const tangentLength = Math.max(1, lengths[segment]);
    const tangent = { x: (end.x - start.x) / tangentLength, y: (end.y - start.y) / tangentLength };
    let normal = { x: tangent.y, y: -tangent.x };
    if (normal.y > 0) normal = { x: -normal.x, y: -normal.y };
    const outward = { x: -tangent.x, y: -tangent.y };
    let mapMultiplier = 1;
    if (assistantState.lashMap === "cat-eye") mapMultiplier = 1.28 - .3 * t;
    else if (assistantState.lashMap === "doll") mapMultiplier = 1.08 + .2 * (1 - Math.abs(t - .5) * 2);
    else if (assistantState.lashMap === "natural") mapMultiplier = .92 + .16 * (1 - Math.abs(t - .5) * 2);
    const outerMultiplier = 1.18 - .18 * t;
    const baseLength = eye.width * settings.length * outerMultiplier * mapMultiplier;
    for (let strand = 0; strand < settings.strands; strand++) {
      const fanOffset = settings.strands === 1 ? 0 : (strand - (settings.strands - 1) / 2) * .12;
      const direction = { x: normal.x + outward.x * .2 + tangent.x * fanOffset, y: normal.y + outward.y * .2 + tangent.y * fanOffset };
      const directionSize = Math.hypot(direction.x, direction.y) || 1;
      const length = baseLength * (strand === 0 ? 1 : .9 + .1 * (strand % 2));
      const tip = { x: root.x + direction.x / directionSize * length, y: root.y + direction.y / directionSize * length };
      tryonContext.beginPath();
      tryonContext.moveTo(root.x, root.y);
      tryonContext.quadraticCurveTo(root.x + direction.x * length * .35 + tangent.x * length * .08, root.y + direction.y * length * .35 + tangent.y * length * .08, tip.x, tip.y);
      tryonContext.stroke();
    }
  }
}

function drawLashOverlay() {
  if (!detectedEyes || !tryonContext) return;
  tryonContext.clearRect(0, 0, tryonCanvas.width, tryonCanvas.height);
  const settings = STYLE_RENDER[assistantState.style] || STYLE_RENDER.Classic;
  detectedEyes.forEach(eye => drawSingleEye(eye, settings));
}

function sizeTryonPreview() {
  if (!tryonImage.naturalWidth || !tryonImage.naturalHeight) return;
  const stageParent = tryonStage.parentElement;
  const parentStyle = getComputedStyle(stageParent);
  const horizontalPadding = parseFloat(parentStyle.paddingLeft) + parseFloat(parentStyle.paddingRight);
  const availableWidth = Math.max(1, stageParent.clientWidth - horizontalPadding);
  const maxHeight = Math.min(innerHeight * .62, 520);
  const scale = Math.min(availableWidth / tryonImage.naturalWidth, maxHeight / tryonImage.naturalHeight);
  const width = Math.max(1, Math.round(tryonImage.naturalWidth * scale));
  const height = Math.max(1, Math.round(tryonImage.naturalHeight * scale));
  tryonStage.style.width = `${width}px`;
  tryonStage.style.height = `${height}px`;
  tryonStage.style.aspectRatio = `${width} / ${height}`;
}

addEventListener("resize", () => {
  if (!tryonStage.hidden) sizeTryonPreview();
}, { passive: true });

$("#tryon-file").addEventListener("change", event => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    tryonAssessment.textContent = "Please choose an image file for your private try-on.";
    event.target.value = "";
    return;
  }
  loadTryonPhoto(file);
  event.target.value = "";
});

async function startTryonCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    tryonAssessment.textContent = "Camera access needs a supported browser and a secure HTTPS page. You can upload a photo instead.";
    return;
  }
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
    tryonVideo.srcObject = cameraStream;
    tryonVideo.hidden = false;
    tryonCamera.hidden = true;
    tryonCapture.hidden = false;
    await tryonVideo.play();
    tryonCapture.focus();
    tryonAssessment.textContent = "Face the camera in good light, keep both eyes open, then capture when ready.";
  } catch (error) {
    stopCamera();
    const denied = error.name === "NotAllowedError" || error.name === "SecurityError";
    tryonAssessment.textContent = denied
      ? "Camera permission was denied. Allow camera access in your browser settings, or upload a photo instead."
      : "The camera couldn't start on this device. Try uploading a photo instead.";
    console.error("Camera could not be started.", error);
  }
}

tryonCamera.addEventListener("click", startTryonCamera);

tryonCapture.addEventListener("click", async () => {
  if (!tryonVideo.videoWidth || !tryonVideo.videoHeight) {
    tryonAssessment.textContent = "The camera is still starting. Please try capturing again in a moment.";
    return;
  }
  try {
    const captureCanvas = document.createElement("canvas");
    const scale = Math.min(1, 1024 / Math.max(tryonVideo.videoWidth, tryonVideo.videoHeight));
    captureCanvas.width = Math.round(tryonVideo.videoWidth * scale);
    captureCanvas.height = Math.round(tryonVideo.videoHeight * scale);
    captureCanvas.getContext("2d").drawImage(tryonVideo, 0, 0, captureCanvas.width, captureCanvas.height);
    const blob = await new Promise((resolve, reject) => captureCanvas.toBlob(value => value ? resolve(value) : reject(new Error("Your browser couldn't capture the photo.")), "image/jpeg", .9));
    await loadTryonPhoto(blob);
  } catch (error) {
    tryonAssessment.textContent = `${error.message} You can upload a photo instead.`;
    console.error("Camera capture failed.", error);
  }
});

$("#tryon-download").addEventListener("click", () => {
  if (!detectedEyes || !tryonCanvas.width) return;
  const output = document.createElement("canvas");
  output.width = tryonCanvas.width;
  output.height = tryonCanvas.height;
  const context = output.getContext("2d");
  context.drawImage(tryonImage, 0, 0);
  context.drawImage(tryonCanvas, 0, 0);
  output.toBlob(blob => {
    if (!blob) {
      tryonAssessment.textContent = "Your browser couldn't create the preview download. You can still view the comparison here.";
      return;
    }
    try {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "lashes-by-micha-preview.png";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      tryonAssessment.textContent = "Your browser couldn't start the preview download. You can still view the comparison here.";
      console.error("Lash preview download failed.", error);
    }
  }, "image/png");
});

/* ===== Service selection and honest booking hand-off ===== */
function serviceKey(service) {
  return normalized(service).replace(/\s+/g, "") === "megavolume" ? "mega" : normalized(service).replace(/\s+/g, "");
}

function setSelectedService(service) {
  assistantState.service = service;
  bookingService.value = service;
  updateBookingSummary();
}

function configuredCalendlyUrl(service) {
  if (!service) return null;
  const key = serviceKey(service);
  const serviceUrl = CONFIG.bookingUrls[key];
  const defaultUrl = CONFIG.bookingUrls.default;
  const isSet = url => typeof url === "string" && /^https:\/\/calendly\.com\//i.test(url) && !url.includes("YOUR-LINK");
  if (isSet(serviceUrl)) return { url: serviceUrl, hasServiceEvent: true };
  if (isSet(defaultUrl)) return { url: defaultUrl, hasServiceEvent: false };
  return null;
}

function calendlyPrefill(service) {
  const configured = configuredCalendlyUrl(service);
  if (!configured) return null;
  const url = new URL(configured.url);
  const name = bookingName.value.trim() || assistantState.name;
  const email = bookingEmail.value.trim() || assistantState.email;
  if (name) url.searchParams.set("name", name);
  if (email) url.searchParams.set("email", email);
  if (!configured.hasServiceEvent) url.searchParams.set("a1", service);
  return url.toString();
}

function updateBookingSummary() {
  const service = bookingService.value;
  if (service) assistantState.service = service;
  const selectedLashStyle = assistantState.style;
  bookingSummary.textContent = `Service: ${service || "not selected"} · Try-on style: ${selectedLashStyle}. ${configuredCalendlyUrl(service) ? "Calendly will show live availability and confirm the appointment." : "This website can send a request only; Micha must confirm it."}`;
  const calendarUrl = calendlyPrefill(service);
  const calendlyLink = $("#booking-calendly-link");
  if (calendarUrl) {
    calendlyLink.href = calendarUrl;
    calendlyLink.hidden = false;
    $("#booking-fallback-note").hidden = true;
    $("#booking-date-label").hidden = true;
    $("#booking-date").hidden = true;
    $("#booking-time-label").hidden = true;
    $("#booking-time").hidden = true;
    $("#booking-request").hidden = true;
    $("#booking-calendly-actions").hidden = false;
  } else {
    calendlyLink.hidden = true;
    $("#booking-calendly-actions").hidden = true;
    $("#booking-fallback-note").hidden = false;
    $("#booking-date-label").hidden = false;
    $("#booking-date").hidden = false;
    $("#booking-time-label").hidden = false;
    $("#booking-time").hidden = false;
    $("#booking-request").hidden = false;
  }
}

function bookingRequestMessage() {
  return [
    "Hi Micha, I would like to request an appointment (not yet confirmed).",
    `Service: ${bookingService.value}`,
    `Preferred date: ${$("#booking-date").value || "not provided"}`,
    `Preferred time (South Africa, UTC+2): ${$("#booking-time").value || "not provided"}`,
    `Name: ${bookingName.value.trim() || "not provided"}`,
    `Try-on style: ${assistantState.style}`
  ].join("\n");
}

function updateFallbackLinks() {
  const message = bookingRequestMessage();
  $("#booking-whatsapp-fallback").href = whatsappUrl(message);
}

bookingService.addEventListener("change", () => {
  updateBookingSummary();
  updateFallbackLinks();
});
[bookingName, bookingEmail, $("#booking-date"), $("#booking-time")].forEach(input => {
  input.addEventListener("input", () => {
    if (input === bookingName) assistantState.name = input.value.trim();
    if (input === bookingEmail) assistantState.email = input.value.trim();
    updateBookingSummary();
    updateFallbackLinks();
  });
});

let calendlyLoadPromise = null;
function loadCalendlyWidget() {
  if (window.Calendly) return Promise.resolve(window.Calendly);
  if (calendlyLoadPromise) return calendlyLoadPromise;
  calendlyLoadPromise = new Promise((resolve, reject) => {
    let script = document.querySelector("script[data-calendly-widget]");
    let appendScript = false;
    if (!script) {
      script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.dataset.calendlyWidget = "";
      appendScript = true;
    }
    if (script.dataset.failed === "true") { reject(new Error("Calendly could not load.")); return; }
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      if (window.Calendly) resolve(window.Calendly);
      else reject(new Error("Calendly loaded without its widget API."));
    }, { once: true });
    script.addEventListener("error", () => {
      script.dataset.failed = "true";
      reject(new Error("Calendly could not load."));
    }, { once: true });
    if (script.dataset.loaded === "true" && window.Calendly) resolve(window.Calendly);
    if (appendScript) document.head.appendChild(script);
    setTimeout(() => reject(new Error("Calendly took too long to load.")), 10000);
  });
  return calendlyLoadPromise;
}

function showCalendlyFallback(error, url) {
  console.error("Calendly could not open.", error);
  const link = $("#booking-calendly-link");
  link.href = url;
  link.hidden = false;
  const fallback = $("#booking-whatsapp-fallback");
  fallback.href = whatsappUrl(bookingRequestMessage());
  fallback.hidden = false;
  assistantBookingStatus.textContent = "Calendly didn't load here. Open the Calendly link in a new tab, or ask Micha on WhatsApp.";
}

$("#booking-open-calendly").addEventListener("click", async () => {
  const service = bookingService.value;
  const url = calendlyPrefill(service);
  if (!url) return;
  assistantBookingStatus.textContent = "Opening live Calendly availability…";
  try {
    const calendly = await loadCalendlyWidget();
    calendly.initPopupWidget({ url });
    assistantBookingStatus.textContent = `Opening Calendly for ${service}. Calendly confirms the appointment and emails the confirmation and reminder.`;
  } catch (error) {
    showCalendlyFallback(error, url);
  }
});

$("#booking-inline-toggle").addEventListener("click", async () => {
  const url = calendlyPrefill(bookingService.value);
  if (!url) return;
  const container = $("#booking-inline");
  container.hidden = false;
  assistantBookingStatus.textContent = "Loading the live scheduler…";
  try {
    const calendly = await loadCalendlyWidget();
    container.replaceChildren();
    calendly.initInlineWidget({ url, parentElement: container });
    assistantBookingStatus.textContent = "Calendly shows live availability, confirms your booking, and emails your confirmation and reminder.";
  } catch (error) {
    showCalendlyFallback(error, url);
  }
});

$("#booking-request").addEventListener("click", () => {
  if (!bookingService.value || !bookingName.value.trim() || !$("#booking-date").value || !$("#booking-time").value) {
    assistantBookingStatus.textContent = "Please choose a service and enter your name, preferred date and preferred time before sending your request.";
    if (!bookingService.value) bookingService.focus();
    else if (!bookingName.value.trim()) bookingName.focus();
    else if (!$("#booking-date").value) $("#booking-date").focus();
    else $("#booking-time").focus();
    return;
  }
  updateFallbackLinks();
  assistantBookingStatus.textContent = "WhatsApp is opening with your appointment request. It is not confirmed until Micha replies.";
  window.open(whatsappUrl(bookingRequestMessage()), "_blank", "noopener");
});

$("#booking-whatsapp-fallback").href = whatsappUrl(bookingRequestMessage());
updateBookingSummary();