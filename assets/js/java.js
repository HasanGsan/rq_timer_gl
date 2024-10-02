import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCX1ajKqt1Ix2qsk3-GSr2-48JU0nI1VQw",
    authDomain: "rqtimerboss.firebaseapp.com",
    projectId: "rqtimerboss",
    storageBucket: "rqtimerboss.appspot.com",
    messagingSenderId: "907343695862",
    appId: "1:907343695862:web:0eb2a14833cc80c83881d7",
    measurementId: "G-NGBXBPDTQ2"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


const bosses = ['archon', 'baks', 'voko', 'gt', 'dengur', 'destructor', 'ancient-ent', 'zveromor', 'koroleva', 'pruzhinka', 'shaman', 'hugo', 'edward', 'zt', 'ypir-kont', 'ypir-kat', 'ypir-tanc', 'pojir-moz', 'pojir-el', 'sovetnik', 'plamyarik', 'kor-termit', 'faraon', 'hozyain1', 'hozyain2', 'orakyl', 'zs1', 'zs2', 'jyjelica', 'samec-vor', 'samec-yma', 'samec-les', 'samca', 'ireks', 'gbg', 'lakysha', 'kp', 'kb1', 'kb2', 'kor-ternia', 'volk', 'tr-kris', 'vdova', 'slepo-krc', 'slepo-tym'];


window.startTimer = function (boss, respawnTime) {
    const bossRef = ref(database, `bosses/${boss}`);
    const currentTime = Math.floor(Date.now() / 1000); // текущее время в секундах

    onValue(bossRef, (snapshot) => {
        const data = snapshot.val();

        // Проверяем, если босс уже убит и его таймер не истек, просто обновляем интерфейс
        if (data && data.isAlive) {
            const remainingTime = (data.killTime + data.respawnTime) - currentTime;
            if (remainingTime > 0) {
                document.getElementById(`${boss}-btn`).disabled = true;
                countdown(boss, data.killTime, data.respawnTime);
                return; // Выходим, если таймер уже идет
            } else {
                resetBoss(boss); // Если таймер истек, сбрасываем босса
                return;
            }
        }

        // Если босс не был убит, начинаем новый таймер
        set(bossRef, {
            isAlive: true,
            respawnTime: respawnTime,
            killTime: currentTime
        }).then(() => {
            document.getElementById(`${boss}-btn`).disabled = true;
            countdown(boss, currentTime, respawnTime);
        }).catch((error) => {
            console.error("Ошибка при записи в Firebase: ", error);
        });
    }, {
        onlyOnce: true
    }); // Обработка срабатывает только один раз
};


function playVoiceMessage(message) {
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = 'ru-RU';  // Устанавливаем язык (русский)
    speech.pitch = 1;       // Высота тона
    speech.rate = 1;        // Скорость речи
    speechSynthesis.speak(speech);
}

// Функция обратного отсчёта
const timerIntervals = {};

// Функция обратного отсчёта
//window.countdown = function (boss, killTime, respawnTime) {
//    const timerElement = document.getElementById(`${boss}-timer`);
//
//    // Если таймер уже запущен, очищаем его
//    if (timerIntervals[boss]) {
//        clearInterval(timerIntervals[boss]);
//    }
//
//    timerIntervals[boss] = setInterval(() => {
//        const currentTime = Math.floor(Date.now() / 1000);
//        const remainingTime = (killTime + respawnTime) - currentTime;
//
//        if (remainingTime <= 0) {
//            clearInterval(timerIntervals[boss]);
//            delete timerIntervals[boss]; // Удаляем таймер из объекта
//            resetBoss(boss);
//            return;
//        }
//
//        const hours = Math.floor(remainingTime / 3600);
//        const minutes = Math.floor((remainingTime % 3600) / 60);
//        const seconds = remainingTime % 60;
//
//        timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//    }, 1000);
//}

