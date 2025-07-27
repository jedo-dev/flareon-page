// let animation = anime({
//   // Цели
//   targets: '.text',
//   // Свойства
//   translateX: 250,
//   scale: 1,
//   rotate: '1turn',
//   // Параметры свойств
//   duration: 1000,
//   easing: 'linear',
//   // Параметры анимации
//   direction: 'alternate',
//   loop: true,
// });

document.addEventListener('DOMContentLoaded', function () {
  const starList = document.getElementById('star-list');
  let section1 = document.querySelector('.section-1');
  // Получаем размеры секции, а не всего окна


  const generateStars = () => {

    const { width, height } = section1.getBoundingClientRect();
    console.log(`current width and height`, width, height)
    const isMobile = width < 768;
    let sectionRect = section1.getBoundingClientRect();
    let centerX = sectionRect.width / 2;
    let centerY = sectionRect.height / 2;
    const radius = isMobile ? width * 0.7 : height * 0.5;
    const numberOfStars = isMobile ? 30 : 60
    for (let i = 0; i < numberOfStars; i++) {
      const angle = (i / numberOfStars) * Math.PI * 2;

      // Генерация координат внутри секции
      const x = centerX + radius * Math.cos(angle) + (Math.random() * 100 - 50);
      const y = centerY + radius * Math.sin(angle) + (Math.random() * 100 - 50);

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', `stars stars-${Math.floor(Math.random() * 3) + 1}`);
      svg.setAttribute('viewBox', '0 0 800 400');
      svg.setAttribute('height', '100px'); // Уменьшаем размер звезд
      svg.style.setProperty('--star-size', Math.floor(Math.random() * 3));
      svg.style.setProperty('--twinkle-delay', `${Math.floor(Math.random() * 3)}s`);
      svg.style.setProperty('--twinkle-duration', `${Math.floor(Math.random() * 3)}s`);
      // Позиционируем относительно секции
      svg.style.position = 'absolute';
      svg.style.left = `${x}px`;
      svg.style.top = `${y}px`;

      // Ограничиваем, чтобы звезды не выходили за границы
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

  generateStars(); // Увеличиваем радиус и количество звезд
  let resizeTimeout;

  console.log(`anime`, anime)
  // Функция для очистки и генерации
  const updateStars = () => {
    section1 = document.querySelector('.section-1');
    starList.innerHTML = ''; // Удаляем все старые звезды
    generateStars(); // Генерируем новые
    let animationStars = anime({
      // Цели
      targets: '.stars-1',
      // Свойства
      translateX: 10,
      scale: 1,
      rotate: '2turn',
      // Параметры свойств
      duration: 1000,
      easing: 'linear',
      // Параметры анимации
      direction: 'alternate',
      loop: true,
    });

    let animationStars2 = anime({
      // Цели
      targets: '.stars-2',
      // Свойства
      translateX: -100,
      scale: 1,
      rotate: '1turn',
      // Параметры свойств
      duration: 1000,
      easing: 'linear',
      // Параметры анимации
      direction: 'alternate',
      loop: true,
    });
    let animationStars3 = anime({
      // Цели
      targets: '.stars-3',
      // Свойства
      translateX: 100,
      scale: 1,
      rotate: '3turn',
      // Параметры свойств
      duration: 2000,
      easing: 'linear',
      // Параметры анимации
      direction: 'alternate',
      loop: true,
    });
  };

  // Первая загрузка
  updateStars();

  // Обработчик ресайза с debounce
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(updateStars, 200);
  });
  // generateStars(750, 30);
  // generateStars(1050, 30);
  // generateStars(250, 15);

  ///падающие звезды

  // window.addEventListener('scroll', function () {
  //   console.log('scroll');
  //   const scrollPosition = window.scrollY || window.pageYOffset; // Позиция скролла
  //   anime({
  //     // Запускаем анимацию превращения звезд в линию
  //     targets: '.stars',
  //     translateY: scrollPosition, // Преобразование в линию по вертикали
  //     // Преобразование в линию по горизонтали
  //     direction: 'alternate',
  //     duration: 1000, // Длительность анимации
  //     easing: 'linear',
  //   });
  // });

  // var myAnimation = anime({
  //   targets: ['.line-stars'],
  //   translateX: window.innerWidth,
  //   easing: 'linear',
  //   duration: 1000,
  //   delay: anime.stagger(100),
  //   loop: true,
  // });
  // var myAnimation = anime({
  //   targets: ['.line-stars-2'],
  //   translateX: window.innerWidth,
  //   easing: 'linear',
  //   duration: 1100,
  //   delay: anime.stagger(90),
  //   loop: true,
  // });

  var myAnimation = anime({
    targets: ['.line-stars-3', '.line-stars', '.line-stars-2'],
    translateX: window.innerWidth,
    easing: function (el, i, total) {
      return function (t) {
        return Math.pow(Math.sin(t * (i + 1)), 1);
      };
    },
    // duration: 4000,
    // delay: anime.stagger(70),
    loop: true,
  });

  var myAnimation = anime({
    targets: ['.vertical'],

    easing: 'linear',
    translateX: 50,
    translateY: 50,
    direction: 'alternate',
    duration: 900,

    loop: true,
  });

  var myAnimation12 = anime({
    // Цели
    targets: '.falling-star',
    // Начальная позиция (правый верхний угол)
    translateX: ['100vw', '-100vw'], // От правого края до левого
    translateY: ['-100vh', '100vh'], // От верхнего края до нижнего
    // Масштабирование от маленького к большому и обратно
    scale: [0.2, 1.5, 0],
    // Прозрачность (появление и исчезновение)
    opacity: [0, 1, 0],
    // Вращение

    // Длительность анимации
    duration: 6000,
    // Функция плавности
    easing: 'easeInOutQuad',
    // Бесконечный повтор
    loop: true,
    // Задержка перед повторением (по желанию)
    delay: function (el, i) {
      return i * 500; // Задержка для нескольких звезд
    }
  });

  var jupiter = anime({
    // Цели
    targets: '.jupiter',
    // Плавное покачивание вверх-вниз
    translateY: ['-200px', '-100px'],
    // Лёгкое колебание из стороны в сторону
    translateX: ['-70px', '-60px'],
    // Небольшое изменение масштаба
    scale: [0.98, 1.02],
    // Медленное вращение
    rotate: {
      value: 30,
      easing: 'linear'
    },
    // Настройки анимации
    duration: 8000, // Более медленная анимация для плавности
    easing: 'easeInOutSine', // Плавное ускорение/замедление
    direction: 'alternate', // Движение вперед-назад
    loop: true,
    // Небольшая случайная задержка для более естественного вида
    delay: anime.random(0, 2000)

  });

  const fly1Animation = anime({
    targets: '.fly-1',
    loop: true,
    opacity: [0, 1, 0],
    // translateY: ['0px', '-10px', '10px', '0px'], // Дрожание вверх-вниз
    // easing: 'easeInOutSine',
    duration: 1000,

  });
  const fly2Animation = anime({
    targets: '.fly-2',
    loop: true,
    opacity: [0, 1, 0],
    // translateY: ['0px', '-10px', '10px', '0px'], // Дрожание вверх-вниз
    // easing: 'easeInOutSine',
    duration: 1000,

  });
  // Инициализация анимации

const colors = ['#708ea7', '#7072a7', '#70a7a5', '#a78970']; // Ваша палитра
  const cardboardShake = (target) => {
    anime({
      targets: target,
      translateX: () => anime.random(-1, 1),
      translateY: () => anime.random(-1, 1),

     color: ()=>{
      let num= anime.random(0, 4)
      console.log(`num`,num,colors[num ])
      return colors[num]
     },

      rotate: () => anime.random(-1, 1),
      duration: () => anime.random(80, 120),
     
      easing: 'steps(10)', // Рваная анимация
      complete: () => cardboardShake(target) // Рекурсивный вызов
    });
  };

  cardboardShake('.text');
  cardboardShake('.text-2');
});

