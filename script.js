let expression = '';
let justCalculated = false;

// Ambil elemen layar (dari catatan: const layar = document.getElementById("layar"))
function updateDisplay() {
  const layar = document.getElementById('layar');

  // Tampilan ^ 
  layar.textContent = formatDisplay(expression) || '0';

  if (layar.textContent.length > 12) {
    layar.style.fontSize = '20px';
  } else if (layar.textContent.length > 8) {
    layar.style.fontSize = '26px';
  } else {
    layar.style.fontSize = '32px';
  }
}

// Tampilkan ^ di layar sebagai pengganti **
function formatDisplay(expr) {
  return expr.replace(/\*\*/g, '^');
}

// Fungsi tambah(nilai)
function tambah(nilai) {
  const ops = ['+', '-', '*', '/', '%', '**'];
  const isPangkat = nilai === '**';

  if (justCalculated && !ops.includes(nilai)) {
    expression = '';
  }
  justCalculated = false;

  // Ganti operator kalau ada operator di akhir
  const endsWithOp = /(\*\*|[\+\-\*\/])$/.test(expression);
  if (ops.includes(nilai) && endsWithOp) {
    expression = expression.replace(/(\*\*|[\+\-\*\/]+)$/, '');
  }

  // Cegah titik ganda dalam satu angka
  if (nilai === '.' && expression.split(/\*\*|[\+\-\*\/]/).pop().includes('.')) return;

  // Cegah operator di awal (kecuali minus)
  if (expression === '' && ops.includes(nilai) && nilai !== '-') return;

  expression += nilai;
  updateDisplay();
}

// Fungsi clearLayar() - hapus semua (dari catatan)
function clearLayar() {
  expression = '';
  justCalculated = false;
  document.getElementById('expr').textContent = '';
  document.getElementById('layar').textContent = '0';
  document.getElementById('layar').style.fontSize = '32px';
}

// Fungsi hapus() - hapus karakter (dari catatan: layar.value = layar.value.slice(0, -1))
function hapus() {
  if (expression.endsWith('**')) {
    expression = expression.slice(0, -2);
  } else {
    expression = expression.slice(0, -1);
  }
  justCalculated = false;
  updateDisplay();
}

// Fungsi hitung hasil
function hitung() {
  if (!expression) return;
  try {
    const exprForEval = expression.replace(/%/g, '/100');
    document.getElementById('expr').textContent = formatDisplay(expression) + ' =';
    const result = Function('"use strict"; return (' + exprForEval + ')')();
    const rounded = parseFloat(result.toFixed(10));
    expression = String(rounded);
    justCalculated = true;
    updateDisplay();
  } catch (e) {
    document.getElementById('layar').textContent = 'Error';
    expression = '';
  }
}

// Keyboard support
document.addEventListener('keydown', function(e) {
  if (e.key >= '0' && e.key <= '9') tambah(e.key);
  else if (['+', '-', '*', '/', '%', '.'].includes(e.key)) tambah(e.key);
  else if (e.key === '^') tambah('**');
  else if (e.key === 'Enter' || e.key === '=') hitung();
  else if (e.key === 'Backspace') hapus();
  else if (e.key === 'Escape') clearLayar();
});