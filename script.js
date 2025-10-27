/**
 * Портфолио Александра Горбунова - Анимации и интерактивность
 * Использует библиотеку Anime.js для создания анимаций
 */

document.addEventListener('DOMContentLoaded', function () {
  // ===== ПЕРЕМЕННЫЕ И ЭЛЕМЕНТЫ =====
  const starList = document.getElementById('star-list');
  let section1 = document.querySelector('.hero-section');
  let resizeTimeout;

  // ===== ГЕНЕРАЦИЯ ЗВЕЗД =====
  /**
   * Генерирует анимированные звезды в первой секции
   * Адаптивно подстраивается под размер экрана
   */
  const generateStars = () => {
    const { width, height } = section1.getBoundingClientRect();
    const isMobile = width < 768;
    let sectionRect = section1.getBoundingClientRect();
    let centerX = sectionRect.width / 2;
    let centerY = sectionRect.height / 2;
    const radius = isMobile ? width * 0.7 : height * 0.5;
    const numberOfStars = isMobile ? 30 : 60;

    for (let i = 0; i < numberOfStars; i++) {
      const angle = (i / numberOfStars) * Math.PI * 2;
      const x = centerX + radius * Math.cos(angle) + (Math.random() * 100 - 50);
      const y = centerY + radius * Math.sin(angle) + (Math.random() * 100 - 50);

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', `star star-${Math.floor(Math.random() * 3) + 1}`);
      svg.setAttribute('viewBox', '0 0 800 400');
      svg.setAttribute('height', '100px');
      svg.style.setProperty('--star-size', Math.floor(Math.random() * 3));
      svg.style.setProperty('--twinkle-delay', `${Math.floor(Math.random() * 3)}s`);
      svg.style.setProperty('--twinkle-duration', `${Math.floor(Math.random() * 3)}s`);

      svg.style.position = 'absolute';
      svg.style.left = `${Math.max(20, Math.min(x, sectionRect.width - 20))}px`;
      svg.style.top = `${Math.max(20, Math.min(y, sectionRect.height - 20))}px`;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute(
        'd',
        'M261.4349670410156,180.26905822753906C272.60985661824543,182.79671155293784,314.42152211507164,195.97907351175945,336.77130126953125,197.30941772460938C359.12108042399086,198.6397619374593,400.2675772094727,196.02242479960123,412.1076354980469,189.2376708984375C423.9476937866211,182.45291699727377,421.78026295979816,159.55156679789226,416.5919189453125,151.5695037841797C411.40357493082684,143.5874407704671,388.8370608520508,138.35276649475097,377.1300354003906,135.42601013183594C365.42300994873045,132.4992537689209,344.5859363301595,138.3572468439738,337.66815185546875,131.83856201171875C330.750367380778,125.3198771794637,336.47983169555664,95.33781665802002,330.4932861328125,91.47982025146484C324.50674057006836,87.62182384490967,300.3692091878255,97.58146539052328,297.3094177246094,105.82959747314453C294.24962626139325,114.07772955576579,307.6038931274414,140.03438210805257,309.865478515625,147.085205078125C312.1270639038086,154.13602804819743,310.294475402832,145.78027549743652,312.5560607910156,153.3632354736328C314.81764617919924,160.9461954498291,320.98805836995444,188.09567253112792,325.11212158203125,198.20628356933594C329.23618479410806,208.31689460754396,333.97308553059895,214.87293940226238,340.3587341308594,221.524658203125C346.7443827311198,228.17637700398762,364.03737024943035,239.8565051015218,368.16143798828125,243.04933166503906',
      );
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#d0c896');
      path.setAttribute('stroke-width', '53');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-dasharray', '27 15');

      svg.appendChild(path);
      starList.appendChild(svg);
    }
  };

  // ===== ОБНОВЛЕНИЕ ЗВЕЗД =====
  /**
   * Очищает старые звезды и создает новые с анимацией
   */
  const updateStars = () => {
    section1 = document.querySelector('.hero-section');
    starList.innerHTML = '';
    generateStars();

    // Анимация для разных групп звезд
    anime({
      targets: '.star-1',
      translateX: 10,
      scale: 1,
      rotate: '2turn',
      duration: 1000,
      easing: 'linear',
      direction: 'alternate',
      loop: true,
    });

    anime({
      targets: '.star-2',
      translateX: -100,
      scale: 1,
      rotate: '1turn',
      duration: 1000,
      easing: 'linear',
      direction: 'alternate',
      loop: true,
    });

    anime({
      targets: '.star-3',
      translateX: 100,
      scale: 1,
      rotate: '3turn',
      duration: 2000,
      easing: 'linear',
      direction: 'alternate',
      loop: true,
    });
  };

  // ===== ИНИЦИАЛИЗАЦИЯ =====
  updateStars();

  // Обработчик ресайза с debounce
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateStars, 200);
  });

  // ===== АНИМАЦИИ ПАДАЮЩИХ ЗВЕЗД =====
  /**
   * Анимация падающих звезд в первой секции
   */
  anime({
    targets: ['.line-stars-3', '.line-stars', '.line-stars-2'],
    translateX: window.innerWidth,
    easing: function (el, i, total) {
      return function (t) {
        return Math.pow(Math.sin(t * (i + 1)), 1);
      };
    },
    loop: true,
  });

  // Анимация вертикальных элементов
  anime({
    targets: ['.vertical'],
    easing: 'linear',
    translateX: 50,
    translateY: 50,
    direction: 'alternate',
    duration: 900,
    loop: true,
  });

  // ===== АНИМАЦИЯ ПАДАЮЩИХ ЗВЕЗД =====
  /**
   * Анимация падающих звезд с эффектом появления и исчезновения
   */
  anime({
    targets: '.falling-star',
    translateX: ['100vw', '-100vw'],
    translateY: ['-100vh', '100vh'],
    scale: [0.2, 1.5, 0],
    opacity: [0, 1, 0],
    duration: 6000,
    easing: 'easeInOutQuad',
    loop: true,
    delay: function (el, i) {
      return i * 500;
    }
  });

  // ===== АНИМАЦИЯ ПЛАНЕТЫ ЮПИТЕР =====
  /**
   * Плавная анимация покачивания планеты Юпитер
   */
  anime({
    targets: '.jupiter',
    translateY: ['-200px', '-100px'],
    translateX: ['10px', '60px'],

    scale: [0.98, 1.02],
    rotate: {
      value: 30,
      easing: 'linear'
    },
    duration: 8000,
    easing: 'easeInOutSine',
    direction: 'alternate',
    loop: true,
    delay: anime.random(0, 2000)
  });


  anime({
    targets: '.ufo',
    translateY: ['0', '-100%'],
    translateX: ['0', '-100%'],

    scale: [0.98, 1.02],
    rotate: {
      value: 30,
      easing: 'linear'
    },
    duration: 8000,
    easing: 'easeInOutSine',
    direction: 'alternate',
    loop: true,
    delay: anime.random(0, 2000)
  });

  // ===== ЭФФЕКТ "ДРОЖАНИЯ" ДЛЯ ТЕКСТА =====
  /**
   * Создает эффект дрожания для текста (cardboard effect)
   * @param {string} target - CSS селектор элемента
   */
  const colors = ['#708ea7', '#7072a7', '#70a7a5', '#a78970'];
  const cardboardShake = (target) => {
    anime({
      targets: target,
      translateX: () => anime.random(-1, 1),
      translateY: () => anime.random(-1, 1),
      color: () => {
        let num = anime.random(0, 4);
        return colors[num];
      },
      rotate: () => anime.random(-1, 1),
      duration: () => anime.random(80, 120),
      easing: 'steps(10)',
      complete: () => cardboardShake(target)
    });
  };

  // Применяем эффект дрожания к тексту
  cardboardShake('.text-primary');
  cardboardShake('.text-secondary');

  // ===== ГЕНЕРАЦИЯ ПАДАЮЩИХ ЛИНИЙ ДЛЯ СЕКЦИИ ТЕХНОЛОГИЙ =====
  /**
   * Генерирует вертикальные линии, падающие сверху вниз
   * Создает эффект карандашной штриховки
   */

  /**
   * ===== КОНФИГУРАЦИЯ ЛИНИЙ =====
   * Можно изменять параметры для настройки эффекта:
   * 
   * numberOfLines - количество одновременно создаваемых линий
   * colors - массив цветов в HEX формате
   * minSpeed/maxSpeed - диапазон скорости падения в миллисекундах
   * minHeight/maxHeight - диапазон высоты линий в пикселях
   * spawnInterval - интервал появления новых линий
   * lineWidth - толщина линии
   */
  const lineConfig = {
    numberOfLines: 100,           // Количество линий на экране
    colors: ['#d0c896', '#9e7960', '#708ea7'],  // Три цвета для линий
    minSpeed: 200,              // Минимальная скорость анимации (мс)
    maxSpeed: 1000,              // Максимальная скорость анимации (мс)
    minHeight: 80,               // Минимальная высота линии
    maxHeight: 200,              // Максимальная высота линии
    spawnInterval: 100,          // Интервал появления новых линий (мс)
    lineWidth: 2,                // Толщина линии (px)
  };

  const generateFallingLines = () => {
    const technologiesSection = document.querySelector('.technologies-section');
    const starBackground = technologiesSection?.querySelector('.star-background');

    if (!starBackground) return;

    // Очищаем предыдущие линии
    starBackground.innerHTML = '';

    // Создаем функцию для генерации одной линии
    const createLine = () => {
      const line = document.createElement('div');
      line.classList.add('falling-line');

      // Случайная позиция по горизонтали
      const randomX = Math.random() * 100;
      line.style.left = `${randomX}%`;

      // Случайная высота линии
      const randomHeight = lineConfig.minHeight + Math.random() * (lineConfig.maxHeight - lineConfig.minHeight);
      line.style.height = `${randomHeight}px`;

      // Случайный цвет
      const randomColor = lineConfig.colors[Math.floor(Math.random() * lineConfig.colors.length)];
      line.style.backgroundColor = randomColor;
      line.style.boxShadow = `0 0 3px ${randomColor}`;

      // Толщина линии
      line.style.width = `${lineConfig.lineWidth}px`;

      // Небольшой горизонтальный сдвиг для неровности
      const randomOffset = (Math.random() - 0.5) * 3;
      line.style.setProperty('--shake-offset', `${randomOffset}px`);

      starBackground.appendChild(line);

      // Анимация через Anime.js
      const randomSpeed = lineConfig.minSpeed + Math.random() * (lineConfig.maxSpeed - lineConfig.minSpeed);

      const viewportHeight = window.innerHeight;
      const lineStartTop = -randomHeight;

      anime({
        targets: line,
        top: [lineStartTop, viewportHeight + 50],
        opacity: [
          { value: 0, duration: 0 },
          { value: 1, duration: 100 },
          { value: 1, duration: randomSpeed * 0.8 },
          { value: 0, duration: 200 }
        ],
        duration: randomSpeed,
        easing: 'linear',
        complete: () => {
          line.remove();
        }
      });

      // Дополнительная анимация дрожания
      anime({
        targets: line,
        translateX: [
          { value: () => anime.random(-2, 2), duration: 200 },
          { value: () => anime.random(-1.5, 1.5), duration: 200 },
          { value: () => anime.random(-2, 2), duration: 200 },
          { value: () => anime.random(-1, 1), duration: 200 },
          { value: () => anime.random(-2, 2), duration: 200 },
          { value: () => anime.random(-1.5, 1.5), duration: 200 },
        ],
        duration: randomSpeed * 0.5,
        easing: 'easeInOutSine',
        loop: true,
        direction: 'alternate'
      });
    };

    // Создаем начальные линии
    for (let i = 0; i < lineConfig.numberOfLines; i++) {
      const randomDelay = Math.random() * 2000;
      setTimeout(() => {
        createLine();
      }, randomDelay);
    }

    // Постоянно создаем новые линии
    const spawnLines = () => {
      createLine();
      setTimeout(spawnLines, lineConfig.spawnInterval);
    };

    // Запускаем постоянную генерацию
    setTimeout(spawnLines, lineConfig.spawnInterval);
  };

  // Запускаем генерацию линий
  generateFallingLines();
});