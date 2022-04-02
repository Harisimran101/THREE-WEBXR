import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/loaders/GLTFLoader.js';
import { VRButton } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/webxr/XRHandModelFactory.js';


let hand1, hand2;
			let controller1, controller2;
			let controllerGrip1, controllerGrip2;

			let controls;


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

			controller1 = renderer.xr.getController( 0 );
			scene.add( controller1 );

			controller2 = renderer.xr.getController( 1 );
			scene.add( controller2 );

			const controllerModelFactory = new XRControllerModelFactory();
			const handModelFactory = new XRHandModelFactory();

			// Hand 1
			controllerGrip1 = renderer.xr.getControllerGrip( 0 );
			controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
			scene.add( controllerGrip1 );

			hand1 = renderer.xr.getHand( 0 );
			hand1.add( handModelFactory.createHandModel( hand1 ) );

			scene.add( hand1 );

			// Hand 2
			controllerGrip2 = renderer.xr.getControllerGrip( 1 );
			controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
			scene.add( controllerGrip2 );

			hand2 = renderer.xr.getHand( 1 );
			hand2.add( handModelFactory.createHandModel( hand2 ) );
			scene.add( hand2 );

			//

			const newgeometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );

			const line = new THREE.Line( newgeometry );
			line.name = 'line';
			line.scale.z = 5;

			controller1.add( line.clone() );
			controller2.add( line.clone() );


			camera.position.z = 6;

			function animate() {
				renderer.setAnimationLoop( animate );
				
				anime({
					targets: cube.position,
					y: [cube.position.y, '3'],
					loop: true,
					direction: 'alternate',
					ease: 'easeInOutSine',
					duration: 2000,
				})

				renderer.render( scene, camera );
			};

			animate();