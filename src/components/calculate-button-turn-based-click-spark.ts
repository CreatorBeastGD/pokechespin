import type { ComponentType, ReactNode } from "react";
import ClickSpark from "./ClickSpark";

type ClickSparkProps = {
  children: ReactNode;
  sparkColor: string;
  shape: string;
  sparkCount: number;
  sparkSize: number;
  sparkRadius: number;
  duration: number;
  randomness: number;
  className?: string;
  disabled: boolean;
};

export const ClickSparkWithProps = ClickSpark as unknown as ComponentType<ClickSparkProps>;
