import { useState } from "react";
import Navbar from "../components/Navbar";

function Home() {
  const [status, setStatus] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setStatus('Uploading...')

    const res = await fetch('/api/v1/reports/upload', {
      method: 'POST',
      body: formData
    })

    if (res.ok) {
      setStatus('Uploaded successfully!')
    } else {
      setStatus('Upload failed.')
    }
  }


  return (
    <>
      <Navbar></Navbar>
      <input type="file" accept=".md" onChange={handleUpload} />
      {status && <p>{status}</p>}
      <h1>My Application</h1>
    </>
  )
}

export default Home;  