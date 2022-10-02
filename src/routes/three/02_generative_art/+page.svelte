<script lang="ts">
	import { debounce } from '../../../utils/debounce';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

	const settings = {
		dimensions: [1024, 1280],
		// Get a WebGL canvas rather than 2D
		context: 'webgl',
		// Turn on MSAA
		attributes: { antialias: true }
	};

	let context: any;

	onMount(() => {
		const renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		renderer.setClearColor('hsl(0, 0%, 95%)', 1);

		const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000);
		camera.position.set(2, 2, 2);
		camera.lookAt(new THREE.Vector3());


		const scene = new THREE.Scene();
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshNormalMaterial();
		const mesh = new THREE.Mesh(geometry, material);
		mesh.scale.setScalar(0.5);
		scene.add(mesh);

		context.appendChild(renderer.domElement);
		const controls = new OrbitControls(camera, renderer.domElement);
		function render() {
			requestAnimationFrame(render);
			// Rotate mesh
			mesh.rotation.y += 0.01;
			controls.update();
			// Draw scene with our camera
			renderer.render(scene, camera);
		}
		render();
		const resize = () => {
			const {
				dimensions: [x, y]
			} = settings;
			const width = Math.min(x, window.innerWidth);
			const height = Math.min(y, window.innerHeight);
			renderer.setPixelRatio(height / width);
			renderer.setSize(width, height);

			camera.aspect = x / y;

			// Update camera properties
			camera.updateProjectionMatrix();
		};

		const debounceResize = debounce(100, resize);
		window.addEventListener('resize', debounceResize);

		resize();

		return () => {
			window.removeEventListener('resize', debounceResize);
			renderer.dispose();
		};
	});
</script>

<main>
	<div>
		<div bind:this={context} />
	</div>
</main>
