"use client";

import { AppHeader } from "@/src/components/AppHeader";
import { AppFooter } from "@/src/components/AppFooter";
import { EmailClassifier } from "@/src/components/EmailClassifier";
import React from "react";

const DARK_BLUE = "#001020";
const GOLD_ORANGE = "#E0A030";

export default function Home(): React.ReactElement {
  return (
    <main style={{
      minHeight: "100vh",
      background: DARK_BLUE,
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 50%, rgba(224, 160, 48, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(224, 160, 48, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
        `,
        pointerEvents: "none",
      }} />
      <AppHeader />
      <div style={{ 
        flex: 1,
        padding: "64px 32px", 
        maxWidth: 1400, 
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <EmailClassifier />
        </div>
      </div>
      <AppFooter />
    </main>
  );
}
