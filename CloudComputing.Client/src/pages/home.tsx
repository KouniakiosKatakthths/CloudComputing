import { useState } from "react";
import Navbar from "../components/Navbar";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthService";
import type { ApiError } from "../components/ErrorDisplay";
import ErrorDisplay from "../components/ErrorDisplay";
import UserForm from "../forms/UserForm";

function Home() {
  const [status, setStatus] = useState('')
  const [user_status, setUserStatus] = useState('');
  const [delete_status, setDeleteStatus] = useState('');
  const [username, setUsername] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { user } = useAuth();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setStatus('Μεταφόρτωση...');
    setError(null);

    try {
      const res = await fetch('/api/v1/reports/upload', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        setStatus('Επιτυχής μεταφόρτωση!')
      } else {
        const err = await res.json();
        setStatus('Η μεταφόρτωση απέτυχε.')
        setError(err);
      }
    } catch (ex) {
      console.log(ex);
      setStatus('Η μεταφόρτωση απέτυχε.')
      setError(null);
    }
  }

  const handleCreateUser = async (username: string, password: string) => {
    setError(null);

    setUserStatus('Δημιουργία χρήστη...')
    try {
      setCreatingUser(true);

      const res = await fetch('/api/v1/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!res.ok) {
        const err = await res.json();
        setError(err);
        setUserStatus('Πρόβλημα στη δημιουργία χρήστη!')
        return;
      }

      setUserStatus('Ο χρήστης δημιουργήθηκε επιτυχώς!')
    } catch (ex) {
      console.log(ex);
      setError(null);

      setUserStatus('Πρόβλημα στη δημιουργία χρήστη!')
    }
    finally {
      setCreatingUser(false);
    }
  }

  const handleDeleteUser = async () => {
    setError(null);

    setDeleteStatus('Διαγραφή χρήστη...')
    try {
      const res = await fetch(`/api/v1/users/delete?username=${encodeURIComponent(username)}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err);
        setDeleteStatus('Πρόβλημα στη διαγραφή χρήστη!')
        return;
      }

      setDeleteStatus('Ο χρήστης διαγράφηκε επιτυχώς!')
      setUsername('');
    } catch (ex) {
      console.log(ex);
      setError(null);
      setDeleteStatus('Πρόβλημα στη διαγραφή χρήστη!')
    }
  }

  return (
    <>
      <Navbar></Navbar>

      <div className="content">
        
        <h1>Υπολογιστική Νέφους και Υπηρεσίες</h1>
        <p>Καλώς ήρθατε στην εφαρμογή για την υποβολή αναφορών! Η εφαρμογή έχει δημιουργηθεί για την προβολή αναφορών εργαστηρίου.</p>
        <p>
          Μπορείτε να μεταβείτε στην αναφορά για τη πρώτη εργασία εδω
          <NavLink to="/ex1" className="button-blue button-blue-enabled"
            style={{ marginLeft: '10px' }}>
            Εργασία 1
          </NavLink>
        </p>

        { /* Account actions container*/ }
        <div className="container">
          <h2>Πληροφορίες λογαριασμού</h2>
          <p><strong>Όνομα χρήστη:</strong> {user?.username}</p>
          <p><strong>Ρόλος:</strong> {user?.role === 1 ? 'Διαχειριστής' : 'Απλός Χρήστης'}</p>

          { /* Admin options */ }
          {user?.role === 1 && (
            <div>
              { /* Upload report field */ }
              <h4 className="text-list-header">Μεταφόρτωση αναφοράς</h4>
              <p className="text-list-p">Σε περίπτωση που μία αναφορά εχει ίδιο όνομα με ήδη υπάρχουσα, η υπάρχουσα θα αντικατασταθεί.</p>
              <input type="file" accept=".md" onChange={handleUpload} />
              {status && <p>{status}</p>}

              { /* User create field */ }
              <h4 className="text-list-header">Δημιουργία χρήστη</h4>
              <UserForm loading={creatingUser} submit_button_text="Δημιουργία χρήστη" onSubmit={handleCreateUser}></UserForm>
              {user_status && <p>{user_status}</p>}

              { /* User delete field */ }
              <h4 className="text-list-header">Διαγραφή χρήστη</h4>
              <input className="user-form-field" placeholder="Όνομα χρήστη" value={username} onChange={(e) => setUsername(e.target.value)}></input>
              <button className="user-form-button" style={{ marginLeft: '15px' }} onClick={handleDeleteUser}>Διαγραφή χρήστη</button>
              {delete_status && <p>{delete_status}</p>}
            </div>
          )}
        </div>

        { /* Api errors display */ }
        {error !== null && (
          <div style={{ marginTop: '20px' }}>
            <ErrorDisplay error={error} />
          </div>
        )}
      </div>
      
    </>
  )
}

export default Home;  