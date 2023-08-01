'use client';

import styles from '@/styles/pages/Home.module.scss';

export default function Home() {
  const { title } = styles;
  return <h1 className={title}>Hi there</h1>;
}
