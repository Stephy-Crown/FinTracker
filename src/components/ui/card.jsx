// src/components/ui/card.js
export function Card({ children }) {
  return (
    <div className="border border-purple-200 shadow-lg rounded p-2 m-2">
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return <div className="font-bold">{children}</div>;
}

export function CardTitle({ children }) {
  return <h3 className="text-lg">{children}</h3>;
}

export function CardContent({ children }) {
  return <div className="mt-2">{children}</div>;
}
