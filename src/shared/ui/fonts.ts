import {
  Amiri,
  Caveat,
  Inter_Tight,
  JetBrains_Mono,
  Noto_Sans_Arabic,
  Source_Serif_4,
} from "next/font/google";

/**
 * Vexo type system (source: design/landingPage/variant-14/index.html).
 * Latin display/body/serif/mono + Arabic stacks (Caveat has no Arabic glyphs,
 * so Arabic supplies its own serif/sans faces — see EPIC 05 flags).
 */

export const fontDisplay = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

export const fontBody = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const fontSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif2",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const fontArSerif = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-ar-serif",
});

export const fontArSans = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ar-sans",
});

export const fontVariables = [
  fontDisplay.variable,
  fontBody.variable,
  fontSerif.variable,
  fontMono.variable,
  fontArSerif.variable,
  fontArSans.variable,
].join(" ");
