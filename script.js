const colors = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b'];
let currentSelectedColor = colors[0];
let subjectCount = 0;

function init() {
    const now = new Date();
    document.getElementById('currentDateDisplay').innerText = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    
    // สร้างตารางเวลา
    const timeGrid = document.getElementById('time-grid');
    for (let h = 4; h <= 23; h++) {
        const row = document.createElement('div');
        row.className = 'time-row py-2';
        row.innerHTML = `<div class="text-[11px] font-bold text-slate-300 w-16">${h.toString().padStart(2, '0')}:00</div>
            <div class="flex flex-1 gap-2 h-8">${Array(4).fill(0).map(() => `<div class="slot flex-1 bg-white border border-slate-100 rounded-lg cursor-pointer transition-all" onclick="paintSlot(this)"></div>`).join('')}</div>`;
        timeGrid.appendChild(row);
    }

    ['Quran', 'English', 'Academic'].forEach(n => addSubject(n));
    renderHistory();
}

// ระบบสลับหน้า
function switchTab(tab) {
    document.getElementById('track-page').classList.toggle('hidden', tab !== 'track');
    document.getElementById('history-page').classList.toggle('hidden', tab !== 'history');
    document.querySelectorAll('.nav-btn').forEach((btn, i) => btn.classList.toggle('active', (i === 0 && tab === 'track') || (i === 1 && tab === 'history')));
    if(tab === 'history') renderHistory();
}

// ระบบระบายสี
function paintSlot(el) {
    const activeColorRgb = hexToRgb(currentSelectedColor);
    el.style.background = (el.style.background === activeColorRgb) ? "white" : currentSelectedColor;
    el.style.borderColor = (el.style.background === "white") ? "#f1f5f9" : currentSelectedColor;
    updateTotal();
}

function updateTotal() {
    const painted = Array.from(document.querySelectorAll('.slot')).filter(s => s.style.background !== "" && s.style.background !== "white").length;
    const h = Math.floor((painted * 15) / 60);
    const m = (painted * 15) % 60;
    document.getElementById('totalHours').innerText = `${h}h ${m.toString().padStart(2, '0')}m`;
}

// ระบบเก็บประวัติ (Local Storage)
function saveToHistory() {
    const data = {
        date: document.getElementById('currentDateDisplay').innerText,
        total: document.getElementById('totalHours').innerText,
        id: Date.now()
    };
    let history = JSON.parse(localStorage.getItem('study_history') || '[]');
    history.unshift(data);
    localStorage.setItem('study_history', JSON.stringify(history));
    alert('บันทึกลงประวัติแล้ว!');
}

function renderHistory() {
    const container = document.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('study_history') || '[]');
    container.innerHTML = history.map(item => `
        <div class="history-card shadow-sm">
            <div class="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">${item.date}</div>
            <div class="text-2xl font-bold text-slate-800">${item.total}</div>
            <div class="text-xs text-slate-400 mt-2 italic">Focused Learning Session</div>
        </div>
    `).join('') || '<p class="text-slate-400">ยังไม่มีประวัติการบันทึก</p>';
}

function addSubject(name) {
    const container = document.getElementById('subject-list');
    const color = colors[subjectCount % colors.length];
    const item = document.createElement('div');
    item.className = 'subject-item flex items-center gap-4 cursor-pointer p-3 rounded-2xl transition-all';
    item.onclick = () => {
        document.querySelectorAll('.subject-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        currentSelectedColor = color;
    };
    item.innerHTML = `<div class="w-3 h-3 rounded-full" style="background: ${color}"></div><span class="text-sm font-bold text-slate-600">${name}</span>`;
    container.appendChild(item);
    if(subjectCount === 0) item.click();
    subjectCount++;
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

// ฟังก์ชันเดิมอื่นๆ เช่น downloadImage...
async function downloadImage() {
    const area = document.getElementById('capture-area');
    const canvas = await html2canvas(area, { scale: 3, backgroundColor: "#ffffff" });
    const link = document.createElement('a');
    link.download = `Study-Report.png`;
    link.href = canvas.toDataURL();
    link.click();
}

init();