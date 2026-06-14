/**
 * FileUploader Component Tests
 * @balloo/core-ui
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FileUploader } from '../FileUploader';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Upload: ({ size }: { size: number }) => <svg data-testid="upload-icon" width={size} height={size} />,
  File: ({ size }: { size: number }) => <svg data-testid="file-icon" width={size} height={size} />,
  X: ({ size }: { size: number }) => <svg data-testid="x-icon" width={size} height={size} />,
  CheckCircle: ({ size }: { size: number }) => <svg data-testid="check-icon" width={size} height={size} />,
  AlertCircle: ({ size }: { size: number }) => <svg data-testid="alert-icon" width={size} height={size} />,
  Cloud: ({ size }: { size: number }) => <svg data-testid="cloud-icon" width={size} height={size} />,
  Image: ({ size }: { size: number }) => <svg data-testid="image-icon" width={size} height={size} />,
  Film: ({ size }: { size: number }) => <svg data-testid="film-icon" width={size} height={size} />,
  Music: ({ size }: { size: number }) => <svg data-testid="music-icon" width={size} height={size} />,
}));

describe('FileUploader', () => {
  const mockOnFileSelect = jest.fn();
  const mockOnFileUpload = jest.fn().mockResolvedValue({ success: true, url: 'https://example.com/file' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders file uploader with drop zone', () => {
    render(
      <FileUploader
        onFileSelect={mockOnFileSelect}
        onFileUpload={mockOnFileUpload}
      />
    );

    expect(screen.getByText(/перетащите файлы/i)).toBeInTheDocument();
    expect(screen.getByText(/выберите/i)).toBeInTheDocument();
    expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
  });

  it('shows max file size hint', () => {
    render(
      <FileUploader
        onFileSelect={mockOnFileSelect}
        onFileUpload={mockOnFileUpload}
        maxFileSize={26214400}
      />
    );

    expect(screen.getByText(/25 MB/i)).toBeInTheDocument();
  });

  it('shows accepted file types when provided', () => {
    render(
      <FileUploader
        onFileSelect={mockOnFileSelect}
        onFileUpload={mockOnFileUpload}
        acceptedTypes={['image/*', 'application/pdf']}
      />
    );

    expect(screen.getByText(/image\/\*, application\/pdf/i)).toBeInTheDocument();
  });

  it('handles file drop', async () => {
    render(
      <FileUploader
        onFileSelect={mockOnFileSelect}
        onFileUpload={mockOnFileUpload}
      />
    );

    const dropZone = screen.getByText(/перетащите файлы/i).closest('div');
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith([file]);
    });
  });

  it('handles file input selection', async () => {
    render(
      <FileUploader
        onFileSelect={mockOnFileSelect}
        onFileUpload={mockOnFileUpload}
      />
    );

    const fileInput = screen.getByTestId('upload-icon').closest('div')?.querySelector('input[type="file"]');
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    if (fileInput) {
      fireEvent.change(fileInput, {
        target: { files: [file] },
      });
    }

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith([file]);
    });
  });

  it('rejects file exceeding max size', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <FileUploader
        onFileSelect={mockOnFileSelect}
        onFileUpload={mockOnFileUpload}
        maxFileSize={1024} // 1KB
      />
    );

    const dropZone = screen.getByText(/перетащите файлы/i).closest('div');
    const largeFile = new File(['x'.repeat(2048)], 'large.pdf', { type: 'application/pdf' });

    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [largeFile],
      },
    });

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('слишком большой'));
      expect(mockOnFileSelect).not.toHaveBeenCalled();
    });

    alertMock.mockRestore();
  });

  it('shows upload progress', async () => {
    mockOnFileUpload.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve({ success: true, url: 'https://example.com/file' }), 100);
      });
    });

    render(
      <FileUploader
        onFileSelect={mockOnFileSelect}
        onFileUpload={mockOnFileUpload}
      />
    );

    const dropZone = screen.getByText(/перетащите файлы/i).closest('div');
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file],
      },
    });

    // Check if progress bar appears during upload
    await waitFor(() => {
      expect(screen.getByText(/test.pdf/i)).toBeInTheDocument();
    });
  });

  it('shows success state after upload', async () => {
    render(
      <FileUploader
        onFileSelect={mockOnFileSelect}
        onFileUpload={mockOnFileUpload}
      />
    );

    const dropZone = screen.getByText(/перетащите файлы/i).closest('div');
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });
  });

  it('shows error state on upload failure', async () => {
    mockOnFileUpload.mockResolvedValue({ success: false, error: 'Upload failed' });

    render(
      <FileUploader
        onFileSelect={mockOnFileSelect}
        onFileUpload={mockOnFileUpload}
      />
    );

    const dropZone = screen.getByText(/перетащите файлы/i).closest('div');
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    });
  });

  it('allows removing completed file', async () => {
    render(
      <FileUploader
        onFileSelect={mockOnFileSelect}
        onFileUpload={mockOnFileUpload}
      />
    );

    const dropZone = screen.getByText(/перетащите файлы/i).closest('div');
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/test.pdf/i)).toBeInTheDocument();
    });

    const removeButton = screen.getByTestId('x-icon').closest('button');
    fireEvent.click(removeButton!);

    expect(screen.queryByText(/test.pdf/i)).not.toBeInTheDocument();
  });

  it('shows Yandex Disk indicator', () => {
    render(
      <FileUploader
        onFileSelect={mockOnFileSelect}
        onFileUpload={mockOnFileUpload}
        uploadToYandexDisk={true}
      />
    );

    expect(screen.getByText(/яндекс.диск/i)).toBeInTheDocument();
  });

  it('hides Yandex Disk indicator when disabled', () => {
    render(
      <FileUploader
        onFileSelect={mockOnFileSelect}
        onFileUpload={mockOnFileUpload}
        uploadToYandexDisk={false}
      />
    );

    expect(screen.queryByText(/яндекс.диск/i)).not.toBeInTheDocument();
  });

  it('handles multiple files', async () => {
    render(
      <FileUploader
        onFileSelect={mockOnFileSelect}
        onFileUpload={mockOnFileUpload}
        maxFiles={10}
      />
    );

    const dropZone = screen.getByText(/перетащите файлы/i).closest('div');
    const file1 = new File(['content1'], 'file1.pdf', { type: 'application/pdf' });
    const file2 = new File(['content2'], 'file2.pdf', { type: 'application/pdf' });

    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file1, file2],
      },
    });

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith([file1, file2]);
    });
  });

  it('shows file count in queue header', async () => {
    render(
      <FileUploader
        onFileSelect={mockOnFileSelect}
        onFileUpload={mockOnFileUpload}
      />
    );

    const dropZone = screen.getByText(/перетащите файлы/i).closest('div');
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Загрузка файлов')).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    const { container } = render(
      <FileUploader
        onFileSelect={mockOnFileSelect}
        onFileUpload={mockOnFileUpload}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('FileUploader - Edge Cases', () => {
  const mockOnFileSelect = jest.fn();
  const mockOnFileUpload = jest.fn().mockResolvedValue({ success: true });

  it('handles empty file array', () => {
    render(
      <FileUploader
        onFileSelect={mockOnFileSelect}
        onFileUpload={mockOnFileUpload}
      />
    );

    const dropZone = screen.getByText(/перетащите файлы/i).closest('div');

    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [],
      },
    });

    expect(mockOnFileSelect).not.toHaveBeenCalled();
  });

  it('handles upload error gracefully', async () => {
    mockOnFileUpload.mockRejectedValue(new Error('Network error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <FileUploader
        onFileSelect={mockOnFileSelect}
        onFileUpload={mockOnFileUpload}
      />
    );

    const dropZone = screen.getByText(/перетащите файлы/i).closest('div');
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});
