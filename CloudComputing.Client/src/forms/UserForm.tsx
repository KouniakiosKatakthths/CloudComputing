import { useState } from "react";

interface Props {
  submit_button_text: string,
  loading: boolean,
  onSubmit: (username: string, password: string) => Promise<void>
}

export default function UserForm({ submit_button_text, loading, onSubmit }: Props) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onFormSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    await onSubmit(username, password);
  }

  return (
    <form className="user-form" onSubmit={e => onFormSubmit(e)}>
      <input className="user-form-field" placeholder="Όνομα χρήστη" disabled={loading} value={username} onChange={(e) => setUsername(e.target.value)}></input>
      <input className="user-form-field" placeholder="Κωδικός πρόσβασης" disabled={loading} type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
      <button className="user-form-button" disabled={loading} type="submit">{submit_button_text}</button>
    </form>
  )
}