import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

export const optimizeGeometry = (geometry, tolerance = 0.01) => {
  // Merge vertices that are close to each other
  const mergedGeometry = BufferGeometryUtils.mergeVertices(geometry, tolerance);

  // Compute vertex normals
  mergedGeometry.computeVertexNormals();

  return mergedGeometry;
};
