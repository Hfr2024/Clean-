const storageInfo = document.getElementById("storageInfo");
const scanBtn = document.getElementById("scanBtn");
const largeFiles = document.getElementById("largeFiles");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const tipsBtn = document.getElementById("tipsBtn");
const tipsBox = document.getElementById("tipsBox");
const noteInput = document.getElementById("noteInput");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const notesList = document.getElementById("notesList");

const tips = [
  "أغلق التطبيقات غير المستخدمة.",
  "احذف الملفات الكبيرة القديمة.",
  "امسح ذاكرة التخزين المؤقت من التطبيقات الثقيلة.",
  "أوقف التحديثات التلقائية غير الضرورية.",
  "خفف الخلفيات الحية والودجات الثقيلة."
];

function renderNotes(){
  const notes = JSON.parse(localStorage.getItem("mlh_notes") || "[]");
  notesList.innerHTML = "";
  notes.forEach((n, i) => {
    const li = document.createElement("li");
    li.textContent = n;
    li.addEventListener("click", () => {
      notes.splice(i,1);
      localStorage.setItem("mlh_notes", JSON.stringify(notes));
      renderNotes();
    });
    notesList.appendChild(li);
  });
}

saveNoteBtn.addEventListener("click", () => {
  const val = noteInput.value.trim();
  if(!val) return;
  const notes = JSON.parse(localStorage.getItem("mlh_notes") || "[]");
  notes.push(val);
  localStorage.setItem("mlh_notes", JSON.stringify(notes));
  noteInput.value = "";
  renderNotes();
});

tipsBtn.addEventListener("click", () => {
  tipsBox.innerHTML = tips.map(t => `• ${t}`).join("<br>");
});

fileInput.addEventListener("change", () => {
  fileList.innerHTML = "";
  [...fileInput.files].forEach(file => {
    const li = document.createElement("li");
    li.textContent = `${file.name} — ${(file.size / 1024 / 1024).toFixed(2)} MB`;
    fileList.appendChild(li);
  });
});

scanBtn.addEventListener("click", () => {
  largeFiles.innerHTML = "";
  const files = [...(fileInput.files || [])].sort((a,b) => b.size - a.size).slice(0,5);
  if(!files.length){
    largeFiles.innerHTML = "<li>لا توجد ملفات محددة.</li>";
    return;
  }
  files.forEach(file => {
    const li = document.createElement("li");
    li.textContent = `${file.name} — ${(file.size / 1024 / 1024).toFixed(2)} MB`;
    largeFiles.appendChild(li);
  });
});

if ('storage' in navigator && navigator.storage.estimate) {
  navigator.storage.estimate().then(({usage = 0, quota = 0}) => {
    const used = (usage / 1024 / 1024).toFixed(1);
    const total = (quota / 1024 / 1024).toFixed(1);
    storageInfo.textContent = `المساحة المستخدمة تقريبًا: ${used} MB / ${total} MB`;
  }).catch(() => {
    storageInfo.textContent = "تعذر جلب معلومات التخزين.";
  });
} else {
  storageInfo.textContent = "معلومات التخزين غير مدعومة في هذا المتصفح.";
}

renderNotes();
