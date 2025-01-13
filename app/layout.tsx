"use client"

import React from "react";
import Navbar from "./components/Navbar";
import { Amplify } from "aws-amplify";
import "./app.css";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";
import Footer from "./components/Footer";

Amplify.configure(outputs);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="layout-container">      
        <Authenticator>
          <div className="content-wrapper">
            <Navbar />
            <div className="main-content">
              {children}
            </div>
            <Footer />
          </div>
        </Authenticator>
      </body>
    </html>
  );
}