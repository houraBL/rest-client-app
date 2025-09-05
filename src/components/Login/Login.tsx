'use client';
import { registerWithEmailAndPassword } from '@/firebase/firebase';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const register = () => {
    registerWithEmailAndPassword(email, password);
    setEmail('');
    setPassword('');
  };
  return (
    <>
      <h2 className="hero-content hero">REGISTER</h2>
      <input
        type="text"
        className="input input-accent"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-mail Address"
      />
      <input
        type="password"
        className="input input-secondary"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button className="btn btn-info" onClick={register}>
        Register
      </button>
    </>
  );
}
