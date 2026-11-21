/**
 * Foresight Conferences & Exhibitions - Complete Interactive Engine
 * Renders full PDF-fidelity cards with embedded photos, SVG flags, 3-column metadata,
 * target audience lists, Foresight visa boxes, direct links, table index view, and auto-expiration.
 */

(function () {
  'use strict';

  // Ensure events dataset is loaded
  const getEvents = () => window.FORESIGHT_EVENTS || (typeof FORESIGHT_EVENTS !== 'undefined' ? FORESIGHT_EVENTS : []);

  // --- STATE ---
  let currentLang = localStorage.getItem('foresight_lang') || 'ku';
  let activeTab = 'all'; // 'all', 'medical', 'non-medical', 'upcoming', 'expired'
  let selectedCountry = 'all';
  let selectedMonthYear = 'all';
  let sortBy = 'date-asc'; // 'date-asc', 'date-desc', 'pdf-order', 'title'
  let viewMode = 'cards'; // 'cards' (2-col full PDF cards), 'single' (1-col large PDF page view), 'table' (PDF page 2/3 index table)
  let searchQuery = '';
  let activeModalEventId = null;

  // --- I18N DICTIONARY ---
  const i18n = {
    ku: {
      siteTitle: "کۆنفرانس و پێشانگاکانی فۆرسایت | FORESIGHT Visa Consultancy & Academic Services",
      brandName: "FORESIGHT",
      brandTagline: "ڕاوێژکاریی ڤیزا و خزمەتگوزارییە ئەکادیمییەکان",
      heroBadge: "ڕێبەری فەرمیی کۆنفرانس و پێشانگا نێودەوڵەتییەکان ٢٠٢٦ – ٢٠٢٧",
      heroTitle: "پێرستی گشتیی <span>کۆنفرانس و پێشانگا</span> جیهانییەکان",
      heroSubtitle: "تەواوی زانیاری، وێنە، بەروار، شوێنی بەڕێوەچوون، گرووپی بەشداربووان و لینکی فەرمیی ٤٢ کۆنفرانس و پێشانگای پزیشکی، ئەندازیاری، تەکنەلۆژی و بازرگانی بە سەرپەرشتیی فۆرسایت.",
      statTotal: "کۆی گشتیی کۆنفرانسەکان",
      statMedical: "کۆنفرانسی پزیشکی و ددانسازی",
      statTech: "پێشانگای ئەندازیاری و بازرگانی",
      statCountries: "وڵاتی جیاواز",
      searchPlaceholder: "گەڕان بەپێی ناوی کۆنفرانس، وڵات، شار، بواری پسپۆڕی یان شوێن...",
      viewCards: "کارتە تەواوەکان",
      viewSingle: "پەڕەی گەورە (PDF)",
      viewTable: "پێرستی گشتی (خشتە)",
      tabAll: "هەموو کۆنفرانسەکان",
      tabMedical: "بەشی یەکەم: پزیشکی و ددانسازی",
      tabTech: "بەشی دووەم: ئەندازیاری، بازرگانی و تەکنەلۆژی",
      tabUpcoming: "بەردەستەکان (داهاتوو)",
      tabExpired: "بەسەرچووەکان",
      filterCountryLabel: "فلتەر بەپێی وڵات",
      filterCountryAll: "هەموو وڵاتەکان",
      filterDateLabel: "فلتەر بەپێی مانگ و ساڵ",
      filterDateAll: "هەموو مانگ و ساڵەکان",
      filterSortLabel: "ڕیزبەندکردن",
      sortPdfOrder: "ڕیزبەندیی پیدیئێفەکە",
      sortDateAsc: "نزیکترین بەروار",
      sortDateDesc: "دوورترین بەروار",
      sortTitle: "بەپێی ئەلفوبێ",
      resetFilters: "سڕینەوەی فلتەرەکان",
      resultsCount: "ژمارەی کۆنفرانسە پیشاندراوەکان:",
      eventsWord: "کۆنفرانس و پێشانگا",
      badgeMedical: "پزیشکی و ددانسازی",
      badgeTech: "ئەندازیاری و بازرگانی",
      statusUpcoming: "بەردەستە",
      statusExpired: "بەسەرچووە",
      daysLeft: "ڕۆژی ماوە",
      metaCountryCity: "وڵات و شار",
      metaDate: "بەرواری کۆنفرانس",
      metaVenue: "شوێنی بەڕێوەچوون",
      metaTicket: "تکت و تۆمارکردن:",
      audienceHeading: "تایبەتە بە کێ؟",
      officialSiteBtn: "سەردانی ماڵپەڕی فەرمی",
      ticketLinkBtn: "لینکی تکت / تۆمارکردن",
      visaFormBtn: "فۆرمی بانگهێشتنامە",
      expandCardBtn: "پیشاندان بە گەورەیی",
      shareBtn: "کۆپیکردنی بەستەر",
      copiedNotice: "بەستەری کۆنفرانسەکە کۆپی کرا!",
      tableColPage: "ژمارە",
      tableColName: "ناوی کۆنفرانس / پێشانگا",
      tableColLocation: "وڵات و شار",
      tableColDate: "بەروار",
      tableColStatus: "دۆخ",
      tableColLinks: "لینکی فەرمی",
      emptyTitle: "هیچ کۆنفرانسێک نەدۆزرایەوە",
      emptyDesc: "تکایە وشەی گەڕانەکەت بگۆڕە یان فلتەرەکان ڕێکبخەرەوە بۆ بینینی هەموو کۆنفرانسەکان.",
      footerDesc: "FORESIGHT — Visa Consultancy & Academic Services: سەرپەرشتیی تەواوی ڕێکارەکانی تۆمارکردن لە کۆنفرانس و پێشانگا نێودەوڵەتییەکان، وەرگرتنی بانگهێشتنامەی فەرمی و ڕێکخستنی فایلی ڤیزای شنگن، بەریتانیا، کەنەدا و ئەمریکا.",
      footerRights: "سەرجەم مافەکان پارێزراوە بۆ FORESIGHT © 2026–2027"
    },
    en: {
      siteTitle: "FORESIGHT Conferences & Exhibitions | Visa Consultancy & Academic Services",
      brandName: "FORESIGHT",
      brandTagline: "Visa Consultancy & Academic Services",
      heroBadge: "Official International Conferences & Exhibitions Guide 2026 – 2027",
      heroTitle: "General Directory of <span>Global Conferences & Expos</span>",
      heroSubtitle: "Complete official information, photos, dates, venues, target audiences, and direct official links for 42 medical, dental, engineering, technology, and trade exhibitions supervised by Foresight.",
      statTotal: "Total Conferences",
      statMedical: "Medical & Dental",
      statTech: "Engineering, Tech & Trade",
      statCountries: "Countries",
      searchPlaceholder: "Search by conference name, country, city, specialty, or venue...",
      viewCards: "Full Detail Cards",
      viewSingle: "Large Page View",
      viewTable: "General Index Table",
      tabAll: "All Conferences",
      tabMedical: "Part 1: Medical & Dental",
      tabTech: "Part 2: Engineering, Trade & Tech",
      tabUpcoming: "Active / Upcoming",
      tabExpired: "Past / Expired",
      filterCountryLabel: "Filter by Country",
      filterCountryAll: "All Countries",
      filterDateLabel: "Filter by Month & Year",
      filterDateAll: "All Months & Years",
      filterSortLabel: "Sort Order",
      sortPdfOrder: "Original PDF Order",
      sortDateAsc: "Soonest Date First",
      sortDateDesc: "Latest Date First",
      sortTitle: "Alphabetical",
      resetFilters: "Reset Filters",
      resultsCount: "Showing Conferences:",
      eventsWord: "conferences & exhibitions",
      badgeMedical: "Medical & Dental",
      badgeTech: "Engineering & Trade",
      statusUpcoming: "Active / Open",
      statusExpired: "Expired / Past",
      daysLeft: "days left",
      metaCountryCity: "Country & City",
      metaDate: "Conference Date",
      metaVenue: "Venue",
      metaTicket: "Tickets & Registration:",
      audienceHeading: "Who Should Attend?",
      officialSiteBtn: "Official Website",
      ticketLinkBtn: "Tickets / Registration",
      visaFormBtn: "Visa Invitation Form",
      expandCardBtn: "Full View",
      shareBtn: "Copy Link",
      copiedNotice: "Conference link copied to clipboard!",
      tableColPage: "#",
      tableColName: "Conference / Exhibition Name",
      tableColLocation: "Country & City",
      tableColDate: "Dates",
      tableColStatus: "Status",
      tableColLinks: "Official Link",
      emptyTitle: "No Matching Conferences Found",
      emptyDesc: "Try changing your search query or resetting the filters to see all 42 conferences.",
      footerDesc: "FORESIGHT — Visa Consultancy & Academic Services: Complete supervision of international conference registration, official invitation letter acquisition, and Schengen, UK, Canada & USA visa dossier preparation.",
      footerRights: "All Rights Reserved © FORESIGHT 2026–2027"
    }
  };

  // --- DATE & EXPIRATION LOGIC ---
  function getEventStatus(event) {
    const now = new Date();
    const end = new Date((event.endDate || event.startDate) + 'T23:59:59');
    const start = new Date(event.startDate + 'T00:00:00');
    const isExpired = end < now;
    const diffDays = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
    return { isExpired, diffDays };
  }

  function getMonthYearKey(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  function formatMonthYearLabel(key, lang) {
    if (!key) return '';
    const [year, month] = key.split('-');
    const mNum = parseInt(month, 10);
    const monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthNamesKu = [
      "مانگی ١ (کانوونی دووەم / Jan)",
      "مانگی ٢ (شوبات / Feb)",
      "مانگی ٣ (ئازار / Mar)",
      "مانگی ٤ (نیسان / Apr)",
      "مانگی ٥ (ئایار / May)",
      "مانگی ٦ (حوزەیران / Jun)",
      "مانگی ٧ (تەممووز / Jul)",
      "مانگی ٨ (ئاب / Aug)",
      "مانگی ٩ (ئەیلوول / Sep)",
      "مانگی ١٠ (تشرینی یەکەم / Oct)",
      "مانگی ١١ (تشرینی دووەم / Nov)",
      "مانگی ١٢ (کانوونی یەکەم / Dec)"
    ];
    return lang === 'ku' ? `${monthNamesKu[mNum - 1]} ${year}` : `${monthNamesEn[mNum - 1]} ${year}`;
  }

  // --- DOM REFERENCES ---
  const elements = {
    langBtn: document.getElementById('langToggleBtn'),
    langText: document.getElementById('langText'),
    searchInput: document.getElementById('searchInput'),
    pillsContainer: document.getElementById('pillsContainer'),
    countrySelect: document.getElementById('countrySelect'),
    monthYearSelect: document.getElementById('monthYearSelect'),
    sortSelect: document.getElementById('sortSelect'),
    resetBtn: document.getElementById('resetFiltersBtn'),
    viewModeGroup: document.getElementById('viewModeGroup'),
    eventsGrid: document.getElementById('eventsGrid'),
    tableWrapper: document.getElementById('indexTableWrapper'),
    resultsCount: document.getElementById('resultsCountNumber'),
    resultsTotal: document.getElementById('resultsTotalNumber'),
    emptyState: document.getElementById('emptyState'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalContent: document.getElementById('modalContentArea'),
    toast: document.getElementById('toastNotice'),
    backToTop: document.getElementById('backToTopBtn')
  };

  // --- INITIALIZE ---
  function init() {
    setLanguage(currentLang, false);
    populateFilterDropdowns();
    renderStatistics();
    bindEvents();
    applyFiltersAndRender();
    checkUrlHash();
  }

  function setLanguage(lang, rerender = true) {
    currentLang = lang;
    localStorage.setItem('foresight_lang', lang);
    document.documentElement.lang = lang;
    document.body.dir = lang === 'ku' ? 'rtl' : 'ltr';

    if (elements.langText) {
      elements.langText.textContent = lang === 'ku' ? 'English' : 'کوردی';
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[lang] && i18n[lang][key]) {
        el.innerHTML = i18n[lang][key];
      }
    });

    if (elements.searchInput) {
      elements.searchInput.placeholder = i18n[lang].searchPlaceholder;
    }

    if (rerender) {
      populateFilterDropdowns();
      applyFiltersAndRender();
      if (activeModalEventId) openModal(activeModalEventId);
    }
  }

  function populateFilterDropdowns() {
    const events = getEvents();
    if (!events.length) return;
    const t = i18n[currentLang];

    // Countries
    const countriesMap = new Map();
    events.forEach(e => {
      const name = currentLang === 'ku' ? e.country_ku : e.country_en;
      const count = (countriesMap.get(e.country_en)?.count || 0) + 1;
      countriesMap.set(e.country_en, { name, count });
    });

    const prevCountry = elements.countrySelect.value || 'all';
    elements.countrySelect.innerHTML = `<option value="all">${t.filterCountryAll} (${events.length})</option>`;
    Array.from(countriesMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .forEach(([key, val]) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = `${val.name} (${val.count})`;
        elements.countrySelect.appendChild(opt);
      });
    elements.countrySelect.value = prevCountry;

    // Months & Years
    const monthCounts = new Map();
    events.forEach(e => {
      const k = getMonthYearKey(e.startDate);
      if (k) monthCounts.set(k, (monthCounts.get(k) || 0) + 1);
    });

    const prevMonth = elements.monthYearSelect.value || 'all';
    elements.monthYearSelect.innerHTML = `<option value="all">${t.filterDateAll}</option>`;
    Array.from(monthCounts.keys())
      .sort()
      .forEach(k => {
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = `${formatMonthYearLabel(k, currentLang)} (${monthCounts.get(k)})`;
        elements.monthYearSelect.appendChild(opt);
      });
    elements.monthYearSelect.value = prevMonth;
  }

  function renderStatistics() {
    const events = getEvents();
    if (!events.length) return;

    const total = events.length;
    const medical = events.filter(e => e.category === 'medical').length;
    const tech = events.filter(e => e.category === 'non-medical').length;
    const countries = new Set(events.map(e => e.country_en)).size;
    const upcoming = events.filter(e => !getEventStatus(e).isExpired).length;
    const expired = events.filter(e => getEventStatus(e).isExpired).length;

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setEl('statTotalNum', total);
    setEl('statMedNum', medical);
    setEl('statTechNum', tech);
    setEl('statCountriesNum', countries);

    setEl('badgeCountAll', total);
    setEl('badgeCountMed', medical);
    setEl('badgeCountTech', tech);
    setEl('badgeCountActive', upcoming);
    setEl('badgeCountExpired', expired);
  }

  function applyFiltersAndRender() {
    const events = getEvents();
    let list = [...events];

    // 1. Tab Filter
    if (activeTab === 'medical') {
      list = list.filter(e => e.category === 'medical');
    } else if (activeTab === 'non-medical') {
      list = list.filter(e => e.category === 'non-medical');
    } else if (activeTab === 'upcoming') {
      list = list.filter(e => !getEventStatus(e).isExpired);
    } else if (activeTab === 'expired') {
      list = list.filter(e => getEventStatus(e).isExpired);
    }

    // 2. Country Filter
    if (selectedCountry !== 'all') {
      list = list.filter(e => e.country_en === selectedCountry);
    }

    // 3. Month/Year Filter
    if (selectedMonthYear !== 'all') {
      list = list.filter(e => getMonthYearKey(e.startDate) === selectedMonthYear);
    }

    // 4. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(e => {
        const fields = [
          e.title_ku, e.title_en, e.headline_ku, e.headline_en,
          e.field_ku, e.field_en, e.city_ku, e.city_en,
          e.country_ku, e.country_en, e.venue,
          e.overview_ku, e.overview_en,
          ...(e.audience_ku || []), ...(e.audience_en || [])
        ];
        return fields.some(f => (f || '').toLowerCase().includes(q));
      });
    }

    // 5. Sort
    if (sortBy === 'date-asc') {
      list.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } else if (sortBy === 'date-desc') {
      list.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    } else if (sortBy === 'title') {
      list.sort((a, b) => {
        const tA = currentLang === 'ku' ? a.title_ku : a.title_en;
        const tB = currentLang === 'ku' ? b.title_ku : b.title_en;
        return tA.localeCompare(tB);
      });
    }

    if (elements.resultsCount) elements.resultsCount.textContent = list.length;
    if (elements.resultsTotal) elements.resultsTotal.textContent = events.length;

    if (list.length === 0) {
      elements.eventsGrid.style.display = 'none';
      elements.tableWrapper.style.display = 'none';
      elements.emptyState.style.display = 'block';
      return;
    }

    elements.emptyState.style.display = 'none';

    if (viewMode === 'table') {
      elements.eventsGrid.style.display = 'none';
      elements.tableWrapper.style.display = 'block';
      renderIndexTable(list);
    } else {
      elements.tableWrapper.style.display = 'none';
      elements.eventsGrid.style.display = 'grid';
      elements.eventsGrid.classList.toggle('single-col-mode', viewMode === 'single');
      renderFullCards(list);
    }
  }

  // --- BUILD CARD HTML (EXACT PDF PAGE FIDELITY + ALL LINKS) ---
  function buildCardInnerHtml(e, isModal = false) {
    const t = i18n[currentLang];
    const { isExpired, diffDays } = getEventStatus(e);

    const country = currentLang === 'ku' ? e.country_ku : e.country_en;
    const city = currentLang === 'ku' ? e.city_ku : e.city_en;
    const title = currentLang === 'ku' ? e.title_ku : e.title_en;
    const headline = currentLang === 'ku' ? e.headline_ku : e.headline_en;
    const overview = currentLang === 'ku' ? e.overview_ku : e.overview_en;
    const field = currentLang === 'ku' ? e.field_ku : e.field_en;
    const audience = currentLang === 'ku' ? e.audience_ku : e.audience_en;
    const foresightTitle = currentLang === 'ku' ? e.foresight_title_ku : e.foresight_title_en;
    const foresightText = currentLang === 'ku' ? e.foresight_ku : e.foresight_en;
    const ticketPrice = currentLang === 'ku' ? e.ticketPrice_ku : e.ticketPrice_en;
    const deadline = currentLang === 'ku' ? e.deadline_ku : e.deadline_en;

    const statusBadgeHtml = isExpired
      ? `<span class="status-pill expired">⏱ ${t.statusExpired}</span>`
      : `<span class="status-pill active">● ${t.statusUpcoming}${diffDays > 0 ? ` (${diffDays} ${t.daysLeft})` : ''}</span>`;

    const categoryBadgeHtml = e.category === 'medical'
      ? `<span class="cat-pill medical">🩺 ${t.badgeMedical}</span>`
      : `<span class="cat-pill non-medical">🏗️ ${t.badgeTech}</span>`;

    const audienceBulletsHtml = (audience || []).map(item => `<li><span>${item}</span></li>`).join('');

    return `
      <!-- Top Bar: Country Flag & City + Date & Status Badges -->
      <div class="pdf-card-topbar">
        <div class="country-flag-pill">
          <img src="${e.flagImg}" alt="${country}" class="country-flag-img" loading="lazy" />
          <span class="country-city-name">${country} — ${city}</span>
        </div>
        <div class="top-badges-wrap">
          ${categoryBadgeHtml}
          ${statusBadgeHtml}
          <span class="date-pill-badge">📅 ${e.dateText_en}</span>
        </div>
      </div>

      <div class="pdf-card-content">
        <!-- Titles & Visa Headline (Exact from PDF) -->
        <div class="pdf-title-group">
          <div class="pdf-small-title">${title}</div>
          <h3 class="pdf-big-headline">${headline}</h3>
        </div>

        <p class="pdf-overview-text">${overview}</p>

        <!-- High-Res Conference Photo Banner (Extracted from PDF) -->
        <div class="pdf-photo-banner" style="${isModal ? 'height: 240px;' : ''}">
          <img src="${e.image}" alt="${title}" loading="lazy" />
          <div class="photo-field-overlay">
            <span class="photo-field-tag">📌 ${field}</span>
          </div>
        </div>

        <!-- 3-Column Official Metadata Box (وڵات و شار | بەرواری کۆنفرانس | شوێنی بەڕێوەچوون) -->
        <div class="pdf-meta-grid">
          <div class="pdf-meta-col">
            <span class="pdf-meta-label">${t.metaCountryCity}</span>
            <span class="pdf-meta-val">${country} — ${city}</span>
          </div>
          <div class="pdf-meta-col">
            <span class="pdf-meta-label">${t.metaDate}</span>
            <span class="pdf-meta-val" dir="ltr" style="text-align: start;">${e.dateText_en}</span>
          </div>
          <div class="pdf-meta-col">
            <span class="pdf-meta-label">${t.metaVenue}</span>
            <span class="pdf-meta-val">${e.venue}</span>
          </div>
        </div>

        ${ticketPrice ? `
          <div class="pdf-ticket-bar">
            <div><strong>🎟️ ${t.metaTicket}</strong> ${ticketPrice}</div>
            ${e.contactInfo ? `<div style="margin-top:0.2rem;"><strong>📩 Contact:</strong> <span dir="ltr">${e.contactInfo}</span></div>` : ''}
          </div>
        ` : ''}

        ${deadline ? `
          <div class="pdf-deadline-alert">
            ⚠️ ${deadline}
          </div>
        ` : ''}

        <!-- "تایبەتە بە کێ؟" (Target Audience Box - Exact from PDF) -->
        <div class="pdf-audience-box">
          <div class="pdf-box-heading">
            <span class="teal-dot"></span>
            <span>${t.audienceHeading}</span>
          </div>
          <ul class="pdf-audience-list">
            ${audienceBulletsHtml}
          </ul>
        </div>

        <!-- "سەرپەرشتیی فۆرسایت" (Teal Supervision Box - Exact from PDF) -->
        <div class="pdf-foresight-box">
          <div class="pdf-foresight-title">🛡️ ${foresightTitle}</div>
          <div class="pdf-foresight-text">${foresightText}</div>
        </div>

        <!-- Direct Clickable Official Links -->
        <div class="pdf-card-actions">
          <a href="${e.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn-official-primary">
            <span>🌐 ${t.officialSiteBtn}</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>

          ${e.ticketUrl && e.ticketUrl !== e.officialUrl ? `
            <a href="${e.ticketUrl}" target="_blank" rel="noopener noreferrer" class="btn-ticket-link">
              <span>🎟️ ${t.ticketLinkBtn}</span>
            </a>
          ` : ''}

          ${e.visaUrl ? `
            <a href="${e.visaUrl}" target="_blank" rel="noopener noreferrer" class="btn-ticket-link">
              <span>🛂 ${t.visaFormBtn}</span>
            </a>
          ` : ''}

          ${!isModal ? `
            <button class="btn-modal-expand" data-id="${e.id}">
              <span>🔍 ${t.expandCardBtn}</span>
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  function renderFullCards(events) {
    elements.eventsGrid.innerHTML = '';
    events.forEach(e => {
      const { isExpired } = getEventStatus(e);
      const card = document.createElement('article');
      card.className = `pdf-card ${isExpired ? 'is-expired' : ''}`;
      card.id = `card-${e.id}`;
      card.innerHTML = buildCardInnerHtml(e, false);
      elements.eventsGrid.appendChild(card);
    });
  }

  // --- RENDER GENERAL INDEX TABLE (LIKE PAGES 2 & 3 OF PDF) ---
  function renderIndexTable(events) {
    const t = i18n[currentLang];
    const rowsHtml = events.map((e, idx) => {
      const { isExpired } = getEventStatus(e);
      const title = currentLang === 'ku' ? e.title_ku : e.title_en;
      const country = currentLang === 'ku' ? e.country_ku : e.country_en;
      const city = currentLang === 'ku' ? e.city_ku : e.city_en;
      const statusHtml = isExpired
        ? `<span class="status-pill expired">⏱ ${t.statusExpired}</span>`
        : `<span class="status-pill active">● ${t.statusUpcoming}</span>`;

      return `
        <tr>
          <td><strong>${idx + 1}</strong></td>
          <td>
            <div style="font-weight: 800; color: #0f172a; cursor: pointer;" class="table-row-trigger" data-id="${e.id}">${title}</div>
            <div style="font-size: 0.78rem; color: #64748b;">${currentLang === 'ku' ? e.field_ku : e.field_en}</div>
          </td>
          <td>
            <div class="table-flag-cell">
              <img src="${e.flagImg}" alt="${country}" class="country-flag-img" style="width:28px;height:19px;" />
              <span>${country} — ${city}</span>
            </div>
          </td>
          <td dir="ltr" style="font-weight: 700;">${e.dateText_en}</td>
          <td>${statusHtml}</td>
          <td>
            <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
              <a href="${e.officialUrl}" target="_blank" rel="noopener noreferrer" class="table-link-btn">
                🌐 ${t.officialSiteBtn}
              </a>
              <button class="btn-modal-expand" style="padding:0.35rem 0.65rem; font-size:0.78rem;" data-id="${e.id}">
                🔍
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    elements.tableWrapper.innerHTML = `
      <table class="pdf-index-table">
        <thead>
          <tr>
            <th>${t.tableColPage}</th>
            <th>${t.tableColName}</th>
            <th>${t.tableColLocation}</th>
            <th>${t.tableColDate}</th>
            <th>${t.tableColStatus}</th>
            <th>${t.tableColLinks}</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  }

  // --- MODAL VIEW ---
  function openModal(id) {
    const events = getEvents();
    const event = events.find(e => e.id === id);
    if (!event) return;

    activeModalEventId = id;
    window.location.hash = `event=${id}`;
    const t = i18n[currentLang];

    elements.modalContent.innerHTML = `
      <div class="modal-header">
        <div style="font-weight:800; color:var(--foresight-teal); font-size:0.95rem;">
          FORESIGHT — Visa Consultancy & Academic Services
        </div>
        <button class="modal-close-btn" id="modalCloseBtnInner" aria-label="Close">✕</button>
      </div>
      <div class="modal-body" style="padding:0;">
        ${buildCardInnerHtml(event, true)}
      </div>
      <div class="modal-footer">
        <button class="btn-modal-expand" id="shareEventBtn">
          🔗 ${t.shareBtn}
        </button>
        <button class="btn-modal-expand" id="modalCloseFooterBtn">
          ✕
        </button>
      </div>
    `;

    elements.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    const close1 = document.getElementById('modalCloseBtnInner');
    const close2 = document.getElementById('modalCloseFooterBtn');
    if (close1) close1.addEventListener('click', closeModal);
    if (close2) close2.addEventListener('click', closeModal);

    const shareBtn = document.getElementById('shareEventBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const url = window.location.origin + window.location.pathname + `#event=${event.id}`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => showToast(t.copiedNotice));
        } else {
          showToast(t.copiedNotice);
        }
      });
    }
  }

  function closeModal() {
    elements.modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    activeModalEventId = null;
    history.replaceState(null, null, ' ');
  }

  function showToast(msg) {
    if (!elements.toast) return;
    elements.toast.textContent = msg;
    elements.toast.classList.add('show');
    setTimeout(() => elements.toast.classList.remove('show'), 2600);
  }

  function checkUrlHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#event=')) {
      const id = hash.replace('#event=', '');
      setTimeout(() => openModal(id), 250);
    }
  }

  // --- BIND EVENTS ---
  function bindEvents() {
    if (elements.langBtn) {
      elements.langBtn.addEventListener('click', () => {
        setLanguage(currentLang === 'ku' ? 'en' : 'ku');
      });
    }

    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        applyFiltersAndRender();
      });
    }

    if (elements.viewModeGroup) {
      elements.viewModeGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.view-mode-btn');
        if (!btn) return;
        document.querySelectorAll('.view-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        viewMode = btn.getAttribute('data-view');
        applyFiltersAndRender();
      });
    }

    if (elements.pillsContainer) {
      elements.pillsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.pill-btn');
        if (!btn) return;
        document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTab = btn.getAttribute('data-tab');
        applyFiltersAndRender();
      });
    }

    if (elements.countrySelect) {
      elements.countrySelect.addEventListener('change', (e) => {
        selectedCountry = e.target.value;
        applyFiltersAndRender();
      });
    }

    if (elements.monthYearSelect) {
      elements.monthYearSelect.addEventListener('change', (e) => {
        selectedMonthYear = e.target.value;
        applyFiltersAndRender();
      });
    }

    if (elements.sortSelect) {
      elements.sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        applyFiltersAndRender();
      });
    }

    if (elements.resetBtn) {
      elements.resetBtn.addEventListener('click', () => {
        activeTab = 'all';
        selectedCountry = 'all';
        selectedMonthYear = 'all';
        sortBy = 'date-asc';
        searchQuery = '';
        if (elements.searchInput) elements.searchInput.value = '';
        if (elements.countrySelect) elements.countrySelect.value = 'all';
        if (elements.monthYearSelect) elements.monthYearSelect.value = 'all';
        if (elements.sortSelect) elements.sortSelect.value = 'date-asc';
        document.querySelectorAll('.pill-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-tab') === 'all');
        });
        applyFiltersAndRender();
      });
    }

    document.addEventListener('click', (e) => {
      const expandBtn = e.target.closest('.btn-modal-expand[data-id]');
      if (expandBtn) {
        openModal(expandBtn.getAttribute('data-id'));
        return;
      }
      const rowTrigger = e.target.closest('.table-row-trigger[data-id]');
      if (rowTrigger) {
        openModal(rowTrigger.getAttribute('data-id'));
      }
    });

    if (elements.modalOverlay) {
      elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.modalOverlay) closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        elements.backToTop.classList.add('visible');
      } else {
        elements.backToTop.classList.remove('visible');
      }
    });

    if (elements.backToTop) {
      elements.backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
