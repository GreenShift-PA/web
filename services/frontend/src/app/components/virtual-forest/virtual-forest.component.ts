import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import * as dat from 'lil-gui'
import { createNoise2D } from 'simplex-noise'
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

	MAX_HEIGHT:number = 10
	STONE_HEIGHT: number = this.MAX_HEIGHT * 0.8
	DIRT_HEIGHT: number = this.MAX_HEIGHT * 0.7
	GRASS_HEIGHT: number = this.MAX_HEIGHT * 0.5
	SAND_HEIGHT: number = this.MAX_HEIGHT * 0.3
	DIRT2_HEIGHT: number = this.MAX_HEIGHT * 0

	// INFO: If the is no type any its can't compile
	stoneGeo:any = new THREE.BoxGeometry(0,0,0)
	dirstGeo:any = new THREE.BoxGeometry(0,0,0)
	dirst2Geo:any = new THREE.BoxGeometry(0,0,0)
	sandGeo:any = new THREE.BoxGeometry(0,0,0)
	grassGeo:any = new THREE.BoxGeometry(0,0,0)

	hexGeometry = (height: number, position: THREE.Vector2) => {
		let geo = new THREE.CylinderGeometry(1, 1, height, 6, 1 , false)
		geo.translate(position.x, height * 0.5, position.y)

		return geo
	}

	makeHex = (height:number, position:THREE.Vector2) => {
		const geo = this.hexGeometry(height, position)

		if (height > this.STONE_HEIGHT){
			this.stoneGeo = mergeGeometries([this.stoneGeo, geo])
		}else if (height > this.DIRT_HEIGHT) {
			this.dirstGeo = mergeGeometries([this.dirstGeo, geo])
		}else if (height > this.GRASS_HEIGHT) {
			this.grassGeo = mergeGeometries([this.grassGeo, geo])
		}else if (height > this.SAND_HEIGHT) {
			this.sandGeo = mergeGeometries([this.sandGeo, geo])
		}else if (height > this.DIRT2_HEIGHT) {
			this.dirst2Geo = mergeGeometries([this.dirst2Geo, geo])
		}
	}

	// TODO: Change any into a type 	
	hexMesh = (geo:any, map:any) => {
		const mat = new THREE.MeshPhysicalMaterial({
			map
		})
		const mesh = new THREE.Mesh(geo, mat)
		mesh.castShadow = true
		mesh.receiveShadow = true

		return mesh
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
			bg_color: "#ffeecc",
			height_water: this.MAX_HEIGHT * 0.2,
			position_water: this.MAX_HEIGHT * 0.099,
		}

		// Textures Loader
		const textureLoader = new THREE.TextureLoader()
		const textures = {
			dirt: textureLoader.load("/assets/map/dirt.png"),
			dirt2: textureLoader.load("/assets/map/dirt2.jpg"),
			grass: textureLoader.load("/assets/map/grass.jpg"),
			sand: textureLoader.load("/assets/map/sand.jpg"),
			water: textureLoader.load("/assets/map/water.jpg"),
			stone: textureLoader.load("/assets/map/stone.png"),
		}
		
		// Set up Scene
		const scene = new THREE.Scene()
		scene.background = new THREE.Color(parameters_scene.bg_color)
		gui_scene.addColor(parameters_scene, "bg_color").onChange((value: THREE.Color) => {
			// TODO: Maybe need to change
			scene.background = new THREE.Color(parameters_scene.bg_color)
		})

		const noise2D = createNoise2D();

		for (let i = -10; i <= 10; i++){
			for (let j = -10; j <= 10; j++){
				let position = this.tileToPosition(i, j)

				if (position.length() > 16) continue

				// The noise to make the relief
				let noise = (noise2D(i * 0.1, j * 0.1) + 1) * 0.5
				noise = Math.pow(noise, 2)

				this.makeHex(noise * this.MAX_HEIGHT, position)
			}
		}

		const stoneMesh = this.hexMesh(this.stoneGeo, textures.stone)
		const grassMesh = this.hexMesh(this.grassGeo, textures.grass)
		const dirst2Mesh = this.hexMesh(this.dirst2Geo, textures.dirt2)
		const dirstMesh = this.hexMesh(this.dirstGeo, textures.dirt)
		const sandMesh = this.hexMesh(this.sandGeo, textures.sand)
		scene.add(stoneMesh, grassMesh, dirst2Mesh, dirstMesh, sandMesh)



		// Add water
		const seaMesh = new THREE.Mesh(
			new THREE.CylinderGeometry(17, 17, parameters_scene.height_water, 50),
			new THREE.MeshPhysicalMaterial({
				color: "#55aaff",
				ior: 1.4,
				transmission: 1,
				transparent: true,
				thickness: 1,
				roughness :1, 
				metalness: 0.025,
				roughnessMap: textures.water,
				metalnessMap: textures.water
			})
		)
		seaMesh.receiveShadow = true
		seaMesh.position.set(0, parameters_scene.position_water, 0)
		scene.add(seaMesh)

		// Add map container 
		// const mapContainer = new THREE.Mesh(
		// 	new THREE.CylinderGeometry(17, 17.1, this.MAX_HEIGHT * 0.25, 50, 1, true),
		// 	new THREE.MeshPhysicalMaterial({
		// 		map: textures.dirt,
		// 		envMapIntensity: 0.2,
		// 	})
		// )
		// mapContainer.receiveShadow = true
		// mapContainer.position.set(0, this.MAX_HEIGHT * 0.124, 0)
		// scene.add(mapContainer)


		// Add map floor
		const mapFloor = new THREE.Mesh(
			new THREE.CylinderGeometry(18.5, 18.5, this.MAX_HEIGHT * 0.1, 50),
			new THREE.MeshPhysicalMaterial({
				map: textures.dirt2,
				side: THREE.DoubleSide
			})
		)
		mapFloor.receiveShadow = true
		mapFloor.position.set(0, - this.MAX_HEIGHT * 0.05, 0)
		scene.add(mapFloor)



		// Ambient light
		const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.15)
		gui_anbiant_light.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name("Intensity ambiant light")
		scene.add(ambientLight)
		
		// Directional light
		const directionalLight = new THREE.DirectionalLight('#ffcb8e', 0.5)
		directionalLight.position.set(10, 20, 10)

		// Direction Light Shadow setup Create shadows
		directionalLight.castShadow = true
		// Attention : augmenter la resolution de la camera de la lumière consome beaucoup de performance
		directionalLight.shadow.mapSize.width = 512
		directionalLight.shadow.mapSize.height = 512 
		directionalLight.shadow.camera.near = 0.5
		directionalLight.shadow.camera.far = 500

		directionalLight.shadow.camera.top = 15
		directionalLight.shadow.camera.right = 15
		directionalLight.shadow.camera.bottom = -15
		directionalLight.shadow.camera.left = -15
		
		const directionalLightCameraHelper = new THREE.DirectionalLightHelper(directionalLight)
		directionalLightCameraHelper.visible = false
		scene.add(directionalLightCameraHelper)

		gui_directional_light.add(directionalLightCameraHelper, "visible")
		gui_directional_light.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
		gui_directional_light.add(directionalLight.position, 'x').min(-50).max(50).step(0.001)
		gui_directional_light.add(directionalLight.position, 'y').min(-50).max(50).step(0.001)
		gui_directional_light.add(directionalLight.position, 'z').min(-50).max(50).step(0.001)
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
		renderer.shadowMap.enabled = true
		renderer.shadowMap.type = THREE.PCFSoftShadowMap


		



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
