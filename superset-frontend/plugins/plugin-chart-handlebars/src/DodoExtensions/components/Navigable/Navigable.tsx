// DODO created 49751291
import { t, styled } from '@superset-ui/core';
import { Tooltip } from '@superset-ui/chart-controls';
import { useRef, useState, useEffect } from 'react';
import NavigableOnboarding from './NavigableOnboarding';

const ZOOM_STEP_TOUCHPAD = 0.01;
const ZOOM_STEP_MOUSE = 0.05;
const PAN_MULTIPLIER = 1;

const Container = styled.div`
  overflow: auto;
  height: 100%;
  width: 100%;
`;

// Контейнер для элементов управления навигацией
const NavigationControls = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 8px;
  z-index: 1;
`;

// Стилизованный компонент для индикатора масштаба
const ZoomIndicator = styled.div`
  background: ${({ theme }) => theme.colors.grayscale.dark2};
  color: ${({ theme }) => theme.colors.grayscale.light5};
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 11px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  user-select: none;

  &:hover {
    opacity: 1;
  }
`;

// Стилизованный компонент для кнопки сброса
const ResetButton = styled.button`
  background: ${({ theme }) => theme.colors.primary.base};
  color: ${({ theme }) => theme.colors.grayscale.light5};
  border: none;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 11px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

export interface NavigableSafeMarkdownProps {
  children: React.ReactNode;
}

const isTouchpadScroll = (event: React.WheelEvent): boolean => {
  // Touchpad scrolls typically use pixel-based scrolling
  if (event.deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
    return Math.abs(event.deltaY) < 10; // mouse wheels usually have higher values
  }
  return false;
};

