"use client";

import { useState, useEffect } from "react";
import "./app.css";
import PathMathLogo from "../public/PathMath-logo.png";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs);

export default function App() {
  return (
    <main>
      <img src={PathMathLogo.src} alt="PαthMαth Logo" className="logo"/>
      <h1>PαthMαth</h1>
    </main>
  );
}