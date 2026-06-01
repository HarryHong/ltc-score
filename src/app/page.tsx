import { HandCalculator } from "@/components/HandCalculator";
import { Header } from "@/components/Header";
import { MarqueeBanner } from "@/components/MarqueeBanner";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <MarqueeBanner />
      <main>
        <HandCalculator />
      </main>
      <footer className="border-t border-ltc-black/10 bg-ltc-white py-8 text-center text-sm text-ltc-muted">
        <p>
          © {new Date().getFullYear()}{" "}
          <Link
            href="https://luckytile.club"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ltc-black underline-offset-2 hover:underline"
          >
            Lucky Tile Club
          </Link>{" "}
          | All Rights Reserved.
        </p>
        <p className="mt-2 text-xs">
          AI scoring is a guide — always confirm with your table&apos;s house
          rules.
        </p>
      </footer>
    </>
  );
}
