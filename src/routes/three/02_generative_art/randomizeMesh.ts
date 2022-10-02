import * as THREE from 'three';
import random from 'canvas-sketch-util/random';

// Snap 0..1 point to a -1..1 grid
const grid = (n: number, gridSize: number) => {
	const max = gridSize - 1;
	const snapped = Math.round(n * max) / max;
	return snapped * 2 - 1;
};

// Randomize mesh attributes
export const randomizeMesh = (mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>, palette: any[]) => {
	const gridSize = random.rangeFloor(3, 11);
	// Choose a random grid point in a 3D volume between -1..1
	const point = new THREE.Vector3(
		grid(random.value(), gridSize),
		grid(random.value(), gridSize),
		grid(random.value(), gridSize)
	);

	// Stretch it vertically
	point.y *= 2;
	// Scale all the points closer together
	point.multiplyScalar(0.5);

	// Save position
	mesh.position.copy(point);
	(mesh as any).originalPosition = mesh.position.clone();

	// Choose a color for the mesh material
	mesh.material.color.set(random.pick(palette));

	// Randomly scale each axis
	mesh.scale.set(random.gaussian(), random.gaussian(), random.gaussian());

	// Do more random scaling on each axis
	if (random.chance(0.5)) mesh.scale.x *= random.gaussian();
	if (random.chance(0.5)) mesh.scale.y *= random.gaussian();
	if (random.chance(0.5)) mesh.scale.z *= random.gaussian();

	// Further scale each object
	mesh.scale.multiplyScalar(random.gaussian() * 0.25);
};
