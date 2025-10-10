"use client";

// Template for creating a new prototype
// To use this template:
// 1. Create a new folder in app/prototypes with your prototype name
// 2. Copy this file and styles.module.css into your new folder
// 3. Create an 'images' folder for your prototype's images
// 4. Rename and customize the component and styles as needed

import { useState } from 'react';
import Link from 'next/link';
import styles from './styles.module.css';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: newTaskTitle,
          completed: false,
        },
      ]);
      setNewTaskTitle('');
    }
  };

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tasks</h1>
      
      <form onSubmit={addTask} className={styles.form}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task"
          className={styles.input}
        />
        <button type="submit" className={styles.addButton}>
          Add task
        </button>
      </form>

      <div className={styles.taskList}>
        {tasks.map(task => (
          <div key={task.id} className={styles.taskItem}>
            <label className={styles.taskLabel}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className={styles.checkbox}
              />
              <span className={`${styles.taskTitle} ${task.completed ? styles.completed : ''}`}>
                {task.title}
              </span>
            </label>
            <button
              onClick={() => deleteTask(task.id)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 