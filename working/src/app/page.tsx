/**
 * Balloo Working Sandbox
 * Песочница для тестирования кода
 */

'use client';

import { useState, useEffect } from 'react';

interface SandboxCode {
  id: string;
  language: string;
  code: string;
  output: string;
  status: 'idle' | 'running' | 'success' | 'error';
  timestamp: string;
}

const defaultCode = `// Напиши свой код здесь
// Поддерживается JavaScript и TypeScript

console.log('Hello from Balloo Sandbox!');

// Пример: функция для сложения чисел
function add(a, b) {
  return a + b;
}

const result = add(2, 3);
console.log('2 + 3 =', result);

// Пример: работа с массивами
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log('Doubled:', doubled);

// Пример: асинхронный код
async function fetchData() {
  console.log('Fetching data...');
  return { success: true, data: [1, 2, 3] };
}

fetchData().then(data => {
  console.log('Fetched:', data);
});`;

export default function WorkingPage() {
  const [code, setCode] = useState(defaultCode);
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [history, setHistory] = useState<SandboxCode[]>([]);
  const [executionTime, setExecutionTime] = useState<number>(0);

  const handleRun = async () => {
    setStatus('running');
    setOutput('');
    
    const startTime = Date.now();

    try {
      // Имитация выполнения кода (в реальности - sandbox environment)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Перехват console.log
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args: any[]) => {
        logs.push(args.map(a => String(a)).join(' '));
        originalLog(...args);
      };

      try {
        // Безопасное выполнение (eval с ограничениями)
        // В production использовать Worker или Docker sandbox
        const func = new Function(code);
        const result = func();
        
        if (result !== undefined) {
          logs.push('Return value:', JSON.stringify(result, null, 2));
        }

        setOutput(logs.join('\n'));
        setStatus('success');
      } catch (error: any) {
        setOutput(`Error: ${error.message}\n\nStack:\n${error.stack || ''}`);
        setStatus('error');
      } finally {
        console.log = originalLog;
      }

      const endTime = Date.now();
      setExecutionTime(endTime - startTime);

      // Сохранение в историю
      const sandboxCode: SandboxCode = {
        id: Date.now().toString(),
        language,
        code,
        output: logs.join('\n'),
        status: 'success',
        timestamp: new Date().toISOString(),
      };

      setHistory(prev => [sandboxCode, ...prev].slice(0, 20));
    } catch (error) {
      setOutput('Failed to execute code');
      setStatus('error');
    }
  };

  const handleClear = () => {
    setCode('');
    setOutput('');
    setStatus('idle');
  };

  const handleLoadExample = () => {
    setCode(defaultCode);
    setOutput('');
    setStatus('idle');
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                🛠️ Balloo Working Sandbox
              </h1>
              <p className="text-gray-400 mt-1">
                Песочница для тестирования кода
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                status === 'running' ? 'bg-yellow-600 text-white' :
                status === 'success' ? 'bg-green-600 text-white' :
                status === 'error' ? 'bg-red-600 text-white' :
                'bg-gray-600 text-gray-300'
              }`}>
                {status === 'running' ? '⏳ Выполняется...' :
                 status === 'success' ? '✅ Успех' :
                 status === 'error' ? '❌ Ошибка' :
                 '⏸️ Готов'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div className="flex flex-col h-[calc(100vh-200px)]">
            {/* Toolbar */}
            <div className="bg-gray-800 rounded-t-xl border border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                  </select>
                  
                  <span className="text-sm text-gray-400">
                    {executionTime > 0 && `⏱️ ${executionTime}ms`}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleLoadExample}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    📄 Пример
                  </button>
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    🗑️ Очистить
                  </button>
                  <button
                    onClick={handleRun}
                    disabled={status === 'running'}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    {status === 'running' ? '⏳...' : '▶️ Запустить'}
                  </button>
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 bg-gray-800 border-x border-gray-700">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full p-4 bg-gray-800 text-gray-100 font-mono text-sm resize-none focus:outline-none"
                spellCheck={false}
                placeholder="Напишите свой код здесь..."
              />
            </div>
          </div>

          {/* Output */}
          <div className="flex flex-col h-[calc(100vh-200px)]">
            {/* Output Header */}
            <div className="bg-gray-800 rounded-t-xl border border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Вывод
                </h2>
                {output && (
                  <button
                    onClick={() => navigator.clipboard.writeText(output)}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    📋 Копировать
                  </button>
                )}
              </div>
            </div>

            {/* Output Content */}
            <div className="flex-1 bg-gray-800 border-x border-gray-700 p-4 overflow-auto">
              {status === 'running' ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Выполнение кода...</p>
                  </div>
                </div>
              ) : output ? (
                <pre className={`text-sm font-mono whitespace-pre-wrap ${
                  status === 'error' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {output}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <p className="text-4xl mb-4">🖥️</p>
                    <p>Нажмите «Запустить» для выполнения кода</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">
                История выполнения
              </h2>
              <button
                onClick={handleClearHistory}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Очистить историю
              </button>
            </div>
            <div className="max-h-64 overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Время
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Язык
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Код (первые 50 симв.)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Действие
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {history.map(item => (
                    <tr key={item.id} className="hover:bg-gray-750">
                      <td className="px-6 py-3 text-sm text-gray-400">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-300">
                        {item.language}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-400 truncate max-w-xs">
                        {item.code.substring(0, 50)}...
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.status === 'success' ? 'bg-green-900 text-green-300' :
                          item.status === 'error' ? 'bg-red-900 text-red-300' :
                          'bg-gray-900 text-gray-300'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <button
                          onClick={() => {
                            setCode(item.code);
                            setOutput(item.output);
                            setStatus(item.status);
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Загрузить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
