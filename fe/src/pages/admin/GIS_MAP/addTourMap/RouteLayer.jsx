import React, { useMemo } from "react";
import {
  Source,
  Layer,
} from "react-map-gl/maplibre";

const RouteLayer = ({
  travelEdges = [],
  selectedRoute = [],
}) => {

  //-------------------------------------------------------
  // Graph Connections
  //-------------------------------------------------------

  const graphGeoJSON = useMemo(() => {

    if (!travelEdges.length)
      return null;

    return {
      type: "FeatureCollection",

      features: travelEdges
        .filter(
          (edge) =>
            edge.source &&
            edge.target &&
            Number.isFinite(
              edge.source.latitude
            ) &&
            Number.isFinite(
              edge.source.longitude
            ) &&
            Number.isFinite(
              edge.target.latitude
            ) &&
            Number.isFinite(
              edge.target.longitude
            )
        )
        .map((edge) => ({
          type: "Feature",

          properties: {
            color:
              edge.color ??
              "#1976d2",
          },

          geometry: {
            type: "LineString",

            coordinates: [
              [
                edge.source.longitude,
                edge.source.latitude,
              ],

              [
                edge.target.longitude,
                edge.target.latitude,
              ],
            ],
          },
        })),
    };
  }, [travelEdges]);

  //-------------------------------------------------------
  // Selected Tour
  //-------------------------------------------------------

  const routeGeoJSON = useMemo(() => {

    if (
      !selectedRoute ||
      selectedRoute.length < 2
    )
      return null;

    const coordinates =
      selectedRoute
        .filter(
          (node) =>
            Number.isFinite(
              node.latitude
            ) &&
            Number.isFinite(
              node.longitude
            )
        )
        .map((node) => [
          node.longitude,
          node.latitude,
        ]);

    if (coordinates.length < 2)
      return null;

    return {
      type: "Feature",

      geometry: {
        type: "LineString",

        coordinates,
      },
    };
  }, [selectedRoute]);

  //-------------------------------------------------------

  return (
    <>
      {/* Graph */}

      {graphGeoJSON && (
        <Source
          id="graph-source"
          type="geojson"
          data={graphGeoJSON}
        >
          <Layer
            id="graph-layer"
            type="line"
            paint={{
              "line-width": 3,
              "line-color": "#1976d2",
              "line-opacity": 0.65,
            }}
          />
        </Source>
      )}

      {/* Selected Tour */}

      {routeGeoJSON && (
        <Source
          id="tour-source"
          type="geojson"
          data={routeGeoJSON}
        >
          <Layer
            id="tour-layer"
            type="line"
            paint={{
              "line-width": 6,
              "line-color": "#d32f2f",
              "line-opacity": 0.9,
            }}
          />
        </Source>
      )}
    </>
  );
};

export default RouteLayer;