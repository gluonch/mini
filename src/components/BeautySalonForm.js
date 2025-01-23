import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

const BeautySalonForm = () => {
  const [name, setName] = useState('');
  const [isTelegram, setIsTelegram] = useState(false);
  const [logs, setLogs] = useState([]);

  // Функция для добавления логов
  const addLog = (message) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toISOString()} - ${message}`]);
  };

  useEffect(() => {
    addLog('Checking Telegram availability...');
    addLog(`window.Telegram exists: ${!!window.Telegram}`);

    if (window.Telegram?.WebApp) {
      addLog('Telegram WebApp found!');
      setIsTelegram(true);
      window.Telegram.WebApp.ready();

      const user = window.Telegram.WebApp.initDataUnsafe.user;
      addLog(`Telegram user data: ${JSON.stringify(user)}`);

      if (user) {
        const fullName = [user.first_name, user.last_name]
          .filter(Boolean)
          .join(' ');
        setName(fullName);
        addLog(`Name set to: ${fullName}`);
      }

      const mainButton = window.Telegram.WebApp.MainButton;
      addLog('Setting up main button...');

      mainButton.setText('Записаться');
      mainButton.show();

      mainButton.onClick(() => {
        addLog('Main button clicked!');
        if (name.trim()) {
          addLog(`Attempting to send data: ${JSON.stringify({ name })}`);
          try {
            window.Telegram.WebApp.sendData(JSON.stringify({ name }));
            addLog('Data sent successfully!');
          } catch (error) {
            addLog(`Error sending data: ${error.message}`);
          }
        }
      });
    } else {
      addLog('Telegram WebApp not found');
    }
  }, [name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      addLog(`Form submitted with name: ${name}`);
      alert('Форма успешно отправлена!');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center">Запись в салон красоты</h2>
        {isTelegram && <p className="text-center text-green-600">Telegram WebApp активен</p>}
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Ваше имя"
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {!isTelegram && (
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Записаться
          </button>
        )}

        {/* Debug logging section */}
        <div className="mt-8 p-4 bg-gray-100 rounded-md">
          <h3 className="font-bold mb-2">Debug Logs:</h3>
          <div className="text-xs font-mono h-40 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="py-1">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeautySalonForm;