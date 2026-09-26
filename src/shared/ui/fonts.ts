import localFont from "next/font/local";

/**
 * Vexo type system (source: design/landingPage/variant-14/index.html).
 * Latin display/body/serif/mono + Arabic stacks (Caveat has no Arabic glyphs,
 * so Arabic supplies its own serif/sans faces - see EPIC 05 flags).
 *
 * SELF-HOSTED: every face is a local .woff2 under ./fonts, emitted into the
 * build output by Next. `next/font/google` is deliberately NOT used anywhere:
 * it fetches from Google on every fresh build and fails with ETIMEDOUT on
 * networks that block fonts.googleapis.com / fonts.gstatic.com.
 *
 * To change a family/weight: drop the new .woff2 into ./fonts and add the
 * matching { path, weight, style } entry below. Export names and CSS
 * variables are the stable public surface - do not rename them.
 */

export const fontDisplay = localFont({
  src: [
    { path: "./fonts/caveat-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/caveat-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/caveat-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/caveat-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const fontBody = localFont({
  src: [
    { path: "./fonts/inter-tight-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/inter-tight-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/inter-tight-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/inter-tight-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const fontSerif = localFont({
  src: [
    { path: "./fonts/source-serif-4-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/source-serif-4-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/source-serif-4-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/source-serif-4-latin-600-italic.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-serif2",
  display: "swap",
});

export const fontMono = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const fontBarlow = localFont({
  src: [
    { path: "./fonts/barlow-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/barlow-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/barlow-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-barlow",
  display: "swap",
});

export const fontBarlowCondensed = localFont({
  src: [
    { path: "./fonts/barlow-condensed-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/barlow-condensed-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/barlow-condensed-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const fontSpaceGrotesk = localFont({
  src: [
    { path: "./fonts/space-grotesk-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/space-grotesk-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/space-grotesk-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/space-grotesk-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const fontInter = localFont({
  src: [
    { path: "./fonts/inter-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/inter-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/inter-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const fontFraunces = localFont({
  src: [
    { path: "./fonts/fraunces-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/fraunces-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/fraunces-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/fraunces-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "./fonts/fraunces-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/fraunces-latin-600-italic.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

export const fontKarla = localFont({
  src: [
    { path: "./fonts/karla-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/karla-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/karla-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-karla",
  display: "swap",
});

export const fontSplineSansMono = localFont({
  src: [
    { path: "./fonts/spline-sans-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/spline-sans-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-spline-sans-mono",
  display: "swap",
});

export const fontCormorant = localFont({
  src: [
    { path: "./fonts/cormorant-garamond-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-300-italic.woff2", weight: "300", style: "italic" },
    { path: "./fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "./fonts/cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-600-italic.woff2", weight: "600", style: "italic" },
    { path: "./fonts/cormorant-garamond-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-700-italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
});

export const fontLato = localFont({
  src: [
    { path: "./fonts/lato-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/lato-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/lato-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-lato",
  display: "swap",
});

export const fontSpectral = localFont({
  src: [
    { path: "./fonts/spectral-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/spectral-latin-300-italic.woff2", weight: "300", style: "italic" },
    { path: "./fonts/spectral-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/spectral-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/spectral-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/spectral-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-spectral",
  display: "swap",
});

export const fontInstrumentSans = localFont({
  src: [
    { path: "./fonts/instrument-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/instrument-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const fontSpaceMono = localFont({
  src: [
    { path: "./fonts/space-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/space-mono-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-space-mono",
  display: "swap",
});

export const fontPlusJakartaSans = localFont({
  src: [
    { path: "./fonts/plus-jakarta-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/plus-jakarta-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/plus-jakarta-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/plus-jakarta-sans-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/plus-jakarta-sans-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const fontSourceSans3 = localFont({
  src: [
    { path: "./fonts/source-sans-3-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/source-sans-3-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/source-sans-3-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/source-sans-3-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/source-sans-3-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-source-sans-3",
  display: "swap",
});

export const fontMulish = localFont({
  src: [
    { path: "./fonts/mulish-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/mulish-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/mulish-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/mulish-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-mulish",
  display: "swap",
});

export const fontFragmentMono = localFont({
  src: [
    { path: "./fonts/fragment-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/fragment-mono-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-fragment-mono",
  display: "swap",
});

export const fontArchivo = localFont({
  src: [
    { path: "./fonts/archivo-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/archivo-latin-300-italic.woff2", weight: "300", style: "italic" },
    { path: "./fonts/archivo-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/archivo-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/archivo-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/archivo-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "./fonts/archivo-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/archivo-latin-600-italic.woff2", weight: "600", style: "italic" },
    { path: "./fonts/archivo-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/archivo-latin-700-italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-archivo",
  display: "swap",
});

export const fontPlayfairDisplay = localFont({
  src: [
    { path: "./fonts/playfair-display-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/playfair-display-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/playfair-display-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/playfair-display-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "./fonts/playfair-display-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/playfair-display-latin-600-italic.woff2", weight: "600", style: "italic" },
    { path: "./fonts/playfair-display-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/playfair-display-latin-700-italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-playfair-display",
  display: "swap",
});

export const fontIbmPlexSans = localFont({
  src: [
    { path: "./fonts/ibm-plex-sans-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/ibm-plex-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ibm-plex-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

export const fontIbmPlexMono = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const fontArSerif = localFont({
  src: [
    { path: "./fonts/amiri-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/amiri-arabic-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ar-serif",
  display: "swap",
});

export const fontArSans = localFont({
  src: [
    { path: "./fonts/noto-sans-arabic-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/noto-sans-arabic-arabic-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/noto-sans-arabic-arabic-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/noto-sans-arabic-arabic-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ar-sans",
  display: "swap",
});

export const fontVariables = [
  fontDisplay.variable,
  fontBody.variable,
  fontSerif.variable,
  fontMono.variable,
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
  fontArSerif.variable,
  fontArSans.variable,
].join(" ");