//window.countdown = function (boss, killTime, respawnTime) {
//    const timerElement = document.getElementById(`${boss}-timer`);
//    const bossName = boss.charAt(0).toUpperCase() + boss.slice(1);  // Формируем имя босса с заглавной буквы
//
//    // Если таймер уже запущен, очищаем его
//    if (timerIntervals[boss]) {
//        clearInterval(timerIntervals[boss]);
//    }
//
//    let fiveMinutesAlerted = false;  // Флаг для 5-минутного предупреждения
//    let respawnAlerted = false;      // Флаг для предупреждения о респауне
//
//    timerIntervals[boss] = setInterval(() => {
//        const currentTime = Math.floor(Date.now() / 1000);
//        const remainingTime = (killTime + respawnTime) - currentTime;
//
//        if (remainingTime <= 0) {
//            if (!respawnAlerted) {
//                playVoiceMessage(`Монстр ${bossName} возродился!`);
//                respawnAlerted = true;  // Устанавливаем флаг, чтобы оповещение проигрывалось только один раз
//            }
//            clearInterval(timerIntervals[boss]);
//            delete timerIntervals[boss]; // Удаляем таймер из объекта
//            resetBoss(boss);
//            return;
//        }
//
//        const hours = Math.floor(remainingTime / 3600);
//        const minutes = Math.floor((remainingTime % 3600) / 60);
//        const seconds = remainingTime % 60;
//
//        // Обновляем отображение таймера
//        timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//
//        // Предупреждение за 5 минут до респауна
//        if (remainingTime <= 300 && !fiveMinutesAlerted) {
//            playVoiceMessage(`Монстр ${bossName} возродится через 5 минут.`);
//            fiveMinutesAlerted = true;  // Устанавливаем флаг, чтобы оповещение проигрывалось только один раз
//        }
//    }, 1000);
//}


window.countdown = function (boss, killTime, respawnTime) {
    const timerElement = document.getElementById(`${boss}-timer`);
    
    const bossRow = document.getElementById(`${boss}-row`);
    const bossNameElement = bossRow.querySelector('.boss-name');
    const bossName = bossNameElement ? bossNameElement.textContent : boss;

    if (timerIntervals[boss]) {
        clearInterval(timerIntervals[boss]);
    }

    let fiveMinutesAlerted = false;  // Флаг для 5-минутного предупреждения
    let respawnAlerted = false;      // Флаг для предупреждения о респауне

    timerIntervals[boss] = setInterval(() => {
        const currentTime = Math.floor(Date.now() / 1000);
        const remainingTime = (killTime + respawnTime) - currentTime;

        if (remainingTime <= 0) {
            if (!respawnAlerted) {
                playVoiceMessage(`Монстр ${bossName} возродился!`);
                respawnAlerted = true;  // Устанавливаем флаг, чтобы оповещение проигрывалось только один раз
            }
            clearInterval(timerIntervals[boss]);
            delete timerIntervals[boss];
            resetBoss(boss);
            return;
        }

        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;

        timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Предупреждение за 5 минут до респауна
        if (remainingTime <= 300 && !fiveMinutesAlerted) {
            playVoiceMessage(`Монстр ${bossName} возродится через 5 минут.`);
            fiveMinutesAlerted = true;  // Устанавливаем флаг, чтобы оповещение проигрывалось только один раз
        }
    }, 1000);
}

// Функция сброса босса после окончания таймера
window.resetBoss = function (boss) {
    const bossRef = ref(database, `bosses/${boss}`);

    set(bossRef, {
        isAlive: false,
        respawnTime: 0,
        killTime: null
    });

    document.getElementById(`${boss}-timer`).textContent = "00:00:00";
    document.getElementById(`${boss}-btn`).disabled = false;

    // Сброс флагов для повторного использования
    fiveMinutesAlerted = false;  // Сбрасываем флаг для 5-минутного предупреждения
    respawnAlerted = false;      // Сбрасываем флаг для предупреждения о респауне
}


// Слушаем изменения в базе данных и обновляем интерфейс для всех пользователей
bosses.forEach(boss => {
    const bossRef = ref(database, `bosses/${boss}`);
    onValue(bossRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            document.getElementById(`${boss}-btn`).disabled = data.isAlive;
            if (data.isAlive) {
                // Вычисляем оставшееся время до спавна
                const remainingTime = (data.killTime + data.respawnTime) - Math.floor(Date.now() / 1000);
                if (remainingTime > 0) {
                    countdown(boss, data.killTime, data.respawnTime);
                } else {
                    resetBoss(boss); // сбрасываем босса, если время вышло
                }
            } else {
                // Сбрасываем текст таймера, если босс не жив
                document.getElementById(`${boss}-timer`).textContent = "00:00:00";
                // Очищаем таймер, если он существует
                if (timerIntervals[boss]) {
                    clearInterval(timerIntervals[boss]);
                    delete timerIntervals[boss]; // Удаляем таймер из объекта
                }
            }
        }
    });
});




// ФУНКЦИЯ ДЛЯ ПРОВЕРКИ АВТОРИЗАЦИИ

