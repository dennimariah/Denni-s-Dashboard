import './globals.css';

export const metadata = {
  title: "Dennika's Dashboard",
  description: 'Personal life dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
