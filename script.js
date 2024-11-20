// Particles.js Configuration
particlesJS("particles-js", {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#ffffff" },
    shape: { type: "circle" },
    opacity: {
      value: 0.5,
      random: false,
      anim: { enable: false },
    },
    size: {
      value: 3,
      random: true,
      anim: { enable: false },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 6,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" },
      resize: true,
    },
  },
  retina_detect: true,
});

// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
});

// BMKG API Integration
const fetchGempaTerkini = async () => {
  try {
    const response = await fetch(
      "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json"
    );
    const data = await response.json();
    return data.Infogempa.gempa;
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    return null;
  }
};

let map = L.map("map").setView([-2.5489, 118.0149], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const updateMap = (gempaData) => {
  if (!gempaData) return;

  const { Coordinates, Magnitude, Kedalaman, Wilayah, Tanggal, Jam } =
    gempaData;
  const [lat, lon] = Coordinates.split(",").map((coord) => parseFloat(coord));

  const marker = L.marker([lat, lon]).addTo(map);

  const popupContent = `
        <div class="gempa-popup">
            <h3>Gempa Terkini</h3>
            <p>Magnitude: ${Magnitude}</p>
            <p>Kedalaman: ${Kedalaman}</p>
            <p>Wilayah: ${Wilayah}</p>
            <p>Waktu: ${Tanggal} ${Jam}</p>
        </div>
    `;
  marker.bindPopup(popupContent);

  L.circle([lat, lon], {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.3,
    radius: Magnitude * 50000,
  }).addTo(map);
};

const updateGempaCards = (gempaData) => {
  if (!gempaData) return;

  const container = document.getElementById("gempa-terkini");
  container.innerHTML = ""; // Clear existing content

  const card = document.createElement("div");
  card.className = "gempa-card";
  card.innerHTML = `
        <h3>Gempa Terkini</h3>
        <div class="gempa-info">
            <p><strong>Magnitude:</strong> ${gempaData.Magnitude}</p>
            <p><strong>Kedalaman:</strong> ${gempaData.Kedalaman}</p>
            <p><strong>Lokasi:</strong> ${gempaData.Wilayah}</p>
            <p><strong>Waktu:</strong> ${gempaData.Tanggal} ${gempaData.Jam}</p>
            <p><strong>Potensi:</strong> ${gempaData.Potensi}</p>
        </div>
    `;
  container.appendChild(card);
};

// Emergency Form Handler
document.getElementById("emergency-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = {
    nama: document.getElementById("nama").value,
    lokasi: document.getElementById("lokasi").value,
    jenisBantuan: document.getElementById("jenis-bantuan").value,
    deskripsi: document.getElementById("deskripsi").value,
  };

  // Show alert
  const alert = document.createElement("div");
  alert.className = "alert";
  alert.textContent =
    "Permintaan bantuan telah dikirim! Tim akan segera menghubungi Anda.";
  document.body.appendChild(alert);

  // Remove alert after 5 seconds
  setTimeout(() => {
    alert.remove();
  }, 5000);

  // Reset form
  e.target.reset();
});

// Mobile Menu Toggle
document.querySelector(".menu-toggle").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("active");
});

// Loading Screen
window.addEventListener("load", async () => {
  // Fetch initial earthquake data
  const gempaData = await fetchGempaTerkini();
  updateMap(gempaData);
  updateGempaCards(gempaData);

  // Hide loading screen with fade effect
  const loadingScreen = document.querySelector(".loading-screen");
  loadingScreen.style.opacity = "0";
  setTimeout(() => {
    loadingScreen.style.display = "none";
  }, 500);

  // Set up periodic data refresh (every 5 minutes)
  setInterval(async () => {
    const newData = await fetchGempaTerkini();
    updateMap(newData);
    updateGempaCards(newData);
  }, 300000);
});
const mitigasiData = [
  {
    title: "Persiapkan Kit Darurat",
    description:
      "Siapkan tas darurat berisi: air mineral, makanan kaleng, obat-obatan, senter, baterai cadangan, dan dokumen penting. Simpan di tempat mudah dijangkau.",
    icon: "🚨",
  },
  {
    title: "Identifikasi Titik Kumpul",
    description:
      "Tentukan lokasi aman di sekitar rumah atau kantor sebagai titik kumpul keluarga atau rekan kerja jika terjadi gempa. Pastikan semua anggota keluarga mengetahui lokasi ini.",
    icon: "📍",
  },
  {
    title: "Simulasi Evakuasi",
    description:
      "Lakukan simulasi evakuasi secara berkala dengan keluarga. Latih anggota keluarga untuk berlindung di bawah meja atau di sudut ruangan yang kuat saat gempa terjadi.",
    icon: "🏃",
  },
  {
    title: "Amankan Perabot",
    description:
      "Pasang penahan atau kunci pada lemari, rak, dan perabot berat agar tidak mudah roboh saat gempa. Hindari menempatkan barang berat di atas tempat tidur atau area tidur.",
    icon: "🛋️",
  },
  {
    title: "Perhatikan Instalasi Listrik",
    description:
      "Pastikan instalasi listrik rumah dalam kondisi baik. Matikan listrik dan gas jika terjadi gempa untuk mencegah kebakaran. Kenali lokasi sekring listrik dan katup gas.",
    icon: "🔌",
  },
];

