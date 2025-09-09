// src/components/Legend.test.tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import {Legend} from './'

describe('<Legend />', () => {
  it('показывает все диапазоны', () => {
    const component = render(<Legend />)
    expect(component.getByText(/≤ 5 мин/)).toBeInTheDocument()
    expect(component.getByText(/5–15 мин/)).toBeInTheDocument()
    expect(component.getByText(/15–30 мин/)).toBeInTheDocument()
    expect(component.getByText(/> 30 мин/)).toBeInTheDocument()
  })
})
