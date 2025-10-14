import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce, useDebounce } from '../debounce'
import { renderHook, waitFor } from '@testing-library/react'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should debounce function calls', () => {
    const func = vi.fn()
    const debouncedFunc = debounce(func, 300)

    debouncedFunc()
    debouncedFunc()
    debouncedFunc()

    expect(func).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)

    expect(func).toHaveBeenCalledTimes(1)
  })

  it('should pass arguments to debounced function', () => {
    const func = vi.fn()
    const debouncedFunc = debounce(func, 300)

    debouncedFunc('test', 123)

    vi.advanceTimersByTime(300)

    expect(func).toHaveBeenCalledWith('test', 123)
  })

  it('should reset timer on subsequent calls', () => {
    const func = vi.fn()
    const debouncedFunc = debounce(func, 300)

    debouncedFunc()
    vi.advanceTimersByTime(200)
    debouncedFunc()
    vi.advanceTimersByTime(200)

    expect(func).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)

    expect(func).toHaveBeenCalledTimes(1)
  })
})

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 300 })

    expect(result.current).toBe('initial')

    vi.advanceTimersByTime(300)

    await waitFor(() => {
      expect(result.current).toBe('updated')
    })
  })
})
