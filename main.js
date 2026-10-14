// Індивідуальне завдання: боржники останньої сесії
// Запуск: node main.js [файл]   (за замовчуванням registry.txt)

const fs = require('fs');
const HeapSort = require('./heapSort');

const PASS = 60;     // мінімальний прохідний бал
const NO_GRADE = '-'; // оцінку не отримано (і для іспиту, і для заліку)

// --- читання реєстру з файлу ---
function readRegistry(file) {
  return fs.readFileSync(file, 'utf8')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'))
    .map(l => {
      const [name, program, subject, type, date, score] = l.split(';').map(s => s.trim());
      return {
        name, program, subject, type, date,
        score: score === NO_GRADE ? null : Number(score), // null = оцінки немає
      };
    });
}

// --- номер сесії за датою (зимова: вер-лют, літня: бер-сер) ---
function sessionId(date) {
  const [, m, y] = date.split('.').map(Number);
  if (m <= 2) return (y - 1) * 2 + 1; // зимова сесія попереднього навч. року
  if (m >= 9) return y * 2 + 1;       // зимова
  return y * 2;                       // літня
}

const isDebt = r => r.score === null || r.score < PASS;

// --- основна логіка ---
const file = process.argv[2] || 'registry.txt';
const all = readRegistry(file);

const lastSession = Math.max(...all.map(r => sessionId(r.date)));
const records = all.filter(r => sessionId(r.date) === lastSession);

// групуємо по студенту
const students = {};
for (const r of records) {
  if (!students[r.name]) students[r.name] = { name: r.name, program: r.program, debts: [], passedExams: [] };
  const s = students[r.name];
  if (isDebt(r)) s.debts.push(r);
  else if (r.type === 'іспит') s.passedExams.push(r.score);
}

const debtors = Object.values(students)
  .filter(s => s.debts.length > 0)
  .map(s => ({
    ...s,
    avg: s.passedExams.length ? s.passedExams.reduce((a, b) => a + b, 0) / s.passedExams.length : 0,
  }));

// сортування: кількість боргів ↓, при рівності середній бал ↑
// compare > 0 => a має йти ПІСЛЯ b
const sorter = new HeapSort((a, b) => {
  if (a.debts.length !== b.debts.length) return b.debts.length - a.debts.length;
  return a.avg - b.avg;
});
const result = sorter.sort(debtors);

// --- вивід ---
console.log(`Реєстр: ${file}. Записів усього: ${all.length}, в останній сесії: ${records.length}\n`);
console.log('СТУДЕНТИ З ЗАБОРГОВАНОСТЯМИ ЗА ОСТАННЮ СЕСІЮ\n');

if (!result.length) console.log('Боржників немає.');

result.forEach((s, i) => {
  console.log(`${i + 1}. ${s.name} (${s.program})`);
  console.log(`   Заборгованостей: ${s.debts.length}; середній бал (складені іспити): ${s.passedExams.length ? s.avg.toFixed(2) : 'немає'}`);
  for (const d of s.debts) {
    const score = d.score === null ? 'не отримано' : d.score;
    console.log(`   - ${d.subject} [${d.type}], ${d.date}: ${score}`);
  }
  console.log();
});
