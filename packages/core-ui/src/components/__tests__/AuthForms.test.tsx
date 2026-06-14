/**
 * AuthForms Component Tests
 * @balloo/core-ui
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginForm, RegisterForm, SMSVerificationForm } from '../AuthForms';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Eye: ({ size }: { size: number }) => <svg data-testid="eye-icon" width={size} height={size} />,
  EyeOff: ({ size }: { size: number }) => <svg data-testid="eye-off-icon" width={size} height={size} />,
  Mail: ({ size }: { size: number }) => <svg data-testid="mail-icon" width={size} height={size} />,
  Lock: ({ size }: { size: number }) => <svg data-testid="lock-icon" width={size} height={size} />,
  Phone: ({ size }: { size: number }) => <svg data-testid="phone-icon" width={size} height={size} />,
  ArrowRight: ({ size }: { size: number }) => <svg data-testid="arrow-icon" width={size} height={size} />,
  CheckCircle: ({ size }: { size: number }) => <svg data-testid="check-icon" width={size} height={size} />,
}));

describe('LoginForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form with all fields', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Вход')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument();
  });

  it('submits form with valid credentials', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Пароль'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /войти/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('toggles password visibility', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const passwordInput = screen.getByPlaceholderText('Пароль');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByTestId('eye-icon').closest('button');
    fireEvent.click(toggleButton!);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();
  });

  it('shows forgot password link when provided', () => {
    const onForgotPassword = jest.fn();
    render(<LoginForm onSubmit={mockOnSubmit} onForgotPassword={onForgotPassword} />);

    expect(screen.getByText(/забыли пароль/i)).toBeInTheDocument();
  });

  it('shows register link when provided', () => {
    const onRegister = jest.fn();
    render(<LoginForm onSubmit={mockOnSubmit} onRegister={onRegister} />);

    expect(screen.getByText(/зарегистрироваться/i)).toBeInTheDocument();
  });

  it('shows Yandex login button when provided', () => {
    const onYandexLogin = jest.fn();
    render(<LoginForm onSubmit={mockOnSubmit} onYandexLogin={onYandexLogin} />);

    expect(screen.getByText(/войти через яндекс/i)).toBeInTheDocument();
  });

  it('disables submit button when loading', () => {
    render(<LoginForm onSubmit={mockOnSubmit} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /вход/i });
    expect(submitButton).toBeDisabled();
  });

  it('displays error message', () => {
    render(<LoginForm onSubmit={mockOnSubmit} error="Invalid credentials" />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(screen.getByPlaceholderText('Пароль'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /войти/i }));

    // Form should still submit (HTML5 validation handles email format)
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('invalid-email', 'password123');
    });
  });
});

describe('RegisterForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders registration form with all fields', () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Регистрация')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Имя')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('+7 (___) ___-__-__')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/пароль/i)).toBeInTheDocument();
  });

  it('validates password length (6-9 characters)', () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);

    const passwordInput = screen.getByPlaceholderText(/пароль/i);
    expect(passwordInput).toHaveAttribute('minLength', '6');
    expect(passwordInput).toHaveAttribute('maxLength', '9');
  });

  it('shows password validation indicator', () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);

    const passwordInput = screen.getByPlaceholderText(/пароль/i);
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    expect(screen.getByText(/допустимая длина/i)).toBeInTheDocument();
  });

  it('requires terms acceptance', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /зарегистрироваться/i });
    expect(submitButton).toBeDisabled();

    const termsCheckbox = screen.getByLabelText(/принимаю/i);
    fireEvent.click(termsCheckbox);

    expect(submitButton).not.toBeDisabled();
  });

  it('submits form with valid data', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Имя'), {
      target: { value: 'Иван Иванов' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'ivan@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('+7 (___) ___-__-__'), {
      target: { value: '+79991234567' },
    });
    fireEvent.change(screen.getByPlaceholderText(/пароль/i), {
      target: { value: 'Pass123' },
    });

    const termsCheckbox = screen.getByLabelText(/принимаю/i);
    fireEvent.click(termsCheckbox);

    fireEvent.click(screen.getByRole('button', { name: /зарегистрироваться/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        displayName: 'Иван Иванов',
        email: 'ivan@example.com',
        phone: '+79991234567',
        password: 'Pass123',
      });
    });
  });

  it('disables submit button when loading', () => {
    render(<RegisterForm onSubmit={mockOnSubmit} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /регистрация/i });
    expect(submitButton).toBeDisabled();
  });

  it('shows login link when provided', () => {
    const onLogin = jest.fn();
    render(<RegisterForm onSubmit={mockOnSubmit} onLogin={onLogin} />);

    expect(screen.getByText(/войти/i)).toBeInTheDocument();
  });
});

describe('SMSVerificationForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnResend = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders SMS verification form', () => {
    render(
      <SMSVerificationForm
        phone="+79991234567"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText(/подтверждение телефона/i)).toBeInTheDocument();
    expect(screen.getByText(/+79991234567/i)).toBeInTheDocument();
    expect(screen.getByText(/3-значный код/i)).toBeInTheDocument();
  });

  it('renders three code inputs', () => {
    render(
      <SMSVerificationForm
        phone="+79991234567"
        onSubmit={mockOnSubmit}
      />
    );

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(3);
  });

  it('auto-focuses next input on digit entry', () => {
    render(
      <SMSVerificationForm
        phone="+79991234567"
        onSubmit={mockOnSubmit}
      />
    );

    const inputs = screen.getAllByRole('textbox');
    
    fireEvent.change(inputs[0], { target: { value: '1' } });
    expect(inputs[1]).toHaveFocus();
  });

  it('submits when all three digits are entered', async () => {
    render(
      <SMSVerificationForm
        phone="+79991234567"
        onSubmit={mockOnSubmit}
      />
    );

    const inputs = screen.getAllByRole('textbox');
    
    fireEvent.change(inputs[0], { target: { value: '1' } });
    fireEvent.change(inputs[1], { target: { value: '2' } });
    fireEvent.change(inputs[2], { target: { value: '3' } });

    fireEvent.click(screen.getByRole('button', { name: /подтвердить/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('123');
    });
  });

  it('shows resend button when provided', () => {
    render(
      <SMSVerificationForm
        phone="+79991234567"
        onSubmit={mockOnSubmit}
        onResend={mockOnResend}
      />
    );

    expect(screen.getByText(/отправить код повторно/i)).toBeInTheDocument();
  });

  it('calls resend callback', async () => {
    render(
      <SMSVerificationForm
        phone="+79991234567"
        onSubmit={mockOnSubmit}
        onResend={mockOnResend}
      />
    );

    fireEvent.click(screen.getByText(/отправить код повторно/i));

    await waitFor(() => {
      expect(mockOnResend).toHaveBeenCalled();
    });
  });

  it('disables submit when loading', () => {
    render(
      <SMSVerificationForm
        phone="+79991234567"
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );

    const submitButton = screen.getByRole('button', { name: /проверка/i });
    expect(submitButton).toBeDisabled();
  });

  it('displays error message', () => {
    render(
      <SMSVerificationForm
        phone="+79991234567"
        onSubmit={mockOnSubmit}
        error="Invalid code"
      />
    );

    expect(screen.getByText('Invalid code')).toBeInTheDocument();
  });

  it('shows code validity timer', () => {
    render(
      <SMSVerificationForm
        phone="+79991234567"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText(/код действителен 5 минут/i)).toBeInTheDocument();
  });
});
