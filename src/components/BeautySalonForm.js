import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

const BeautySalonForm = () => {
  const [name, setName] = useState('');
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    // Check if running in Telegram and initialize
    if (window.Telegram?.WebApp) {
      setIsTelegram(true);
      window.Telegram.WebApp.ready();

      // Pre-fill name from Telegram data
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      if (user) {
        const fullName = [user.first_name, user.last_name]
          .filter(Boolean)
          .join(' ');
        setName(fullName);
      }

      // Setup main button
      const mainButton = window.Telegram.WebApp.MainButton;
      mainButton.setText('Записаться');
      mainButton.show();

      // Handle submission via main button
      mainButton.onClick(() => {
        if (name.trim()) {
          window.Telegram.WebApp.sendData(JSON.stringify({ name }));
        }
      });
    }
  }, [name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      console.log('Form submitted:', { name });
      alert('Форма успешно отправлена!');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center">Запись в салон красоты</h2>
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
      </div>
    </div>
  );
};

export default BeautySalonForm;