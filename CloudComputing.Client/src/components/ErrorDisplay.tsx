export interface ApiError {
  code: number;
  message: string | null;
};

function ErrorDisplay({ error }: { error: ApiError | null }) {
  if (error === null) 
    return (
      <div className="container container-danger">
        <h2>Συνέβει κάποιο πρόβλημα</h2>
        <p>Unknown server error</p>
      </div>
    )

  return (
    <div className="container container-danger">
      <h2>Συνέβει κάποιο πρόβλημα</h2>
      {error.message !== null ? <p>{error.message}</p> : <p>Unknown server error</p>}
    </div>
  )
}

export default ErrorDisplay;