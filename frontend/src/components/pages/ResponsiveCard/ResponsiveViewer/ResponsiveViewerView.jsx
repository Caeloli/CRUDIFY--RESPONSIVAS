import React from "react";

export function ResponsiveViewerView({ file }) {
  console.log("Archivo desde rvv", file);
  return (
    <div className="mx-auto responsivecard-filepreview w-100">
      {file ? (
        <iframe
          src={URL.createObjectURL(file)}
          width={"90%"}
          height={"95%"}
        />
      ) : (
        <h2 className="text-center">Aún no has subido ningún archivo</h2>
      )}
    </div>
  );
}
