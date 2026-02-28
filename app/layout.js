import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ClarifAI — Evaluate. Explain. Empower.",
  description: "A 4-layer Explainable AI pipeline that evaluates student submissions with rubric scoring, evidence citing, counterfactual coaching, and misconception tagging.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0D0D1A] text-gray-200`}
      >
        {children}
      </body>
    </html>
  );
}
