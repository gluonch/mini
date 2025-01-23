import React, { useState, useEffect, useCallback } from 'react';
import { User, Phone, Scissors, Calendar, Clock, MessageSquare } from 'lucide-react';

const BeautySalonForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    comment: ''
  });

  const [errors, setErrors] = useState({});
  const [isTelegram, setIsTelegram] = useState(false);

  const services = [
    'Стрижка',
    'Окрашивание',
    'Маникюр',
    'Педикюр',
    'Массаж',
    'Макияж'
  ];

    const validateForm = useCallback((showErrors = true) => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Введите имя';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Введите телефон';
        } else if (!/^\+?[0-9]{10,12}$/.test(formData.phone.trim())) {
            newErrors.phone = 'Неверный формат телефона';
        }

        if (!formData.service) {
            newErrors.service = 'Выберите услугу';
        }

        if (!formData.date) {
            newErrors.date = 'Выберите дату';
        }

        if (!formData.time) {
            newErrors.time = 'Выберите время';
        }

        if (showErrors) {
            setErrors(newErrors);
        }
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(() => {
        if (validateForm()) {
            if (isTelegram) {
                window.Telegram.WebApp.sendData(JSON.stringify(formData));
            } else {
                console.log('Форма отправлена:', formData);
                alert('Форма успешно отправлена!');
            }
        }
    }, [formData, isTelegram, validateForm]);

    useEffect(() => {
        // Проверяем, запущено ли приложение в Telegram
        if (window.Telegram && window.Telegram.WebApp) {
            setIsTelegram(true);
            window.Telegram.WebApp.ready();

            // Предзаполнение имени из данных Telegram
            const user = window.Telegram.WebApp.initDataUnsafe.user;
            if (user) {
                const fullName = [user.first_name, user.last_name]
                    .filter(Boolean)
                    .join(' ');
                setFormData(prev => ({
                    ...prev,
                    name: fullName
                }));
            }

            // Настройка главной кнопки
            const mainButton = window.Telegram.WebApp.MainButton;
            mainButton.setText('Записаться');
            mainButton.onClick(handleSubmit);
        }
    }, [handleSubmit]);

    useEffect(() => {
        if (isTelegram) {
            const isValid = validateForm(false);
            const mainButton = window.Telegram.WebApp.MainButton;

            if (isValid) {
                mainButton.show();
            } else {
                mainButton.hide();
            }
        }
    }, [formData, isTelegram, validateForm]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-center">Запись в салон красоты</h2>
                <p className="text-center text-gray-600">Заполните форму для записи на процедуру</p>
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
                        className={`pl-10 w-full px-3 py-2 border rounded-md ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="+7XXXXXXXXXX"
                        className={`pl-10 w-full px-3 py-2 border rounded-md ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Scissors className="h-5 w-5 text-gray-400"/>
                    </div>
                    <select
                        name="service"
                        className={`pl-10 w-full px-3 py-2 border rounded-md ${
                            errors.service ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={formData.service}
                        onChange={handleChange}
                    >
                        <option value="">Выберите услугу</option>
                        {services.map((service) => (
                            <option key={service} value={service}>
                                {service}
                            </option>
                        ))}
                    </select>
                    {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        type="date"
                        name="date"
                        className={`pl-10 w-full px-3 py-2 border rounded-md ${
                            errors.date ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        type="time"
                        name="time"
                        className={`pl-10 w-full px-3 py-2 border rounded-md ${
                            errors.time ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={formData.time}
                        onChange={handleChange}
                        min="09:00"
                        max="20:00"
                    />
                    {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                </div>

                <div className="relative">
                    <div className="absolute top-3 left-3">
                        <MessageSquare className="h-5 w-5 text-gray-400"/>
                    </div>
                    <textarea
                        name="comment"
                        placeholder="Ваш комментарий"
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                        value={formData.comment}
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