const fs = require('fs');
if (!fs.existsSync('assets/flags')) fs.mkdirSync('assets/flags', { recursive: true });

const flags = {
  it: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="1" height="2" fill="#009246"/><rect width="1" height="2" x="1" fill="#fff"/><rect width="1" height="2" x="2" fill="#ce2b37"/></svg>`,
  nl: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6"><rect fill="#21468B" width="9" height="6"/><rect fill="#FFF" width="9" height="4"/><rect fill="#AE1C28" width="9" height="2"/></svg>`,
  fr: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#ED2939"/><rect width="2" height="2" fill="#fff"/><rect width="1" height="2" fill="#002395"/></svg>`,
  de: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3"><rect width="5" height="3" fill="#000"/><rect width="5" height="2" y="1" fill="#D00"/><rect width="5" height="1" y="2" fill="#FFCE00"/></svg>`,
  at: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#ed2939"/><rect width="3" height="0.666" y="0.666" fill="#fff"/></svg>`,
  pl: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 5"><rect width="8" height="5" fill="#dc143c"/><rect width="8" height="2.5" fill="#fff"/></svg>`,
  hu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 3"><rect fill="#477050" width="6" height="3"/><rect fill="#FFF" width="6" height="2"/><rect fill="#CE2939" width="6" height="1"/></svg>`,
  es: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500"><rect width="750" height="500" fill="#c60b1e"/><rect width="750" height="250" y="125" fill="#ffc400"/></svg>`,
  ch: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#da291c"/><rect width="20" height="6" x="6" y="13" fill="#fff"/><rect width="6" height="20" x="13" y="6" fill="#fff"/></svg>`,
  ca: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 48"><rect width="96" height="48" fill="#d80621"/><rect x="24" width="48" height="48" fill="#fff"/><path fill="#d80621" d="M48 8l-3.5 7-3.5-1.5 2 7.5-6-5-1.5 3-5.5-1 2.5 5.5-2.5 1.5 8 5.5-1 3.5h9.5v8h3v-8H59l-1-3.5 8-5.5-2.5-1.5 2.5-5.5-5.5 1-1.5-3-6 5 2-7.5-3.5 1.5z"/></svg>`,
  gb: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><g clip-path="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="3"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>`,
  us: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 741 390"><rect width="741" height="390" fill="#b22234"/><path d="M0,45H741M0,105H741M0,165H741M0,225H741M0,285H741M0,345H741" stroke="#fff" stroke-width="30"/><rect width="296.4" height="210" fill="#3c3b6e"/><g fill="#fff"><circle cx="40" cy="35" r="10"/><circle cx="100" cy="35" r="10"/><circle cx="160" cy="35" r="10"/><circle cx="220" cy="35" r="10"/><circle cx="265" cy="35" r="10"/><circle cx="70" cy="70" r="10"/><circle cx="130" cy="70" r="10"/><circle cx="190" cy="70" r="10"/><circle cx="245" cy="70" r="10"/><circle cx="40" cy="105" r="10"/><circle cx="100" cy="105" r="10"/><circle cx="160" cy="105" r="10"/><circle cx="220" cy="105" r="10"/><circle cx="265" cy="105" r="10"/><circle cx="70" cy="140" r="10"/><circle cx="130" cy="140" r="10"/><circle cx="190" cy="140" r="10"/><circle cx="245" cy="140" r="10"/><circle cx="40" cy="175" r="10"/><circle cx="100" cy="175" r="10"/><circle cx="160" cy="175" r="10"/><circle cx="220" cy="175" r="10"/><circle cx="265" cy="175" r="10"/></g></svg>`
};

for (const [code, svg] of Object.entries(flags)) {
  fs.writeFileSync(`assets/flags/${code}.svg`, svg, 'utf8');
}
console.log('Saved 12 SVG flags in assets/flags/');
