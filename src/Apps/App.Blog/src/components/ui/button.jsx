// src/components/ui/button.jsx
export function Button({ children, variant = 'default', ...props }) {
  const base = 'px-4 py-2 rounded font-medium';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'bg-transparent text-gray-800 hover:bg-gray-100',
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
