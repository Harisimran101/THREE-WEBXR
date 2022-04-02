import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/loaders/GLTFLoader.js';
import { VRButton } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/webxr/XRControllerModelFactory.js';

const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

			const renderer = new THREE.WebGLRenderer();
			renderer.setSize( window.innerWidth, window.innerHeight );
            renderer.xr.enabled = true;
			document.body.appendChild( renderer.domElement );

            document.body.appendChild( VRButton.createButton( renderer ) );

            const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1.3 );
            scene.add( light );

			const geometry = new THREE.BoxGeometry();
			const material = new THREE.MeshStandardMaterial( { color: 'lightblue' } );
			const cube = new THREE.Mesh( geometry, material );
			scene.add( cube );

            anime({
				targets: cube.position,
				y: [cube.position.y, '3'],
				loop: true,
				direction: 'alternate',
				ease: 'easeInOutSine',
				duration: 2000,
			})

			camera.position.z = 6;

			function animate() {
				renderer.setAnimationLoop( animate );
				

				renderer.render( scene, camera );
			};

			animate();