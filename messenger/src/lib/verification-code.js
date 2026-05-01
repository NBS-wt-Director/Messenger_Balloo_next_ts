/**
 * Генерация кода верификации из 7 русских слов
 */

const russianWords = [
  'солнце', 'месяц', 'звезда', 'небо', 'земля', 'вода', 'огонь', 'ветер',
  'горы', 'лес', 'река', 'море', 'птица', 'рыба', 'зверь', 'цветок',
  'трава', 'дерево', 'камень', 'песок', 'утро', 'вечер', 'ночь', 'день',
  'зима', 'лето', 'осень', 'весна', 'дождь', 'снег', 'град', 'туман',
  'радуга', 'гром', 'молния', 'роса', 'иней', 'лед', 'пламя', 'дым',
  'мир', 'любовь', 'вера', 'надежда', 'радость', 'смех', 'песня', 'танец',
  'книга', 'слово', 'мысль', 'мечта', 'сон', 'ярость', 'сила', 'честь',
  'друг', 'враг', 'путь', 'дом', 'огонь', 'свет', 'тьма', 'тишина',
  'волна', 'берег', 'остров', 'корабль', 'парус', 'якорь', 'компас', 'карта',
  'меч', 'щит', 'шлем', 'доспех', 'конь', 'колесо', 'мост', 'башня'
];

/**
 * Генерация случайного кода из 7 слов
 */
function generateVerificationCode() {
  const code = [];
  const usedIndices = new Set();
  
  while (code.length < 7) {
    const index = Math.floor(Math.random() * russianWords.length);
    
    if (!usedIndices.has(index)) {
      usedIndices.add(index);
      code.push(russianWords[index]);
    }
  }
  
  return code.join('-');
}

/**
 * Проверка кода верификации
 */
function verifyCode(inputCode, storedCode) {
  if (!inputCode || !storedCode) return false;
  
  // Нормализация: удаление пробелов, приведение к нижнему регистру
  const normalizedInput = inputCode.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
  const normalizedStored = storedCode.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
  
  return normalizedInput === normalizedStored;
}

/**
 * Форматирование кода для отображения (с пробелами)
 */
function formatCodeForDisplay(code) {
  return code.replace(/-/g, ' ');
}

/**
 * Получение первых 3 слов для подсказки
 */
function getCodeHint(code) {
  const words = code.split('-');
  return words.slice(0, 3).join('-') + '...';
}

module.exports = {
  generateVerificationCode,
  verifyCode,
  formatCodeForDisplay,
  getCodeHint
};
