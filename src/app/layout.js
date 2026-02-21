import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "ZionX — AI Preventive Health Assistant",
  description:
    "Multi-agent AI health system with specialized agents for pregnancy, chronic disease, pediatrics, mental health, and emergency triage. Preventive, context-aware, and memory-driven.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