const Navigable: React.FC<NavigableSafeMarkdownProps> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [scale, setScale] = useState(1);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Функция для обработки начала перетаскивания
  const handleMouseDown = (e: React.MouseEvent) => {
    // Только при нажатии средней кнопки мыши (колесико) или при зажатом Alt/Command
    if (e.button === 1 || (e.button === 0 && (e.altKey || e.metaKey))) {
      e.preventDefault();

      if (contentRef.current) {
        contentRef.current.style.userSelect = 'none';
        contentRef.current.style.cursor = 'grab';
        setIsDragging(true);
        setStartX(e.pageX - contentRef.current.offsetLeft);
        setStartY(e.pageY - contentRef.current.offsetTop);
        setScrollLeft(contentRef.current.scrollLeft);
        setScrollTop(contentRef.current.scrollTop);
      }
    }
  };

  // Функция для обработки перетаскивания
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !contentRef.current) return;

    e.preventDefault();
    const x = e.pageX - contentRef.current.offsetLeft;
    const y = e.pageY - contentRef.current.offsetTop;

    // Определяем, насколько нужно прокрутить
    const walkX = (x - startX) * PAN_MULTIPLIER; // Множитель для скорости прокрутки
    const walkY = (y - startY) * PAN_MULTIPLIER;

    // Прокручиваем контент
    contentRef.current.scrollLeft = scrollLeft - walkX;
    contentRef.current.scrollTop = scrollTop - walkY;

    // Отмечаем, что произошла прокрутка
    if (!hasScrolled) {
      setHasScrolled(true);
    }
  };

  // Функция для обработки окончания перетаскивания и выхода мыши за пределы контейнера
  const handleStopDragging = () => {
    if (contentRef.current) {
      contentRef.current.style.cursor = 'auto';
      contentRef.current.style.userSelect = 'auto';
    }
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Обработчик события прокрутки колесика мыши для зумирования
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    // Если зажата клавиша Alt или Command, то изменяем масштаб
    if (e.altKey || e.metaKey) {
      if (!contentRef.current) return;

      // Сохраняем текущую позицию прокрутки и размеры контейнера
      const container = contentRef.current;
      const rect = container.getBoundingClientRect();

      // Получаем текущие значения прокрутки
      const currentScrollLeft = container.scrollLeft;
      const currentScrollTop = container.scrollTop;

      // Получаем позицию курсора относительно документа и контейнера
      const mouseX = e.clientX - rect.left + currentScrollLeft;
      const mouseY = e.clientY - rect.top + currentScrollTop;

      const ZOOM_STEP = isTouchpadScroll(e)
        ? ZOOM_STEP_TOUCHPAD
        : ZOOM_STEP_MOUSE;

      // Определяем направление прокрутки и изменяем масштаб
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      const oldScale = scale;
      const newScale = Math.max(0.1, Math.min(3, scale + delta)); // Ограничиваем масштаб от 0.1 до 3

      // Вычисляем новые позиции прокрутки, чтобы точка под курсором оставалась на месте
      const scaleFactor = newScale / oldScale;

      // Новая позиция = (старая позиция + позиция курсора) * коэффициент масштабирования - позиция курсора
      const newScrollLeft = mouseX * scaleFactor - (e.clientX - rect.left);
      const newScrollTop = mouseY * scaleFactor - (e.clientY - rect.top);

      // Устанавливаем новый масштаб и позиции прокрутки
      setScale(newScale);

      // Обновляем прокрутку сразу после изменения масштаба
      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.scrollLeft = newScrollLeft;
          contentRef.current.scrollTop = newScrollTop;

          // Обновляем состояние прокрутки
          setScrollLeft(newScrollLeft);
          setScrollTop(newScrollTop);
        }
      });

      // Отмечаем, что произошло зумирование
      if (!hasScrolled && newScale !== 1) {
        setHasScrolled(true);
      }
    }
  };

  // Обработчик двойного клика для сброса масштаба
  const handleResetZoom = () => {
    setScale(1);
    // При сбросе масштаба также сбрасываем прокрутку к началу
    if (contentRef.current) {
      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
          contentRef.current.scrollLeft = 0;

          // Обновляем состояние прокрутки
          setScrollLeft(0);
          setScrollTop(0);
        }
      });
    }
  };

  // Обработчик для сброса всех состояний
  const handleResetAll = () => {
    setScale(1);
    if (contentRef.current) {
      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
          contentRef.current.scrollLeft = 0;

          // Обновляем состояние прокрутки
          setScrollLeft(0);
          setScrollTop(0);
          setHasScrolled(false);
        }
      });
    } else {
      setHasScrolled(false);
    }
  };

  // Добавляем обработчики событий для клавиатуры
  useEffect(() => {
    // Флаг для отслеживания, была ли нажата клавиша Alt/Command
    let keyPressed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Используем пробел или Command (для Mac) или Alt (для Windows/Linux)
      if ((e.metaKey || e.altKey) && !keyPressed) {
        keyPressed = true;
        if (contentRef.current && !isDragging) {
          contentRef.current.style.userSelect = 'none';
          contentRef.current.style.cursor = 'grab';
        }
      }

      // Сброс масштаба и прокрутки по клавише Escape
      if (e.code === 'Escape' && (scale !== 1 || hasScrolled)) {
        setScale(1);
        if (contentRef.current) {
          requestAnimationFrame(() => {
            if (contentRef.current) {
              contentRef.current.scrollTop = 0;
              contentRef.current.scrollLeft = 0;

              // Обновляем состояние прокрутки
              setScrollLeft(0);
              setScrollTop(0);
              setHasScrolled(false);
            }
          });
        } else {
          setHasScrolled(false);
        }
      }

      // Увеличение масштаба по клавише "+" или "="
      if (
        (e.key === '+' || e.key === '=' || e.code === 'Equal') &&
        !e.altKey &&
        !e.metaKey
      ) {
        e.preventDefault();

        // Увеличиваем масштаб
        const newScale = Math.min(3, scale + ZOOM_STEP_MOUSE);

        if (newScale !== scale) {
          setScale(newScale);

          // Отмечаем, что произошло зумирование
          if (!hasScrolled && newScale !== 1) {
            setHasScrolled(true);
          }
        }
      }

      // Уменьшение масштаба по клавише "-"
      if (
        (e.key === '-' || e.key === '_' || e.code === 'Minus') &&
        !e.altKey &&
        !e.metaKey
      ) {
        e.preventDefault();

        // Уменьшаем масштаб
        const newScale = Math.max(0.1, scale - ZOOM_STEP_MOUSE);

        if (newScale !== scale) {
          setScale(newScale);

          // Отмечаем, что произошло зумирование
          if (!hasScrolled && newScale !== 1) {
            setHasScrolled(true);
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Используем пробел или Command (для Mac) или Alt (для Windows/Linux)
      if (e.code.startsWith('Meta') || e.code.startsWith('Alt')) {
        keyPressed = false;
        if (contentRef.current) {
          contentRef.current.style.cursor = 'auto';
          contentRef.current.style.userSelect = 'auto';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isDragging, scale, hasScrolled]);

  // Стили для масштабируемого контента
  const contentStyle: React.CSSProperties = {
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: scale === 1 ? '100%' : `${100 / scale}%`,
    height: 'auto',
    willChange: 'transform', // Оптимизация для плавного масштабирования
  };

  return (
    <Container
      ref={contentRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleStopDragging}
      onMouseLeave={handleStopDragging}
      onWheel={handleWheel}
      role="presentation"
      aria-label={t('Content with navigation')}
    >
      <div style={contentStyle}>{children}</div>
      <NavigationControls>
        {(scale !== 1 || hasScrolled) && (
          <Tooltip title={t('Reset view (Esc)')}>
            <ResetButton onClick={handleResetAll}>{t('Reset')}</ResetButton>
          </Tooltip>
        )}
        {scale !== 1 && (
          <Tooltip
            title={t('Double-click to reset zoom. Use +/- keys to zoom in/out')}
          >
            <ZoomIndicator onDoubleClick={handleResetZoom}>
              {Math.round(scale * 100)}%
            </ZoomIndicator>
          </Tooltip>
        )}
      </NavigationControls>

      <NavigableOnboarding />
    </Container>
  );
};

export default Navigable;
