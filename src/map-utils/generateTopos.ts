import { multiPolygon } from "@turf/helpers";
import { GeometryProperties, MapGeometries } from "./types";
import { merge } from 'topojson-client';

import topo from '../world.json'
import { theme } from "./theme";

export interface TopoObject {
  type: any;
  arcs: number[][][];
  properties: Omit<GeometryProperties, 'color' | 'zoneId'>;
}

export interface Topo {
  type: any;
  arcs: number[][][];
  objects: {
    [key: string]: TopoObject;
  };
}

export const generateTopos = (): MapGeometries => {
  const geometries: MapGeometries = { features: [], type: 'FeatureCollection' };
  // Casting to unknown first to allow using [number, number] for center property
  const topography = topo as unknown as Topo;

  for (const k of Object.keys(topography.objects)) {
    if (!topography.objects[k].arcs) {
      continue;
    }

    // Exclude if spatial aggregate is on and the feature is not highest granularity
    // I.e excludes SE if spatialAggregate is off.
    // if (
    //   SpatialAggregate === SpatialAggregate.ZONE &&
    //   !topography.objects[k].properties.isHighestGranularity
    // ) {
    //   continue;
    // }

    // Exclude if spatial aggregate is off and the feature is aggregated view,
    // I.e excludes SE-SE4 if spatialAggregate is on.
    if (
      // spatialAggregate === SpatialAggregate.COUNTRY &&
      !topography.objects[k].properties.isAggregatedView
    ) {
      continue;
    }

    const topoObject = merge(topography, [topography.objects[k]]);
    const mp = multiPolygon(topoObject.coordinates, {
      zoneId: topography.objects[k].properties.zoneName,
      color: theme.nonClickableFill,
      ...topography.objects[k].properties,
    });

    geometries.features.push(mp);
  }
  return geometries;
};