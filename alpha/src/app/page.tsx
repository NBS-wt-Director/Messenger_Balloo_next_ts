/**
 * Balloo Alpha
 * Экспериментальные функции
 * 
 * @status Placeholder - Alpha Testing
 */

export default function AlphaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-8xl mb-6">🧪</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Balloo Alpha
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Экспериментальные функции
        </p>
        <div className="bg-white rounded-xl shadow-sm border p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Тестируемые функции:
          </h2>
          <ul className="text-left space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-yellow-500">⚠️</span>
              AI-ассистент v2.0
            </li>
            <li className="flex items-center gap-2">
              <span className="text-yellow-500">⚠️</span>
              Голосовые команды
            </li>
            <li className="flex items-center gap-2">
              <span className="text-yellow-500">⚠️</span>
              AR интеграция
            </li>
            <li className="flex items-center gap-2">
              <span className="text-yellow-500">⚠️</span>
              Blockchain notes
            </li>
          </ul>
          <p className="mt-4 text-sm text-gray-500">
            ⚠️ Функции в альфа-тестировании. Используйте на свой страх и риск.
          </p>
        </div>
        <a
          href="http://localhost:3007"
          className="mt-8 inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
        >
          ← Вернуться к Nodes Switcher
        </a>
      </div>
    </div>
  );
}
