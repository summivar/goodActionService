
import styles from '@/components/home/home.module.scss';
import Link from 'next/link';
import {useAppSelector} from '@/store/hooks';
import {selectUserData} from '@/store/slices/user';
import {useRouter} from 'next/navigation';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>

        <section className={`${styles.text} ${styles.headline}`}>
          Welcome to our
        </section>

        <section className={`${styles.text} ${styles.headlineService}`}>
          Good Deeds Service!
        </section>

        <section className={`${styles.text} ${styles.defaultText}`}>
          Our platform is designed to help you track and share your good deeds, inspiring positivity and making a
          difference in the world.
          Here, you can keep a record of the kind acts you have performed and connect with like-minded individuals who
          share your passion for making a positive impact.
        </section>

        <section className={`${styles.text} ${styles.defaultText}`}>
          Sign up now and start your journey of making a positive impact, one good deed at a time. Together, lets make
          the world a better place!
        </section>


        <Link className={styles.link} href='/signUp'>
          <button className={styles.buttonSignUp}>
            Continue
          </button>
        </Link>
      </div>
    </div>
  );
}