"use client";

import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import Layout from './components/Layout';
import { useTheme } from './components/Layout';
import styles from './dashboard.module.css';
import { monthlyExpenses, incomeData, savingsHistory, categoryColors } from './data';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function DashboardContent() {
  const { darkMode } = useTheme();
  const [timePeriod, setTimePeriod] = useState<'month' | 'year'>('month');
  const [showRealTime, setShowRealTime] = useState(false);

  // Calculate total income and expenses based on time period
  const monthlyIncome = Object.values(incomeData).reduce((acc, curr) => acc + curr, 0);
  const yearlyIncome = monthlyIncome * 12;
  const totalIncome = timePeriod === 'month' ? monthlyIncome : yearlyIncome;
  
  const monthlyExpenseTotal = Object.values(monthlyExpenses.march).reduce((acc, curr) => acc + curr, 0);
  const yearlyExpenseTotal = monthlyExpenseTotal * 12;
  const totalExpenses = timePeriod === 'month' ? monthlyExpenseTotal : yearlyExpenseTotal;

  // Prepare data for monthly expenses chart
  const expenseChartData = {
    labels: Object.keys(monthlyExpenses.march),
    datasets: [{
      label: 'March expenses',
      data: Object.values(monthlyExpenses.march),
      backgroundColor: Object.values(categoryColors),
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  // Prepare data for income breakdown
  const incomeChartData = {
    labels: Object.keys(incomeData),
    datasets: [{
      data: Object.values(incomeData),
      backgroundColor: ['#007aff', '#34c759', '#ff9500'],
    }]
  };

  // Prepare data for savings trend
  const savingsChartData = {
    labels: savingsHistory.map(item => item.month),
    datasets: [{
      label: 'Monthly savings',
      data: savingsHistory.map(item => item.amount),
      borderColor: '#34c759',
      backgroundColor: 'rgba(52, 199, 89, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#34c759',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    }]
  };

  const netSavings = totalIncome - totalExpenses;

  return (
    <div className={styles.container}>
      {/* Dashboard Hero */}
      <div className={styles.dashboardHero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.dashboardTitle}>Financial Dashboard</h1>
          <p className={styles.dashboardSubtitle}>
            Track your income, expenses, and savings in real-time
          </p>
        </div>
        <div className={styles.heroVisualization}>
          <div className={styles.transactionBadge}>
            {Math.floor(totalExpenses)} transactions
            {showRealTime && <span className={styles.liveDot}>●</span>}
          </div>
          <div className={styles.barChart}>
            {savingsHistory.map((item, index) => (
              <div 
                key={index} 
                className={styles.bar}
                style={{ 
                  height: `${(item.amount / 1200) * 100}%`,
                  animationDelay: `${index * 0.1}s`
                }}
                title={`${item.month}: $${item.amount}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Sales Overview Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Financial Overview</h2>
          <div className={styles.metricsGrid}>
            <div className={`${styles.metricCard} ${styles.coralCard}`}>
              <div className={styles.metricHeader}>
                <span className={styles.metricLabel}>Total Income</span>
                <button 
                  className={styles.menuButton} 
                  aria-label="Menu"
                  onClick={() => alert('Income menu: View details, Export data, Settings')}
                >
                  ⋯
                </button>
              </div>
              <div className={styles.metricValue}>${totalIncome.toLocaleString()}</div>
              <div className={styles.metricChange}>
                {timePeriod === 'month' ? 'This month' : 'This year'}
              </div>
            </div>

            <div className={`${styles.metricCard} ${styles.coralCard}`}>
              <div className={styles.metricHeader}>
                <span className={styles.metricLabel}>Total Expenses</span>
                <button 
                  className={styles.menuButton} 
                  aria-label="Menu"
                  onClick={() => alert('Expenses menu: View breakdown, Filter by category, Export')}
                >
                  ⋯
                </button>
              </div>
              <div className={styles.metricValue}>${totalExpenses.toLocaleString()}</div>
              <div className={styles.metricChange}>
                {timePeriod === 'month' ? 'This month' : 'This year'}
              </div>
            </div>

            <div className={`${styles.metricCard} ${styles.yellowCard}`}>
              <div className={styles.metricHeader}>
                <span className={styles.metricLabel}>Net Savings</span>
                <button 
                  className={styles.menuButton} 
                  aria-label="Menu"
                  onClick={() => alert('Savings menu: Set goals, View history, Compare periods')}
                >
                  ⋯
                </button>
              </div>
              <div className={styles.metricValue}>${netSavings.toLocaleString()}</div>
              <div className={styles.metricChange}>
                {((netSavings / totalIncome) * 100).toFixed(1)}% savings rate
              </div>
            </div>

            <div className={`${styles.metricCard} ${styles.coralCard}`}>
              <div className={styles.metricHeader}>
                <span className={styles.metricLabel}>Monthly Budget</span>
                <button 
                  className={styles.menuButton} 
                  aria-label="Menu"
                  onClick={() => alert('Budget menu: Edit budget, View allocation, Set alerts')}
                >
                  ⋯
                </button>
              </div>
              <div className={styles.metricValue}>${(monthlyIncome * 0.8).toLocaleString()}</div>
              <div className={styles.metricChange}>
                80% of monthly income
              </div>
            </div>

            <div className={`${styles.metricCard} ${styles.greenCard}`}>
              <div className={styles.metricHeader}>
                <span className={styles.metricLabel}>Income</span>
                <button 
                  className={styles.menuButton} 
                  aria-label="Menu"
                  onClick={() => alert('Income menu: Add income source, View breakdown, Settings')}
                >
                  ⋯
                </button>
              </div>
              <div className={styles.metricValue}>${totalIncome.toLocaleString()}</div>
              <div className={styles.toggleGroup}>
                <button 
                  className={`${styles.toggleButton} ${timePeriod === 'month' ? styles.active : ''}`}
                  onClick={() => setTimePeriod('month')}
                  title="View monthly data"
                >
                  Monthly
                </button>
                <button 
                  className={`${styles.toggleButton} ${timePeriod === 'year' ? styles.active : ''}`}
                  onClick={() => setTimePeriod('year')}
                  title="View yearly data"
                >
                  Yearly
                </button>
              </div>
            </div>

            <div 
              className={`${styles.metricCard} ${styles.darkCard} ${styles.addCard}`}
              onClick={() => {
                const cardType = prompt('What would you like to add?\n\n1. New metric card\n2. Custom widget\n3. External integration\n\nEnter 1, 2, or 3:');
                if (cardType) {
                  alert(`Adding option ${cardType}... (Feature coming soon!)`);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  const cardType = prompt('What would you like to add?\n\n1. New metric card\n2. Custom widget\n3. External integration\n\nEnter 1, 2, or 3:');
                  if (cardType) {
                    alert(`Adding option ${cardType}... (Feature coming soon!)`);
                  }
                }
              }}
              role="button"
              tabIndex={0}
              title="Add new metric or widget"
            >
              <div className={styles.addButton}>
                <span className={styles.addIcon}>+</span>
                <span className={styles.addText}>Add</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Analytics</h2>
          <div className={styles.analyticsGrid}>
            <div className={`${styles.metricCard} ${styles.darkCard}`}>
              <div className={styles.metricHeader}>
                <span className={styles.metricLabel}>Avg savings per month</span>
                <button 
                  className={styles.menuButton} 
                  aria-label="Menu"
                  onClick={() => alert('Analytics menu: View trends, Compare periods, Set targets')}
                >
                  ⋯
                </button>
              </div>
              <div className={styles.metricValue}>
                ${(savingsHistory.reduce((acc, item) => acc + item.amount, 0) / savingsHistory.length).toFixed(0)}
              </div>
              <div className={styles.metricChange}>
                Based on last {savingsHistory.length} months
              </div>
            </div>

            <div className={`${styles.metricCard} ${styles.grayCard}`}>
              <div className={styles.metricHeader}>
                <span className={styles.metricLabel}>Real-time Monitoring</span>
                <label 
                  className={styles.switchContainer}
                  title={showRealTime ? 'Turn off real-time updates' : 'Turn on real-time updates'}
                >
                  <input 
                    type="checkbox" 
                    checked={showRealTime}
                    onChange={(e) => setShowRealTime(e.target.checked)}
                    className={styles.switchInput}
                  />
                  <span className={styles.switch}></span>
                </label>
              </div>
              <div className={styles.statusText}>{showRealTime ? 'On' : 'Off'}</div>
              {showRealTime && (
                <div className={styles.metricChange}>
                  <span className={styles.pulseDot}>●</span> Live updates active
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className={styles.chartsSection}>
          <div className={`${styles.chartCard} ${styles.darkCard}`}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.chartTitle}>Expense Breakdown</h3>
                <p className={styles.chartSubtitle}>
                  {timePeriod === 'month' ? 'Monthly' : 'Yearly'} spending by category
                </p>
              </div>
              <button 
                className={styles.menuButton} 
                aria-label="Menu"
                onClick={() => alert('Chart menu: Download as PNG, Export data, Customize view')}
              >
                ⋯
              </button>
            </div>
          <div className={styles.chartContainer}>
            <Bar 
              data={expenseChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                    tooltip: {
                      enabled: true,
                      callbacks: {
                        label: (context) => {
                          return `${context.label}: $${context.parsed.y.toLocaleString()}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                      },
                      ticks: {
                        color: '#86868b',
                        font: {
                          size: 11,
                          weight: 500
                        }
                      }
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: '#86868b',
                        font: {
                          size: 11,
                          weight: 500
                        }
                      }
                    }
                }
              }}
            />
          </div>
        </div>

          <div className={`${styles.chartCard} ${styles.darkCard}`}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.chartTitle}>Income Sources</h3>
                <p className={styles.chartSubtitle}>
                  Distribution of income streams ({timePeriod === 'month' ? 'monthly' : 'yearly'})
                </p>
              </div>
              <button 
                className={styles.menuButton} 
                aria-label="Menu"
                onClick={() => alert('Chart menu: Download as PNG, Export data, Add source')}
              >
                ⋯
              </button>
            </div>
          <div className={styles.chartContainer}>
            <Doughnut 
              data={incomeChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                  cutout: '70%',
                plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        color: '#ffffff',
                        font: {
                          size: 12,
                          weight: 500
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                      }
                    },
                    tooltip: {
                      enabled: true,
                      callbacks: {
                        label: (context) => {
                          const value = context.parsed;
                          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
                        }
                      }
                    }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default function FinanceDashboard() {
  return (
    <Layout currentPage="dashboard">
      <DashboardContent />
    </Layout>
  );
} 