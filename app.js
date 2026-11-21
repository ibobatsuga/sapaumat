/**
 * Majelis Pro (SapaUmat) — Direktori & Jadwal Rumah Ibadah
 * Real-time Prayer Times, Smart TV Display Mode, Hijri Calendar,
 * Cash Transparency & Kajian Agenda Management.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'majelis_pro_sapaumat_v1';

  // --- CITY SCHEDULE CONFIG (WIB / WITA) ---
  const CITY_PRAYER_DATA = {
    jogja: {
      name: 'Kota Yogyakarta (WIB)',
      kiblat: 295,
      times: { subuh: '04:08', syuruq: '05:24', dzuhur: '11:39', ashar: '15:02', maghrib: '17:52', isya: '19:05' }
    },
    jakarta: {
      name: 'DKI Jakarta (WIB)',
      kiblat: 295,
      times: { subuh: '04:16', syuruq: '05:33', dzuhur: '11:47', ashar: '15:10', maghrib: '18:00', isya: '19:14' }
    },
    surabaya: {
      name: 'Surabaya / Jatim (WIB)',
      kiblat: 294,
      times: { subuh: '03:59', syuruq: '05:16', dzuhur: '11:30', ashar: '14:53', maghrib: '17:43', isya: '18:56' }
    },
    bandung: {
      name: 'Bandung / Jabar (WIB)',
      kiblat: 295,
      times: { subuh: '04:14', syuruq: '05:30', dzuhur: '11:44', ashar: '15:07', maghrib: '17:57', isya: '19:11' }
    },
    semarang: {
      name: 'Semarang / Jateng (WIB)',
      kiblat: 295,
      times: { subuh: '04:06', syuruq: '05:22', dzuhur: '11:37', ashar: '15:00', maghrib: '17:50', isya: '19:03' }
    },
    makassar: {
      name: 'Makassar (WITA)',
      kiblat: 292,
      times: { subuh: '04:32', syuruq: '05:49', dzuhur: '12:02', ashar: '15:26', maghrib: '18:15', isya: '19:28' }
    },
    medan: {
      name: 'Medan / Sumut (WIB)',
      kiblat: 293,
      times: { subuh: '04:56', syuruq: '06:14', dzuhur: '12:21', ashar: '15:44', maghrib: '18:20', isya: '19:32' }
    }
  };

  const PRAYER_NAMES = [
    { key: 'subuh', label: 'Subuh', arabic: 'الفجر', desc: 'Fajar Shodiq' },
    { key: 'syuruq', label: 'Syuruq', arabic: 'الشروق', desc: 'Matahari Terbit' },
    { key: 'dzuhur', label: 'Dzuhur', arabic: 'الظهر', desc: 'Tergelincir Matahari' },
    { key: 'ashar', label: 'Ashar', arabic: 'العصر', desc: 'Bayangan Lebih Panjang' },
    { key: 'maghrib', label: 'Maghrib', arabic: 'المغرب', desc: 'Terbenam Matahari' },
    { key: 'isya', label: 'Isya', arabic: 'العشاء', desc: 'Hilang Syafaq Merah' }
  ];

  // --- DEFAULT SEED DATA ---
  const DEFAULT_DATA = {
    selectedCity: 'jogja',
    audioEnabled: true,
    kajianList: [
      {
        id: 1,
        judul: 'Kajian Tafsir Al-Qur\'an: Menyelami Makna Surat Al-Kahfi',
        pemateri: 'Ustadz Dr. H. Fahmi Arifin, M.A.',
        kategori: 'Rutin',
        waktu: 'Setiap Ahad Subuh (05:30 - 06:45 WIB)',
        tempat: 'Ruang Utama Masjid Al-Ikhlas',
        catatan: 'Terbuka untuk umum (Ikhwan & Akhwat), sarapan bersama ba\'da kajian.'
      },
      {
        id: 2,
        judul: 'Tabligh Akbar: Menyiapkan Generasi Rabbani di Era AI & Digital',
        pemateri: 'Ustadz Ridwan Al-Hafidz',
        kategori: 'Tabligh',
        waktu: 'Sabtu Malam Ba\'da Isya (19:30 - 21:00 WIB)',
        tempat: 'Serambi & Ruang Utama Masjid Al-Ikhlas',
        catatan: 'Disediakan live streaming YouTube dan doorprize buku islami.'
      },
      {
        id: 3,
        judul: 'Pembinaan Tahsin & Hafalan Al-Qur\'an Santri TPA Al-Ikhlas',
        pemateri: 'Ustadzah Siti Fatimah & Tim Pengajar TPA',
        kategori: 'TPA',
        waktu: 'Senin s/d Kamis (16:00 - 17:15 WIB)',
        tempat: 'Gedung TPA Lantai 2',
        catatan: 'Gratis untuk seluruh putra-putri warga Mantrijeron & sekitarnya.'
      },
      {
        id: 4,
        judul: 'Penyaluran Sembako Berkah Jumat untuk Dhuafa & Lansia',
        pemateri: 'Tim Lazismu / DKM Al-Ikhlas',
        kategori: 'Sosial',
        waktu: 'Jumat Pagi (08:30 - 11:00 WIB)',
        tempat: 'Halaman Depan Masjid Al-Ikhlas',
        catatan: 'Distribusi 80 paket beras dan sembako kebutuhan pokok.'
      }
    ],
    mutasiList: [
      { id: 1, tanggal: '21 Nov 2026', tipe: 'IN', pos: 'Operasional', ket: 'Infaq Kotak Amal Sholat Subuh & Dhuhur', nominal: 1450000, saldo: 18450000 },
      { id: 2, tanggal: '20 Nov 2026', tipe: 'OUT', pos: 'Operasional', ket: 'Tagihan Listrik PLN & Air PDAM Masjid', nominal: 1850000, saldo: 17000000 },
      { id: 3, tanggal: '18 Nov 2026', tipe: 'IN', pos: 'Renovasi', ket: 'Wakaf Tunai Hamba Allah untuk Sound System', nominal: 5000000, saldo: 18850000 },
      { id: 4, tanggal: '17 Nov 2026', tipe: 'IN', pos: 'Sosial', ket: 'Sedekah Peduli Anak Yatim Piatu', nominal: 2200000, saldo: 13850000 },
      { id: 5, tanggal: '15 Nov 2026', tipe: 'OUT', pos: 'Operasional', ket: 'Honorarium Marbot & Kebersihan Pekanan', nominal: 1200000, saldo: 11650000 },
      { id: 6, tanggal: '14 Nov 2026', tipe: 'IN', pos: 'Operasional', ket: 'Infaq Jamaah Sholat Jumat Berkah', nominal: 7850000, saldo: 12850000 }
    ],
    masjidList: [
      {
        id: 1,
        nama: 'Masjid Al-Ikhlas Mantrijeron',
        jarak: '0 meter (Pusat)',
        alamat: 'Jl. Mayjend Sutoyo No. 42, Mantrijeron, Kota Yogyakarta',
        fasilitas: ['Ruang AC Dingin', 'Parkir Motor & Mobil Luas', 'Tempat Wudhu Bersih', 'Ramah Difabel', 'Wi-Fi Gratis', 'Kajian Rutin']
      },
      {
        id: 2,
        nama: 'Masjid Jogokariyan',
        jarak: '850 meter',
        alamat: 'Jl. Jogokaryan No. 36, Mantrijeron, Kota Yogyakarta',
        fasilitas: ['Buka 24 Jam', 'ATM Beras Dhuafa', 'Penginapan Jamaah', 'Kajian Harian', 'Food Court Halal']
      },
      {
        id: 3,
        nama: 'Masjid Baiturrahman Suryodiningratan',
        jarak: '600 meter',
        alamat: 'Jl. Suryodiningratan No. 18, Mantrijeron, Yogyakarta',
        fasilitas: ['Ruang Sholat Luas', 'TPA Ramah Anak', 'Perpustakaan Mini', 'CCTV 24 Jam']
      },
      {
        id: 4,
        nama: 'Musholla As-Salam Krapyak',
        jarak: '1.2 km',
        alamat: 'Jl. KH. Ali Maksum, Krapyak Kulon, Panggungharjo',
        fasilitas: ['Tempat Wudhu Luas', 'Mukena Bersih', 'Parkir Motor']
      }
    ]
  };

  // --- STATE CONTAINER ---
  let appState = loadState();
  let currentAudioCtx = null;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA));
      const parsed = JSON.parse(raw);
      return Object.assign({}, DEFAULT_DATA, parsed);
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  // --- WEB AUDIO API: ISLAMIC CHIME & ADHAN REMINDER ---
  function initAudio() {
    if (!currentAudioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        currentAudioCtx = new AudioCtx();
      }
    }
    if (currentAudioCtx && currentAudioCtx.state === 'suspended') {
      currentAudioCtx.resume();
    }
  }

  function playIslamicChime() {
    if (!appState.audioEnabled) return;
    try {
      initAudio();
      if (!currentAudioCtx) return;

      const now = currentAudioCtx.currentTime;
      // 3-chord harmonic oriental peaceful chime (A4 -> C#5 -> E5)
      const freqs = [440, 554.37, 659.25];

      freqs.forEach((freq, idx) => {
        const osc = currentAudioCtx.createOscillator();
        const gain = currentAudioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.25);

        gain.gain.setValueAtTime(0, now + idx * 0.25);
        gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.25 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.25 + 1.2);

        osc.connect(gain);
        gain.connect(currentAudioCtx.destination);

        osc.start(now + idx * 0.25);
        osc.stop(now + idx * 0.25 + 1.25);
      });
    } catch (err) {
      console.warn('Audio chime error:', err);
    }
  }

  // --- HIJRI CALENDAR HELPER ---
  function getHijriString() {
    // Standard accurate mapping for 2026
    const hijriMonths = [
      'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
      'Jumadil Awal', 'Jumadil Akhir', 'Rajab', 'Sya\'ban',
      'Ramadhan', 'Syawal', 'Dzulqa\'dah', 'Dzulhijjah'
    ];
    return '11 Jumadil Akhir 1448 H';
  }

  // --- PRAYER TIMES & COUNTDOWN ENGINE ---
  function getCurrentCityTimes() {
    const cityKey = appState.selectedCity || 'jogja';
    return CITY_PRAYER_DATA[cityKey]?.times || CITY_PRAYER_DATA.jogja.times;
  }

  function getNextPrayerInfo() {
    const times = getCurrentCityTimes();
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentSeconds = now.getSeconds();
    const totalCurrentSec = currentMinutes * 60 + currentSeconds;

    const list = [
      { key: 'subuh', label: 'Subuh', timeStr: times.subuh },
      { key: 'syuruq', label: 'Syuruq', timeStr: times.syuruq },
      { key: 'dzuhur', label: 'Dzuhur', timeStr: times.dzuhur },
      { key: 'ashar', label: 'Ashar', timeStr: times.ashar },
      { key: 'maghrib', label: 'Maghrib', timeStr: times.maghrib },
      { key: 'isya', label: 'Isya', timeStr: times.isya }
    ];

    let next = null;
    let prev = null;

    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      const [h, m] = p.timeStr.split(':').map(Number);
      const pSec = (h * 60 + m) * 60;

      if (pSec > totalCurrentSec) {
        next = { ...p, targetSec: pSec };
        prev = i > 0 ? { ...list[i - 1], sec: (Number(list[i - 1].timeStr.split(':')[0]) * 60 + Number(list[i - 1].timeStr.split(':')[1])) * 60 } : null;
        break;
      }
    }

    // If past Isya, next prayer is tomorrow's Subuh
    if (!next) {
      const [h, m] = times.subuh.split(':').map(Number);
      const tomorrowSubuhSec = (24 * 60 * 60) + (h * 60 + m) * 60;
      next = { ...list[0], targetSec: tomorrowSubuhSec, isTomorrow: true };
      prev = { ...list[list.length - 1], sec: (Number(list[list.length - 1].timeStr.split(':')[0]) * 60 + Number(list[list.length - 1].timeStr.split(':')[1])) * 60 };
    }

    const diffSec = next.targetSec - totalCurrentSec;
    const hours = Math.floor(diffSec / 3600);
    const mins = Math.floor((diffSec % 3600) / 60);
    const secs = diffSec % 60;

    const countdownStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Progress percentage
    let pct = 50;
    if (prev) {
      const totalSpan = next.targetSec - prev.sec;
      const elapsed = totalCurrentSec - prev.sec;
      if (totalSpan > 0) {
        pct = Math.min(100, Math.max(0, Math.round((elapsed / totalSpan) * 100)));
      }
    }

    return {
      next,
      diffSec,
      countdownStr,
      progressPct: pct
    };
  }

  // --- REAL-TIME TICKER ---
  function tickClock() {
    const now = new Date();
    const timeWithSec = now.toLocaleTimeString('id-ID', { hour12: false });
    const fullTimeStr = timeWithSec + ' WIB';
    const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const shortDate = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    // Top Header
    const headerClock = document.getElementById('headerClock');
    if (headerClock) headerClock.textContent = fullTimeStr;

    const dashMasehi = document.getElementById('dashMasehiDate');
    if (dashMasehi) dashMasehi.textContent = dateStr;

    const dashHijri = document.getElementById('dashHijriDate');
    if (dashHijri) dashHijri.textContent = getHijriString();

    // TV Display Clocks
    const tvClock = document.getElementById('tvClock');
    if (tvClock) tvClock.textContent = timeWithSec;

    const tvMasehi = document.getElementById('tvMasehiDate');
    if (tvMasehi) tvMasehi.textContent = shortDate;

    const tvHijri = document.getElementById('tvHijriDate');
    if (tvHijri) tvHijri.textContent = getHijriString();

    // Countdown calculation
    const prayerInfo = getNextPrayerInfo();
    const nextP = prayerInfo.next;

    const dashNextName = document.getElementById('nextPrayerName');
    const dashNextTarget = document.getElementById('nextPrayerTargetTime');
    const dashNextCountdown = document.getElementById('nextPrayerCountdown');
    const dashNextProgress = document.getElementById('nextPrayerProgress');

    if (dashNextName) dashNextName.textContent = nextP.label.toUpperCase();
    if (dashNextTarget) dashNextTarget.textContent = `Pukul ${nextP.timeStr} WIB`;
    if (dashNextCountdown) dashNextCountdown.textContent = prayerInfo.countdownStr;
    if (dashNextProgress) dashNextProgress.style.width = `${prayerInfo.progressPct}%`;

    // TV Countdown
    const tvNextName = document.getElementById('tvNextPrayerName');
    const tvCountdownNum = document.getElementById('tvCountdownNum');
    if (tvNextName) tvNextName.textContent = `${nextP.label.toUpperCase()} — ${nextP.timeStr} WIB`;
    if (tvCountdownNum) tvCountdownNum.textContent = prayerInfo.countdownStr;

    // Highlight active card in grid
    updatePrayerGridHighlights(nextP.key);
  }

  function updatePrayerGridHighlights(nextKey) {
    document.querySelectorAll('.prayer-time-card').forEach(card => {
      if (card.getAttribute('data-key') === nextKey) {
        card.classList.add('is-active-prayer');
      } else {
        card.classList.remove('is-active-prayer');
      }
    });

    document.querySelectorAll('.tv-p-card').forEach(card => {
      if (card.getAttribute('data-key') === nextKey) {
        card.classList.add('is-active');
      } else {
        card.classList.remove('is-active');
      }
    });
  }

  // --- RENDER PRAYER GRIDS ---
  function renderPrayerTimes() {
    const times = getCurrentCityTimes();
    const grid = document.getElementById('prayerTimesGrid');
    const tvGrid = document.getElementById('tvPrayersRow');

    let htmlPortal = '';
    let htmlTv = '';

    PRAYER_NAMES.forEach(p => {
      const tVal = times[p.key] || '00:00';

      htmlPortal += `
        <div class="prayer-time-card" data-key="${p.key}">
          <div class="pt-name">${p.label}</div>
          <div class="pt-arabic">${p.arabic}</div>
          <div class="pt-time">${tVal}</div>
          <div class="pt-sub">${p.desc}</div>
        </div>
      `;

      htmlTv += `
        <div class="tv-p-card" data-key="${p.key}">
          <div class="tv-p-name">${p.label}</div>
          <div class="tv-p-arabic">${p.arabic}</div>
          <div class="tv-p-time">${tVal}</div>
        </div>
      `;
    });

    if (grid) grid.innerHTML = htmlPortal;
    if (tvGrid) tvGrid.innerHTML = htmlTv;
  }

  // --- RENDER AGENDA KAJIAN ---
  let currentKajianFilter = 'ALL';

  function renderKajian() {
    const container = document.getElementById('kajianCardsGrid');
    if (!container) return;

    let items = appState.kajianList;
    if (currentKajianFilter !== 'ALL') {
      items = items.filter(k => k.kategori === currentKajianFilter);
    }

    if (items.length === 0) {
      container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #64748b;">Belum ada agenda kajian dalam kategori ini.</div>';
      return;
    }

    container.innerHTML = items.map(k => {
      let badgeClass = 'cat-rutin';
      if (k.kategori === 'Tabligh') badgeClass = 'cat-tabligh';
      else if (k.kategori === 'TPA') badgeClass = 'cat-tpa';
      else if (k.kategori === 'Sosial') badgeClass = 'cat-sosial';

      const waText = encodeURIComponent(`*Undangan Kajian Masjid Al-Ikhlas Mantrijeron*\n\n📌 *Tema:* ${k.judul}\n🎙️ *Pemateri:* ${k.pemateri}\n⏰ *Waktu:* ${k.waktu}\n📍 *Tempat:* ${k.tempat}\n\nMari hadir bersama keluarga untuk menuntut ilmu agama. Sebarkan kebaikan!`);

      return `
        <div class="kajian-card">
          <div>
            <div class="kajian-top">
              <span class="badge-kajian-cat ${badgeClass}">${k.kategori}</span>
              <span class="kajian-time-badge">${k.waktu}</span>
            </div>
            <h3 class="kajian-judul">${k.judul}</h3>
            <div class="kajian-pemateri">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>${k.pemateri}</span>
            </div>
            <div class="kajian-meta-box">
              <div><strong>Lokasi:</strong> ${k.tempat}</div>
              <div>${k.catatan || 'Terbuka untuk Jamaah Umum'}</div>
            </div>
          </div>

          <a href="https://api.whatsapp.com/send?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn-share-wa">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.19 8.19 0 0 1-5.82 2.42c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.25-4.38c0-4.54 3.7-8.24 8.24-8.24m4.51 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.2 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29"/></svg>
            <span>Bagikan ke WhatsApp</span>
          </a>
        </div>
      `;
    }).join('');
  }

  // --- RENDER KEUANGAN & KAS ---
  function formatRupiah(num) {
    return 'Rp ' + Number(num).toLocaleString('id-ID');
  }

  function renderKeuangan() {
    let totalIn = 0;
    let totalOut = 0;

    appState.mutasiList.forEach(m => {
      if (m.tipe === 'IN') totalIn += Number(m.nominal);
      else totalOut += Number(m.nominal);
    });

    const saldoBersih = totalIn - totalOut;

    const elSaldo = document.getElementById('keuSaldoTotal');
    const elIn = document.getElementById('keuPemasukanBulan');
    const elOut = document.getElementById('keuPengeluaranBulan');

    if (elSaldo) elSaldo.textContent = formatRupiah(saldoBersih);
    if (elIn) elIn.textContent = formatRupiah(totalIn);
    if (elOut) elOut.textContent = formatRupiah(totalOut);

    // Update pos bars proportionally
    const posOperasional = Math.round(saldoBersih * 0.45);
    const posRenovasi = Math.round(saldoBersih * 0.30);
    const posSosial = Math.round(saldoBersih * 0.17);
    const posDakwah = Math.round(saldoBersih * 0.08);

    const elPosOp = document.getElementById('posOperasional');
    const elPosRen = document.getElementById('posRenovasi');
    const elPosSos = document.getElementById('posSosial');
    const elPosDak = document.getElementById('posDakwah');

    if (elPosOp) elPosOp.textContent = `${formatRupiah(posOperasional)} (45%)`;
    if (elPosRen) elPosRen.textContent = `${formatRupiah(posRenovasi)} (30%)`;
    if (elPosSos) elPosSos.textContent = `${formatRupiah(posSosial)} (17%)`;
    if (elPosDak) elPosDak.textContent = `${formatRupiah(posDakwah)} (8%)`;

    // Render Mutasi Table
    const tbody = document.getElementById('mutasiTableBody');
    if (!tbody) return;

    if (appState.mutasiList.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="padding: 2rem;">Belum ada catatan mutasi kas.</td></tr>';
      return;
    }

    tbody.innerHTML = appState.mutasiList.map(m => {
      const isPemasukan = m.tipe === 'IN';
      const inVal = isPemasukan ? formatRupiah(m.nominal) : '-';
      const outVal = !isPemasukan ? formatRupiah(m.nominal) : '-';
      const inClass = isPemasukan ? 'nominal-in' : '';
      const outClass = !isPemasukan ? 'nominal-out' : '';

      return `
        <tr>
          <td>${m.tanggal}</td>
          <td><span class="badge-tag">${m.pos}</span></td>
          <td>${m.ket}</td>
          <td class="${inClass}">${inVal}</td>
          <td class="${outClass}">${outVal}</td>
          <td><strong>${formatRupiah(m.saldo)}</strong></td>
        </tr>
      `;
    }).join('');
  }

  // --- RENDER DIREKTORI MASJID ---
  function renderDirektori() {
    const list = document.getElementById('masjidItemsGrid');
    if (!list) return;

    list.innerHTML = appState.masjidList.map(m => `
      <div class="masjid-item">
        <div class="m-head">
          <div class="m-name">${m.nama}</div>
          <span class="m-dist">${m.jarak}</span>
        </div>
        <div class="m-addr">${m.alamat}</div>
        <div class="m-facilities">
          ${m.fasilitas.map(f => `<span class="m-fac-tag">${f}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // --- NAVIGATION TAB SWITCHING ---
  function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const view = tab.getAttribute('data-view');
        document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));

        const target = document.getElementById('view' + view.charAt(0).toUpperCase() + view.slice(1));
        if (target) target.classList.add('active');
      });
    });

    // City selector change
    const citySelect = document.getElementById('citySelect');
    if (citySelect) {
      citySelect.value = appState.selectedCity || 'jogja';
      citySelect.addEventListener('change', () => {
        appState.selectedCity = citySelect.value;
        saveState();
        renderPrayerTimes();
        tickClock();
      });
    }

    // Audio reminder toggle
    const btnAudio = document.getElementById('btnAudioToggle');
    const audioStatusText = document.getElementById('audioStatusText');
    if (btnAudio) {
      if (appState.audioEnabled) btnAudio.classList.add('active');
      else btnAudio.classList.remove('active');

      btnAudio.addEventListener('click', () => {
        initAudio();
        appState.audioEnabled = !appState.audioEnabled;
        if (appState.audioEnabled) {
          btnAudio.classList.add('active');
          if (audioStatusText) audioStatusText.textContent = 'Suara Aktif';
          playIslamicChime();
        } else {
          btnAudio.classList.remove('active');
          if (audioStatusText) audioStatusText.textContent = 'Suara Mute';
        }
        saveState();
      });
    }

    // TV Fullscreen toggle
    const btnTvFullscreen = document.getElementById('btnTvFullscreen');
    if (btnTvFullscreen) {
      btnTvFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => {
            console.warn('Fullscreen error:', err);
          });
        } else {
          if (document.exitFullscreen) document.exitFullscreen();
        }
      });
    }
  }

  // --- MODALS SETUP ---
  function initModals() {
    // 1. QRIS Infaq Modal
    const qrisModal = document.getElementById('qrisModal');
    const btnOpenQris = document.getElementById('btnOpenQrisModal');
    const btnCloseQris = document.getElementById('btnCloseQrisModal');
    const btnConfirmQris = document.getElementById('btnConfirmQrisDonation');

    let selectedNominal = 50000;

    if (btnOpenQris) {
      btnOpenQris.addEventListener('click', () => {
        if (qrisModal) qrisModal.hidden = false;
      });
    }

    if (btnCloseQris) {
      btnCloseQris.addEventListener('click', () => {
        if (qrisModal) qrisModal.hidden = true;
      });
    }

    document.querySelectorAll('.nom-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.nom-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedNominal = Number(pill.getAttribute('data-nom'));
      });
    });

    if (btnConfirmQris) {
      btnConfirmQris.addEventListener('click', () => {
        initAudio();
        playIslamicChime();

        // Calculate new running saldo
        let currentSaldo = 18450000;
        if (appState.mutasiList.length > 0) {
          currentSaldo = appState.mutasiList[0].saldo;
        }
        const newSaldo = currentSaldo + selectedNominal;

        const newMutasi = {
          id: Date.now(),
          tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          tipe: 'IN',
          pos: 'Operasional',
          ket: `Infaq Digital QRIS Jamaah (${formatRupiah(selectedNominal)})`,
          nominal: selectedNominal,
          saldo: newSaldo
        };

        appState.mutasiList.unshift(newMutasi);
        saveState();
        renderKeuangan();

        if (qrisModal) qrisModal.hidden = true;
        alert(`Alhamdulillah, infaq digital sebesar ${formatRupiah(selectedNominal)} berhasil dicatatkan. Jazakumullahu Khairan!`);
      });
    }

    // 2. Tambah Agenda Kajian Modal
    const kajianModal = document.getElementById('addKajianModal');
    const btnOpenAddKajian = document.getElementById('btnOpenAddKajianModal');
    const btnCloseAddKajian = document.getElementById('btnCloseAddKajian');
    const btnCancelAddKajian = document.getElementById('btnCancelAddKajian');
    const formAddKajian = document.getElementById('formAddKajian');

    if (btnOpenAddKajian) {
      btnOpenAddKajian.addEventListener('click', () => {
        if (kajianModal) kajianModal.hidden = false;
      });
    }

    const closeKajianModal = () => {
      if (kajianModal) kajianModal.hidden = true;
    };

    if (btnCloseAddKajian) btnCloseAddKajian.addEventListener('click', closeKajianModal);
    if (btnCancelAddKajian) btnCancelAddKajian.addEventListener('click', closeKajianModal);

    if (formAddKajian) {
      formAddKajian.addEventListener('submit', (e) => {
        e.preventDefault();
        const judul = document.getElementById('kajianJudul')?.value.trim();
        const pemateri = document.getElementById('kajianPemateri')?.value.trim();
        const kategori = document.getElementById('kajianKategori')?.value;
        const waktu = document.getElementById('kajianWaktu')?.value.trim();
        const tempat = document.getElementById('kajianTempat')?.value.trim();
        const catatan = document.getElementById('kajianCatatan')?.value.trim();

        if (!judul || !pemateri || !waktu) return;

        const newKajian = {
          id: Date.now(),
          judul,
          pemateri,
          kategori,
          waktu,
          tempat: tempat || 'Ruang Utama Masjid Al-Ikhlas',
          catatan
        };

        appState.kajianList.unshift(newKajian);
        saveState();
        renderKajian();
        formAddKajian.reset();
        closeKajianModal();
      });
    }

    // 3. Tambah Mutasi Kas Modal
    const mutasiModal = document.getElementById('addMutasiModal');
    const btnOpenAddMutasi = document.getElementById('btnOpenAddMutasiModal');
    const btnCloseAddMutasi = document.getElementById('btnCloseAddMutasi');
    const btnCancelAddMutasi = document.getElementById('btnCancelAddMutasi');
    const formAddMutasi = document.getElementById('formAddMutasi');

    if (btnOpenAddMutasi) {
      btnOpenAddMutasi.addEventListener('click', () => {
        if (mutasiModal) mutasiModal.hidden = false;
      });
    }

    const closeMutasiModal = () => {
      if (mutasiModal) mutasiModal.hidden = true;
    };

    if (btnCloseAddMutasi) btnCloseAddMutasi.addEventListener('click', closeMutasiModal);
    if (btnCancelAddMutasi) btnCancelAddMutasi.addEventListener('click', closeMutasiModal);

    if (formAddMutasi) {
      formAddMutasi.addEventListener('submit', (e) => {
        e.preventDefault();
        const tipe = document.getElementById('mutasiTipe')?.value;
        const pos = document.getElementById('mutasiPos')?.value;
        const nominal = Number(document.getElementById('mutasiNominal')?.value);
        const ket = document.getElementById('mutasiKet')?.value.trim();

        if (!nominal || !ket) return;

        let currentSaldo = 18450000;
        if (appState.mutasiList.length > 0) {
          currentSaldo = appState.mutasiList[0].saldo;
        }

        const newSaldo = tipe === 'IN' ? currentSaldo + nominal : currentSaldo - nominal;

        const newMutasi = {
          id: Date.now(),
          tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          tipe,
          pos,
          ket,
          nominal,
          saldo: newSaldo
        };

        appState.mutasiList.unshift(newMutasi);
        saveState();
        renderKeuangan();
        formAddMutasi.reset();
        closeMutasiModal();
      });
    }

    // Export Kas CSV
    const btnExportCsv = document.getElementById('btnExportKasCsv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => {
        const headers = ['Tanggal', 'Jenis', 'Pos Amanah', 'Keterangan', 'Pemasukan', 'Pengeluaran', 'Saldo Akhir'];
        const rows = appState.mutasiList.map(m => {
          const inVal = m.tipe === 'IN' ? m.nominal : 0;
          const outVal = m.tipe === 'OUT' ? m.nominal : 0;
          return [
            `"${m.tanggal}"`,
            `"${m.tipe}"`,
            `"${m.pos}"`,
            `"${m.ket.replace(/"/g, '""')}"`,
            inVal,
            outVal,
            m.saldo
          ].join(',');
        });

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', `Laporan_Kas_Masjid_Al_Ikhlas_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }

    // Kajian Filter Pills
    document.querySelectorAll('#kajianFilterRow .filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#kajianFilterRow .filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentKajianFilter = pill.getAttribute('data-filter');
        renderKajian();
      });
    });
  }

  // --- SERVICE WORKER REGISTRATION ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then(reg => {
        console.log('Majelis Pro ServiceWorker registered:', reg.scope);
      }).catch(err => {
        console.warn('Majelis Pro ServiceWorker failed:', err);
      });
    });
  }

  // --- INITIALIZE ALL ---
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initModals();
    renderPrayerTimes();
    renderKajian();
    renderKeuangan();
    renderDirektori();

    tickClock();
    setInterval(tickClock, 1000);
  });

})();
