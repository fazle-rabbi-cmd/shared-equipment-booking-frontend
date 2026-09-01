import {
  Camera,
  Headphones,
  Keyboard,
  Laptop,
  Monitor,
  MonitorPlay,
  Mouse,
  Package,
  Printer,
  Smartphone,
  Tablet,
} from 'lucide-vue-next';
import type { Component } from 'vue';

const ICONS: Record<string, Component> = {
  laptop: Laptop,
  camera: Camera,
  projector: MonitorPlay,
  screen: MonitorPlay,
  monitor: Monitor,
  tablet: Tablet,
  phone: Smartphone,
  printer: Printer,
  headphone: Headphones,
  keyboard: Keyboard,
  mouse: Mouse,
};

export function equipmentIcon(category: string): Component {
  const key = Object.keys(ICONS).find((k) => category.toLowerCase().includes(k));
  return key ? ICONS[key] : Package;
}