import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Loading } from '../Loading'

describe('<Loading />', () => {
  it('рендерит текст индикатора', () => {
    render(<Loading />)
    // Используем неполный текст, чтобы не «спотыкаться» об символ многоточия
    expect(screen.getByText(/Загрузка данных/)).toBeInTheDocument()
  })

  it('имеет inline-стиль padding: 16px', () => {
    render(<Loading />)
    const el = screen.getByText(/Загрузка данных/)
    expect(el).toHaveStyle({ padding: '16px' })
  })
})
