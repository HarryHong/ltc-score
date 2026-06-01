export function MarqueeBanner() {
  const text =
    "A pop-up mahjong social club in Toronto 〰️ A pop-up mahjong social club in Toronto 〰️ ";

  return (
    <div className="overflow-hidden border-y border-ltc-black/10 bg-ltc-white py-3">
      <div className="ltc-marquee flex whitespace-nowrap">
        <span
          className="px-4 text-2xl text-ltc-black md:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
          aria-hidden
        >
          {text}
          {text}
        </span>
      </div>
    </div>
  );
}
