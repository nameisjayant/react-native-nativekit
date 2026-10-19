import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { Logo } from "@/components/Logo";
import { Showcase } from "@/components/Showcase";
import { components, INSTALL, NPM_URL, PACKAGE, REPO_URL, version } from "@/lib/data";

const FEATURES = [
  { icon: "M5 12.5l4.5 4.5L19 7.5", title: "Truly native", text: "Real Jetpack Compose and SwiftUI views, not JS look-alikes. Ripples, haptics and physics come from the OS." },
  { icon: "M4 7h16M4 12h10M4 17h7", title: "One API, two platforms", text: "Write a single React Native component and get Material 3 on Android and Apple's design on iOS." },
  { icon: "M12 3l2.6 5.6L20 9.3l-4 4 1 5.7-5-2.8-5 2.8 1-5.7-4-4 5.4-.7z", title: "Liquid Glass", text: "The glass button uses .glass on iOS 26+ and falls back to a blurred material on older versions." },
  { icon: "M4 17h16M7 13h10M10 9h4", title: "Native bottom sheets", text: "Modal, half-expanded, persistent and action sheets with real drag physics, detents and back handling." },
  { icon: "M13 3L5 14h6l-1 7 8-11h-6z", title: "New Architecture", text: "Built on Fabric native components with codegen, so props and events stay typed and fast." },
  { icon: "M8 6l-5 6 5 6M16 6l5 6-5 6", title: "Typed end to end", text: "Every prop, variant and callback ships with TypeScript types, exported from the package." },
];

export default function HomePage() {
  return (
    <main id="main" className="home">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-logo">
              <Logo size={64} />
            </div>
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Jetpack Compose on Android · SwiftUI on iOS
            </p>
            <h1 id="hero-title">
              Native UI that <span className="grad">feels at home</span>.
            </h1>
            <p className="lead">
              Truly native UI components for React Native. Every component renders a real platform view, Material 3
              on Android and SwiftUI or UIKit on iOS, driven from one typed React Native API.
            </p>
            <div className="install">
              <code>
                <span className="tk-fn">npm</span> install <span className="tk-string">{PACKAGE}</span>
              </code>
              <CopyButton text={INSTALL} label="Copy install command" />
            </div>
            <div className="cta-row">
              <Link href={`/docs/${components[0].slug}/`} className="btn btn-primary">
                Browse components
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              <Link href="/docs/" className="btn btn-ghost">Get started</Link>
            </div>
            <ul className="stats">
              <li><strong>{components.length}</strong><span>components</span></li>
              <li><strong>13</strong><span>native variants</span></li>
              <li><strong>2</strong><span>platforms</span></li>
              <li><a href={NPM_URL} target="_blank" rel="noreferrer"><strong>v{version}</strong><span>on npm</span></a></li>
            </ul>
          </div>
          <Showcase />
        </div>

        <ul className="features">
          {FEATURES.map((f) => (
            <li key={f.title} className="feature">
              <span className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20"><path d={f.icon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <h2>{f.title}</h2>
              <p>{f.text}</p>
            </li>
          ))}
        </ul>

        <footer className="home-foot">
          MIT · Made for React Native by{" "}
          <a href="https://github.com/nameisjayant" target="_blank" rel="noreferrer">Jayant Kumar</a> ·{" "}
          <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub</a>
        </footer>
      </section>
    </main>
  );
}
