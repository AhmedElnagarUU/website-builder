import {
  Amiri,
  Archivo,
  Barlow,
  Barlow_Condensed,
  Caveat,
  Cormorant_Garamond,
  Fragment_Mono,
  Fraunces,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Instrument_Sans,
  Inter,
  Inter_Tight,
  JetBrains_Mono,
  Karla,
  Lato,
  Mulish,
  Noto_Sans_Arabic,
  Playfair_Display,
  Source_Sans_3,
  Source_Serif_4,
  Space_Grotesk,
  Space_Mono,
  Spectral,
  Spline_Sans_Mono,
  Plus_Jakarta_Sans,
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

export const fontBarlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
});

export const fontBarlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
});

export const fontSpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const fontInter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
});

export const fontFraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

export const fontKarla = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-karla",
});

export const fontSplineSansMono = Spline_Sans_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-spline-sans-mono",
});

export const fontCormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

export const fontLato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
});

export const fontSpectral = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
});

export const fontInstrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument-sans",
});

export const fontSpaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const fontPlusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
});

export const fontSourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-source-sans-3",
});

export const fontMulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mulish",
});

export const fontFragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-fragment-mono",
});

export const fontArchivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
});

export const fontPlayfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair-display",
});

export const fontIbmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-ibm-plex-sans",
});

export const fontIbmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
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
  fontBarlow.variable,
  fontBarlowCondensed.variable,
  fontSpaceGrotesk.variable,
  fontInter.variable,
  fontFraunces.variable,
  fontKarla.variable,
  fontSplineSansMono.variable,
  fontCormorant.variable,
  fontLato.variable,
  fontSpectral.variable,
  fontInstrumentSans.variable,
  fontSpaceMono.variable,
  fontPlusJakartaSans.variable,
  fontSourceSans3.variable,
  fontMulish.variable,
  fontFragmentMono.variable,
  fontArchivo.variable,
  fontPlayfairDisplay.variable,
  fontIbmPlexSans.variable,
  fontIbmPlexMono.variable,
].join(" ");