// Проверка сессии на странице таймера
// Функция для проверки авторизации
function checkSessionOnTimerPage() {
    const sessionData = JSON.parse(localStorage.getItem('userSession'));
    const welcomeMessage = document.getElementById('welcomeMessage');
    const authLogName = document.getElementById('auth_log_name');

    if (sessionData) {
        const userLevel = sessionData.level; // Получаем уровень пользователя

        // Проверяем уровень доступа
        if (userLevel === 2) {
            // Пользователь level 2 - доступ только к таймеру
            const now = new Date();
            const expiry = new Date(sessionData.expiryDate);

            // Проверяем, истекла ли подписка для пользователя level 2
            if (now > expiry) {
                // Сессия истекла
                localStorage.removeItem('userSession');
                alert("Ваша подписка истекла. Пожалуйста, авторизуйтесь заново.");
                window.location.href = "auth.html"; // Переход на страницу авторизации
            } else {
                // Сессия активна
                welcomeMessage.textContent = "Добро пожаловать, пользователь!";
                // Обрезаем логин для отображения
                const loginWithoutId = sessionData.login.split('_')[0];
                authLogName.textContent = `Вы авторизовались под: ${loginWithoutId}`; // Отображаем логин без ID
            }
        } else if (userLevel === 1) {
            // Администратор level 1 - доступ к таймеру и панели администратора
            welcomeMessage.textContent = "Добро пожаловать, администратор!";
            // Обрезаем логин для отображения
            const loginWithoutId = sessionData.login.split('_')[0];
            authLogName.textContent = `Ваш логин: ${loginWithoutId}`; // Отображаем логин без ID
            // Здесь можно добавить дополнительные действия для администратора, если необходимо
        } else {
            // Уровень доступа не определен
            alert("Ошибка доступа. Пожалуйста, свяжитесь с администратором.");
            window.location.href = "auth.html"; // Переход на страницу авторизации
        }
    } else {
        // Пользователь не авторизован
        alert("Вы не авторизованы. Пожалуйста, войдите в систему.");
        window.location.href = "auth.html"; // Переход на страницу авторизации
    }
}

// Обработчик события на загрузку страницы
document.addEventListener('DOMContentLoaded', () => {
    checkSessionOnTimerPage(); // Проверка сессии при загрузке страницы таймера
});

// Функция для выхода из системы
function logout() {
    localStorage.removeItem('userSession'); // Удаляем данные сессии
    alert("Вы вышли из системы.");
    window.location.href = "auth.html"; // Переход на страницу авторизации
}

// Обработчик события для кнопки выхода
document.getElementById('logoutButton').addEventListener('click', logout);



// Функция для показа модального окна отмены
window.showCancelDialog = function (boss) {
    const modal = document.getElementById('cancel-dialog');
    modal.style.display = 'block'; // Показываем диалог

    // При подтверждении отмены
    document.getElementById('confirm-cancel-btn').onclick = function () {
        modal.style.display = 'none'; // Закрываем диалог
        performCancelKill(boss); // Выполняем отмену таймера
    };

    // При отказе от отмены
    document.getElementById('deny-cancel-btn').onclick = function () {
        modal.style.display = 'none'; // Просто закрываем диалог
    };
};

// Функция отмены таймера с полной серверной обработкой
window.performCancelKill = function (boss) {
    const bossRef = ref(database, `bosses/${boss}`);

    // Сбрасываем статус босса и удаляем его данные в базе данных
    set(bossRef, {
        isAlive: false,
        respawnTime: 0,
        killTime: null
    }).then(() => {
        // Обновляем интерфейс для всех пользователей
        resetBoss(boss);
    }).catch((error) => {
        console.error("Ошибка при отмене таймера в Firebase: ", error);
    });
};

// Обновляем функцию для вызова диалога перед отменой
window.cancelKill = function (boss) {
    showCancelDialog(boss); // Показываем диалог
};

