"use client";

import { type ReactNode } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { LazyMotion } from "framer-motion";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <LazyMotion features={loadFeatures} strict>
        <SmoothScroll>{children}</SmoothScroll>
      </LazyMotion>
    </ErrorBoundary>
  );
}
