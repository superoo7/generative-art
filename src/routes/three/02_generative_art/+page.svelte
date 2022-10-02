<script lang="ts">
	import { debounce } from '../../../utils/debounce';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { settings } from './settings';
	import random from 'canvas-sketch-util/random';
	import palettes from 'nice-color-palettes';
	import { randomizeMesh } from './randomizeMesh';
	import BezierEasing from 'bezier-easing';

	let context: any;

	onMount(() => {
		// Create a renderer
		const renderer = new THREE.WebGLRenderer({
			antialias: settings.antialias
		});

		// WebGL background color
		renderer.setClearColor('hsl(0, 0%, 95%)', 1);

		// Setup a camera, we will update its settings on resize
		const camera = new THREE.OrthographicCamera();

		// Setup your scene
		const scene = new THREE.Scene();

		// Get a palette for our scene
		const palette = random.pick(palettes);

		// Orbit Zoom
		const zoom = 2;

		camera.position.set(zoom, zoom, zoom);
		camera.lookAt(new THREE.Vector3());
		const container = new THREE.Group();
		const geometry = new THREE.BoxGeometry(1, 1, 1);

		// The # of cubes to create
		const chunks = 50;

		// Create each cube and return a THREE.Mesh
		const meshes = Array.from(new Array(chunks)).map(() => {
			// Basic "unlit" material with no depth
			const material = new THREE.MeshStandardMaterial({
				metalness: 0,
				roughness: 1,
				color: random.pick(palette)
			});

			// Create the mesh
			const mesh = new THREE.Mesh(geometry, material);

			// Randomize it
			randomizeMesh(mesh, palette);
			container.add(mesh);
			return mesh;
		});

		scene.add(container);

		let controls: OrbitControls;
		if (settings.orbit) {
			controls = new OrbitControls(camera, renderer.domElement);
		}

		scene.add(new THREE.AmbientLight('hsl(0,0%,30%)'));
		// Add a harsh light to the scene
		const light = new THREE.DirectionalLight('white', 1);
		light.position.set(0, 4, 0);
		scene.add(light);

		const easeFn = BezierEasing(0.67, 0.03, 0.29, 0.99);

		context.appendChild(renderer.domElement);

		let time = 0;
		const MAX_VALUE = 2;
		let direction = "positive";
		const render = () => {
			requestAnimationFrame(render);
			if(time > MAX_VALUE) {
				direction = "negative";
			} else if(time <= 0) {
				direction = "positive";
			}
			const SENSITIVITY = 0.001;
			time = direction === "positive" ? time + SENSITIVITY : time - SENSITIVITY;

			scene.rotation.z = easeFn(time * 2);

			// Animate each mesh with noise
			// meshes.forEach((mesh) => {
			// 	const f = 0.5;
			// 	mesh.position.x =
			// 		(mesh as any).originalPosition.x +
			// 		0.25 *
			// 			random.noise3D(
			// 				mesh.position.x * f,
			// 				mesh.position.y * f,
			// 				mesh.position.z * f,
			// 				time * 0.25
			// 			);
			// });
			// Rotate mesh
			if (settings.orbit) controls.update();
			// Draw scene with our camera
			renderer.render(scene, camera);
		};
		render();

		const resize = () => {
			const {
				dimensions: [x, y]
			} = settings;
			const width = Math.min(x, window.innerWidth);
			const height = Math.min(y, window.innerHeight);
			const aspect = width / height;
			renderer.setPixelRatio(aspect);
			renderer.setSize(width, height);

			const zoom = 1.85;
			camera.left = -zoom * aspect;
			camera.right = zoom * aspect;
			camera.top = zoom;
			camera.bottom = -zoom;
			camera.near = -100;
			camera.far = 100;
			camera.position.set(zoom, zoom, zoom);
			camera.lookAt(new THREE.Vector3());

			// Update camera properties
			camera.updateProjectionMatrix();
		};

		const debounceResize = debounce(100, resize);
		window.addEventListener('resize', debounceResize);

		resize();

		return () => {
			window.removeEventListener('resize', debounceResize);
			renderer.dispose();
			if(settings.orbit) controls.dispose();
		};
	});
</script>

<main>
	<div>
		<div bind:this={context} />
	</div>
</main>
