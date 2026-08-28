/**
 * Орбитальный слайдер секции образования
 *
 * Секция растянута по высоте, внутренний экран прилипает (sticky).
 * Скролл выбирает только ЦЕЛЕВУЮ планету (ближайшую остановку),
 * а орбита сама плавно докручивается до нее — промежуточных
 * "зависших" состояний между планетами не бывает.
 *
 * Активная планета выходит вперед и заметно увеличивается,
 * остальные удаляются назад, уменьшаются и уходят в тень.
 * Текст активного образования появляется "из тени" (см. education.css).
 *
 * Работает и на десктопе, и на мобильных.
 * Выключается только при prefers-reduced-motion (статичная колонка).
 */

class EducationOrbit {
  constructor() {
    this.section = document.querySelector('.education-section');
    this.scroller = document.querySelector('.portfolio-container');
    if (!this.section || !this.scroller) return;

    this.sticky = this.section.querySelector('.education-sticky');
    this.scene = this.section.querySelector('.orbit-scene');
    this.planets = Array.from(this.section.querySelectorAll('.orbit-planet'));
    this.infos = Array.from(this.section.querySelectorAll('.education-info'));
    if (!this.sticky || !this.scene || this.planets.length === 0) return;

    // ===== КОНФИГУРАЦИЯ ОРБИТЫ =====
    this.config = {
      minScale: 0.22,      // Масштаб планеты в самой дальней точке орбиты
      maxScale: 1.5,       // Масштаб активной (передней) планеты
      minBrightness: 0.3,  // Затемнение дальней планеты
      maxBlur: 2.5,        // Размытие дальней планеты (px)
      snapSpeed: 4,        // Скорость докрутки к целевой планете (больше — быстрее)
      activeRange: 0.22,   // Насколько близко к остановке планета считается активной
      rxRatio: 0.36,       // Горизонтальный радиус орбиты как доля ширины сцены
      rxMax: 460           // Максимальный горизонтальный радиус (px)
    };

    this.rx = 0;
    this.ry = 70;
    this.position = 0;     // Текущая (анимируемая) позиция орбиты
    this.target = 0;       // Целевая остановка, выбранная скроллом
    this.rafId = null;
    this.lastTime = 0;
    this.activeIndex = -1;

    this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
    this.applyMode = this.applyMode.bind(this);
    this.step = this.step.bind(this);

    this.init();
  }

  init() {
    this.scroller.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize);
    this.reducedMotionQuery.addEventListener('change', this.applyMode);
    this.applyMode();
  }

  applyMode() {
    if (!this.reducedMotionQuery.matches) {
      this.section.classList.add('orbit-on');
      this.measure();
      this.syncTarget(true);
      this.render();
    } else if (this.section.classList.contains('orbit-on')) {
      this.section.classList.remove('orbit-on');
      this.resetStyles();
    }
  }

  /**
   * Сбрасывает инлайн-стили, выставленные орбитой (для статичного режима)
   */
  resetStyles() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.planets.forEach((planet) => {
      planet.style.transform = '';
      planet.style.filter = '';
      planet.style.zIndex = '';
    });
    this.infos.forEach((info) => info.classList.remove('active'));
    this.activeIndex = -1;
  }

  /**
   * Пересчитывает радиусы орбиты под текущий размер сцены
   */
  measure() {
    const sceneWidth = this.scene.clientWidth || this.sticky.clientWidth;
    this.rx = Math.min(sceneWidth * this.config.rxRatio, this.config.rxMax);
    this.scene.style.setProperty('--orbit-rx', `${Math.round(this.rx)}px`);

    const styles = getComputedStyle(this.scene);
    const ry = parseFloat(styles.getPropertyValue('--orbit-ry'));
    if (!Number.isNaN(ry)) {
      this.ry = ry;
    }
  }

  onScroll() {
    if (!this.section.classList.contains('orbit-on')) return;
    this.syncTarget();
  }

  onResize() {
    if (!this.section.classList.contains('orbit-on')) {
      this.applyMode();
      return;
    }
    this.measure();
    // После ресайза тот же scrollTop может означать другую остановку
    this.syncTarget();
    this.render();
  }

  /**
   * Прогресс скролла внутри секции: 0 — экран только прилип, 1 — сейчас отлипнет
   */
  getScrollProgress() {
    const rect = this.section.getBoundingClientRect();
    const scrollable = rect.height - this.sticky.clientHeight;
    if (scrollable <= 0) return 0;
    return Math.min(1, Math.max(0, -rect.top / scrollable));
  }

  /**
   * Скролл выбирает ближайшую остановку; орбита докручивается к ней сама
   */
  syncTarget(immediate = false) {
    const stops = this.planets.length - 1;
    const nextTarget = Math.round(this.getScrollProgress() * stops);

    if (immediate) {
      this.target = nextTarget;
      this.position = nextTarget;
      return;
    }

    if (nextTarget !== this.target) {
      this.target = nextTarget;
      this.startAnimation();
    }
  }

  startAnimation() {
    if (this.rafId !== null) return;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.step);
  }

  /**
   * Кадр докрутки: позиция экспоненциально приближается к цели.
   * Скорость задается snapSpeed и не зависит от частоты кадров монитора.
   */
  step(now) {
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    const diff = this.target - this.position;
    if (Math.abs(diff) < 0.001) {
      this.position = this.target;
      this.rafId = null;
      this.render();
      return;
    }

    this.position += diff * (1 - Math.exp(-dt * this.config.snapSpeed));
    this.render();
    this.rafId = requestAnimationFrame(this.step);
  }

  /**
   * Расставляет планеты по орбите и включает текст активной
   */
  render() {
    const count = this.planets.length;
    const angleStep = (Math.PI * 2) / count;
    const frontAngle = Math.PI / 2; // передняя точка орбиты — внизу эллипса

    this.planets.forEach((planet, i) => {
      const angle = frontAngle + (i - this.position) * angleStep;
      const depth = (Math.sin(angle) + 1) / 2; // 0 — дальняя точка, 1 — передняя

      const x = Math.cos(angle) * this.rx;
      const y = Math.sin(angle) * this.ry;
      const scale = this.config.minScale + (this.config.maxScale - this.config.minScale) * depth;
      const brightness = this.config.minBrightness + (1 - this.config.minBrightness) * depth;
      const blur = this.config.maxBlur * (1 - depth);

      planet.style.transform =
        `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) ` +
        `scale(${scale.toFixed(3)})`;
      planet.style.filter = `brightness(${brightness.toFixed(2)}) blur(${blur.toFixed(1)}px)`;
      planet.style.zIndex = String(1 + Math.round(depth * 40));
    });

    // Текст показываем, когда планета почти докрутилась до остановки
    const settled = Math.abs(this.position - this.target) < this.config.activeRange;
    const nextActive = settled ? this.target : -1;

    if (nextActive !== this.activeIndex) {
      this.activeIndex = nextActive;
      this.infos.forEach((info, i) => {
        info.classList.toggle('active', i === nextActive);
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new EducationOrbit();
});
