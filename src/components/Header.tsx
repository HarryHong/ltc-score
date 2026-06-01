import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-ltc-black/10 bg-ltc-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="https://luckytile.club"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <Image
            src="https://images.squarespace-cdn.com/content/v1/696ba901a0bcb96e7536579c/6714fcef-71fa-4df6-bf5b-d36c8b533713/LTC-tile2-250x100+-8.png"
            alt="Lucky Tile Club"
            width={48}
            height={48}
            className="rounded-sm"
            unoptimized
          />
          <span
            className="text-xl tracking-tight text-ltc-black"
            style={{ fontFamily: "var(--font-readex)" }}
          >
            LTC
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="https://luckytile.club"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-ltc-muted transition-colors hover:text-ltc-black sm:inline"
          >
            luckytile.club
          </Link>
          <Link
            href="https://www.instagram.com/luckytileclub/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ltc-coral px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{ fontFamily: "var(--font-readex)" }}
          >
            Follow us
          </Link>
        </nav>
      </div>
    </header>
  );
}
