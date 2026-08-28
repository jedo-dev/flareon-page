/**
 * Интерактивная лента проектов
 * Управление модальными окнами и слайдерами изображений
 */

class ProjectsTimeline {
  constructor() {
    this.modal = null;
    this.currentProject = null;
    this.currentSlideIndex = 0;
    this.animations = [];
    this.eventHandlers = {
      click: [],
      keydown: [],
      touchstart: null,
      touchend: null
    };
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeModal();
  }

  /**
   * Настройка обработчиков событий
   */
  setupEventListeners() {
    // Обработчики для кнопок открытия модального окна
    const handleExpandClick = (e) => {
      if (e.target.closest('.project-expand-btn')) {
        e.preventDefault();
        e.stopPropagation();
        const projectItem = e.target.closest('.project-timeline-item');
        this.openModal(projectItem);
      }
    };
    document.addEventListener('click', handleExpandClick);
    this.eventHandlers.click.push({ type: 'click', handler: handleExpandClick });

    // Обработчики для модального окна
    const handleModalClick = (e) => {
      if (e.target.closest('#modal-close-btn') || e.target.closest('.modal-overlay')) {
        e.preventDefault();
        e.stopPropagation();
        this.closeModal();
      }
    };
    document.addEventListener('click', handleModalClick);
    this.eventHandlers.click.push({ type: 'click', handler: handleModalClick });

    // Обработчики для слайдера в модальном окне
    const handleSliderClick = (e) => {
      if (e.target.closest('.modal-slider-btn')) {
        e.preventDefault();
        e.stopPropagation();
        const direction = e.target.classList.contains('modal-slider-prev') ? -1 : 1;
        this.navigateModalSlider(direction);
      }

      if (e.target.closest('.modal-dot')) {
        e.preventDefault();
        e.stopPropagation();
        const dotIndex = Array.from(document.querySelectorAll('.modal-dot')).indexOf(e.target);
        this.goToModalSlide(dotIndex);
      }
    };
    document.addEventListener('click', handleSliderClick);
    this.eventHandlers.click.push({ type: 'click', handler: handleSliderClick });

    // Закрытие по Escape
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    };
    document.addEventListener('keydown', handleKeydown);
    this.eventHandlers.keydown.push({ type: 'keydown', handler: handleKeydown });

