import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

const { getSelectedFromId, setSelectedFromId, dispatchMock } = vi.hoisted(() => {
  let _selectedFromId: number | null = null
  const _dispatch = vi.fn()
  return {
    getSelectedFromId: () => _selectedFromId,
    setSelectedFromId: (v: number | null) => { _selectedFromId = v },
    dispatchMock: _dispatch,
  }
})

// Мокаем стор-хуки: селектор просто вернёт текущее значение из hoisted-стейта, диспатч — общая заглушка
vi.mock('../../store', () => ({
  useAppDispatch: () => dispatchMock,
  useAppSelector: (selector: any) => getSelectedFromId(), // сам selector не вызываем — нам важен результат
}))

// Мокаем селектор: сам по себе он не используется (мы перехватываем useAppSelector),
// но модуль импортируется компонентом, поэтому отдадим простую заглушку
vi.mock('../../store/uiSlice/selectors', () => ({
  selectFromIdSite: (_: unknown) => 0,
}))

// Мокаем экшен: хотим видеть понятный action-объект в диспетче
vi.mock('../../store/uiSlice', () => ({
  selectFrom: (payload: number | null) => ({ type: 'ui/selectFrom', payload }),
}))

// Мокаем Legend — визуально нам достаточно маркера
vi.mock('../Legend', () => ({
  Legend: () => <div data-testid="legend" />,
}))

// Мокаем тексты, чтобы тест не зависел от реальных строк
vi.mock('../../constants', () => ({
  SIDEBAR_TEXTS: {
    TITLE: 'Sidebar Title',
    INFO: 'Sidebar info text',
    BUTTON_TITLE: 'Reset selection',
    LEGEND_TITLE: 'Legend',
    DATA_INFO: 'Tiles: OpenStreetMap',
  },
}))

// Импортируем тестируемый компонент ПОСЛЕ моков
import { Sidebar } from './'

beforeEach(() => {
  // Сбрасываем состояние перед каждым тестом
  setSelectedFromId(null)
  dispatchMock.mockClear()
})

describe('<Sidebar />', () => {
  it('рендерит заголовки, описания и Legend; кнопка disabled когда выбранной точки нет', () => {
    render(<Sidebar />)

    expect(screen.getByRole('heading', { level: 1, name: 'Sidebar Title' })).toBeInTheDocument()
    expect(screen.getByText('Sidebar info text')).toBeInTheDocument()
    expect(screen.getByText('Legend')).toBeInTheDocument()
    expect(screen.getByTestId('legend')).toBeInTheDocument()
    expect(screen.getByText('Tiles: OpenStreetMap')).toBeInTheDocument()

    const btn = screen.getByRole('button', { name: 'Reset selection' })
    expect(btn).toBeDisabled()
  })

  it('кнопка активна при выбранной точке и по клику диспатчит selectFrom(null)', () => {
    setSelectedFromId(42) // эмулируем, что в сторах есть выбранная остановка

    render(<Sidebar />)

    const btn = screen.getByRole('button', { name: 'Reset selection' })
    expect(btn).toBeEnabled()

    fireEvent.click(btn)
    expect(dispatchMock).toHaveBeenCalledTimes(1)
    expect(dispatchMock).toHaveBeenCalledWith({ type: 'ui/selectFrom', payload: null })
  })
})
