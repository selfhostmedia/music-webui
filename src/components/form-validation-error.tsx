export function FormValidationError({ text }: { text?: string }) {
  return <span className="inline-block text-xs text-red-700 dark:text-red-300">{text || ' '}</span>;
}
