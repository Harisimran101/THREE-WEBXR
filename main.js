import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/loaders/GLTFLoader.js';
import { VRButton } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/webxr/XRHandModelFactory.js';

let container;
			let camera, scene, renderer;
			let controller1, controller2;
			let controllerGrip1, controllerGrip2;
			const box = new THREE.Box3();

			const controllers = [];
			const oscillators = [];
			let controls, group;
			let audioCtx = null;

			// minor pentatonic scale, so whichever notes is striked would be more pleasant
			const musicScale = [ 0, 3, 5, 7, 10 ];

			init();
			animate();

			function initAudio() {

				if ( audioCtx !== null ) {

					return;

				}

				audioCtx = new ( window.AudioContext || window.webkitAudioContext )();
				function createOscillator() {

					// creates oscillator
					const oscillator = audioCtx.createOscillator();
					oscillator.type = 'sine'; // possible values: sine, triangle, square
					oscillator.start();
					return oscillator;

				}

				oscillators.push( createOscillator() );
				oscillators.push( createOscillator() );
				window.oscillators = oscillators;

			}

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x808080 );

				camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
				camera.position.set( 0, 1.6, 6 );

				controls = new OrbitControls( camera, container );
				controls.target.set( 0, 1.6, 0 );
				controls.update();

				scene.add( new THREE.HemisphereLight( 0x808080, 0x606060, 1.3 ) );

				const light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( 0, 6, 0 );
				light.castShadow = true;
				light.shadow.camera.top = 2;
				light.shadow.camera.bottom = - 2;
				light.shadow.camera.right = 2;
				light.shadow.camera.left = - 2;
				light.shadow.mapSize.set( 4096, 4096 );
				scene.add( light );

				const loader = new GLTFLoader();
				loader.load('model.glb', (gltf) =>{
					 let model = gltf.scene;
					 scene.add(model);
					 model.position.y = 0.5;
					 model.scale.set(1.5,1.5,1.5)
				})

			
				

	

				//

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.outputEncoding = THREE.sRGBEncoding;
				renderer.shadowMap.enabled = true;
				renderer.xr.enabled = true;
				container.appendChild( renderer.domElement );

				document.body.appendChild( VRButton.createButton( renderer ) );

				document.getElementById( 'VRButton' ).addEventListener( 'click', () => {

					initAudio();

				} );

				// controllers

				controller1 = renderer.xr.getController( 0 );
				scene.add( controller1 );

				controller2 = renderer.xr.getController( 1 );
				scene.add( controller2 );

				const controllerModelFactory = new XRControllerModelFactory();

				controllerGrip1 = renderer.xr.getControllerGrip( 0 );
				controllerGrip1.addEventListener( 'connected', controllerConnected );
				controllerGrip1.addEventListener( 'disconnected', controllerDisconnected );
				controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
				scene.add( controllerGrip1 );

				controllerGrip2 = renderer.xr.getControllerGrip( 1 );
				controllerGrip2.addEventListener( 'connected', controllerConnected );
				controllerGrip2.addEventListener( 'disconnected', controllerDisconnected );
				controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
				scene.add( controllerGrip2 );

				//

				window.addEventListener( 'resize', onWindowResize );

			}

			function controllerConnected( evt ) {

				controllers.push( {
					gamepad: evt.data.gamepad,
					grip: evt.target,
					colliding: false,
					playing: false
				} );

			}

			function controllerDisconnected( evt ) {

				const index = controllers.findIndex( o => o.controller === evt.target );
				if ( index !== - 1 ) {

					controllers.splice( index, 1 );

				}

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function animate() {

				renderer.setAnimationLoop( render );

			}

		
			function render() {

			

				renderer.render( scene, camera );

			}