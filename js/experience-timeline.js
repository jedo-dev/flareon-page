/**
 * Управление модальным окном опыта работы
 * Открытие и закрытие модального окна с подробной информацией
 */

class ExperienceTimeline {
  constructor() {
    this.modal = null;
    this.closeBtn = null;
    this.overlay = null;
    this.title = null;
    this.description = null;
    this.experienceData = {};
    this.animations = [];
    this.eventHandlers = {
      click: [],
      keydown: []
    };
    this.init();
  }

  init() {
    this.setupExperienceData();
    this.initializeModal();
    this.setupEventListeners();
  }

  /**
   * Данные о опыте работы
   */
  setupExperienceData() {
    this.experienceData = {
      'rtk-sintez': {
        title: 'РТК-Синтез',
        responsibilities: [
          'Разработка клиентской части информационных систем',
          'Обогащение собственной ui-kit библиотеки',
          'Ревью кода коллег по смежным проектам'
        ],
        technologies: ['React', 'Redux Saga', 'RTK Query']
      },
      'sandbox': {
        title: 'Sandbox',
        responsibilities: [
          'Разработка клиентской части (Nuxt.js) системы для автоматизации работы кальянных и ресторанов',
          'Использование методологии FSD при написании компонентной базы с интернационализацией i18n'
        ],
        technologies: ['Nuxt', 'element-ui', 'i18n']
      },
      'click-group': {
        title: 'Click Group',
        problems: [
          'Использование классового подхода в написании React приложений, что осложняло разработку и поддержку кода',
          'Интеграция MobX для управления состоянием приложений'
        ],
        responsibilities: [
          'Реализация front end части (React, Nest.js) подсистемы автоматизации бизнес процессов с использованием BPMS систем (Camunda)',
          'Построение архитектуры клиентских решений',
          'Проведение code review и формирование задач в таск-трекере для команды из 3 человек',
          'Взаимодействие с Camunda, используя чистый API и Java Delegate',
          'Создание proxy backend с пагинацией, сортировкой и поиском, используя Nest.js для интеграций',
          'Совместная работа с аналитиками на стадии проектного решения для выстраивания макетов',
          'Проведение демо показов для ФЗ',
          'Настройка Docker Compose с использованием Docker и Nginx',
          'Настройка и мониторинг Sentry.io'
        ],
        achievements: [
          'Завершил три коммерческих проекта с использованием MobX, React и Ant Design',
          'Оптимизировал процессы автоматизации, что позволило сократить время на выполнение задач',
          'Успешно провел интеграцию и настройку Keycloak для управления аутентификацией на фронтенде',
          'Улучшил архитектуру клиентских решений, что повысило их производительность и управляемость'
        ],
        technologies: ['React', 'MobX', 'Ant Design', 'Nest.js', 'Docker', 'Nginx', 'Keycloak', 'Camunda', 'Sentry.io']
      },
      'almaz-antej': {
        title: 'НПО Алмаз-Антей',
        responsibilities: [
          'Оформление конструкторской документации и разработка печатных плат',
          'Разработка модуля автоматизации, который включал генерацию списка элементной базы из ASCII файла печатной платы на клиентской части',
          'Создание служебной записки и утверждающего листа. Реализована форма на клиентской части, собирающая данные и отправляющая их на бэкенд на PHP для генерации заполненного Word файла',
          'Модуль для сравнения упоминания элементной базы в сборочном чертеже со спецификацией из PDF файла, использующий регулярные выражения для проверки всех упоминаний на чертеже',
          'Работа с полифилами для обеспечения совместимости с IE9'
        ],
        results: [
          'Существенно повысил эффективность работы за счет автоматизации рутинных задач',
          'Разработал инструменты, которые сократили время на обработку конструкторской документации и уменьшили количество ошибок'
        ],
        technologies: ['React', 'PHP', 'Регулярные выражения', 'Полифилы для IE9']
      }
    };
  }

  /**
   * Инициализация модального окна
   */
  initializeModal() {
    this.modal = document.getElementById('experience-modal');
    this.closeBtn = document.getElementById('experience-modal-close-btn');
    this.overlay = this.modal?.querySelector('.modal-overlay');
    this.title = document.getElementById('experience-modal-title');
    this.description = document.getElementById('experience-modal-description');
  }

