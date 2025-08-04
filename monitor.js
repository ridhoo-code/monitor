const hosts = [
  { name: "Google", url: "https://www.google.com/generate_204" },
  { name: "BHAKTI PURNA JUAL", url: "www.bhaktipurnajual.com" },
  { name: "ZEN", url: "zen.bhakti.co.id" }
];

const tableBody = document.getElementById("monitorBody");

async function pingHost(name, url) {
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 sec max
    const res = await fetch(url, { signal: controller.signal, mode: 'no-cors' });
    clearTimeout(timeout);
    const latency = Math.round(performance.now() - start);
    return { name, status: "Online", latency };
  } catch (err) {
    return { name, status: "Offline", latency: "Timeout" };
  }
}

async function refreshStatus() {
  tableBody.innerHTML = "";
  const results = await Promise.all(hosts.map(h => pingHost(h.name, h.url)));
  for (const r of results) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${r.name}</td>
      <td class="${r.status === "Online" ? "status-up" : "status-down"}">${r.status}</td>
      <td>${r.latency} ms</td>
    `;
    tableBody.appendChild(row);
  }
}

// Run first load
refreshStatus();
// Auto-refresh every 10 sec
setInterval(refreshStatus, 10000);
