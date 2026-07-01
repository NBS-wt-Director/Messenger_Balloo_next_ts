// Stub for @balloo/core-ui
export function Button({ children, variant, size, ...props }: any) { return <button {...props}>{children}</button>; }
export function Modal({ isOpen, onClose, title, children }: any) { if (!isOpen) return null; return <div><h2>{title}</h2>{children}<button onClick={onClose}>X</button></div>; }
export function Alert({ message, type, onClose }: any) { return <div>{message}</div>; }
export function Card({ children, variant, padding }: any) { return <div>{children}</div>; }
export function Input(props: any) { return <input {...props} />; }
export function StatusBadge(props: any) { return <span {...props} />; }
export type AlertType = 'success' | 'error' | 'warning' | 'info';
export const BORDER_RADIUS = 0;
export const COLORS = {};
export const SPACING = {};
