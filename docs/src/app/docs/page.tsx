import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { Table } from "@/components/Table";
import { Toc } from "@/components/Toc";
import { components, PACKAGE } from "@/lib/data";

export const metadata: Metadata = { title: "Getting started" };

const SECTIONS = [
  { id: "installation", title: "Installation" },
  { id: "requirements", title: "Requirements" },
  { id: "basic-usage", title: "Basic usage" },
  { id: "how-it-works", title: "How it works" },
  { id: "typescript", title: "TypeScript" },
  { id: "all-components", title: "All components" },
];

const INSTALL = `npm install ${PACKAGE}
# or
yarn add ${PACKAGE}`;

const PODS = `cd ios && pod install`;

const BASIC = `import { useState } from 'react';
import { Text } from 'react-native';
import {
  NativeKitBottomSheet,
  NativeKitButton,
} from '${PACKAGE}';

export default function Checkout() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NativeKitButton title="Show details" onPress={() => setOpen(true)} />

      <NativeKitBottomSheet
        visible={open}
        variant="halfExpanded"
        onDismiss={() => setOpen(false)}
        style={{ padding: 24, gap: 12 }}
      >
        <Text>Any React Native content</Text>
        <NativeKitButton title="Close" onPress={() => setOpen(false)} />
      </NativeKitBottomSheet>
    </>
  );
}`;

const TYPES = `import type {
  NativeKitButtonProps,
  NativeKitButtonVariant,
  NativeKitBottomSheetProps,
  NativeKitBottomSheetVariant,
} from '${PACKAGE}';`;

export default function GettingStarted() {
  return (
    <div className="doc-with-toc">
      <article className="doc">
        <p className="crumbs">Docs / Overview</p>
        <h1>Getting started</h1>
        <p className="lead">
          NativeKit gives React Native truly native UI components. Each one renders a real platform view, Jetpack
          Compose on Android and SwiftUI or UIKit on iOS, from a single typed React Native API.
        </p>

        <h2 id="installation">Installation</h2>
        <p>Add the package with your package manager:</p>
        <CodeBlock code={INSTALL} lang="bash" title="Terminal" />
        <p>Then install the iOS pods:</p>
        <CodeBlock code={PODS} lang="bash" title="Terminal" />

        <h2 id="requirements">Requirements</h2>
        <Table
          head={["Platform", "Requirement"]}
          rows={[
            ["React Native", "New Architecture (Fabric) enabled"],
            ["Android", "`minSdkVersion` 24+, Kotlin 2.x (Jetpack Compose + Material 3 are bundled)"],
            ["iOS", "SwiftUI; Liquid Glass needs iOS 26+ and Xcode 26 (Swift 6.2)"],
          ]}
        />
        <p className="callout">
          The components render real platform views, so they are <strong>not</strong> available on web.
        </p>

        <h2 id="basic-usage">Basic usage</h2>
        <p>
          Import the components and use them like any other React Native view. Here a button opens a native bottom
          sheet that renders your own React Native children:
        </p>
        <CodeBlock code={BASIC} title="Checkout.tsx" />

        <h2 id="how-it-works">How it works</h2>
        <p>
          Every component is a Fabric native component. On Android it hosts a Compose view inside{" "}
          <code>MaterialTheme</code>; on iOS it hosts SwiftUI in a <code>UIHostingController</code> or presents a UIKit
          sheet. Props flow down through codegen, and native events such as <code>onPress</code> and{" "}
          <code>onDismiss</code> flow back up to your JavaScript.
        </p>
        <p>
          Because the views are native, you get each platform&apos;s own ripple, press feedback, haptics, drag physics,
          detents and accessibility for free.
        </p>

        <h2 id="typescript">TypeScript</h2>
        <p>Every prop, variant and callback type is exported from the package:</p>
        <CodeBlock code={TYPES} title="TypeScript" />

        <h2 id="all-components">All components</h2>
        <ul className="bar-grid">
          {components.map((c) => (
            <li key={c.slug}>
              <Link href={`/docs/${c.slug}/`} className="bar-card">
                <span className="bar-card-media" aria-hidden="true">
                  {c.slug === "button" ? (
                    <span className="demo demo-buttons">
                      <span className="m3 m3-filled">Filled</span>
                      <span className="m3 m3-tonal">Tonal</span>
                      <span className="m3 m3-outlined">Outlined</span>
                    </span>
                  ) : (
                    <span className="demo demo-sheet">
                      <span className="scrim" />
                      <span className="sheet">
                        <span className="handle" />
                        <span className="sheet-title" />
                        <span className="sk-line" />
                        <span className="sk-line short" />
                      </span>
                    </span>
                  )}
                </span>
                <span className="bar-card-name">{c.component}</span>
                <span className="bar-card-text">{c.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </article>
      <Toc sections={SECTIONS} />
    </div>
  );
}
