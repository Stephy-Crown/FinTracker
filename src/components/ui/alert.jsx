// src/components/ui/alert.js
export function Alert({ children }) {
  return (
    <div className="bg-yellow-200 text-yellow-800 p-4 rounded">{children}</div>
  );
}

export function AlertDescription({ children }) {
  return <p className="text-sm mt-1">{children}</p>;
}
