import { fontVariables } from "@/shared/ui/fonts";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