const pascaBencanaData = [
  {
    title: "Periksa Kondisi Bangunan",
    description:
      "Lakukan pemeriksaan menyeluruh terhadap struktur bangunan. Waspadai retak, kebocoran gas, atau kerusakan listrik. Jangan masuk ke dalam bangunan sebelum dinyatakan aman.",
    icon: "🏠",
  },
  {
    title: "Dokumentasi Kerusakan",
    description:
      "Foto dan catat semua kerusakan yang terjadi untuk keperluan klaim asuransi. Simpan bukti pembelian dan perbaikan yang dilakukan.",
    icon: "📸",
  },
  {
    title: "Koordinasi dengan Tetangga",
    description:
      "Bantu tetangga yang membutuhkan pertolongan. Bentuk tim untuk pembersihan dan pemulihan lingkungan. Bagikan informasi penting terkait bantuan dan layanan darurat.",
    icon: "🤝",
  },
  {
    title: "Pantau Informasi",
    description:
      "Ikuti perkembangan informasi dari pihak berwenang. Waspadai gempa susulan dan informasi evakuasi. Pastikan menggunakan sumber informasi resmi.",
    icon: "📱",
  },
  {
    title: "Perhatikan Kesehatan",
    description:
      "Jaga kebersihan dan sanitasi untuk mencegah penyakit. Segera cari bantuan medis jika ada yang terluka. Perhatikan kondisi mental dan stres pasca bencana.",
    icon: "🏥",
  },
];

const saatBencanaData = [
  {
    title: "Jaga Ketenangan",
    description:
      "Tetap tenang dan tidak panik. Ikuti prosedur evakuasi yang telah direncanakan. Bantu yang membutuhkan bantuan jika memungkinkan.",
    icon: "🧘",
  },
  {
    title: "Cari Tempat Berlindung",
    description:
      "Berlindung di bawah meja yang kokoh atau di sudut ruangan. Jauhi jendela dan benda-benda yang mungkin jatuh. Lindungi kepala dengan bantal atau tas.",
    icon: "🏃",
  },
  {
    title: "Matikan Listrik dan Gas",
    description:
      "Segera matikan sumber listrik dan gas untuk mencegah kebakaran atau ledakan. Hindari penggunaan lift dan tangga yang rusak.",
    icon: "⚡",
  },
  {
    title: "Ikuti Arahan",
    description:
      "Dengarkan dan ikuti arahan dari petugas berwenang. Jangan menyebarkan informasi yang belum terverifikasi. Tetap di tempat aman hingga situasi kondusif.",
    icon: "📢",
  },
  {
    title: "Siapkan Jalur Evakuasi",
    description:
      "Kenali dan gunakan jalur evakuasi terdekat. Hindari area yang berpotensi longsor atau runtuh. Menuju titik kumpul yang telah ditentukan.",
    icon: "🚪",
  },
];

const renderMitigasiCards = () => {
  const cardContainer = document.querySelector(".mitigasi-container");

  if (cardContainer) {
    cardContainer.innerHTML = ""; // Clear existing content

    // Sebelum Bencana
    const sebelumSection = document.createElement("div");
    sebelumSection.className = "timeline-item";
    sebelumSection.setAttribute("data-aos", "fade-right");
    sebelumSection.innerHTML = `
      <div class="timeline-content">
        <h3>Sebelum Gempa Terjadi</h3>
        <div class="card-container">
          ${mitigasiData
            .map(
              (item, index) => `
            <div class="card mitigasi-card" data-aos="fade-up" data-aos-delay="${
              100 * (index + 1)
            }">
              <div class="card-header">
                <span class="card-icon">${item.icon}</span>
                <h4>${item.title}</h4>
              </div>
              <div class="card-body">
                <p>${item.description}</p>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    // Saat Bencana
    const saatSection = document.createElement("div");
    saatSection.className = "timeline-item";
    saatSection.setAttribute("data-aos", "fade-up");
    saatSection.innerHTML = `
      <div class="timeline-content">
        <h3>Saat Gempa Terjadi</h3>
        <div class="card-container">
          ${saatBencanaData
            .map(
              (item, index) => `
            <div class="card mitigasi-card" data-aos="fade-up" data-aos-delay="${
              100 * (index + 1)
            }">
              <div class="card-header">
                <span class="card-icon">${item.icon}</span>
                <h4>${item.title}</h4>
              </div>
              <div class="card-body">
                <p>${item.description}</p>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    // Pasca Bencana
    const pascaSection = document.createElement("div");
    pascaSection.className = "timeline-item";
    pascaSection.setAttribute("data-aos", "fade-left");
    pascaSection.innerHTML = `
      <div class="timeline-content">
        <h3>Pasca Gempa</h3>
        <div class="card-container">
          ${pascaBencanaData
            .map(
              (item, index) => `
            <div class="card mitigasi-card" data-aos="fade-up" data-aos-delay="${
              100 * (index + 1)
            }">
              <div class="card-header">
                <span class="card-icon">${item.icon}</span>
                <h4>${item.title}</h4>
              </div>
              <div class="card-body">
                <p>${item.description}</p>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    cardContainer.appendChild(sebelumSection);
    cardContainer.appendChild(saatSection);
    cardContainer.appendChild(pascaSection);
  }
};

// Add this to your window load event or DOMContentLoaded event
document.addEventListener("DOMContentLoaded", renderMitigasiCards);

document.querySelector(".menu-toggle").addEventListener("click", function () {
  this.classList.toggle("active");
  document.querySelector(".nav-links").classList.toggle("active");
});