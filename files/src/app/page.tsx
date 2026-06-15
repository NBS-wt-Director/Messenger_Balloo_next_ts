/**
 * Balloo Files
 * Файловый менеджер платформы
 * 
 * @status Placeholder - In Development
 */

export default function FilesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-8xl mb-6">📁</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Balloo Files
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Файловый менеджер в разработке
        </p>
        <div className="bg-white rounded-xl shadow-sm border p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Запланированные функции:
          </h2>
          <ul className="text-left space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Загрузка файлов
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Управление папками
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Интеграция с Yandex Disk
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Общий доступ к файлам
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Предпросмотр файлов
            </li>
          </ul>
        </div>
        <a
          href="http://localhost:3007"
          className="mt-8 inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          ← Вернуться к Nodes Switcher
        </a>
      </div>
    </div>
  );
}