// Добавляем функцию для ручного ввода времени
window.manualTimeInput = function (boss) {
    // Получаем кнопку босса и его время респавна
    const bossButton = document.getElementById(`${boss}-btn`);
    const respawnTime = parseInt(bossButton.getAttribute('onclick').match(/startTimer\('.*?', (\d+)\)/)[1]);

    // Проверяем, жив ли босс
    if (bossButton.disabled) {
        alert("Этот босс уже убит. Пожалуйста, дождитесь его респавна.");
        return;
    }

    // Показываем модальное окно
    const modal = document.getElementById('manual-time-dialog');
    modal.style.display = 'block';

    const confirmInputBtn = document.getElementById('confirm-input-btn');
    const cancelInputBtn = document.getElementById('cancel-input-btn');
    const minutesInput = document.getElementById('minutes-input');

    // Подтверждение ввода
    confirmInputBtn.onclick = function () {
        const minutes = parseInt(minutesInput.value);

        // Проверка на пустой ввод и корректность
        if (isNaN(minutes) || minutes < 0) {
            alert("Пожалуйста, введите корректное количество минут.");
            return;
        }

        const totalSecondsEntered = minutes * 60; // Конвертируем введенные минуты в секунды

        // Проверяем, не превышает ли введенное время время респавна
        if (totalSecondsEntered > respawnTime) {
            alert(`Введите количество минут, не превышающее время респавна босса (${respawnTime / 60} минут).`);
            return;
        }

        // Вычисляем оставшееся время
        const timeLeft = respawnTime - totalSecondsEntered; // Вычисляем оставшееся время в секундах
        if (timeLeft < 0) {
            alert("Время респавна не может быть отрицательным. Пожалуйста, проверьте ввод.");
            return;
        }

        startTimer(boss, timeLeft); // Запускаем таймер с оставшимся временем

        // Блокировка кнопок
        bossButton.disabled = true; // Блокируем кнопку

        // Закрываем модальное окно
        modal.style.display = 'none';
    };

    // Отмена ввода
    cancelInputBtn.onclick = function () {
        modal.style.display = 'none'; // Закрываем модальное окно
    };
};


/// ФИЛЬТР БОССОВ И ЭЛИТ

const sessionData = JSON.parse(localStorage.getItem('userSession'));
const userId = sessionData ? sessionData.login : null;

// Функция для открытия модального окна
document.getElementById('settings-btn').addEventListener('click', () => {
    document.getElementById('boss-settings-modal').style.display = 'block';
    loadBossSettings();
});

// Закрытие модального окна (если необходимо)
window.onclick = function (event) {
    if (event.target == document.getElementById('boss-settings-modal')) {
        document.getElementById('boss-settings-modal').style.display = 'none';
    }
}

// Загрузка настроек боссов для текущего пользователя
function loadBossSettings() {
    if (!userId) return;

    // Ссылка на скрытые боссы пользователя в Firebase
    const userRef = ref(database, `contact_data/user/${userId}/hiddenBosses`);

    // Очистка списка перед генерацией
    const bossListElement = document.getElementById('boss-list');
    bossListElement.innerHTML = '';

    // Получение скрытых боссов из Firebase
    onValue(userRef, (snapshot) => {
        const hiddenBosses = snapshot.val() || [];

        // Генерация чекбоксов для каждого босса
        bosses.forEach(boss => {
            const bossRow = document.getElementById(`${boss}-row`);
            if (bossRow) {
                const bossName = bossRow.querySelector('.boss-name').textContent.trim(); // Имя босса на русском
                const bossImage = bossRow.querySelector('.boss-icon').src; // Путь к изображению босса
                const isChecked = hiddenBosses.includes(boss);

                const checkbox = `
                <label>
                    <input type="checkbox" name="boss" value="${boss}" ${isChecked ? 'checked' : ''}>
                    <img src="${bossImage}" width="30" height="30" style="vertical-align: middle; margin-right: 5px;"> ${bossName}
                </label><br>
                `;

                bossListElement.insertAdjacentHTML('beforeend', checkbox);
            }
        });
    });
}

// Сохранение настроек
document.getElementById('boss-settings-form').addEventListener('submit', (e) => {
    e.preventDefault();

    if (!userId) return;

    // Получение всех отмеченных чекбоксов
    const checkedBosses = Array.from(document.querySelectorAll('input[name="boss"]:checked'))
        .map(input => input.value);

    // Сохранение скрытых боссов в Firebase
    set(ref(database, `contact_data/user/${userId}/hiddenBosses`), checkedBosses)
        .then(() => {
            alert('Настройки успешно сохранены.');
            document.getElementById('boss-settings-modal').style.display = 'none';
            applyHiddenBosses(checkedBosses); // Применить изменения сразу на странице
        })
        .catch((error) => {
            console.error('Ошибка при сохранении настроек:', error);
        });
});

// Применение скрытых боссов на странице
function applyHiddenBosses(hiddenBosses) {
    bosses.forEach(boss => {
        const bossRow = document.querySelector(`#${boss}-row`); // Найти строку босса по ID
        if (bossRow) {
            bossRow.style.display = hiddenBosses.includes(boss) ? 'none' : ''; // Скрыть/показать
        }
    });
}

// Загрузка скрытых боссов при старте
function loadUserHiddenBosses() {
    if (!userId) return;

    const userRef = ref(database, `contact_data/user/${userId}/hiddenBosses`);
    onValue(userRef, (snapshot) => {
        const hiddenBosses = snapshot.val() || [];
        applyHiddenBosses(hiddenBosses);
    });
}

// Загрузка скрытых боссов при старте
document.addEventListener('DOMContentLoaded', loadUserHiddenBosses);
