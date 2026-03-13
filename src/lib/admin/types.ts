import type { ReactNode } from "react";

export type FieldType =
  | "text"
  | "textarea"
  | "image"
  | "image-list"
  | "number"
  | "string-list"
  | "stats"
  | "socials";

export type StatItem = {
  value: number;
  suffix: string;
  label: string;
};

export type SocialItem = {
  name: string;
  href: string;
};

export type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
};

export type SectionMode = "single" | "collection";

export type SectionConfig = {
  title: string;
  section: string;
  mode: SectionMode;
  description: string;
  icon: ReactNode;
  fields: FieldConfig[];
  createDefaults?: Record<string, unknown>;
};

export type SectionRecord = Record<string, unknown>;

export type Toast = {
  id: number;
  type: "success" | "error";
  message: string;
};
