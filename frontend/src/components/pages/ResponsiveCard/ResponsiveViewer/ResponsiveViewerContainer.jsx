import React from "react";
import { ResponsiveViewerView } from "./ResponsiveViewerView";

export function ResponsiveViewerContainer({ file, width, height }) {
  return <ResponsiveViewerView file={file} width={width} height={height} />;
}
