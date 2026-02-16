import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VartaLang | Premium Language Education Platform",
  description: "Master Indian languages through expert-led instruction, structured curriculum, and immersive practice. Professional certification available.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}