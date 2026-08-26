import RadioPlayer from "./RadioPlayer";
import SeoContent from "./SeoContent";

export default function Home() {
  return (
    <>
      <RadioPlayer />
      {/* Server-rendered SEO content — static HTML for Googlebot */}
      <SeoContent />
    </>
  );
}
