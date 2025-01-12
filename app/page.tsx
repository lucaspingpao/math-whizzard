"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import "./../app/app.css";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

export default function App() {
  const { user } = useAuthenticator();

  return (
    <main>
      <h1>Welcome back, {user?.signInDetails?.loginId}!</h1>
    </main>
  );
}
