// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Agent from '../components/Agent.jsx'

describe('Agent widget', () => {
  it('se deschide, trimite mesaj și afișează un răspuns', async () => {
    render(<Agent />)
    await userEvent.click(screen.getByLabelText('Asistent AI'))
    const input = screen.getByPlaceholderText('Scrie un mesaj…')
    await userEvent.type(input, 'cat costă?')
    await userEvent.click(screen.getByText('➤'))
    expect(await screen.findByText(/800/)).toBeInTheDocument()
  })
})
