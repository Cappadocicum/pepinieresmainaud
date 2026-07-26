// Illustrations des 12 thèmes — style album jeunesse (4-10 ans) : scènes
// vectorielles plates, colorées et rondes, dessinées pour l'appli.
// Chaque dessin est un SVG autonome (240×240, recadrage "slice") affiché en
// médaillon (frise, en-têtes) ou en fond de carte. Pour passer un jour à des
// visuels générés par IA, il suffit de remplacer une entrée par une balise
// <img> pointant vers assets/<slug>.png.
(function () {
  const S = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">';

  // Dessins vectoriels pleine largeur : utilisés en fond de carte (et en
  // secours si un visuel IA manquait).
  window.ART_SVG = {

    // ——— Le commencement : Big Bang, planète, volcan et premier dino ———
    commencement: S +
      '<defs><linearGradient id="g-cm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e1b4b"/><stop offset="1" stop-color="#6d28d9"/></linearGradient></defs>' +
      '<rect width="240" height="240" fill="url(#g-cm)"/>' +
      '<circle cx="34" cy="36" r="2.5" fill="#fff"/><circle cx="74" cy="20" r="2" fill="#fff" opacity=".8"/><circle cx="210" cy="120" r="2.5" fill="#fff"/><circle cx="26" cy="96" r="2" fill="#fff" opacity=".7"/><circle cx="150" cy="18" r="2" fill="#fff" opacity=".8"/><circle cx="196" cy="150" r="2" fill="#fff" opacity=".6"/>' +
      '<g stroke="#fde047" stroke-width="5" stroke-linecap="round"><line x1="182" y1="12" x2="182" y2="22"/><line x1="182" y1="82" x2="182" y2="92"/><line x1="142" y1="52" x2="152" y2="52"/><line x1="212" y1="52" x2="222" y2="52"/><line x1="154" y1="24" x2="161" y2="31"/><line x1="203" y1="73" x2="210" y2="80"/><line x1="210" y1="24" x2="203" y2="31"/><line x1="161" y1="73" x2="154" y2="80"/></g>' +
      '<circle cx="182" cy="52" r="24" fill="#fde047"/><circle cx="182" cy="52" r="14" fill="#fef9c3"/>' +
      '<circle cx="52" cy="70" r="13" fill="#38bdf8"/><ellipse cx="52" cy="70" rx="22" ry="6" fill="none" stroke="#bae6fd" stroke-width="3.5" transform="rotate(-16 52 70)"/>' +
      '<path d="M0 196 Q60 178 130 192 T240 190 L240 240 L0 240 Z" fill="#312e81"/>' +
      '<path d="M78 198 L118 112 L158 198 Z" fill="#7f1d1d"/>' +
      '<ellipse cx="118" cy="114" rx="13" ry="5" fill="#f97316"/>' +
      '<path d="M118 114 q-6 16 0 30 q5 12 -2 26" stroke="#fb923c" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<circle cx="130" cy="94" r="9" fill="#ddd6fe" opacity=".85"/><circle cx="142" cy="84" r="6" fill="#ddd6fe" opacity=".6"/>' +
      '<path d="M176 198 q0 -14 10 -18 q2 -20 12 -20 q8 0 7 9 l-3 9 q12 5 11 20 Z" fill="#4ade80"/>' +
      '<circle cx="197" cy="165" r="1.8" fill="#14532d"/>' +
      "</svg>",

    // ——— La Préhistoire : grotte, mammouth, feu et mains peintes ———
    prehistoire: S +
      '<defs><linearGradient id="g-ph" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d97706"/><stop offset="1" stop-color="#92400e"/></linearGradient></defs>' +
      '<rect width="240" height="240" fill="url(#g-ph)"/>' +
      '<path d="M0 240 L0 132 Q40 62 120 54 Q200 62 240 132 L240 240 Z" fill="#7c2d12"/>' +
      '<g fill="#fef3c7" opacity=".9"><circle cx="60" cy="92" r="8"/><circle cx="53" cy="82" r="3"/><circle cx="59" cy="79" r="3"/><circle cx="65" cy="80" r="3"/><circle cx="70" cy="85" r="3"/><circle cx="50" cy="89" r="3"/></g>' +
      '<g stroke="#fde68a" stroke-width="3.5" fill="none" stroke-linecap="round"><path d="M158 88 q6 -14 22 -12 q16 2 18 14 q2 10 -8 12 l-24 0 q-10 -2 -8 -14"/><path d="M166 102 l0 10 M190 102 l0 10"/><path d="M176 76 l-3 -8 M182 76 l3 -8"/></g>' +
      '<path d="M0 240 L0 198 Q120 184 240 198 L240 240 Z" fill="#451a03"/>' +
      '<g stroke="#78350f" stroke-width="8" stroke-linecap="round"><line x1="104" y1="208" x2="140" y2="198"/><line x1="104" y1="198" x2="140" y2="208"/></g>' +
      '<path d="M122 198 q-12 -8 -8 -22 q3 -10 12 -16 q-3 10 4 14 q8 -6 6 -14 q10 10 8 22 q-2 12 -12 16 Z" fill="#f97316"/>' +
      '<path d="M122 196 q-6 -6 -4 -14 q2 -7 8 -10 q-1 7 4 10 q3 -4 2 -9 q6 7 4 14 q-2 8 -8 9 Z" fill="#fde047"/>' +
      '<ellipse cx="58" cy="166" rx="34" ry="24" fill="#78350f"/>' +
      '<circle cx="90" cy="152" r="14" fill="#78350f"/>' +
      '<path d="M100 148 q10 6 8 18 q-1 8 -8 10" stroke="#78350f" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M96 162 q10 2 14 -6" stroke="#fef9c3" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<g fill="#78350f"><rect x="34" y="182" width="10" height="18" rx="4"/><rect x="52" y="184" width="10" height="18" rx="4"/><rect x="70" y="184" width="10" height="16" rx="4"/></g>' +
      '<circle cx="92" cy="149" r="1.8" fill="#fde68a"/>' +
      "</svg>",

    // ——— L'Égypte : pyramides, soleil, Nil, palmier et chameau ———
    egypte: S +
      '<defs><linearGradient id="g-eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fde68a"/><stop offset="1" stop-color="#fbbf24"/></linearGradient></defs>' +
      '<rect width="240" height="240" fill="url(#g-eg)"/>' +
      '<circle cx="56" cy="52" r="20" fill="#fff7ed" stroke="#fde047" stroke-width="6"/>' +
      '<path d="M10 172 L62 96 L114 172 Z" fill="#b45309"/><path d="M62 96 L114 172 L62 172 Z" fill="#d97706"/>' +
      '<path d="M58 172 L130 62 L202 172 Z" fill="#d97706"/><path d="M130 62 L202 172 L130 172 Z" fill="#f59e0b"/>' +
      '<rect y="168" width="240" height="72" fill="#fbbf24"/>' +
      '<path d="M0 186 Q80 172 240 190 L240 240 L0 240 Z" fill="#f59e0b"/>' +
      '<path d="M0 216 Q120 202 240 222 L240 240 L0 240 Z" fill="#38bdf8"/>' +
      '<path d="M198 214 q4 -22 -2 -32" stroke="#92400e" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<g stroke="#16a34a" stroke-width="4" fill="none" stroke-linecap="round"><path d="M196 182 q-14 -6 -20 2"/><path d="M196 182 q2 -14 12 -16"/><path d="M196 182 q14 -4 18 6"/><path d="M196 182 q-6 -12 -16 -12"/></g>' +
      '<g fill="#92400e"><path d="M28 208 q4 -10 12 -10 q3 -8 10 -8 q7 0 9 8 q8 1 10 10 Z"/><path d="M59 192 q6 -6 10 -2 l-2 6 Z"/><g stroke="#92400e" stroke-width="4" stroke-linecap="round"><line x1="34" y1="208" x2="34" y2="218"/><line x1="44" y1="208" x2="44" y2="219"/><line x1="56" y1="208" x2="56" y2="219"/><line x1="64" y1="208" x2="64" y2="218"/></g></g>' +
      "</svg>",

    // ——— La Grèce : temple blanc sur la colline, mer et olivier ———
    grece: S +
      '<defs><linearGradient id="g-gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bae6fd"/><stop offset="1" stop-color="#38bdf8"/></linearGradient></defs>' +
      '<rect width="240" height="240" fill="url(#g-gr)"/>' +
      '<circle cx="200" cy="40" r="16" fill="#fef9c3" stroke="#fde047" stroke-width="5"/>' +
      '<rect x="0" y="190" width="240" height="50" fill="#0369a1"/>' +
      '<path d="M0 190 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 L240 240 L0 240 Z" fill="#0284c7"/>' +
      '<ellipse cx="120" cy="200" rx="140" ry="52" fill="#86efac"/>' +
      '<path d="M58 92 L120 56 L182 92 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>' +
      '<circle cx="120" cy="78" r="6" fill="#38bdf8"/>' +
      '<rect x="62" y="92" width="116" height="9" rx="3" fill="#f8fafc"/>' +
      '<g fill="#e2e8f0"><rect x="67" y="101" width="18" height="6" rx="2"/><rect x="95" y="101" width="18" height="6" rx="2"/><rect x="123" y="101" width="18" height="6" rx="2"/><rect x="151" y="101" width="18" height="6" rx="2"/></g>' +
      '<g fill="#f8fafc"><rect x="70" y="107" width="12" height="44" rx="3"/><rect x="98" y="107" width="12" height="44" rx="3"/><rect x="126" y="107" width="12" height="44" rx="3"/><rect x="154" y="107" width="12" height="44" rx="3"/></g>' +
      '<rect x="64" y="150" width="112" height="8" rx="3" fill="#f8fafc"/>' +
      '<rect x="56" y="158" width="128" height="10" rx="3" fill="#e2e8f0"/>' +
      '<path d="M18 226 q24 -18 46 -12" stroke="#16a34a" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<g fill="#4ade80"><ellipse cx="30" cy="217" rx="7" ry="3.5" transform="rotate(-28 30 217)"/><ellipse cx="44" cy="212" rx="7" ry="3.5" transform="rotate(-18 44 212)"/><ellipse cx="58" cy="211" rx="7" ry="3.5" transform="rotate(-8 58 211)"/></g>' +
      "</svg>",

    // ——— Rome : Colisée au couchant et bannière SPQR ———
    rome: S +
      '<defs><linearGradient id="g-ro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fed7aa"/><stop offset="1" stop-color="#fb923c"/></linearGradient></defs>' +
      '<rect width="240" height="240" fill="url(#g-ro)"/>' +
      '<circle cx="204" cy="52" r="20" fill="#fff7ed" opacity=".95"/>' +
      '<path d="M0 200 Q120 186 240 200 L240 240 L0 240 Z" fill="#65a30d"/>' +
      '<rect x="30" y="96" width="180" height="100" rx="18" fill="#fef3c7" stroke="#f59e0b" stroke-width="4"/>' +
      '<line x1="32" y1="130" x2="208" y2="130" stroke="#f59e0b" stroke-width="3"/>' +
      '<line x1="32" y1="162" x2="208" y2="162" stroke="#f59e0b" stroke-width="3"/>' +
      '<g fill="#b45309"><path d="M46 126 v-8 a8 8 0 0 1 16 0 v8 Z"/><path d="M78 126 v-8 a8 8 0 0 1 16 0 v8 Z"/><path d="M110 126 v-8 a8 8 0 0 1 16 0 v8 Z"/><path d="M142 126 v-8 a8 8 0 0 1 16 0 v8 Z"/><path d="M174 126 v-8 a8 8 0 0 1 16 0 v8 Z"/></g>' +
      '<g fill="#b45309"><path d="M46 158 v-8 a8 8 0 0 1 16 0 v8 Z"/><path d="M78 158 v-8 a8 8 0 0 1 16 0 v8 Z"/><path d="M110 158 v-8 a8 8 0 0 1 16 0 v8 Z"/><path d="M142 158 v-8 a8 8 0 0 1 16 0 v8 Z"/><path d="M174 158 v-8 a8 8 0 0 1 16 0 v8 Z"/></g>' +
      '<g fill="#78350f"><path d="M56 194 v-12 a9 9 0 0 1 18 0 v12 Z"/><path d="M96 194 v-12 a9 9 0 0 1 18 0 v12 Z"/><path d="M136 194 v-12 a9 9 0 0 1 18 0 v12 Z"/><path d="M176 194 v-12 a9 9 0 0 1 18 0 v12 Z"/></g>' +
      '<g><line x1="16" y1="40" x2="16" y2="96" stroke="#78350f" stroke-width="4"/><rect x="18" y="42" width="36" height="25" rx="3" fill="#dc2626"/><text x="36" y="59" font-family="sans-serif" font-size="11" font-weight="bold" fill="#fde68a" text-anchor="middle">SPQR</text></g>' +
      "</svg>",

    // ——— Les Gaulois : hutte, menhir et sanglier ———
    gaulois: S +
      '<defs><linearGradient id="g-ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ecfccb"/><stop offset="1" stop-color="#bef264"/></linearGradient></defs>' +
      '<rect width="240" height="240" fill="url(#g-ga)"/>' +
      '<circle cx="204" cy="40" r="16" fill="#fde047"/>' +
      '<ellipse cx="60" cy="190" rx="150" ry="70" fill="#a3e635"/>' +
      '<ellipse cx="200" cy="234" rx="180" ry="72" fill="#65a30d"/>' +
      '<rect x="52" y="130" width="64" height="46" rx="8" fill="#d4a373"/>' +
      '<g stroke="#a16207" stroke-width="2.5"><line x1="52" y1="146" x2="116" y2="146"/><line x1="52" y1="160" x2="116" y2="160"/></g>' +
      '<path d="M40 134 L84 74 L128 134 Z" fill="#a16207"/>' +
      '<g stroke="#854d0e" stroke-width="3" stroke-linecap="round"><line x1="58" y1="118" x2="90" y2="82"/><line x1="76" y1="128" x2="108" y2="92"/></g>' +
      '<rect x="74" y="146" width="20" height="30" rx="9" fill="#78350f"/>' +
      '<path d="M168 178 q-6 -52 14 -58 q18 6 12 58 Z" fill="#94a3b8" stroke="#64748b" stroke-width="3"/>' +
      '<path d="M116 194 l6 -9 M128 190 l4 -10 M140 189 l2 -10 M152 190 l-2 -10" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse cx="140" cy="206" rx="30" ry="18" fill="#78350f"/>' +
      '<path d="M164 190 l-4 -9 9 3 Z" fill="#78350f"/>' +
      '<circle cx="168" cy="204" r="13" fill="#78350f"/>' +
      '<ellipse cx="179" cy="208" rx="6" ry="5" fill="#f9a8d4"/>' +
      '<path d="M174 213 q5 4 9 1" stroke="#fef9c3" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<circle cx="168" cy="200" r="1.8" fill="#fde68a"/>' +
      '<g stroke="#78350f" stroke-width="7" stroke-linecap="round"><line x1="126" y1="218" x2="126" y2="228"/><line x1="150" y1="220" x2="150" y2="228"/></g>' +
      "</svg>",

    // ——— Les Vikings : drakkar à voile rayée sur la mer du Nord ———
    vikings: S +
      '<defs><linearGradient id="g-vi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cffafe"/><stop offset="1" stop-color="#67e8f9"/></linearGradient>' +
      '<clipPath id="g-vi-voile"><path d="M84 76 h72 v56 q-36 12 -72 0 Z"/></clipPath></defs>' +
      '<rect width="240" height="240" fill="url(#g-vi)"/>' +
      '<path d="M0 150 L52 84 L104 150 Z" fill="#94a3b8"/>' +
      '<path d="M38 102 L52 84 L66 102 Q59 108 52 104 Q45 108 38 102 Z" fill="#fff"/>' +
      '<path d="M148 150 L192 96 L236 150 Z" fill="#64748b"/>' +
      '<path d="M178 113 L192 96 L206 113 Q199 118 192 115 Q185 118 178 113 Z" fill="#fff"/>' +
      '<path d="M28 60 q6 -6 12 0 q6 -6 12 0" stroke="#475569" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M186 48 q5 -5 10 0 q5 -5 10 0" stroke="#475569" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<rect y="146" width="240" height="94" fill="#0e7490"/>' +
      '<path d="M0 156 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#22d3ee" stroke-width="4" fill="none"/>' +
      '<path d="M0 196 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#155e75" stroke-width="4" fill="none" opacity=".7"/>' +
      '<line x1="120" y1="170" x2="120" y2="70" stroke="#78350f" stroke-width="6"/>' +
      '<g clip-path="url(#g-vi-voile)"><rect x="84" y="70" width="72" height="72" fill="#fff"/><rect x="96" y="70" width="12" height="72" fill="#ef4444"/><rect x="120" y="70" width="12" height="72" fill="#ef4444"/><rect x="144" y="70" width="12" height="72" fill="#ef4444"/></g>' +
      '<path d="M84 76 h72 v56 q-36 12 -72 0 Z" fill="none" stroke="#b45309" stroke-width="3"/>' +
      '<line x1="78" y1="76" x2="162" y2="76" stroke="#78350f" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M48 190 Q120 214 192 190 L178 166 L62 166 Z" fill="#92400e"/>' +
      '<path d="M58 176 Q120 196 182 176" stroke="#78350f" stroke-width="3" fill="none"/>' +
      '<path d="M62 166 Q44 158 46 136 q10 4 10 15 q0 8 8 15 Z" fill="#92400e"/>' +
      '<circle cx="51" cy="141" r="2" fill="#fde68a"/>' +
      '<path d="M178 166 q16 -6 14 -24" stroke="#92400e" stroke-width="8" fill="none" stroke-linecap="round"/>' +
      '<g><circle cx="86" cy="176" r="8" fill="#ef4444" stroke="#fde68a" stroke-width="2.5"/><circle cx="110" cy="181" r="8" fill="#fde047" stroke="#b45309" stroke-width="2.5"/><circle cx="134" cy="181" r="8" fill="#ef4444" stroke="#fde68a" stroke-width="2.5"/><circle cx="158" cy="176" r="8" fill="#fde047" stroke="#b45309" stroke-width="2.5"/></g>' +
      "</svg>",

    // ——— Le Moyen Âge : château fort au clair de lune ———
    "moyen-age": S +
      '<defs><linearGradient id="g-ma" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c7d2fe"/><stop offset="1" stop-color="#818cf8"/></linearGradient></defs>' +
      '<rect width="240" height="240" fill="url(#g-ma)"/>' +
      '<circle cx="200" cy="44" r="18" fill="#fef9c3"/><circle cx="193" cy="40" r="5" fill="#fde68a" opacity=".7"/><circle cx="206" cy="52" r="3.5" fill="#fde68a" opacity=".7"/>' +
      '<circle cx="36" cy="36" r="2" fill="#fff"/><circle cx="66" cy="20" r="2" fill="#fff" opacity=".8"/><circle cx="24" cy="76" r="2" fill="#fff" opacity=".7"/><circle cx="146" cy="26" r="2" fill="#fff" opacity=".8"/>' +
      '<ellipse cx="120" cy="238" rx="164" ry="62" fill="#3f6212"/>' +
      '<line x1="69" y1="66" x2="69" y2="46" stroke="#78350f" stroke-width="3"/><path d="M69 46 l18 6 -18 6 Z" fill="#fde047"/>' +
      '<line x1="171" y1="66" x2="171" y2="46" stroke="#78350f" stroke-width="3"/><path d="M171 46 l18 6 -18 6 Z" fill="#ef4444"/>' +
      '<path d="M46 104 L69 66 L92 104 Z" fill="#dc2626"/><path d="M148 104 L171 66 L194 104 Z" fill="#dc2626"/>' +
      '<rect x="52" y="104" width="34" height="98" fill="#cbd5e1"/><rect x="154" y="104" width="34" height="98" fill="#cbd5e1"/>' +
      '<rect x="63" y="130" width="12" height="18" rx="6" fill="#312e81"/><rect x="165" y="130" width="12" height="18" rx="6" fill="#312e81"/>' +
      '<g fill="#e2e8f0"><rect x="88" y="122" width="10" height="12" rx="2"/><rect x="106" y="122" width="10" height="12" rx="2"/><rect x="124" y="122" width="10" height="12" rx="2"/><rect x="142" y="122" width="10" height="12" rx="2"/></g>' +
      '<rect x="86" y="132" width="68" height="70" fill="#e2e8f0"/>' +
      '<rect x="112" y="142" width="16" height="12" rx="6" fill="#312e81"/>' +
      '<path d="M104 202 v-24 a16 16 0 0 1 32 0 v24 Z" fill="#78350f"/>' +
      '<g stroke="#451a03" stroke-width="2.5"><line x1="112" y1="202" x2="112" y2="164"/><line x1="120" y1="202" x2="120" y2="162"/><line x1="128" y1="202" x2="128" y2="164"/><line x1="104" y1="182" x2="136" y2="182"/><line x1="104" y1="192" x2="136" y2="192"/></g>' +
      "</svg>",

    // ——— La Renaissance : château de la Loire, chevalet et machine volante ———
    renaissance: S +
      '<defs><linearGradient id="g-re" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fce7f3"/><stop offset="1" stop-color="#f0abfc"/></linearGradient></defs>' +
      '<rect width="240" height="240" fill="url(#g-re)"/>' +
      '<circle cx="40" cy="44" r="16" fill="#fef9c3"/>' +
      '<g transform="translate(184 46) rotate(-8)"><path d="M-34 0 Q0 -22 34 0 Q16 -8 0 0 Q-16 -8 -34 0 Z" fill="#d4a373" stroke="#92400e" stroke-width="2"/><ellipse cx="0" cy="3" rx="6" ry="3" fill="#92400e"/></g>' +
      '<rect y="196" width="240" height="44" fill="#4ade80"/>' +
      '<path d="M68 120 L120 92 L172 120 Z" fill="#475569"/>' +
      '<rect x="72" y="120" width="96" height="80" fill="#fff7ed"/>' +
      '<path d="M48 132 L64 100 L80 132 Z" fill="#475569"/><path d="M160 132 L176 100 L192 132 Z" fill="#475569"/>' +
      '<line x1="64" y1="100" x2="64" y2="90" stroke="#eab308" stroke-width="3"/><circle cx="64" cy="88" r="3.5" fill="#fde047"/>' +
      '<line x1="176" y1="100" x2="176" y2="90" stroke="#eab308" stroke-width="3"/><circle cx="176" cy="88" r="3.5" fill="#fde047"/>' +
      '<line x1="120" y1="92" x2="120" y2="80" stroke="#eab308" stroke-width="3"/><circle cx="120" cy="78" r="3.5" fill="#fde047"/>' +
      '<rect x="52" y="132" width="24" height="68" fill="#fff7ed"/><rect x="164" y="132" width="24" height="68" fill="#fff7ed"/>' +
      '<g fill="#93c5fd"><rect x="84" y="136" width="12" height="16" rx="2"/><rect x="114" y="136" width="12" height="16" rx="2"/><rect x="144" y="136" width="12" height="16" rx="2"/><rect x="84" y="164" width="12" height="16" rx="2"/><rect x="144" y="164" width="12" height="16" rx="2"/><rect x="59" y="146" width="10" height="14" rx="2"/><rect x="171" y="146" width="10" height="14" rx="2"/></g>' +
      '<path d="M112 200 v-16 a8 8 0 0 1 16 0 v16 Z" fill="#78350f"/>' +
      '<circle cx="214" cy="196" r="11" fill="#16a34a"/><rect x="211" y="202" width="6" height="12" fill="#78350f"/>' +
      '<g stroke="#92400e" stroke-width="4" stroke-linecap="round"><line x1="18" y1="232" x2="30" y2="186"/><line x1="46" y1="232" x2="34" y2="186"/><line x1="32" y1="228" x2="32" y2="198"/></g>' +
      '<rect x="14" y="160" width="38" height="30" rx="3" fill="#fff" stroke="#92400e" stroke-width="3"/>' +
      '<circle cx="33" cy="172" r="7" fill="#fbbf24"/><path d="M26 181 q7 5 14 0" stroke="#f59e0b" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      "</svg>",

    // ——— Les Temps Modernes : Roi Soleil, palais doré et fontaine ———
    "temps-modernes": S +
      '<defs><linearGradient id="g-tm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fef9c3"/><stop offset="1" stop-color="#fcd34d"/></linearGradient></defs>' +
      '<rect width="240" height="240" fill="url(#g-tm)"/>' +
      '<g fill="#fbbf24"><path transform="rotate(0 120 54)" d="M120 14 l7 16 h-14 Z"/><path transform="rotate(45 120 54)" d="M120 14 l7 16 h-14 Z"/><path transform="rotate(90 120 54)" d="M120 14 l7 16 h-14 Z"/><path transform="rotate(135 120 54)" d="M120 14 l7 16 h-14 Z"/><path transform="rotate(180 120 54)" d="M120 14 l7 16 h-14 Z"/><path transform="rotate(225 120 54)" d="M120 14 l7 16 h-14 Z"/><path transform="rotate(270 120 54)" d="M120 14 l7 16 h-14 Z"/><path transform="rotate(315 120 54)" d="M120 14 l7 16 h-14 Z"/></g>' +
      '<circle cx="120" cy="54" r="24" fill="#fde047" stroke="#f59e0b" stroke-width="3"/>' +
      '<circle cx="112" cy="50" r="2.5" fill="#92400e"/><circle cx="128" cy="50" r="2.5" fill="#92400e"/>' +
      '<path d="M110 60 q10 8 20 0" stroke="#92400e" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<rect x="24" y="122" width="192" height="7" fill="#eab308"/>' +
      '<rect x="24" y="129" width="192" height="52" fill="#fef3c7" stroke="#eab308" stroke-width="3"/>' +
      '<g fill="#a16207"><rect x="36" y="140" width="9" height="15" rx="2"/><rect x="54" y="140" width="9" height="15" rx="2"/><rect x="72" y="140" width="9" height="15" rx="2"/><rect x="36" y="162" width="9" height="14" rx="2"/><rect x="54" y="162" width="9" height="14" rx="2"/><rect x="72" y="162" width="9" height="14" rx="2"/><rect x="158" y="140" width="9" height="15" rx="2"/><rect x="176" y="140" width="9" height="15" rx="2"/><rect x="194" y="140" width="9" height="15" rx="2"/><rect x="158" y="162" width="9" height="14" rx="2"/><rect x="176" y="162" width="9" height="14" rx="2"/><rect x="194" y="162" width="9" height="14" rx="2"/></g>' +
      '<path d="M94 112 L120 96 L146 112 Z" fill="#fde68a" stroke="#eab308" stroke-width="3"/>' +
      '<rect x="98" y="112" width="44" height="69" fill="#fde68a" stroke="#eab308" stroke-width="3"/>' +
      '<path d="M112 181 v-14 a8 8 0 0 1 16 0 v14 Z" fill="#92400e"/>' +
      '<rect y="181" width="240" height="59" fill="#4ade80"/>' +
      '<path d="M28 212 q30 -16 60 0 q-30 14 -60 0 Z" fill="#16a34a" opacity=".85"/>' +
      '<path d="M152 212 q30 -16 60 0 q-30 14 -60 0 Z" fill="#16a34a" opacity=".85"/>' +
      '<ellipse cx="120" cy="218" rx="26" ry="9" fill="#38bdf8" stroke="#0284c7" stroke-width="3"/>' +
      '<path d="M120 214 q-2 -16 0 -20 M112 214 q-6 -10 -2 -16 M128 214 q6 -10 2 -16" stroke="#7dd3fc" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      "</svg>",

    // ——— La Révolution : drapeau tricolore, cocarde et feu d'artifice ———
    revolution: S +
      '<defs><linearGradient id="g-rv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dbeafe"/><stop offset="1" stop-color="#93c5fd"/></linearGradient></defs>' +
      '<rect width="240" height="240" fill="url(#g-rv)"/>' +
      '<g stroke="#f59e0b" stroke-width="3" stroke-linecap="round"><line x1="196" y1="30" x2="196" y2="42"/><line x1="182" y1="36" x2="190" y2="44"/><line x1="210" y1="36" x2="202" y2="44"/><line x1="178" y1="52" x2="188" y2="52"/><line x1="204" y1="52" x2="214" y2="52"/><line x1="182" y1="68" x2="190" y2="60"/><line x1="210" y1="68" x2="202" y2="60"/><line x1="196" y1="74" x2="196" y2="62"/></g>' +
      '<circle cx="196" cy="52" r="4" fill="#fbbf24"/>' +
      '<circle cx="98" cy="26" r="3" fill="#ef4444"/><circle cx="150" cy="40" r="3" fill="#1d4ed8"/><circle cx="176" cy="102" r="3" fill="#ef4444"/><circle cx="214" cy="122" r="3" fill="#1d4ed8"/><circle cx="120" cy="152" r="3" fill="#fbbf24"/><circle cx="70" cy="160" r="3" fill="#ef4444"/>' +
      '<line x1="46" y1="36" x2="46" y2="216" stroke="#78350f" stroke-width="7" stroke-linecap="round"/>' +
      '<circle cx="46" cy="30" r="6" fill="#fbbf24"/>' +
      '<path d="M50 48 Q75 38 100 44 L100 132 Q75 126 50 136 Z" fill="#1d4ed8"/>' +
      '<path d="M100 44 Q125 50 150 46 L150 134 Q125 138 100 132 Z" fill="#fff"/>' +
      '<path d="M150 46 Q175 42 200 50 L200 138 Q175 130 150 134 Z" fill="#dc2626"/>' +
      '<g transform="translate(152 194)"><path d="M-8 8 l-16 26 11 -4 4 11 13 -25 Z" fill="#1d4ed8"/><path d="M8 8 l16 26 -11 -4 -4 11 -13 -25 Z" fill="#dc2626"/><circle r="22" fill="#1d4ed8"/><circle r="15" fill="#fff"/><circle r="8" fill="#dc2626"/></g>' +
      "</svg>",

    // ——— Notre époque : fusée au-dessus de la ville et tour Eiffel ———
    "notre-epoque": S +
      '<defs><linearGradient id="g-ne" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs>' +
      '<rect width="240" height="240" fill="url(#g-ne)"/>' +
      '<circle cx="38" cy="40" r="13" fill="#fef9c3"/><circle cx="44" cy="36" r="11" fill="#6a68f0"/>' +
      '<circle cx="80" cy="24" r="2" fill="#fff"/><circle cx="130" cy="36" r="2" fill="#fff" opacity=".8"/><circle cx="28" cy="90" r="2" fill="#fff" opacity=".7"/><circle cx="222" cy="30" r="2" fill="#fff"/><circle cx="60" cy="120" r="2" fill="#fff" opacity=".6"/>' +
      '<g fill="#312e81"><rect x="0" y="180" width="26" height="60"/><rect x="26" y="164" width="22" height="76"/><rect x="48" y="188" width="20" height="52"/><rect x="150" y="176" width="24" height="64"/><rect x="174" y="160" width="20" height="80"/><rect x="194" y="184" width="26" height="56"/><rect x="220" y="170" width="20" height="70"/></g>' +
      '<g fill="#fde047"><rect x="6" y="188" width="5" height="7" rx="1"/><rect x="16" y="202" width="5" height="7" rx="1"/><rect x="32" y="172" width="5" height="7" rx="1"/><rect x="38" y="192" width="5" height="7" rx="1"/><rect x="54" y="196" width="5" height="7" rx="1"/><rect x="156" y="184" width="5" height="7" rx="1"/><rect x="164" y="204" width="5" height="7" rx="1"/><rect x="180" y="170" width="5" height="7" rx="1"/><rect x="186" y="192" width="5" height="7" rx="1"/><rect x="202" y="192" width="5" height="7" rx="1"/><rect x="226" y="180" width="5" height="7" rx="1"/></g>' +
      '<g fill="#1e1b4b"><path d="M96 240 Q108 190 112 152 L116 152 Q114 192 102 240 Z"/><path d="M142 240 Q130 190 126 152 L122 152 Q124 192 136 240 Z"/><rect x="115" y="130" width="8" height="24" rx="3"/><rect x="102" y="196" width="34" height="6" rx="3"/><rect x="108" y="170" width="22" height="5" rx="2.5"/></g>' +
      '<g transform="translate(182 96) rotate(8)">' +
      '<circle cx="-22" cy="52" r="7" fill="#fff" opacity=".65"/><circle cx="-12" cy="64" r="5" fill="#fff" opacity=".5"/>' +
      '<path d="M-8 30 q8 28 8 32 q0 -4 8 -32 q-8 7 -16 0 Z" fill="#f97316"/>' +
      '<path d="M-4 30 q4 14 4 18 q0 -4 4 -18 q-4 4 -8 0 Z" fill="#fde047"/>' +
      '<path d="M-14 10 q-10 6 -10 20 l10 -6 Z" fill="#ef4444"/><path d="M14 10 q10 6 10 20 l-10 -6 Z" fill="#ef4444"/>' +
      '<path d="M0 -34 q14 14 14 34 q0 12 -4 20 h-20 q-4 -8 -4 -20 q0 -20 14 -34 Z" fill="#f8fafc"/>' +
      '<path d="M0 -34 q10 10 12 20 h-24 q2 -10 12 -20 Z" fill="#ef4444"/>' +
      '<circle cy="0" r="7" fill="#38bdf8" stroke="#1d4ed8" stroke-width="3"/>' +
      "</g>" +
      "</svg>",
  };

  // Visuels générés par IA (Gemini) : vignettes rondes utilisées dans les
  // médaillons (frise, accueil, en-têtes). Mises en cache par le service
  // worker pour fonctionner hors-ligne.
  window.ART = {};
  [
    "commencement", "prehistoire", "egypte", "grece", "rome", "gaulois",
    "vikings", "moyen-age", "renaissance", "temps-modernes", "revolution",
    "notre-epoque",
  ].forEach(function (slug) {
    window.ART[slug] = '<img class="art-img" src="assets/art/' + slug +
      '.webp" alt="" decoding="async">';
  });

  // Fonds de carte à collectionner (portrait, générés par IA) : utilisés par
  // la carte du jour, la grande carte de l'album et les mini-cartes.
  window.CARD_ART = {};
  [
    "commencement", "prehistoire", "egypte", "grece", "rome", "gaulois",
    "vikings", "moyen-age", "renaissance", "temps-modernes", "revolution",
    "notre-epoque",
  ].forEach(function (slug) {
    window.CARD_ART[slug] = "assets/cards/" + slug + ".webp";
  });
})();
