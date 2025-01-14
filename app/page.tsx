"use client";

import { useState, useEffect } from "react";
import "./app.css";
import PathMathLogo from "../public/PathMath-logo.png";
import Link from "next/link";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs);

import { useAuthenticator } from "@aws-amplify/ui-react-core";

export default function App() {
  const { user } = useAuthenticator();
  const apiUrl = 'https://smwylkwm55.execute-api.us-east-2.amazonaws.com/default/users';
  useEffect(() => {
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: String(user.userId),
        email: String(user.signInDetails?.loginId)
      }),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }, []);
  return (
    <main>
      <img src={PathMathLogo.src} alt="PathMath Logo"/>
      <p className="tagline">Find the right path to practice math.</p>
      <div className="button-container">
        <Link href="/tutorial" className="tutorial-btn">Tutorial</Link>
        <Link href="/play" className="play-btn">Play</Link>
      </div>
    </main>
  );
}