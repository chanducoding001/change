import React, { useEffect, useState } from "react";
import {
  Marker,
  Popup,
} from "react-map-gl/maplibre";

import LocationOnIcon from "@mui/icons-material/LocationOn";

const MarkerLayer = ({
  mapRef,
  nodes = [],
  selectedNode,
  setSelectedNode,
}) => {
  const [popupNode, setPopupNode] =
    useState(null);

  //--------------------------------------------------

  // Auto zoom when selected node changes

  useEffect(() => {
    if (
      !selectedNode ||
      !mapRef?.current ||
      selectedNode.latitude == null ||
      selectedNode.longitude == null
    )
      return;

    mapRef.current.flyTo({
      center: [
        selectedNode.longitude,
        selectedNode.latitude,
      ],
      zoom: 15,
      duration: 1000,
    });
  }, [selectedNode, mapRef]);

  //--------------------------------------------------
  
  return (
    <>
      {nodes
        .filter(
          (node) =>
            Number.isFinite(node.latitude) &&
            Number.isFinite(node.longitude)
        )
        .map((node) => (
          <Marker
            key={node.id}
            longitude={node.longitude}
            latitude={node.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();

              setPopupNode(node);

              setSelectedNode(node);
            }}
          >
            <LocationOnIcon
              sx={{
                fontSize:
                  selectedNode?.id ===
                  node.id
                    ? 42
                    : 34,

                color:
                  selectedNode?.id ===
                  node.id
                    ? "#d32f2f"
                    : "#2e7d32",

                cursor: "pointer",

                transition:
                  "all .25s ease",
              }}
            />
          </Marker>
        ))}

      {popupNode && (
        <Popup
          longitude={
            popupNode.longitude
          }
          latitude={
            popupNode.latitude
          }
          anchor="top"
          closeOnClick={false}
          onClose={() =>
            setPopupNode(null)
          }
        >
          <div
            style={{
              minWidth: 220,
            }}
          >
            <strong>
              {popupNode.village_name}
            </strong>

            <br />

            {popupNode.sub_district_name}

            <br />

            {popupNode.district_name}

            <br />

            {popupNode.state_name}
          </div>
        </Popup>
      )}
    </>
  );
};

export default MarkerLayer;
