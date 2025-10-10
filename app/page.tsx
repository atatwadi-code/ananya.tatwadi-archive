import Link from "next/link";
import styles from './styles/home.module.css';
import { instrumentSans } from './fonts';

export default function Home() {
  // Add your prototypes to this array
  const prototypes: Array<{
    name: string;
    description: string;
    href: string;
  }> = [
    {
      name: 'Finance dashboard',
      description: 'A personal finance dashboard with expense tracking and visualizations',
      href: '/prototypes/finance-dashboard',
    },
    {
      name: 'Hummingbird',
      description: 'A little social media Twitter clone',
      href: '/prototypes/hummingbird',
    },
    {
      name: 'Tasks',
      description: 'A to do list app',
      href: '/prototypes/tasks',
    },  
    // Add your new prototypes here like this:
    // {
    //   title: 'Your new prototype',
    //   description: 'A short description of what this prototype does',
    //   path: '/prototypes/my-new-prototype'
    // },
  ];

  return (
    <main className={`${styles.container} ${instrumentSans.className}`}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1>Make it not ugly</h1>
        </header>
        <section className={styles.grid}>
          {/* Goes through the prototypes list (array) to create cards */}
          {prototypes.map((prototype, index) => (
            <Link 
              key={index}
              href={prototype.href} 
              className={styles.card}
            >
              <h3>{prototype.name}</h3>
              <p>{prototype.description}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
