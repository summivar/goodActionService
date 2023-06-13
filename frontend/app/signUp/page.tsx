'use client';
import React, {ChangeEvent, FC, FormEvent, useState} from 'react';
import styles from '@/app/styles/auth.module.scss';
import stylesSignUp from '@/app/signUp/singUp.module.scss';
import Link from 'next/link';
import {UserApi} from '@/services/api';
import {isValidEmail} from '@/helper/isValidEmail';
import {useRouter} from 'next/navigation';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {selectUserData, setUserData} from '@/store/slices/user';

interface FormData {
  email: string;
  username: string;
  password: string;
}

const initialFormData: FormData = {
  email: '',
  username: '',
  password: ''
};

const Page: FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [errorsResponse, setErrorsResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors: Partial<FormData> = {};
    if (!formData.email) {
      validationErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      validationErrors.email = 'Invalid email format';
    }

    if (!formData.username) {
      validationErrors.username = 'Username is required';
    }

    if (!formData.password) {
      validationErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      validationErrors.password = 'Password should be at least 8 characters long';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const data = await UserApi.register(formData);
      dispatch(setUserData(data));
      localStorage.setItem('authToken', data.tokens.accessToken);
      localStorage.setItem('refToken', data.tokens.refreshToken);
      await router.push('/myAccount');
      setIsLoading(false);
    } catch (e: any) {
      if (e?.response?.status === 400) {
        if (Array.isArray(e.response.data.message)) {
          const stringOfArray = e.response.data.message.join(' ');
          setErrorsResponse(stringOfArray);
        } else {
          setErrorsResponse(e.response.data.message);
        }
      }
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={stylesSignUp.context} onSubmit={handleSubmit}>
        <span className={styles.headline}>Signing Up</span>
        <div className={styles.formElem}>
          <label className={styles.formLabel}>
            Your email:
          </label>
          <input
            type="text"
            placeholder="text@example.com"
            className={styles.formInput}
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>
        <div className={styles.formElem}>
          <label className={styles.formLabel}>
            Your username:
          </label>
          <input
            type="text"
            placeholder="your_username"
            className={styles.formInput}
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          {errors.username && <span className={styles.error}>{errors.username}</span>}
        </div>
        <div className={styles.formElem}>
          <label className={styles.formLabel}>
            Your password:
          </label>
          <input
            type="password"
            placeholder="your_hard_password"
            className={styles.formInput}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {errors.password && <span className={styles.error}>{errors.password}</span>}
        </div>
        {errorsResponse && <span className={styles.error}>{errorsResponse}</span>}
        <div className={styles.formElem}>
          <button type="submit" className={styles.buttonSignUp} disabled={isLoading}>
            Sign Up
          </button>
        </div>
      </form>
      <div className={styles.formToSignIn}>
        <Link className={styles.link} href="/signIn">
          If you already have an account <strong className={styles.strongButton}>click</strong>
        </Link>
      </div>
    </div>
  );
};

export default Page;