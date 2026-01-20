export function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  disabled = false, 
  onClick, 
  type = "button",
  className = "" 
}) {
  const baseClasses = "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}

export function Input({ 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  className = "",
  ...props 
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-neutral-800 border border-neutral-700 rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
}

export function Alert({ type = "error", children }) {
  const types = {
    error: "bg-red-900/50 border-red-700 text-red-300",
    success: "bg-green-900/50 border-green-700 text-green-300",
    warning: "bg-yellow-900/50 border-yellow-700 text-yellow-300",
  };

  return (
    <div className={`border rounded-lg p-3 ${types[type]}`}>
      {children}
    </div>
  );
}