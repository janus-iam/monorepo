import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const [mnemonic, setMnemonic] = useState<string>("");

  useEffect(() => {
    const mnemonic = bip39.generateMnemonic(wordlist);
    setMnemonic(mnemonic);
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Mnemonic: {mnemonic}</p>
      <i>This password has been generated on your device and no one knows about it.</i>

      <p>We ask you to build a little story with each word of your password and remember it.</p>
    </div>
  );
}
