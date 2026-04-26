import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Забыли пароль - Balloo Messenger',
  description: 'Восстановление доступа к аккаунту Balloo Messenger',
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
