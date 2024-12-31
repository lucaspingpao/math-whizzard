"use client"

import React from "react";
import Navbar from "./components/Navbar";
import { Amplify } from "aws-amplify";
import "./app.css";
import "./components/Button.css";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>      
        <Authenticator>
          <Navbar />
          {children}
        </Authenticator>
      </body>
    </html>
  );
}
