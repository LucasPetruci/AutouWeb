"use client";

import { AppHeader } from "@/src/components/AppHeader";
import { EmailClassifier } from "@/src/components/EmailClassifier";
import React from "react";

export default function Home(): React.ReactElement {
  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 50%, rgba(24, 144, 255, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(82, 196, 26, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 20%, rgba(250, 173, 20, 0.06) 0%, transparent 50%)
        `,
        pointerEvents: "none",
      }} />
      <AppHeader />
      <div style={{ 
        padding: "48px 32px", 
        maxWidth: 1400, 
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}>
        <EmailClassifier />
      </div>
    </main>
  );
}
