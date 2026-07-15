/* ========================================
   СТИЛЬ & РЕЛАКС — JAVASCRIPT
   ======================================== */

(function () {
    'use strict';

    // ---------- Данные услуг ----------
    const servicesData = {
        hair: [
            { value: 'Женская стрижка', label: 'Женская стрижка — от 2 000 ₽' },
            { value: 'Мужская стрижка', label: 'Мужская стрижка — от 1 500 ₽' },
            { value: 'Окрашивание', label: 'Окрашивание — от 4 000 ₽' },
            { value: 'Укладка', label: 'Укладка — от 1 200 ₽' }
        ],
        massage: [
            { value: 'Классический массаж спины', label: 'Классический массаж спины (60 мин) — 2 500 ₽' },
            { value: 'Лимфодренажный массаж', label: 'Лимфодренажный массаж (90 мин) — 3 500 ₽' },
            { value: 'Массаж шейно-воротниковой зоны', label: 'Массаж шейно-воротниковой зоны (30 мин) — 1 800 ₽' },
            { value: 'Общий расслабляющий массаж', label: 'Общий расслабляющий массаж (90 мин) — 3 200 ₽' }
        ]
    };

    // ---------- Словари для названий месяцев ----------
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    // ========== DOM-элементы ==========
    const header = document.getElementById('header');
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const scrollTopBtn = document.getElementById('scrollTop');
    const bookingForm = document.getElementById('bookingForm');
    const bookingSuccess = document.getElementById('bookingSuccess');
    const serviceTypeSelect = document.getElementById('serviceType');
    const serviceSelect = document.getElementById('service');
    const masterSelect = document.getElementById('master');
    const calendarMonth = document.getElementById('calendarMonth');
    const calendarDays = document.getElementById('calendarDays');
    const calendarPrev = document.getElementById('calendarPrev');
    const calendarNext = document.getElementById('calendarNext');
    const bookingDateInput = document.getElementById('bookingDate');
    const bookingTimeSelect = document.getElementById('bookingTime');
    const reviewsSlider = document.getElementById('reviewsSlider');
    const reviewsDotsContainer = document.getElementById('reviewsDots');
    const resetFormBtn = document.getElementById('resetFormBtn');

    // ========== Состояние календаря ==========
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDate = null;

    // ========== Состояние слайдера отзывов ==========
    let currentReviewIndex = 0;
    let reviewsAutoplayInterval = null;
    const reviews = document.querySelectorAll('.reviews__slide');
    const totalReviews = reviews.length;

    // ========================================
    // ШАПКА: прокрутка и гамбургер-меню
    // ========================================

    // Изменение фона шапки при скролле
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // Гамбургер-меню
    burger.addEventListener('click', function () {
        burger.classList.toggle('active');
        nav.classList.toggle('open');
    });

    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.header__menu-link, .header__btn').forEach(function (link) {
        link.addEventListener('click', function () {
            burger.classList.remove('active');
            nav.classList.remove('open');
        });
    });

    // Закрытие меню при клике вне его области
    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target) && !burger.contains(e.target)) {
            burger.classList.remove('active');
            nav.classList.remove('open');
        }
    });

    // ========================================
    // ТАБЫ УСЛУГ
    // ========================================
    const tabs = document.querySelectorAll('.services__tab');
    const tabContents = document.querySelectorAll('.services__content');

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            // Убираем активный класс у всех табов
            tabs.forEach(function (t) { t.classList.remove('active'); });
            tabContents.forEach(function (c) { c.classList.remove('services__content--active'); });

            // Активируем нужный таб
            tab.classList.add('active');
            var tabId = 'tab-' + tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('services__content--active');
        });
    });

    // ========================================
    // КНОПКИ «ЗАПИСАТЬСЯ» В КАРТОЧКАХ УСЛУГ
    // ========================================
    document.querySelectorAll('.service-card__btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var serviceName = this.getAttribute('data-service');
            // Скроллим к форме
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });

            // Определяем тип услуги по названию
            var hairServices = ['Женская стрижка', 'Мужская стрижка', 'Окрашивание', 'Укладка'];
            if (hairServices.indexOf(serviceName) !== -1) {
                serviceTypeSelect.value = 'hair';
                updateServiceOptions('hair');
            } else {
                serviceTypeSelect.value = 'massage';
                updateServiceOptions('massage');
            }
            serviceSelect.value = serviceName;
        });
    });

    // ========================================
    // КНОПКИ «ЗАПИСАТЬСЯ К МАСТЕРУ»
    // ========================================
    document.querySelectorAll('.master-card__btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var masterName = this.getAttribute('data-master');
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
            // Устанавливаем выбранного мастера
            for (var i = 0; i < masterSelect.options.length; i++) {
                if (masterSelect.options[i].value === masterName) {
                    masterSelect.value = masterName;
                    break;
                }
            }
        });
    });

    // ========================================
    // ДИНАМИЧЕСКОЕ ОБНОВЛЕНИЕ СПИСКА УСЛУГ
    // ========================================
    function updateServiceOptions(type) {
        serviceSelect.innerHTML = '<option value="" disabled selected>Выберите услугу</option>';
        var items = servicesData[type] || [];
        items.forEach(function (item) {
            var option = document.createElement('option');
            option.value = item.value;
            option.textContent = item.label;
            serviceSelect.appendChild(option);
        });
    }

    serviceTypeSelect.addEventListener('change', function () {
        var type = this.value;
        if (type) {
            updateServiceOptions(type);
            clearFieldError(serviceSelect);
        } else {
            serviceSelect.innerHTML = '<option value="" disabled selected>Сначала выберите тип услуги</option>';
        }
    });

    // ========================================
    // КАЛЕНДАРЬ (чистый JS)
    // ========================================

    // Получение количества дней в месяце
    function getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    // Получение дня недели первого дня месяца (0 = воскресенье)
    function getFirstDayOfMonth(month, year) {
        var day = new Date(year, month, 1).getDay();
        // Преобразуем: 0(вс) → 6, 1(пн) → 0 и т.д.
        return day === 0 ? 6 : day - 1;
    }

    // Рендер календаря
    function renderCalendar() {
        calendarMonth.textContent = monthNames[currentMonth] + ' ' + currentYear;

        var daysInMonth = getDaysInMonth(currentMonth, currentYear);
        var firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        var html = '';

        // Пустые ячейки до первого дня
        for (var i = 0; i < firstDay; i++) {
            html += '<button type="button" class="calendar__day empty"></button>';
        }

        // Дни месяца
        for (var d = 1; d <= daysInMonth; d++) {
            var date = new Date(currentYear, currentMonth, d);
            date.setHours(0, 0, 0, 0);
            var isPast = date < today;
            var isToday = date.getTime() === today.getTime();
            var isSelected = selectedDate && date.getTime() === selectedDate.getTime();

            var classes = 'calendar__day';
            if (isPast) classes += ' disabled';
            if (isToday) classes += ' today';
            if (isSelected) classes += ' selected';

            html += '<button type="button" class="' + classes + '" data-date="' + currentYear + '-' + (currentMonth + 1) + '-' + d + '" ' + (isPast ? 'disabled' : '') + '>' + d + '</button>';
        }

        calendarDays.innerHTML = html;

        // Навешиваем обработчики на дни
        calendarDays.querySelectorAll('.calendar__day:not(.disabled):not(.empty)').forEach(function (dayBtn) {
            dayBtn.addEventListener('click', function () {
                var dateStr = this.getAttribute('data-date');
                var parts = dateStr.split('-');
                selectedDate = new Date(parts[0], parts[1] - 1, parts[2]);
                bookingDateInput.value = dateStr;
                renderCalendar();
                generateTimeSlots();
                clearFieldError(bookingDateInput);
            });
        });
    }

    // Кнопки переключения месяцев
    calendarPrev.addEventListener('click', function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    calendarNext.addEventListener('click', function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    // Начальный рендер календаря
    renderCalendar();

    // ========================================
    // ГЕНЕРАЦИЯ ВРЕМЕННЫХ СЛОТОВ
    // ========================================
    function generateTimeSlots() {
        bookingTimeSelect.innerHTML = '<option value="" disabled selected>Выберите время</option>';

        // Эмуляция доступных слотов (в реальном проекте — запрос к серверу)
        var slots = [
            '09:00', '09:30', '10:00', '10:30',
            '11:00', '11:30', '12:00', '12:30',
            '13:00', '13:30', '14:00', '14:30',
            '15:00', '15:30', '16:00', '16:30',
            '17:00', '17:30', '18:00', '18:30',
            '19:00', '19:30', '20:00', '20:30'
        ];

        // Случайно «заняем» некоторые слоты для реалистичности
        var seed = selectedDate ? selectedDate.getDate() : 1;
        var occupiedSlots = new Set();
        for (var i = 0; i < 6; i++) {
            var idx = (seed * (i + 3) * 7) % slots.length;
            occupiedSlots.add(idx);
        }

        slots.forEach(function (time, index) {
            if (!occupiedSlots.has(index)) {
                var option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                bookingTimeSelect.appendChild(option);
            }
        });
    }

    // ========================================
    // МАСКА ТЕЛЕФОНА
    // ========================================
    var phoneInput = document.getElementById('clientPhone');

    phoneInput.addEventListener('input', function (e) {
        var value = e.target.value.replace(/\D/g, '');

        // Если начинается с 8, заменяем на 7
        if (value.startsWith('8') && value.length > 1) {
            value = '7' + value.substring(1);
        }
        // Если не начинается с 7, добавляем
        if (!value.startsWith('7') && value.length > 0) {
            value = '7' + value;
        }

        var formatted = '+7';
        if (value.length > 1) {
            formatted += ' (' + value.substring(1, 4);
        }
        if (value.length > 4) {
            formatted += ') ' + value.substring(4, 7);
        }
        if (value.length > 7) {
            formatted += '-' + value.substring(7, 9);
        }
        if (value.length > 9) {
            formatted += '-' + value.substring(9, 11);
        }

        e.target.value = formatted;
    });

    // Обработка нажатия Backspace в пустом поле
    phoneInput.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && e.target.value.length <= 3) {
            e.target.value = '';
            e.preventDefault();
        }
    });

    // ========================================
    // ВАЛИДАЦИЯ ПОЛЕЙ ФОРМЫ
    // ========================================

    // Показать ошибку
    function showFieldError(input, message) {
        var errorEl = document.getElementById(input.id + 'Error');
        if (errorEl) {
            errorEl.textContent = message;
        }
        input.classList.add('error');
        input.classList.remove('success');
    }

    // Скрыть ошибку
    function clearFieldError(input) {
        var errorEl = document.getElementById(input.id + 'Error');
        if (errorEl) {
            errorEl.textContent = '';
        }
        input.classList.remove('error');
    }

    // Проверка email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Проверка телефона (минимум 11 цифр: +7 XXX XXX XX XX)
    function isValidPhone(phone) {
        var digits = phone.replace(/\D/g, '');
        return digits.length === 11;
    }

    // Валидация всей формы
    function validateForm() {
        var isValid = true;

        // Тип услуги
        if (!serviceTypeSelect.value) {
            showFieldError(serviceTypeSelect, 'Выберите тип услуги');
            isValid = false;
        } else {
            clearFieldError(serviceTypeSelect);
        }

        // Услуга
        if (!serviceSelect.value) {
            showFieldError(serviceSelect, 'Выберите услугу');
            isValid = false;
        } else {
            clearFieldError(serviceSelect);
        }

        // Мастер
        if (!masterSelect.value) {
            showFieldError(masterSelect, 'Выберите мастера');
            isValid = false;
        } else {
            clearFieldError(masterSelect);
        }

        // Дата
        if (!bookingDateInput.value) {
            showFieldError(bookingDateInput, 'Выберите дату');
            isValid = false;
        } else {
            clearFieldError(bookingDateInput);
        }

        // Время
        if (!bookingTimeSelect.value) {
            showFieldError(bookingTimeSelect, 'Выберите время');
            isValid = false;
        } else {
            clearFieldError(bookingTimeSelect);
        }

        // Имя
        var nameInput = document.getElementById('clientName');
        if (!nameInput.value.trim()) {
            showFieldError(nameInput, 'Введите ваше имя');
            isValid = false;
        } else if (nameInput.value.trim().length < 2) {
            showFieldError(nameInput, 'Имя должно содержать минимум 2 символа');
            isValid = false;
        } else {
            clearFieldError(nameInput);
        }

        // Телефон
        if (!isValidPhone(phoneInput.value)) {
            showFieldError(phoneInput, 'Введите корректный номер телефона');
            isValid = false;
        } else {
            clearFieldError(phoneInput);
        }

        // Email
        var emailInput = document.getElementById('clientEmail');
        if (!emailInput.value.trim()) {
            showFieldError(emailInput, 'Введите email');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showFieldError(emailInput, 'Введите корректный email');
            isValid = false;
        } else {
            clearFieldError(emailInput);
        }

        return isValid;
    }

    // ========================================
    // ОТПРАВКА ФОРМЫ
    // ========================================
    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateForm()) {
            // Прокручиваем к первому полю с ошибкой
            var firstError = bookingForm.querySelector('.form-group__input.error');
            if (firstError) {
                firstError.focus();
            }
            return;
        }

        // Собираем данные формы
        var formData = {
            serviceType: serviceTypeSelect.value,
            service: serviceSelect.value,
            master: masterSelect.value,
            date: bookingDateInput.value,
            time: bookingTimeSelect.value,
            name: document.getElementById('clientName').value.trim(),
            phone: phoneInput.value,
            email: document.getElementById('clientEmail').value.trim()
        };

        console.log('Данные формы:', formData);

        // Эмуляция отправки (имитация задержки сервера)
        var submitBtn = bookingForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;

        setTimeout(function () {
            // Показываем сообщение об успехе
            bookingForm.style.display = 'none';
            bookingSuccess.style.display = 'block';

            // Восстанавливаем кнопку
            submitBtn.textContent = 'Записаться';
            submitBtn.disabled = false;
        }, 1500);
    });

    // Кнопка «Записаться ещё раз»
    resetFormBtn.addEventListener('click', function () {
        bookingForm.reset();
        bookingForm.style.display = 'block';
        bookingSuccess.style.display = 'none';

        // Сброс динамических списков
        serviceSelect.innerHTML = '<option value="" disabled selected>Сначала выберите тип услуги</option>';
        bookingTimeSelect.innerHTML = '<option value="" disabled selected>Выберите дату</option>';
        selectedDate = null;
        currentMonth = new Date().getMonth();
        currentYear = new Date().getFullYear();
        renderCalendar();

        // Сброс стилей валидации
        bookingForm.querySelectorAll('.form-group__input').forEach(function (input) {
            input.classList.remove('error', 'success');
        });
        bookingForm.querySelectorAll('.form-group__error').forEach(function (error) {
            error.textContent = '';
        });
    });

    // ========================================
    // СЛАЙДЕР ОТЗЫВОВ
    // ========================================

    // Создаём точки навигации
    reviewsDotsContainer.innerHTML = '';
    for (var r = 0; r < totalReviews; r++) {
        var dot = document.createElement('button');
        dot.classList.add('reviews__dot');
        if (r === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', 'Отзыв ' + (r + 1));
        (function (index) {
            dot.addEventListener('click', function () {
                showReview(index);
                resetAutoplay();
            });
        })(r);
        reviewsDotsContainer.appendChild(dot);
    }

    function showReview(index) {
        // Убираем активный класс у всех слайдов
        reviews.forEach(function (slide) { slide.classList.remove('active'); });
        document.querySelectorAll('.reviews__dot').forEach(function (dot) { dot.classList.remove('active'); });

        // Активируем нужный слайд
        reviews[index].classList.add('active');
        document.querySelectorAll('.reviews__dot')[index].classList.add('active');
        currentReviewIndex = index;
    }

    // Стрелки навигации
    document.getElementById('reviewsPrev').addEventListener('click', function () {
        var newIndex = (currentReviewIndex - 1 + totalReviews) % totalReviews;
        showReview(newIndex);
        resetAutoplay();
    });

    document.getElementById('reviewsNext').addEventListener('click', function () {
        var newIndex = (currentReviewIndex + 1) % totalReviews;
        showReview(newIndex);
        resetAutoplay();
    });

    // Автоматическое перелистывание
    function startAutoplay() {
        reviewsAutoplayInterval = setInterval(function () {
            var newIndex = (currentReviewIndex + 1) % totalReviews;
            showReview(newIndex);
        }, 5000);
    }

    function resetAutoplay() {
        clearInterval(reviewsAutoplayInterval);
        startAutoplay();
    }

    startAutoplay();

    // ========================================
    // АНИМАЦИЯ ПОЯВЛЕНИЯ БЛОКОВ (Intersection Observer)
    // ========================================
    var fadeElements = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Анимация проигрывается один раз
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback для старых браузеров — показываем все элементы
        fadeElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // ========================================
    // КНОПКА «НАВЕРХ»
    // ========================================
    function handleScrollTop() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScrollTop, { passive: true });

    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========================================
    // ПЛАВНЫЙ СКРОЛЛ ДЛЯ ЯКОРНЫХ ССЫЛОК
    // (дополнительная обработка для старых браузеров)
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
                var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

})();
