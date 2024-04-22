import type { AppProps } from "next/app";
import Header from "../src/components/Header";
import { DialogProvider } from "../src/context/UIContext";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DialogProvider>
        <Header />
        <Component {...pageProps} />
      </DialogProvider>
    </>
  );
}