  /**
   * Настройка обработчиков событий
   */
  setupEventListeners() {
    // Обработчик клика на кнопки "Подробнее"
    const handleDetailsClick = (e) => {
      const btn = e.target.closest('.experience-details-btn');
      if (btn) {
        const experienceItem = btn.closest('.experience-item');
        const experienceId = experienceItem?.dataset.experience;
        if (experienceId) {
          this.openModal(experienceId);
        }
      }
    };
    document.addEventListener('click', handleDetailsClick);
    this.eventHandlers.click.push({ type: 'click', handler: handleDetailsClick });

    // Закрытие по кнопке
    if (this.closeBtn) {
      const handleCloseClick = () => this.closeModal();
      this.closeBtn.addEventListener('click', handleCloseClick);
      this.eventHandlers.click.push({ type: 'click', handler: handleCloseClick, element: this.closeBtn });
    }

    // Закрытие по клику на overlay
    if (this.overlay) {
      const handleOverlayClick = () => this.closeModal();
      this.overlay.addEventListener('click', handleOverlayClick);
      this.eventHandlers.click.push({ type: 'click', handler: handleOverlayClick, element: this.overlay });
    }

    // Закрытие по ESC
    const handleKeydown = (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
        this.closeModal();
      }
    };
    document.addEventListener('keydown', handleKeydown);
    this.eventHandlers.keydown.push({ type: 'keydown', handler: handleKeydown });
  }

  /**
   * Открытие модального окна
   */
  openModal(experienceId) {
    const data = this.experienceData[experienceId];
    if (!data || !this.modal) return;

    // Заполняем заголовок
    if (this.title) {
      this.title.textContent = data.title;
    }

    // Заполняем описание
    if (this.description) {
      this.description.innerHTML = this.buildModalContent(data);
    }

    // Показываем модальное окно
    // Скролл живет в .portfolio-container, а не в body — блокируем именно его
    this.modal.classList.add('active');
    const scroller = document.querySelector('.portfolio-container');
    if (scroller) scroller.style.overflow = 'hidden';

    // Анимация появления
    if (typeof anime !== 'undefined') {
      const anim = anime({
        targets: this.modal,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
      });
      this.animations.push(anim);
    }
  }

  /**
   * Закрытие модального окна
   */
  closeModal() {
    if (!this.modal || !this.modal.classList.contains('active')) return;

    // Анимация исчезновения
    if (typeof anime !== 'undefined') {
      const anim = anime({
        targets: this.modal,
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInQuad',
        complete: () => {
          this.modal.classList.remove('active');
          const scroller = document.querySelector('.portfolio-container');
          if (scroller) scroller.style.overflow = '';
        }
      });
      this.animations.push(anim);
    } else {
      this.modal.classList.remove('active');
      const scroller = document.querySelector('.portfolio-container');
      if (scroller) scroller.style.overflow = '';
    }
  }

  /**
   * Построение содержимого модального окна
   */
  buildModalContent(data) {
    let html = '<div class="experience-modal-content">';

    // Проблемы (если есть)
    if (data.problems) {
      html += `
        <div class="experience-modal-section">
          <h3>В первые дни работы выявил и решил следующие проблемы:</h3>
          <ul>
            ${data.problems.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // Обязанности
    if (data.responsibilities) {
      html += `
        <div class="experience-modal-section">
          <h3>Основные обязанности:</h3>
          <ul>
            ${data.responsibilities.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // Достижения (если есть)
    if (data.achievements) {
      html += `
        <div class="experience-modal-section">
          <h3>Достижения:</h3>
          <ul>
            ${data.achievements.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // Результаты (если есть)
    if (data.results) {
      html += `
        <div class="experience-modal-section">
          <h3>Результаты:</h3>
          <ul>
            ${data.results.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // Технологии
    if (data.technologies) {
      html += `
        <div class="experience-modal-section">
          <h3>Технологии:</h3>
          <div class="experience-modal-tech-list">
            ${data.technologies.map(tech => `<span class="experience-modal-tech-tag">${tech}</span>`).join('')}
          </div>
        </div>
      `;
    }

    html += '</div>';
    return html;
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
    this.eventHandlers.click.forEach(({ handler, element }) => {
      if (element) {
        element.removeEventListener('click', handler);
      } else {
        document.removeEventListener('click', handler);
      }
    });
    this.eventHandlers.keydown.forEach(({ handler }) => {
      document.removeEventListener('keydown', handler);
    });
  }
}

// Инициализация при загрузке страницы
let experienceTimelineInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  experienceTimelineInstance = new ExperienceTimeline();
});

// Очистка при выгрузке страницы
window.addEventListener('beforeunload', () => {
  if (experienceTimelineInstance) {
    experienceTimelineInstance.destroy();
  }
});

