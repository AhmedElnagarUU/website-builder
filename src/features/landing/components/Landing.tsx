import { Hero } from "./Hero";
import { Features } from "./Features";
import { HowItWorks } from "./HowItWorks";
import { Languages } from "./Languages";
import { Proof } from "./Proof";
import { FinalCta } from "./FinalCta";

/**
 * Public marketing landing page (variant-14 → SiteCraft).
 * Rendered for logged-out visitors on the home route; signed-in users are
 * redirected to the dashboard by the calling page.
 */
export function Landing() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Languages />
      <Proof />
      <FinalCta />
    </>
  );
}
