import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

const BeautySalonForm = () => {
  const [formData, setFormData] = useState({
    name: ''
  });
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    console.log('Initializing Telegram WebApp...');
    if (window.Telegram?.WebApp) {
      console.log('Telegram WebApp found');
      setIsTelegram(true);
      window.Telegram.WebApp.ready();

      // Pre-fill name from Telegram data
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      if (user) {
        console.log('User data found:', user);
        setFormData(prev => ({
          ...prev,
          name: user.first_name
        }));
      }

      // Setup main button
      const mainButton = window.Telegram.WebApp.MainButton;
      mainButton.setText('Записаться');
      mainButton.show();

      mainButton.onClick(() => {
        console.log('Main button clicked');
        if (formData.name.trim()) {
          console.log('Sending data to Telegram:', { name: formData.name });
          try {
            window.Telegram.WebApp.sendData(JSON.stringify({ name: formData.name }));
            console.log('Data sent successfully');
          } catch (error) {
            console.error('Error sending data:', error);
          }
        }
      });
    } else {
      console.log('Telegram WebApp not found');
    }
  }, [formData.name]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
 const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      console.log('Form submitted:', formData);
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
            <User className="h-5 w-5 text-gray-400"/>
          </div>
          <input
            type="text"
            name="name"
            placeholder="Ваше имя"
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.name}
            onChange={handleChange}
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