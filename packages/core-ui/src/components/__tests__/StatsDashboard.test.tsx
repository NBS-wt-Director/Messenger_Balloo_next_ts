/**
 * StatsDashboard Component Tests
 * @balloo/core-ui
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatsDashboard, SystemMetrics } from '../StatsDashboard';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  CPU: ({ size }: { size: number }) => <svg data-testid="cpu-icon" width={size} height={size} />,
  Memory: ({ size }: { size: number }) => <svg data-testid="memory-icon" width={size} height={size} />,
  Network: ({ size }: { size: number }) => <svg data-testid="network-icon" width={size} height={size} />,
  Database: ({ size }: { size: number }) => <svg data-testid="database-icon" width={size} height={size} />,
  HardDrive: ({ size }: { size: number }) => <svg data-testid="harddrive-icon" width={size} height={size} />,
  Activity: ({ size }: { size: number }) => <svg data-testid="activity-icon" width={size} height={size} />,
  AlertTriangle: ({ size }: { size: number }) => <svg data-testid="alert-icon" width={size} height={size} />,
}));

describe('StatsDashboard', () => {
  const mockMetrics: SystemMetrics = {
    cpuUsage: 45.5,
    memoryUsage: 4096,
    activeConnections: 1250,
    smsQueue: 5,
    dbLoad: 150,
    diskUsage: 125.5,
    uptime: 86400,
    errorRate: 0.5,
  };

  const defaultProps = {
    metrics: mockMetrics,
    refreshInterval: 5000,
  };

  it('renders dashboard with all metrics', () => {
    render(<StatsDashboard {...defaultProps} />);

    expect(screen.getByText('Системные метрики')).toBeInTheDocument();
    expect(screen.getByText(/CPU Usage/i)).toBeInTheDocument();
    expect(screen.getByText(/Memory Usage/i)).toBeInTheDocument();
    expect(screen.getByText(/Connections/i)).toBeInTheDocument();
    expect(screen.getByText(/DB Load/i)).toBeInTheDocument();
    expect(screen.getByText(/Disk Usage/i)).toBeInTheDocument();
    expect(screen.getByText(/SMS Queue/i)).toBeInTheDocument();
    expect(screen.getByText(/Error Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Uptime/i)).toBeInTheDocument();
  });

  it('displays correct CPU usage value', () => {
    render(<StatsDashboard {...defaultProps} />);

    expect(screen.getByText('45.5')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('displays memory usage in GB', () => {
    render(<StatsDashboard {...defaultProps} />);

    // 4096 MB = 4 GB
    expect(screen.getByText('4.00')).toBeInTheDocument();
    expect(screen.getByText('GB')).toBeInTheDocument();
  });

  it('formats uptime correctly', () => {
    render(<StatsDashboard {...defaultProps} />);

    // 86400 seconds = 24 hours = 1 day
    expect(screen.getByText('24ч 0м')).toBeInTheDocument();
  });

  it('shows warning status for high CPU usage', () => {
    const highCpuMetrics: SystemMetrics = {
      ...mockMetrics,
      cpuUsage: 75,
    };

    render(<StatsDashboard metrics={highCpuMetrics} />);

    const cpuCard = screen.getByText(/CPU Usage/i).closest('.metric-card');
    expect(cpuCard).toHaveClass('warning');
  });

  it('shows critical status for very high CPU usage', () => {
    const criticalCpuMetrics: SystemMetrics = {
      ...mockMetrics,
      cpuUsage: 95,
    };

    render(<StatsDashboard metrics={criticalCpuMetrics} />);

    const cpuCard = screen.getByText(/CPU Usage/i).closest('.metric-card');
    expect(cpuCard).toHaveClass('critical');
  });

  it('shows alert for critical system load', () => {
    const criticalMetrics: SystemMetrics = {
      ...mockMetrics,
      cpuUsage: 95,
    };

    render(<StatsDashboard metrics={criticalMetrics} />);

    expect(screen.getByText(/Критическая нагрузка на систему/i)).toBeInTheDocument();
  });

  it('displays last update time', () => {
    const { container } = render(<StatsDashboard {...defaultProps} />);

    const updateText = container.querySelector('.stats-last-update');
    expect(updateText).toBeInTheDocument();
    expect(updateText?.textContent).toContain('Обновлено:');
  });

  it('calls onRefresh callback on interval', async () => {
    const onRefreshMock = jest.fn();
    
    render(
      <StatsDashboard 
        {...defaultProps} 
        refreshInterval={100}
        onRefresh={onRefreshMock}
      />
    );

    await waitFor(() => {
      expect(onRefreshMock).toHaveBeenCalled();
    }, { timeout: 200 });
  });

  it('displays connections with locale formatting', () => {
    render(<StatsDashboard {...defaultProps} />);

    expect(screen.getByText('1,250')).toBeInTheDocument();
  });

  it('shows normal status for low error rate', () => {
    render(<StatsDashboard {...defaultProps} />);

    const errorCard = screen.getByText(/Error Rate/i).closest('.metric-card');
    expect(errorCard).not.toHaveClass('warning');
    expect(errorCard).not.toHaveClass('critical');
  });

  it('shows warning status for high error rate', () => {
    const highErrorMetrics: SystemMetrics = {
      ...mockMetrics,
      errorRate: 10,
    };

    render(<StatsDashboard metrics={highErrorMetrics} />);

    const errorCard = screen.getByText(/Error Rate/i).closest('.metric-card');
    expect(errorCard).toHaveClass('warning');
  });

  it('applies custom className', () => {
    const { container } = render(
      <StatsDashboard {...defaultProps} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('displays all metric icons', () => {
    render(<StatsDashboard {...defaultProps} />);

    expect(screen.getByTestId('cpu-icon')).toBeInTheDocument();
    expect(screen.getByTestId('memory-icon')).toBeInTheDocument();
    expect(screen.getByTestId('network-icon')).toBeInTheDocument();
    expect(screen.getByTestId('database-icon')).toBeInTheDocument();
    expect(screen.getByTestId('harddrive-icon')).toBeInTheDocument();
    expect(screen.getByTestId('activity-icon')).toBeInTheDocument();
  });
});

describe('StatsDashboard - Edge Cases', () => {
  it('handles zero values', () => {
    const zeroMetrics: SystemMetrics = {
      cpuUsage: 0,
      memoryUsage: 0,
      activeConnections: 0,
      smsQueue: 0,
      dbLoad: 0,
      diskUsage: 0,
      uptime: 0,
      errorRate: 0,
    };

    expect(() => {
      render(<StatsDashboard metrics={zeroMetrics} />);
    }).not.toThrow();
  });

  it('handles very large values', () => {
    const largeMetrics: SystemMetrics = {
      cpuUsage: 100,
      memoryUsage: 1073741824, // 1 TB
      activeConnections: 999999999,
      smsQueue: 10000,
      dbLoad: 99999,
      diskUsage: 1073741824,
      uptime: 31536000, // 1 year
      errorRate: 1000,
    };

    expect(() => {
      render(<StatsDashboard metrics={largeMetrics} />);
    }).not.toThrow();
  });

  it('handles negative values gracefully', () => {
    const negativeMetrics: SystemMetrics = {
      cpuUsage: -10,
      memoryUsage: -100,
      activeConnections: -5,
      smsQueue: -1,
      dbLoad: -50,
      diskUsage: -10,
      uptime: -100,
      errorRate: -5,
    };

    expect(() => {
      render(<StatsDashboard metrics={negativeMetrics} />);
    }).not.toThrow();
  });
});
