"use client";

import { useEffect } from "react";
import "./app.css";
import PathMathLogo from "../public/PathMath-logo.png";
import Link from "next/link";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs);

export default function App() {
  return (
    <main>
      <img src={PathMathLogo.src} alt="PathMath Logo"/>
      <p className="tagline">The right path to getting better at math.</p>
      <div className="button-container">
        <Link href="/tutorial" className="tutorial-btn">Tutorial</Link>
        <Link href="/play" className="play-btn">Play</Link>
      </div>
    </main>
  );
}