    // Обработка касаний для мобильных устройств
    this.setupTouchEvents();
  }

  /**
   * Инициализация модального окна
   */
  initializeModal() {
    this.modal = document.getElementById('project-modal');
    if (!this.modal) {
      console.error('Modal element not found');
      return;
    }
  }

  /**
   * Настройка событий касания для мобильных устройств
   */
  setupTouchEvents() {
    // null, а не 0 — координата 0 (край экрана) это валидная точка старта свайпа
    let startX = null;
    let startY = null;

    const handleTouchStart = (e) => {
      if (this.modal && this.modal.classList.contains('active')) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e) => {
      if (!this.modal || !this.modal.classList.contains('active') || startX === null || startY === null) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Проверяем, что это горизонтальный свайп
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        const direction = diffX > 0 ? 1 : -1;
        this.navigateModalSlider(direction);
      }

      startX = null;
      startY = null;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    this.eventHandlers.touchstart = handleTouchStart;
    this.eventHandlers.touchend = handleTouchEnd;
  }

  /**
   * Открытие модального окна
   */
  openModal(projectItem) {
    this.currentProject = projectItem;
    this.currentSlideIndex = 0;

    // Получаем данные проекта
    const projectData = this.getProjectData(projectItem);

    // Заполняем модальное окно данными
    this.populateModal(projectData);

    // Показываем модальное окно
    // Скролл живет в .portfolio-container, а не в body — блокируем именно его
    this.modal.classList.add('active');
    const scroller = document.querySelector('.portfolio-container');
    if (scroller) scroller.style.overflow = 'hidden';

    // Анимация появления
    const anim = anime({
      targets: this.modal,
      opacity: [0, 1],
      duration: 300,
      easing: 'easeOutQuad'
    });
    this.animations.push(anim);
  }

  /**
   * Закрытие модального окна
   */
  closeModal() {
    if (!this.modal || !this.modal.classList.contains('active')) return;

    // Анимация скрытия
    const anim = anime({
      targets: this.modal,
      opacity: [1, 0],
      duration: 200,
      easing: 'easeInQuad',
      complete: () => {
        this.modal.classList.remove('active');
        const scroller = document.querySelector('.portfolio-container');
        if (scroller) scroller.style.overflow = '';
        this.currentProject = null;
        this.currentSlideIndex = 0;
      }
    });
    this.animations.push(anim);
  }

  /**
   * Получение данных проекта
   */
  getProjectData(projectItem) {
    const title = projectItem.querySelector('.project-preview-title').textContent;
    const description = projectItem.querySelector('.project-preview-description').textContent;
    const techTags = Array.from(projectItem.querySelectorAll('.tech-tag')).map(tag => tag.textContent);

    // Получаем детальную информацию из скрытых элементов
    const detailsElement = projectItem.querySelector('.project-details');
    let fullDescription = '';
    let features = [];
    let technologies = [];

    if (detailsElement) {
      const descElement = detailsElement.querySelector('.project-description-full p');
      if (descElement) {
        fullDescription = descElement.textContent;
      }

      const featuresList = detailsElement.querySelectorAll('.project-features li');
      features = Array.from(featuresList).map(li => li.textContent.trim());

      const techItems = detailsElement.querySelectorAll('.tech-item');
      technologies = Array.from(techItems).map(item => ({
        name: item.querySelector('span').textContent,
        logo: item.querySelector('.tech-logo').src
      }));
    }

    // Получаем изображения из слайдера
    const images = [];
    const sliderSlides = projectItem.querySelectorAll('.slider-slide img');
    sliderSlides.forEach(slide => {
      images.push({
        src: slide.src,
        alt: slide.alt
      });
    });

    return {
      title,
      description,
      fullDescription: fullDescription || description,
      features,
      technologies,
      images
    };
  }

  /**
   * Заполнение модального окна данными
   */
  populateModal(data) {
    // Заголовок
    document.getElementById('modal-title').textContent = data.title;

    // Описание
    document.getElementById('modal-description').textContent = data.fullDescription;

    // Функции
    const featuresList = document.getElementById('modal-features');
    featuresList.innerHTML = '';
    data.features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      featuresList.appendChild(li);
    });

    // Технологии
    const techGrid = document.getElementById('modal-tech-grid');
    techGrid.innerHTML = '';
    data.technologies.forEach(tech => {
      const techItem = document.createElement('div');
      techItem.className = 'modal-tech-item';
      techItem.innerHTML = `
        <img src="${tech.logo}" alt="${tech.name}" class="tech-logo">
        <span>${tech.name}</span>
      `;
      techGrid.appendChild(techItem);
    });

    // Слайдер изображений
    this.setupModalSlider(data.images);
  }

  /**
   * Настройка слайдера в модальном окне
   */
  setupModalSlider(images) {
    const sliderTrack = document.getElementById('modal-slider-track');
    const sliderDots = document.getElementById('modal-slider-dots');

    // Очищаем слайдер и сбрасываем сдвиг, оставшийся от прошлого проекта
    sliderTrack.innerHTML = '';
    sliderDots.innerHTML = '';
    sliderTrack.style.transform = 'translateX(0%)';

    // Добавляем слайды
    images.forEach((image, index) => {
      const slide = document.createElement('div');
      slide.className = 'modal-slider-slide';
      if (index === 0) slide.classList.add('active');
      slide.innerHTML = `<img src="${image.src}" alt="${image.alt}">`;
      sliderTrack.appendChild(slide);

      // Добавляем точки
      const dot = document.createElement('span');
      dot.className = 'modal-dot';
      if (index === 0) dot.classList.add('active');
      sliderDots.appendChild(dot);
    });

    this.currentSlideIndex = 0;
  }

  /**
   * Навигация по слайдеру в модальном окне
   */
  navigateModalSlider(direction) {
    const slides = document.querySelectorAll('.modal-slider-slide');
    const dots = document.querySelectorAll('.modal-dot');

    if (slides.length === 0) return;

    let newIndex = this.currentSlideIndex + direction;

    // Циклическая навигация
    if (newIndex < 0) {
      newIndex = slides.length - 1;
    } else if (newIndex >= slides.length) {
      newIndex = 0;
    }

    this.goToModalSlide(newIndex);
  }

  /**
   * Переход к конкретному слайду в модальном окне
   */
  goToModalSlide(slideIndex) {
    const slides = document.querySelectorAll('.modal-slider-slide');
    const dots = document.querySelectorAll('.modal-dot');
    const track = document.getElementById('modal-slider-track');

    if (slideIndex < 0 || slideIndex >= slides.length) return;

    // Убираем активный класс
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Добавляем активный класс
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');

    // Анимация перехода
    const translateX = -slideIndex * 100;
    const anim = anime({
      targets: track,
      translateX: `${translateX}%`,
      duration: 500,
      easing: 'easeOutCubic'
    });
    this.animations.push(anim);

    this.currentSlideIndex = slideIndex;
  }

  /**
   * Очистка ресурсов
   */
  destroy() {
    // Останавливаем все анимации
    this.animations.forEach(anim => {
      if (anim && typeof anim.pause === 'function') {
        anim.pause();
      }
    });
    this.animations = [];

    // Удаляем обработчики событий
    this.eventHandlers.click.forEach(({ handler }) => {
      document.removeEventListener('click', handler);
    });
    this.eventHandlers.keydown.forEach(({ handler }) => {
      document.removeEventListener('keydown', handler);
    });
    if (this.eventHandlers.touchstart) {
      document.removeEventListener('touchstart', this.eventHandlers.touchstart);
    }
    if (this.eventHandlers.touchend) {
      document.removeEventListener('touchend', this.eventHandlers.touchend);
    }
  }
}

// Инициализация при загрузке DOM
let projectsTimelineInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  projectsTimelineInstance = new ProjectsTimeline();
});

// Очистка при выгрузке страницы
window.addEventListener('beforeunload', () => {
  if (projectsTimelineInstance) {
    projectsTimelineInstance.destroy();
  }
});