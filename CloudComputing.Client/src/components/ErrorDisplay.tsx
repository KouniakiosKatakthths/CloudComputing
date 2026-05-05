export interface ApiError {
  code: number;
  message: string | null;
};

function ErrorDisplay({ error }: { error: ApiError }) {
  return (
    <div className="container container-danger">
      <h2>Συνέβει κάποιο πρόβλημα</h2>
      {error.message && <p>Server error: {error.message}</p>}
    </div>
  )
}

export default ErrorDisplay;