/**
 * Foresight Conferences & Exhibitions - Main Interactive Engine
 * Handles bilingual state, dynamic date expiration, filtering, search, and details modal.
 */

(function () {
  'use strict';

  // --- STATE ---
  let currentLang = localStorage.getItem('foresight_lang') || 'ku';
  let activeTab = 'all'; // 'all', 'medical', 'non-medical', 'upcoming', 'expired'
  let selectedCountry = 'all';
  let selectedMonthYear = 'all';
  let sortBy = 'date-asc'; // 'date-asc', 'date-desc', 'title'
  let searchQuery = '';
  let activeModalEventId = null;

  // --- I18N DICTIONARY ---
  const i18n = {
    ku: {
      siteTitle: "کۆنفرانس و پێشانگاکانی فۆرسایت | ڕێبەری نێودەوڵەتی",
      brandName: "فۆرسایت",
      brandTagline: "ڕێبەری کۆنفرانس و پێشانگا نێودەوڵەتییەکان",
      heroBadge: "ئەپدەیتی هەفتانەی ٢٠٢٦ – ٢٠٢٧",
      heroTitle: "گەورەترین ڕێبەری <span>کۆنفرانس و پێشانگا</span> نێودەوڵەتییەکان",
      heroSubtitle: "ڕێبەری تەواوی کۆنفرانسە پزیشکی، ئەندازیاری، تەکنەلۆژی و بازرگانییەکان لەگەڵ دابینکردنی بانگهێشتنامەی فەرمیی ڤیزای شنگن، بەریتانیا، کەنەدا و ئەمریکا لەلایەن تیمی فۆرسایتەوە.",
      statTotal: "کۆی بۆنەکان",
      statMedical: "پزیشکی و تەندروستی",
      statTech: "ئەندازیاری و تەکنەلۆژیا",
      statCountries: "وڵاتی جیهانی",
      searchPlaceholder: "گەڕان بەپێی ناوی کۆنفرانس، شار، وڵات یان بواری پسپۆڕی...",
      tabAll: "هەموو بۆنەکان",
      tabMedical: "پزیشکی و تەندروستی",
      tabTech: "ئەندازیاری و تەکنەلۆژیا",
      tabUpcoming: "بەردەستەکان",
      tabExpired: "بەسەرچووەکان",
      filterCountryLabel: "وڵات",
      filterCountryAll: "هەموو وڵاتەکان",
      filterDateLabel: "مانگ و ساڵ",
      filterDateAll: "هەموو مانگەکان",
      filterSortLabel: "ڕیزبەندی",
      sortDateAsc: "زووترین بەروار",
      sortDateDesc: "درەنگترین بەروار",
      sortTitle: "ئەلفوبێ",
      resetFilters: "سڕینەوەی فلتەرەکان",
      resultsCount: "دۆزراوەتەوە:",
      eventsWord: "بۆنە",
      badgeMedical: "پزیشکی",
      badgeTech: "ئەندازیاری و تەکنەلۆژیا",
      statusUpcoming: "بەردەستە",
      statusExpired: "بەسەرچووە",
      viewDetails: "وردەکارییەکان",
      officialSite: "ماڵپەڕی فەرمی",
      ticketsLink: "کڕینی تکت و تۆمارکردن",
      visaFormLink: "فۆرمی بانگهێشتنامەی ڤیزا",
      emptyTitle: "هیچ ئەنجامێک نەدۆزرایەوە",
      emptyDesc: "تکایە وشەی گەڕانەکەت بگۆڕە یان فلتەرەکان لابدە بۆ بینینی هەموو کۆنفرانسەکان.",
      btnReset: "سڕینەوەی گەڕان",
      modalAudienceTitle: "بۆ کێ دەست دەدات؟ (بەشداربووان)",
      modalVisaTitle: "ڕێکاری بانگهێشتنامە و ڤیزا",
      modalForesightTitle: "پشتگیری و خزمەتگوزاریی فۆرسایت",
      modalMetaLocation: "شوێن:",
      modalMetaDate: "بەروار:",
      modalMetaVenue: "هۆڵی بۆنە:",
      modalMetaPrice: "تێچووی تکت:",
      modalShareBtn: "کۆپیکردنی بەستەر",
      copiedNotice: "بەستەری کۆنفرانس کۆپی کرا!",
      footerDesc: "فۆرسایت ڕێبەری سەرەکییە بۆ ئاسانکاریی بەشداریکردنی پزیشکان، ئەندازیاران و بازرگانان لە دیارترین کۆنفرانس و پێشانگاکانی جیهان لەگەڵ دابینکردنی بانگهێشتنامەی فەرمی و بەڕێوەبردنی دۆسیەی ڤیزا.",
      footerRights: "تەواوی مافەکانی پارێزراوە بۆ فۆرسایت © ٢٠٢٦"
    },
    en: {
      siteTitle: "Foresight Conferences & Exhibitions | Global Portal",
      brandName: "Foresight",
      brandTagline: "Global Conferences & Trade Exhibitions Guide",
      heroBadge: "Weekly Updates 2026 – 2027",
      heroTitle: "The Premier Guide to <span>Conferences & Expos</span>",
      heroSubtitle: "Comprehensive portal for international medical, engineering, tech, and trade exhibitions with official visa invitation letter assistance for Schengen, UK, Canada, and USA by Foresight.",
      statTotal: "Total Events",
      statMedical: "Medical & Health",
      statTech: "Engineering & Tech",
      statCountries: "Countries",
      searchPlaceholder: "Search by conference name, city, country, or field...",
      tabAll: "All Events",
      tabMedical: "Medical & Health",
      tabTech: "Engineering & Tech",
      tabUpcoming: "Upcoming",
      tabExpired: "Past / Expired",
      filterCountryLabel: "Country",
      filterCountryAll: "All Countries",
      filterDateLabel: "Month & Year",
      filterDateAll: "All Dates",
      filterSortLabel: "Sort By",
      sortDateAsc: "Date: Soonest First",
      sortDateDesc: "Date: Latest First",
      sortTitle: "Alphabetical",
      resetFilters: "Clear Filters",
      resultsCount: "Showing:",
      eventsWord: "events",
      badgeMedical: "Medical",
      badgeTech: "Engineering & Tech",
      statusUpcoming: "Active",
      statusExpired: "Past / Expired",
      viewDetails: "View Details",
      officialSite: "Official Site",
      ticketsLink: "Buy Tickets / Register",
      visaFormLink: "Visa Invitation Form",
      emptyTitle: "No Events Found",
      emptyDesc: "Try adjusting your search criteria or clear your filters to view available conferences.",
      btnReset: "Reset Filters",
      modalAudienceTitle: "Who Should Attend? (Target Audience)",
      modalVisaTitle: "Visa Invitation Procedure",
      modalForesightTitle: "Foresight Dossier & Visa Services",
      modalMetaLocation: "Location:",
      modalMetaDate: "Dates:",
      modalMetaVenue: "Venue:",
      modalMetaPrice: "Tickets:",
      modalShareBtn: "Copy Event Link",
      copiedNotice: "Event link copied to clipboard!",
      footerDesc: "Foresight is your premier partner for international conference participation, official invitation letter issuance, and comprehensive visa dossier management across Europe and North America.",
      footerRights: "All Rights Reserved © Foresight 2026"
    }
  };

  // --- HELPERS ---
  const now = new Date();

  function isEventExpired(event) {
    if (!event.endDate) return false;
    const end = new Date(event.endDate + 'T23:59:59');
    return end < now;
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
    const monthNamesEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthNamesKu = ["کانوونی دووەم", "شوبات", "ئازار", "نیسان", "ئایار", "حوزەیران", "تەممووز", "ئاب", "ئەیلوول", "تشرینی یەکەم", "تشرینی دووەم", "کانوونی یەکەم"];
    
    if (lang === 'ku') {
      return `${monthNamesKu[mNum - 1]} ${year}`;
    }
    return `${monthNamesEn[mNum - 1]} ${year}`;
  }

  // --- DOM ELEMENTS ---
  const elements = {
    langBtn: document.getElementById('langToggleBtn'),
    langText: document.getElementById('langText'),
    searchInput: document.getElementById('searchInput'),
    pillsContainer: document.getElementById('pillsContainer'),
    countrySelect: document.getElementById('countrySelect'),
    monthYearSelect: document.getElementById('monthYearSelect'),
    sortSelect: document.getElementById('sortSelect'),
    resetBtn: document.getElementById('resetFiltersBtn'),
    eventsGrid: document.getElementById('eventsGrid'),
    resultsCount: document.getElementById('resultsCountNumber'),
    resultsTotal: document.getElementById('resultsTotalNumber'),
    emptyState: document.getElementById('emptyState'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalContent: document.getElementById('modalContentArea'),
    toast: document.getElementById('toastNotice'),
    backToTop: document.getElementById('backToTopBtn')
  };

  // --- INITIALIZATION ---
  function init() {
    setLanguage(currentLang, false);
    populateFilterDropdowns();
    renderStatistics();
    bindEvents();
    checkUrlHash();
    applyFiltersAndRender();
  }

  // --- LANGUAGE SWITCHER ---
  function setLanguage(lang, rerender = true) {
    currentLang = lang;
    localStorage.setItem('foresight_lang', lang);
    document.documentElement.lang = lang;
    document.body.dir = lang === 'ku' ? 'rtl' : 'ltr';

    if (elements.langText) {
      elements.langText.textContent = lang === 'ku' ? 'English' : 'کوردی';
    }

    // Update static texts
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[lang] && i18n[lang][key]) {
        el.innerHTML = i18n[lang][key];
      }
    });

    // Update placeholder
    if (elements.searchInput) {
      elements.searchInput.placeholder = i18n[lang].searchPlaceholder;
    }

    if (rerender) {
      populateFilterDropdowns();
      applyFiltersAndRender();
      if (activeModalEventId) {
        openModal(activeModalEventId);
      }
    }
  }

  // --- POPULATE DROPDOWNS ---
  function populateFilterDropdowns() {
    if (!window.FORESIGHT_EVENTS) return;
    const events = window.FORESIGHT_EVENTS;
    const t = i18n[currentLang];

    // 1. Countries
    const countriesMap = new Map();
    events.forEach(e => {
      const name = currentLang === 'ku' ? e.country_ku : e.country_en;
      if (!countriesMap.has(e.country_en)) {
        countriesMap.set(e.country_en, { name, flag: e.flag || '🌐' });
      }
    });

    const currentCountryVal = elements.countrySelect.value || 'all';
    elements.countrySelect.innerHTML = `<option value="all">${t.filterCountryAll}</option>`;
    Array.from(countriesMap.entries())
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
      .forEach(([key, val]) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = `${val.flag} ${val.name}`;
        elements.countrySelect.appendChild(opt);
      });
    elements.countrySelect.value = currentCountryVal;

    // 2. Month & Years
    const monthSet = new Set();
    events.forEach(e => {
      const k = getMonthYearKey(e.startDate);
      if (k) monthSet.add(k);
    });

    const currentMonthVal = elements.monthYearSelect.value || 'all';
    elements.monthYearSelect.innerHTML = `<option value="all">${t.filterDateAll}</option>`;
    Array.from(monthSet)
      .sort()
      .forEach(k => {
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = formatMonthYearLabel(k, currentLang);
        elements.monthYearSelect.appendChild(opt);
      });
    elements.monthYearSelect.value = currentMonthVal;
  }

  // --- STATISTICS BANNER ---
  function renderStatistics() {
    if (!window.FORESIGHT_EVENTS) return;
    const events = window.FORESIGHT_EVENTS;

    const total = events.length;
    const medical = events.filter(e => e.category === 'medical').length;
    const tech = events.filter(e => e.category === 'non-medical').length;
    const countries = new Set(events.map(e => e.country_en)).size;

    const statTotalEl = document.getElementById('statTotalNum');
    const statMedEl = document.getElementById('statMedNum');
    const statTechEl = document.getElementById('statTechNum');
    const statCountriesEl = document.getElementById('statCountriesNum');

    if (statTotalEl) statTotalEl.textContent = total;
    if (statMedEl) statMedEl.textContent = medical;
    if (statTechEl) statTechEl.textContent = tech;
    if (statCountriesEl) statCountriesEl.textContent = countries;

    // Update pill counters
    const badgeAll = document.getElementById('badgeCountAll');
    const badgeMed = document.getElementById('badgeCountMed');
    const badgeTech = document.getElementById('badgeCountTech');
    const badgeActive = document.getElementById('badgeCountActive');
    const badgeExpired = document.getElementById('badgeCountExpired');

    const upcoming = events.filter(e => !isEventExpired(e)).length;
    const expired = events.filter(e => isEventExpired(e)).length;

    if (badgeAll) badgeAll.textContent = total;
    if (badgeMed) badgeMed.textContent = medical;
    if (badgeTech) badgeTech.textContent = tech;
    if (badgeActive) badgeActive.textContent = upcoming;
    if (badgeExpired) badgeExpired.textContent = expired;
  }

  // --- FILTERING & SORTING ---
  function applyFiltersAndRender() {
    if (!window.FORESIGHT_EVENTS) return;
    let list = [...window.FORESIGHT_EVENTS];

    // 1. Tab Filter
    if (activeTab === 'medical') {
      list = list.filter(e => e.category === 'medical');
    } else if (activeTab === 'non-medical') {
      list = list.filter(e => e.category === 'non-medical');
    } else if (activeTab === 'upcoming') {
      list = list.filter(e => !isEventExpired(e));
    } else if (activeTab === 'expired') {
      list = list.filter(e => isEventExpired(e));
    }

    // 2. Country Filter
    if (selectedCountry !== 'all') {
      list = list.filter(e => e.country_en === selectedCountry);
    }

    // 3. Month & Year Filter
    if (selectedMonthYear !== 'all') {
      list = list.filter(e => getMonthYearKey(e.startDate) === selectedMonthYear);
    }

    // 4. Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(e => {
        const titleKu = (e.title_ku || '').toLowerCase();
        const titleEn = (e.title_en || '').toLowerCase();
        const fieldKu = (e.field_ku || '').toLowerCase();
        const fieldEn = (e.field_en || '').toLowerCase();
        const cityKu = (e.city_ku || '').toLowerCase();
        const cityEn = (e.city_en || '').toLowerCase();
        const venue = (e.venue || '').toLowerCase();
        const overviewKu = (e.overview_ku || '').toLowerCase();
        const overviewEn = (e.overview_en || '').toLowerCase();

        return (
          titleKu.includes(q) ||
          titleEn.includes(q) ||
          fieldKu.includes(q) ||
          fieldEn.includes(q) ||
          cityKu.includes(q) ||
          cityEn.includes(q) ||
          venue.includes(q) ||
          overviewKu.includes(q) ||
          overviewEn.includes(q)
        );
      });
    }

    // 5. Sorting
    if (sortBy === 'date-asc') {
      list.sort((a, b) => new Date(a.startDate || '2099-01-01') - new Date(b.startDate || '2099-01-01'));
    } else if (sortBy === 'date-desc') {
      list.sort((a, b) => new Date(b.startDate || '2000-01-01') - new Date(a.startDate || '2000-01-01'));
    } else if (sortBy === 'title') {
      list.sort((a, b) => {
        const tA = currentLang === 'ku' ? a.title_ku : a.title_en;
        const tB = currentLang === 'ku' ? b.title_ku : b.title_en;
        return tA.localeCompare(tB);
      });
    }

    // Render results
    renderCards(list);
  }

  // --- RENDER EVENT CARDS ---
  function renderCards(events) {
    const t = i18n[currentLang];
    elements.eventsGrid.innerHTML = '';

    if (elements.resultsCount) elements.resultsCount.textContent = events.length;
    if (elements.resultsTotal) elements.resultsTotal.textContent = window.FORESIGHT_EVENTS.length;

    if (events.length === 0) {
      elements.emptyState.style.display = 'block';
      return;
    }

    elements.emptyState.style.display = 'none';

    events.forEach(e => {
      const expired = isEventExpired(e);
      const title = currentLang === 'ku' ? e.title_ku : e.title_en;
      const city = currentLang === 'ku' ? e.city_ku : e.city_en;
      const country = currentLang === 'ku' ? e.country_ku : e.country_en;
      const dateText = currentLang === 'ku' ? e.dateText_ku : e.dateText_en;
      const excerpt = currentLang === 'ku' ? e.overview_ku : e.overview_en;
      const categoryBadge = e.category === 'medical' ? t.badgeMedical : t.badgeTech;
      const categoryClass = e.category === 'medical' ? 'badge-medical' : 'badge-tech';
      const statusText = expired ? t.statusExpired : t.statusUpcoming;
      const statusClass = expired ? 'badge-status-expired' : 'badge-status-active';

      const card = document.createElement('article');
      card.className = `event-card ${expired ? 'is-expired' : ''}`;
      card.id = `card-${e.id}`;

      card.innerHTML = `
        <div class="card-top-bar">
          <div class="badge-group">
            <span class="badge ${categoryClass}">${categoryBadge}</span>
            <span class="badge ${statusClass}">
              ${expired ? '⏱ ' : '● '}${statusText}
            </span>
          </div>
          <span class="badge-flag" title="${country}">
            ${e.flag || '🌐'} ${city}
          </span>
        </div>

        <div class="card-body">
          <div class="event-dates-tag">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>${dateText}</span>
          </div>

          <h3 class="event-title" title="${title}">${title}</h3>

          <div class="event-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${e.venue || city + ', ' + country}</span>
          </div>

          <p class="event-excerpt">${excerpt}</p>

          <div class="visa-feature-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <span>${currentLang === 'ku' ? e.visa_ku : e.visa_en}</span>
          </div>

          <div class="card-actions">
            <button class="btn-details" data-id="${e.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>${t.viewDetails}</span>
            </button>
            <a href="${e.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn-official-link" title="${t.officialSite}">
              <span>${t.officialSite}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      `;

      elements.eventsGrid.appendChild(card);
    });
  }

  // --- DETAILS MODAL ---
  function openModal(id) {
    if (!window.FORESIGHT_EVENTS) return;
    const event = window.FORESIGHT_EVENTS.find(e => e.id === id);
    if (!event) return;

    activeModalEventId = id;
    window.location.hash = `event=${id}`;

    const t = i18n[currentLang];
    const expired = isEventExpired(event);
    const title = currentLang === 'ku' ? event.title_ku : event.title_en;
    const altTitle = currentLang === 'ku' ? event.title_en : event.title_ku;
    const city = currentLang === 'ku' ? event.city_ku : event.city_en;
    const country = currentLang === 'ku' ? event.country_ku : event.country_en;
    const dateText = currentLang === 'ku' ? event.dateText_ku : event.dateText_en;
    const overview = currentLang === 'ku' ? event.overview_ku : event.overview_en;
    const audience = currentLang === 'ku' ? event.audience_ku : event.audience_en;
    const visa = currentLang === 'ku' ? event.visa_ku : event.visa_en;
    const foresight = currentLang === 'ku' ? event.foresight_ku : event.foresight_en;
    const ticketPrice = currentLang === 'ku' ? event.ticketPrice_ku : event.ticketPrice_en;

    const audienceListHtml = (audience || []).map(item => `<li>${item}</li>`).join('');

    elements.modalContent.innerHTML = `
      <div class="modal-header">
        <div class="modal-title-col">
          <div class="badge-group" style="margin-bottom: 0.25rem;">
            <span class="badge ${event.category === 'medical' ? 'badge-medical' : 'badge-tech'}">
              ${event.category === 'medical' ? t.badgeMedical : t.badgeTech}
            </span>
            <span class="badge ${expired ? 'badge-status-expired' : 'badge-status-active'}">
              ${expired ? '⏱ ' + t.statusExpired : '● ' + t.statusUpcoming}
            </span>
          </div>
          <h2 class="modal-title">${title}</h2>
          <div class="modal-subtitle">${altTitle}</div>
        </div>
        <button class="modal-close-btn" id="modalCloseBtnInner" aria-label="Close modal">✕</button>
      </div>

      <div class="modal-body">
        <div class="info-meta-chips">
          <div class="info-chip">
            <strong>${t.modalMetaLocation}</strong>
            <span>${event.flag || '🌐'} ${city}, ${country}</span>
          </div>
          <div class="info-chip">
            <strong>${t.modalMetaDate}</strong>
            <span>📅 ${dateText}</span>
          </div>
          <div class="info-chip">
            <strong>${t.modalMetaVenue}</strong>
            <span>🏛️ ${event.venue || city}</span>
          </div>
          ${ticketPrice ? `
            <div class="info-chip">
              <strong>${t.modalMetaPrice}</strong>
              <span>🎟️ ${ticketPrice}</span>
            </div>
          ` : ''}
        </div>

        <div class="info-section">
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.6;">${overview}</p>
        </div>

        ${audienceListHtml ? `
          <div class="info-section">
            <h4 class="info-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              ${t.modalAudienceTitle}
            </h4>
            <ul class="audience-list">
              ${audienceListHtml}
            </ul>
          </div>
        ` : ''}

        <div class="visa-callout">
          <strong>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline; vertical-align:middle; margin-left:4px;">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            ${t.modalVisaTitle}
          </strong>
          <p>${visa}</p>
        </div>

        <div class="foresight-supervision-box">
          <strong>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline; vertical-align:middle; margin-left:4px;">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            ${t.modalForesightTitle}
          </strong>
          <p>${foresight}</p>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary-action" id="shareEventBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          <span>${t.modalShareBtn}</span>
        </button>

        <div class="footer-btn-group">
          ${event.ticketUrl ? `
            <a href="${event.ticketUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary-action">
              <span>🎟️ ${t.ticketsLink}</span>
            </a>
          ` : ''}
          ${event.visaUrl ? `
            <a href="${event.visaUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary-action">
              <span>🛂 ${t.visaFormLink}</span>
            </a>
          ` : ''}
          <a href="${event.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary-action">
            <span>🌐 ${t.officialSite}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      </div>
    `;

    elements.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Hook internal buttons
    const closeBtn = document.getElementById('modalCloseBtnInner');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

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
    setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 2800);
  }

  function checkUrlHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#event=')) {
      const id = hash.replace('#event=', '');
      setTimeout(() => openModal(id), 300);
    }
  }

  // --- EVENT BINDINGS ---
  function bindEvents() {
    // Language Switch
    if (elements.langBtn) {
      elements.langBtn.addEventListener('click', () => {
        const nextLang = currentLang === 'ku' ? 'en' : 'ku';
        setLanguage(nextLang);
      });
    }

    // Search Input
    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        applyFiltersAndRender();
      });
    }

    // Quick Pill Tabs
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

    // Country Select
    if (elements.countrySelect) {
      elements.countrySelect.addEventListener('change', (e) => {
        selectedCountry = e.target.value;
        applyFiltersAndRender();
      });
    }

    // Month & Year Select
    if (elements.monthYearSelect) {
      elements.monthYearSelect.addEventListener('change', (e) => {
        selectedMonthYear = e.target.value;
        applyFiltersAndRender();
      });
    }

    // Sort Select
    if (elements.sortSelect) {
      elements.sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        applyFiltersAndRender();
      });
    }

    // Reset Filters Button
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

    // Card Details Click Delegation
    if (elements.eventsGrid) {
      elements.eventsGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-details');
        if (btn) {
          const id = btn.getAttribute('data-id');
          openModal(id);
        }
      });
    }

    // Modal Close
    if (elements.modalCloseBtn) {
      elements.modalCloseBtn.addEventListener('click', closeModal);
    }

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

    // Back to top button
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

  // Run on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
