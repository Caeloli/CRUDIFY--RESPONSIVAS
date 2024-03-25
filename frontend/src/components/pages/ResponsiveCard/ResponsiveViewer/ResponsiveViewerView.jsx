import React from "react";

export function ResponsiveViewerView({ file, width = "90%", height = "95%" }) {
  return (
    <div className="mx-auto responsivecard-filepreview">
      
      {file ? (
        <iframe
          src={URL.createObjectURL(file)}
          width={width}
          height={height}
          title="title"
        />
      ) : (
        <h2 className="text-center">Aún no has subido ningún archivo</h2>
      )}
    </div>
  );
}
