/**
 * Foresight Conferences & Exhibitions - Main Engine
 * Clean, responsive, bilingual (KU/EN), dark/light mode, PDF-data accurate.
 */

(function () {
  'use strict';

  const getEvents = () => window.FORESIGHT_EVENTS || (typeof FORESIGHT_EVENTS !== 'undefined' ? FORESIGHT_EVENTS : []);

  // --- STATE ---
  let currentLang = localStorage.getItem('foresight_lang') || 'ku';
  let currentTheme = localStorage.getItem('foresight_theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  let activeTab = 'all';
  let selectedCountry = 'all';
  let selectedMonthYear = 'all';
  let sortBy = 'pdf-order';
  let viewMode = 'cards';
  let searchQuery = '';
  let activeModalEventId = null;

  // --- TRANSLATIONS ---
  const i18n = {
    ku: {
      siteTitle: "کۆنفرانس و پێشانگاکانی فۆرسایت | FORESIGHT",
      brandTagline: "ڕاوێژکاریی ڤیزا و خزمەتگوزارییە ئەکادیمییەکان",
      heroBadge: "ڕێبەری کۆنفرانس و پێشانگا نێودەوڵەتییەکان ٢٠٢٦ – ٢٠٢٧",
      heroTitle: "پێرستی گشتیی کۆنفرانس و پێشانگاکان",
      statTotal: "کۆی گشتی",
      statMedical: "پزیشکی",
      statTech: "ئەندازیاری و بازرگانی",
      statCountries: "وڵات",
      searchPlaceholder: "گەڕان بەپێی ناوی کۆنفرانس، وڵات، شار یان بوار...",
      viewCards: "کارتەکان",
      viewSingle: "پەڕە",
      viewTable: "پێرست",
      tabAll: "هەمووی",
      tabMedical: "بەشی یەکەم: پزیشکی",
      tabTech: "بەشی دووەم: ئەندازیاری و بازرگانی",
      tabUpcoming: "بەردەستەکان",
      tabExpired: "بەسەرچووەکان",
      filterCountryLabel: "وڵات",
      filterCountryAll: "هەموو وڵاتەکان",
      filterDateLabel: "مانگ و ساڵ",
      filterDateAll: "هەموو مانگەکان",
      filterSortLabel: "ڕیزبەندی",
      sortPdfOrder: "ڕیزبەندیی پیدیئێف",
      sortDateAsc: "نزیکترین بەروار",
      sortDateDesc: "دوورترین بەروار",
      sortTitle: "ئەلفوبێ",
      resetFilters: "سڕینەوەی فلتەر",
      resultsCount: "ئەنجام:",
      eventsWord: "کۆنفرانس",
      badgeMedical: "پزیشکی",
      badgeTech: "ئەندازیاری و بازرگانی",
      statusUpcoming: "بەردەستە",
      statusExpired: "بەسەرچووە",
      metaCountryCity: "وڵات و شار",
      metaDate: "بەرواری کۆنفرانس",
      metaVenue: "شوێنی بەڕێوەچوون",
      audienceHeading: "تایبەتە بە کێ؟",
      officialSiteBtn: "سەردانی ماڵپەڕی فەرمی",
      ticketLinkBtn: "زانیاریی زیاتر / تۆمارکردن",
      expandCardBtn: "پیشاندانی تەواو",
      shareBtn: "کۆپیکردنی بەستەر",
      copiedNotice: "بەستەری کۆنفرانسەکە کۆپی کرا",
      tableColPage: "لاپەڕە",
      tableColName: "ناوی کۆنفرانس / پێشانگا",
      tableColLocation: "وڵات و شار",
      tableColDate: "بەروار",
      tableColStatus: "دۆخ",
      tableColLinks: "ماڵپەڕی فەرمی",
      emptyTitle: "هیچ کۆنفرانسێک نەدۆزرایەوە",
      emptyDesc: "تکایە وشەی گەڕانەکەت بگۆڕە یان فلتەرەکان لابدە.",
      footerDesc: "سەرپەرشتیی تەواوی ڕێکارەکانی تۆمارکردن لە کۆنفرانس و پێشانگا نێودەوڵەتییەکان، وەرگرتنی بانگهێشتنامەی فەرمی و ڕێکخستنی فایلی ڤیزا.",
      footerRights: "سەرجەم مافەکان پارێزراوە بۆ FORESIGHT © 2026–2027"
    },
    en: {
      siteTitle: "FORESIGHT Conferences & Exhibitions",
      brandTagline: "Visa Consultancy & Academic Services",
      heroBadge: "International Conferences & Exhibitions Guide 2026 – 2027",
      heroTitle: "General Directory of Conferences & Exhibitions",
      statTotal: "Total",
      statMedical: "Medical",
      statTech: "Engineering & Trade",
      statCountries: "Countries",
      searchPlaceholder: "Search by conference name, country, city, or field...",
      viewCards: "Cards",
      viewSingle: "Page",
      viewTable: "Index",
      tabAll: "All",
      tabMedical: "Part 1: Medical",
      tabTech: "Part 2: Engineering & Trade",
      tabUpcoming: "Active",
      tabExpired: "Expired",
      filterCountryLabel: "Country",
      filterCountryAll: "All Countries",
      filterDateLabel: "Month & Year",
      filterDateAll: "All Months",
      filterSortLabel: "Sort",
      sortPdfOrder: "PDF Order",
      sortDateAsc: "Soonest Date",
      sortDateDesc: "Latest Date",
      sortTitle: "Alphabetical",
      resetFilters: "Reset",
      resultsCount: "Showing:",
      eventsWord: "conferences",
      badgeMedical: "Medical",
      badgeTech: "Engineering & Trade",
      statusUpcoming: "Active",
      statusExpired: "Expired",
      metaCountryCity: "Country & City",
      metaDate: "Conference Date",
      metaVenue: "Venue",
      audienceHeading: "Who Should Attend?",
      officialSiteBtn: "Visit Official Website",
      ticketLinkBtn: "Information / Registration",
      expandCardBtn: "Full View",
      shareBtn: "Copy Link",
      copiedNotice: "Event link copied",
      tableColPage: "Page",
      tableColName: "Conference / Exhibition Name",
      tableColLocation: "Country & City",
      tableColDate: "Date",
      tableColStatus: "Status",
      tableColLinks: "Official Link",
      emptyTitle: "No Matching Conferences Found",
      emptyDesc: "Try adjusting your search or resetting the filters.",
      footerDesc: "Complete supervision of international conference registration, official invitation letter retrieval, and visa dossier preparation.",
      footerRights: "All Rights Reserved © FORESIGHT 2026–2027"
    }
  };

  // --- HELPERS ---
  function getEventStatus(event) {
    const now = new Date();
    const end = new Date((event.endDate || event.startDate) + 'T23:59:59');
    return { isExpired: end < now };
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
      "کانوونی دووەم (١)", "شوبات (٢)", "ئازار (٣)", "نیسان (٤)",
      "ئایار (٥)", "حوزەیران (٦)", "تەممووز (٧)", "ئاب (٨)",
      "ئەیلوول (٩)", "تشرینی یەکەم (١٠)", "تشرینی دووەم (١١)", "کانوونی یەکەم (١٢)"
    ];
    return lang === 'ku' ? `${monthNamesKu[mNum - 1]} ${year}` : `${monthNamesEn[mNum - 1]} ${year}`;
  }

  const elements = {
    themeBtn: document.getElementById('themeToggleBtn'),
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

  function init() {
    setTheme(currentTheme);
    setLanguage(currentLang, false);
    populateFilterDropdowns();
    renderStatistics();
    bindEvents();
    applyFiltersAndRender();
    checkUrlHash();
  }

  function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('foresight_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  function setLanguage(lang, rerender = true) {
    currentLang = lang;
    localStorage.setItem('foresight_lang', lang);
    document.documentElement.lang = lang;
    document.body.dir = lang === 'ku' ? 'rtl' : 'ltr';

    if (elements.langText) {
      elements.langText.textContent = lang === 'ku' ? 'EN' : 'کوردی';
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

    if (activeTab === 'medical') {
      list = list.filter(e => e.category === 'medical');
    } else if (activeTab === 'non-medical') {
      list = list.filter(e => e.category === 'non-medical');
    } else if (activeTab === 'upcoming') {
      list = list.filter(e => !getEventStatus(e).isExpired);
    } else if (activeTab === 'expired') {
      list = list.filter(e => getEventStatus(e).isExpired);
    }

    if (selectedCountry !== 'all') {
      list = list.filter(e => e.country_en === selectedCountry);
    }

    if (selectedMonthYear !== 'all') {
      list = list.filter(e => getMonthYearKey(e.startDate) === selectedMonthYear);
    }

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

    if (sortBy === 'pdf-order') {
      list.sort((a, b) => (a.pdfPage || 999) - (b.pdfPage || 999));
    } else if (sortBy === 'date-asc') {
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

  function buildCardInnerHtml(e, isModal = false) {
    const t = i18n[currentLang];
    const { isExpired } = getEventStatus(e);

    const country = currentLang === 'ku' ? e.country_ku : e.country_en;
    const city = currentLang === 'ku' ? e.city_ku : e.city_en;
    const title = currentLang === 'ku' ? e.title_ku : e.title_en;
    const headline = currentLang === 'ku' ? e.headline_ku : e.headline_en;
    const overview = currentLang === 'ku' ? e.overview_ku : e.overview_en;
    const audience = currentLang === 'ku' ? e.audience_ku : e.audience_en;
    const foresightTitle = currentLang === 'ku' ? e.foresight_title_ku : e.foresight_title_en;
    const foresightText = currentLang === 'ku' ? e.foresight_ku : e.foresight_en;

    const statusBadgeHtml = isExpired
      ? `<span class="status-pill expired">${t.statusExpired}</span>`
      : `<span class="status-pill active">${t.statusUpcoming}</span>`;

    const categoryBadgeHtml = e.category === 'medical'
      ? `<span class="cat-pill medical">${t.badgeMedical}</span>`
      : `<span class="cat-pill non-medical">${t.badgeTech}</span>`;

    const audienceBulletsHtml = (audience || []).map(item => `<li><span>${item}</span></li>`).join('');

    return `
      <div class="pdf-card-topbar">
        <div class="country-flag-pill">
          <img src="${e.flagImg}" alt="${country}" class="country-flag-img" loading="lazy" />
          <span class="country-city-name">${country} — ${city}</span>
        </div>
        <div class="top-badges-wrap">
          ${categoryBadgeHtml}
          ${statusBadgeHtml}
          <span class="date-pill-badge">${e.dateText_en}</span>
        </div>
      </div>

      <div class="pdf-card-content">
        <div>
          <div class="pdf-small-title">${title}</div>
          <h3 class="pdf-big-headline">${headline}</h3>
        </div>

        <p class="pdf-overview-text">${overview}</p>

        <div class="pdf-photo-banner">
          <img src="${e.image}" alt="${title}" loading="lazy" />
        </div>

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

        <div class="pdf-audience-box">
          <div class="pdf-box-heading">
            <span class="teal-dot"></span>
            <span>${t.audienceHeading}</span>
          </div>
          <ul class="pdf-audience-list">
            ${audienceBulletsHtml}
          </ul>
        </div>

        <div class="pdf-foresight-box">
          <div class="pdf-foresight-title">${foresightTitle}</div>
          <div class="pdf-foresight-text">${foresightText}</div>
        </div>

        <div class="pdf-card-actions">
          <a href="${e.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn-official-primary">
            <span>${t.officialSiteBtn}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>

          ${e.ticketUrl && e.ticketUrl !== e.officialUrl ? `
            <a href="${e.ticketUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary-link">
              <span>${t.ticketLinkBtn}</span>
            </a>
          ` : ''}

          ${!isModal ? `
            <button class="btn-modal-expand" data-id="${e.id}">
              <span>${t.expandCardBtn}</span>
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

  function renderIndexTable(events) {
    const t = i18n[currentLang];
    const rowsHtml = events.map(e => {
      const { isExpired } = getEventStatus(e);
      const title = currentLang === 'ku' ? e.title_ku : e.title_en;
      const country = currentLang === 'ku' ? e.country_ku : e.country_en;
      const city = currentLang === 'ku' ? e.city_ku : e.city_en;
      const statusHtml = isExpired
        ? `<span class="status-pill expired">${t.statusExpired}</span>`
        : `<span class="status-pill active">${t.statusUpcoming}</span>`;

      return `
        <tr>
          <td><strong>${e.pdfPage || '-'}</strong></td>
          <td>
            <div style="font-weight: 700; color: var(--text-primary); cursor: pointer;" class="table-row-trigger" data-id="${e.id}">${title}</div>
          </td>
          <td>
            <div class="table-flag-cell">
              <img src="${e.flagImg}" alt="${country}" class="country-flag-img" style="width:24px;height:16px;" />
              <span>${country} — ${city}</span>
            </div>
          </td>
          <td dir="ltr" style="font-weight: 600;">${e.dateText_en}</td>
          <td>${statusHtml}</td>
          <td>
            <div style="display:flex; gap:0.4rem;">
              <a href="${e.officialUrl}" target="_blank" rel="noopener noreferrer" class="table-link-btn">
                ${t.officialSiteBtn}
              </a>
              <button class="btn-modal-expand" style="padding:0.32rem 0.6rem; font-size:0.78rem;" data-id="${e.id}">
                ${t.expandCardBtn}
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

  function openModal(id) {
    const events = getEvents();
    const event = events.find(e => e.id === id);
    if (!event) return;

    activeModalEventId = id;
    window.location.hash = `event=${id}`;
    const t = i18n[currentLang];

    elements.modalContent.innerHTML = `
      <div class="modal-header">
        <div style="font-weight:700; color:var(--accent); font-size:0.9rem;">
          FORESIGHT — ${currentLang === 'ku' ? 'لاپەڕە' : 'Page'} ${event.pdfPage}
        </div>
        <button class="modal-close-btn" id="modalCloseBtnInner" aria-label="Close">✕</button>
      </div>
      <div class="modal-body">
        ${buildCardInnerHtml(event, true)}
      </div>
      <div class="modal-footer">
        <button class="btn-modal-expand" id="shareEventBtn">${t.shareBtn}</button>
        <button class="btn-modal-expand" id="modalCloseFooterBtn">✕</button>
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
    setTimeout(() => elements.toast.classList.remove('show'), 2500);
  }

  function checkUrlHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#event=')) {
      const id = hash.replace('#event=', '');
      setTimeout(() => openModal(id), 250);
    }
  }

  function bindEvents() {
    if (elements.themeBtn) {
      elements.themeBtn.addEventListener('click', () => {
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
      });
    }

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
        sortBy = 'pdf-order';
        searchQuery = '';
        if (elements.searchInput) elements.searchInput.value = '';
        if (elements.countrySelect) elements.countrySelect.value = 'all';
        if (elements.monthYearSelect) elements.monthYearSelect.value = 'all';
        if (elements.sortSelect) elements.sortSelect.value = 'pdf-order';
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
