 document.addEventListener('DOMContentLoaded', function () {
        // Установим темную тему по умолчанию
        const body = document.body;
        const toggleButton = document.getElementById('theme-toggle');
        let isDarkTheme = true; // Тёмная тема по умолчанию

        function applyTheme() {
            if (isDarkTheme) {
                body.classList.add('dark-theme');
                toggleButton.textContent = "Смена на светлую тему";
            } else {
                body.classList.remove('dark-theme');
                toggleButton.textContent = "Смена на тёмную тему";
            }
        }

        function toggleTheme() {
            isDarkTheme = !isDarkTheme;
            applyTheme();
        }

        // Применим начальную тему при загрузке страницы
        applyTheme();

        // Привязка функции к кнопке переключения темы
        toggleButton.addEventListener('click', toggleTheme);

        // Анимация цветов GELIOS
        const letters = document.querySelectorAll("#animatedText span");
        const colorSet = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFBD33', '#9D33FF']; // Набор цветов

        function getRandomColor() {
            return colorSet[Math.floor(Math.random() * colorSet.length)];
        }

        function animateLetters() {
            letters.forEach((letter, index) => {
                setInterval(() => {
                    letter.style.color = getRandomColor(); // Присваиваем случайный цвет
                }, 500 + index * 100);  // Цвет меняется каждые полсекунды с небольшой задержкой для каждой буквы
            });
        }

        animateLetters();
    });

// Переопределяем стандартный alert
document.addEventListener("DOMContentLoaded", function() {
    // Переопределяем стандартный alert
    window.alert = function(message) {
        document.getElementById('alertMessage').innerText = message;
        document.getElementById('customAlert').style.display = 'flex';
    };

    // Обработка нажатия кнопки OK
    document.getElementById('alertOkButton').onclick = function() {
        document.getElementById('customAlert').style.display = 'none';
    };
});
