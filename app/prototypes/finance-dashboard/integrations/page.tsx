"use client";

import { useState } from 'react';
import Layout from '../components/Layout';
import styles from './integrations.module.css';

const integrations = [
  {
    id: 1,
    name: 'Chase Bank',
    category: 'Banking',
    icon: '🏦',
    description: 'Connect your Chase accounts for automatic transaction syncing',
    connected: true,
    color: '#0066CC'
  },
  {
    id: 2,
    name: 'PayPal',
    category: 'Payments',
    icon: '💳',
    description: 'Sync your PayPal transactions and balances',
    connected: true,
    color: '#003087'
  },
  {
    id: 3,
    name: 'Venmo',
    category: 'Payments',
    icon: '💸',
    description: 'Track your Venmo payments and transfers',
    connected: false,
    color: '#3D95CE'
  },
  {
    id: 4,
    name: 'Coinbase',
    category: 'Crypto',
    icon: '₿',
    description: 'Monitor your cryptocurrency portfolio',
    connected: false,
    color: '#0052FF'
  },
  {
    id: 5,
    name: 'Robinhood',
    category: 'Investing',
    icon: '📈',
    description: 'Track your stock and options investments',
    connected: true,
    color: '#00C805'
  },
  {
    id: 6,
    name: 'Stripe',
    category: 'Business',
    icon: '🔵',
    description: 'Monitor your business payments and revenue',
    connected: false,
    color: '#635BFF'
  },
  {
    id: 7,
    name: 'QuickBooks',
    category: 'Accounting',
    icon: '📊',
    description: 'Sync your accounting data and reports',
    connected: false,
    color: '#2CA01C'
  },
  {
    id: 8,
    name: 'American Express',
    category: 'Banking',
    icon: '💎',
    description: 'Connect your Amex credit cards',
    connected: true,
    color: '#006FCF'
  },
  {
    id: 9,
    name: 'Capital One',
    category: 'Banking',
    icon: '🏧',
    description: 'Link your Capital One accounts',
    connected: false,
    color: '#C41F3E'
  },
  {
    id: 10,
    name: 'Mint',
    category: 'Budgeting',
    icon: '🌿',
    description: 'Import your Mint budgets and goals',
    connected: false,
    color: '#00A868'
  },
  {
    id: 11,
    name: 'Plaid',
    category: 'Infrastructure',
    icon: '🔗',
    description: 'Secure bank account connections',
    connected: true,
    color: '#000000'
  },
  {
    id: 12,
    name: 'Slack',
    category: 'Notifications',
    icon: '💬',
    description: 'Get financial alerts in Slack',
    connected: false,
    color: '#4A154B'
  },
];

const categories = ['All', 'Banking', 'Payments', 'Investing', 'Crypto', 'Business', 'Accounting', 'Budgeting', 'Infrastructure', 'Notifications'];

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = activeCategory === 'All' || integration.category === activeCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const connectedCount = integrations.filter(i => i.connected).length;

  return (
    <Layout currentPage="integrations">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Integrations</h1>
            <p className={styles.subtitle}>
              Connect your favorite financial tools and services. {connectedCount} of {integrations.length} connected.
            </p>
          </div>
          <div className={styles.searchContainer}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Categories */}
        <div className={styles.categories}>
          {categories.map(category => (
            <button
              key={category}
              className={`${styles.categoryButton} ${activeCategory === category ? styles.active : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
              {category !== 'All' && (
                <span className={styles.categoryCount}>
                  {integrations.filter(i => i.category === category).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Integrations Grid */}
        <div className={styles.grid}>
          {filteredIntegrations.map(integration => (
            <div key={integration.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div 
                  className={styles.iconContainer}
                  style={{ background: `${integration.color}15` }}
                >
                  <span className={styles.icon}>{integration.icon}</span>
                </div>
                <button className={styles.menuButton}>⋯</button>
              </div>
              
              <h3 className={styles.cardTitle}>{integration.name}</h3>
              <p className={styles.cardDescription}>{integration.description}</p>
              
              <div className={styles.cardFooter}>
                <span className={styles.categoryBadge}>{integration.category}</span>
                {integration.connected ? (
                  <button className={styles.connectedButton}>
                    <span className={styles.checkmark}>✓</span>
                    Connected
                  </button>
                ) : (
                  <button className={styles.connectButton}>
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredIntegrations.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3 className={styles.emptyTitle}>No integrations found</h3>
            <p className={styles.emptyText}>
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}

        {/* Request Integration */}
        <div className={styles.requestSection}>
          <h2 className={styles.requestTitle}>Don't see what you need?</h2>
          <p className={styles.requestText}>
            Request a new integration and we'll work on adding it to our platform.
          </p>
          <button className={styles.requestButton}>
            Request Integration
            <span className={styles.arrow}>→</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}

