"use client";

import Layout from '../components/Layout';
import styles from './home.module.css';

export default function HomePage() {
  return (
    <Layout currentPage="home">
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>
            Your finances,
            <br />
            <span className={styles.gradient}>beautifully simple</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Track, analyze, and optimize your financial life with an intelligent dashboard 
            designed for the modern age. Powered by insights, driven by you.
          </p>
          <div className={styles.heroActions}>
            <a href="/prototypes/finance-dashboard" className={styles.primaryButton}>
              Get Started Free
              <span className={styles.arrow}>→</span>
            </a>
            <button className={styles.secondaryButton}>
              Watch Demo
              <span className={styles.playIcon}>▶</span>
            </button>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <div className={styles.statValue}>$2.4M+</div>
              <div className={styles.statLabel}>Money Managed</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>50K+</div>
              <div className={styles.statLabel}>Active Users</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>99.9%</div>
              <div className={styles.statLabel}>Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Everything you need</h2>
            <p className={styles.sectionSubtitle}>
              Powerful features to take control of your financial future
            </p>
          </div>

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3 className={styles.featureTitle}>Real-time Analytics</h3>
              <p className={styles.featureText}>
                Monitor your spending patterns and income streams with live updates and intelligent insights.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3 className={styles.featureTitle}>Smart Budgeting</h3>
              <p className={styles.featureText}>
                Set goals, track progress, and get personalized recommendations to optimize your savings.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔐</div>
              <h3 className={styles.featureTitle}>Bank-level Security</h3>
              <p className={styles.featureText}>
                Your data is encrypted end-to-end with industry-leading security protocols.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔗</div>
              <h3 className={styles.featureTitle}>200+ Integrations</h3>
              <p className={styles.featureText}>
                Connect with your favorite banks, apps, and services seamlessly.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📱</div>
              <h3 className={styles.featureTitle}>Mobile & Desktop</h3>
              <p className={styles.featureText}>
                Access your dashboard anywhere, anytime with our responsive design.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🤖</div>
              <h3 className={styles.featureTitle}>AI Insights</h3>
              <p className={styles.featureText}>
                Get personalized financial advice powered by machine learning algorithms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Loved by thousands</h2>
            <p className={styles.sectionSubtitle}>
              See what our users have to say about FinanceFlow
            </p>
          </div>

          <div className={styles.testimonialGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p className={styles.testimonialText}>
                "FinanceFlow transformed how I manage my money. The insights are incredible and the interface is beautiful."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.avatar}>SL</div>
                <div>
                  <div className={styles.authorName}>Sarah Lee</div>
                  <div className={styles.authorTitle}>Product Manager</div>
                </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p className={styles.testimonialText}>
                "Best financial dashboard I've ever used. The real-time updates and AI insights are game-changers."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.avatar}>MC</div>
                <div>
                  <div className={styles.authorName}>Michael Chen</div>
                  <div className={styles.authorTitle}>Software Engineer</div>
                </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p className={styles.testimonialText}>
                "Finally, a finance app that doesn't feel overwhelming. Clean, intuitive, and powerful."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.avatar}>EP</div>
                <div>
                  <div className={styles.authorName}>Emily Park</div>
                  <div className={styles.authorTitle}>Designer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Ready to take control?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of users managing their finances smarter
          </p>
          <a href="/prototypes/finance-dashboard" className={styles.ctaButton}>
            Start Your Journey
            <span className={styles.arrow}>→</span>
          </a>
        </div>
      </section>
    </Layout>
  );
}

