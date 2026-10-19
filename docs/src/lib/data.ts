export const version = "0.1.0";

export const PACKAGE = "@nameisjayant/react-native-nativekit";
export const REPO_URL = "https://github.com/nameisjayant/react-native-nativekit";
export const NPM_URL = `https://www.npmjs.com/package/${PACKAGE}`;
export const INSTALL = `npm install ${PACKAGE}`;

export interface ComponentDoc {
  slug: string;
  name: string;
  component: string;
  summary: string;
  tags: string[];
}

export const components: ComponentDoc[] = [
  {
    slug: "button",
    name: "Button",
    component: "NativeKitButton",
    summary: "A real platform button: Material 3 on Android and SwiftUI on iOS, with six variants, sizes, loading and Liquid Glass.",
    tags: ["6 variants", "Liquid Glass", "Loading state"],
  },
  {
    slug: "bottom-sheet",
    name: "Bottom sheet",
    component: "NativeKitBottomSheet",
    summary: "Material 3 sheets on Android and UIKit sheets on iOS, with your React Native content rendered inside.",
    tags: ["7 variants", "Action sheet", "Detents"],
  },
];

export function getComponent(slug: string): ComponentDoc | undefined {
  return components.find((c) => c.slug === slug);
}

/** Prefixes a public/ path with the deploy base path (empty unless BASE_PATH is set). */
export function asset(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
