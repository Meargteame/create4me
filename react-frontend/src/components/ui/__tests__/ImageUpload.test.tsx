import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../../test/utils/test-utils'
import ImageUpload from '../ImageUpload'

describe('ImageUpload', () => {
  it('should render upload button when no image', () => {
    const onChange = vi.fn()
    render(<ImageUpload value="" onChange={onChange} />)

    expect(screen.getByText('Upload')).toBeInTheDocument()
  })

  it('should display preview when image is provided', () => {
    const onChange = vi.fn()
    render(<ImageUpload value="https://example.com/image.jpg" onChange={onChange} />)

    const image = screen.getByAltText('Preview')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('should show error for invalid file type', async () => {
    const onChange = vi.fn()
    render(<ImageUpload value="" onChange={onChange} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('Please select an image file')).toBeInTheDocument()
    })
  })

  it('should show error for oversized file', async () => {
    const onChange = vi.fn()
    render(<ImageUpload value="" onChange={onChange} maxSize={1} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    // Create a file larger than 1MB
    const largeContent = new Array(2 * 1024 * 1024).fill('a').join('')
    const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' })

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('File size must be less than 1MB')).toBeInTheDocument()
    })
  })

  it('should call onChange when valid file is selected', async () => {
    const onChange = vi.fn()
    render(<ImageUpload value="" onChange={onChange} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })

    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: vi.fn(),
      onloadend: null as any,
      result: 'data:image/jpeg;base64,mockdata'
    }
    
    global.FileReader = vi.fn(() => mockFileReader) as any

    fireEvent.change(input, { target: { files: [file] } })

    // Trigger onloadend
    if (mockFileReader.onloadend) {
      mockFileReader.onloadend({} as any)
    }

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled()
    })
  })
})
