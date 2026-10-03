import { SpaceField } from "@/components/soon/SpaceField";
import "@/components/soon/soon.css";

export default function Home() {
  return (
    <main className="soon">
      <SpaceField clearSelectors={[".soon-title", ".soon-mail"]} />
      <div className="soon-copy">
        <h1 className="soon-title">Something cooler is cooking.</h1>
      </div>
      <a className="soon-mail" href="mailto:tahina@mita-studio.com">
        tahina@mita-studio.com
      </a>
    </main>
  );
}
