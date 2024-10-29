interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-100 text-red-800 p-2 mb-4 rounded">{message}</div>
  );
};

export default ErrorMessage;
