import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

@Component({
selector: 'app-virtual-forest',
templateUrl: './virtual-forest.component.html',
styleUrls: ['./virtual-forest.component.css']
})
export class VirtualForestComponent implements OnInit{

	ngOnInit(): void {
		this.createThreeJsBox();
	}

	tileToPosition(tileX:number, tileY:number){
		return new THREE.Vector2((tileX + (tileY % 2) * 0.5) * 1.77, tileY * 1.535)
	}
	
	createThreeJsBox = () => {
		
		const canvas = document.getElementById('canvas')
		if (!canvas){return }
		
		//Setup debug 
		const gui = new dat.GUI()
		const gui_scene = gui.addFolder("Scene")
		const gui_light = gui_scene.addFolder("Lights")
		const gui_directional_light = gui_light.addFolder("Directional light")
		const gui_anbiant_light = gui_light.addFolder("Ambient light")
		const parameters_scene = {
			bg_color: "#ffeecc"
		}
		
		// Set up Scene
		const scene = new THREE.Scene()
		scene.background = new THREE.Color(parameters_scene.bg_color)
		gui_scene.addColor(parameters_scene, "bg_color").onChange((value: THREE.Color) => {
			// TODO: Maybe need to change
			scene.background = new THREE.Color(parameters_scene.bg_color)
		})

		const hexagon_group = new THREE.Group()
		const height : number = 3

		const hexagon_grometry = new THREE.CylinderGeometry(1, 1, height, 6, 1, false)
		const hexagon_material = new THREE.MeshStandardMaterial({color: '#B2B6B1'})

		for (let i = -10; i <= 10; i++){
			for (let j = -10; j <= 10; j++){
				const hexa = new THREE.Mesh(hexagon_grometry, hexagon_material)
				const hexa_position: THREE.Vector2 = this.tileToPosition(i, j)
				
				if (hexa_position.length() > 16) continue
				
				hexa.position.set(hexa_position.x, height * 0.5, hexa_position.y)
				hexagon_group.add(hexa)
			}
		}

		scene.add(hexagon_group)


		// Ambient light
		const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
		gui_anbiant_light.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name("Intensity ambiant light")
		scene.add(ambientLight)
		
		// Directional light
		const directionalLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
		directionalLight.position.set(4, 10, 0)
		
		const directionalLightCameraHelper = new THREE.DirectionalLightHelper(directionalLight)
		directionalLightCameraHelper.visible = false
		scene.add(directionalLightCameraHelper)

		gui_directional_light.add(directionalLightCameraHelper, "visible")
		gui_directional_light.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
		gui_directional_light.add(directionalLight.position, 'x').min(- 5).max(15).step(0.001)
		gui_directional_light.add(directionalLight.position, 'y').min(- 5).max(15).step(0.001)
		gui_directional_light.add(directionalLight.position, 'z').min(- 5).max(15).step(0.001)
		scene.add(directionalLight)


		const sizes = {
			width: window.innerWidth,
			height: window.innerHeight
		}

		window.addEventListener('resize', () =>
{
			// Update sizes
			sizes.width = window.innerWidth
			sizes.height = window.innerHeight

			// Update camera
			camera.aspect = sizes.width / sizes.height
			camera.updateProjectionMatrix()

			// Update renderer
			renderer.setSize(sizes.width, sizes.height)
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		})
		/**
		 * Camera
		 */
		// Base camera
		const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
		camera.position.set(-17, 31, 33);
		scene.add(camera)

		// Controls
		const controls = new OrbitControls(camera, canvas)
		controls.target.set(0,0,0)
		controls.enableDamping = true

		// Renderer
		const renderer = new THREE.WebGLRenderer({
			canvas: canvas
		})
		renderer.setSize(innerWidth, innerHeight)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		renderer.setClearColor('#262837')


		



		/**
 		* Animate
		*/
		const clock = new THREE.Clock()

		const tick = () => {

			const elapsedTime = clock.getElapsedTime()

			// Update controls
			controls.update()

			// Render
			renderer.render(scene, camera)
		
			// Call tick again on the next frame
			window.requestAnimationFrame(tick)

		}

		tick()
	}



}
