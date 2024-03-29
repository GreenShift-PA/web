import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router"
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import * as dat from 'lil-gui'
import { createNoise2D } from 'simplex-noise'
import { TreeService } from 'src/app/services/virtual_forest/tree.service';
import { gsap } from 'gsap';

@Component({
selector: 'app-virtual-forest',
templateUrl: './virtual-forest.component.html',
styleUrls: ['./virtual-forest.component.css']
})
export class VirtualForestComponent implements OnInit, OnDestroy{

	constructor(private treeService: TreeService, private router: Router, private route: ActivatedRoute) {}

	trees:any = []

	goOnPage = (pageName: string) => {
		this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
		this.router.navigate([pageName]));
	} 
	
	ngOnInit(): void {
		this.route.queryParams.subscribe((params) => {
			const world = this.route.snapshot.paramMap.get('world');

			if (world && world=='follow'){
				this.treeService.getTreeDataFollow().subscribe(response => {
					this.trees = response;
					this.tree_params.max_nbr = this.trees.length,
					this.SIZE = this.chooseSize(this.tree_params.max_nbr)
					this.createThreeJsBox();
				  });
			}else if( world && world=="world"){
				this.treeService.getTreeDataWorld().subscribe(response => {
					this.trees = response;
					this.tree_params.max_nbr = this.trees.length,
					this.SIZE = this.chooseSize(this.tree_params.max_nbr)
					this.createThreeJsBox();
				  });
			}else{
				this.router.navigate(['/not-found'])
			}

		})
		
		// this.trees = this.treeService.getTreeFakeData()
		// this.tree_params.max_nbr = this.trees.length,
		// this.SIZE = this.chooseSize(this.tree_params.max_nbr)
		// this.createThreeJsBox();
	  }

	tileToPosition(tileX:number, tileY:number){
		return new THREE.Vector2((tileX + (tileY % 2) * 0.5) * 1.77, tileY * 1.535) 
	}


	metadata:any = {}
	metaCounter = 0

	currentIntersect:any = null
	currentTree_info:any = null

	tree_params:any = {
		max_nbr : 0,
		counter : 0,
		position : [],
		hit_box: []
	}

	// Size of the make (1 make a map of 10/10)
	// DON'T GO FURTHER THAN 4
	SIZE:number = 1

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

	scene:any = new THREE.Scene()

	first_tree = true
	

	chooseSize = (nbr_trees: number):number => {

		if(nbr_trees < 7){
			return 1
		}else if ( nbr_trees < 40){
			return 2
		}else if ( nbr_trees < 100){
			return 3
		}else{
			return 4
		}

	}


	makeHex = (height:number, position:THREE.Vector2) => {
		const geo: THREE.CylinderGeometry = this.treeService.hexGeometry(height, position)

		if (height > this.STONE_HEIGHT){
			this.stoneGeo = mergeGeometries([this.stoneGeo, geo])
			if(Math.random() > 0.8){
				this.stoneGeo = mergeGeometries([this.stoneGeo, this.treeService.makesStone(height, position)])
			}

		}else if (height > this.DIRT_HEIGHT) {
			this.dirstGeo = mergeGeometries([this.dirstGeo, geo])

			if(Math.random() > 0.9 && this.tree_params.counter < this.tree_params.max_nbr){
				this.grassGeo = mergeGeometries([this.grassGeo, this.makeTree(height, position)])
			}

		}else if (height > this.GRASS_HEIGHT) {
			this.grassGeo = mergeGeometries([this.grassGeo, geo])
			if(Math.random() > 0.85 && this.tree_params.counter < this.tree_params.max_nbr){
				this.grassGeo = mergeGeometries([this.grassGeo, this.makeTree(height, position)])
			}
			if(Math.random() > 0.9 && this.stoneGeo){
				this.stoneGeo = mergeGeometries([this.stoneGeo, this.treeService.makesStone(height, position)])
			}

		}else if (height > this.SAND_HEIGHT) {
			this.sandGeo = mergeGeometries([this.sandGeo, geo])
			if(Math.random() > 0.85 && this.stoneGeo){
				this.stoneGeo = mergeGeometries([this.stoneGeo, this.treeService.makesStone(height, position)])
			}

		}else if (height > this.DIRT2_HEIGHT) {
			this.dirst2Geo = mergeGeometries([this.dirst2Geo, geo])

			if(Math.random() > 0.9 && this.stoneGeo){
				this.stoneGeo = mergeGeometries([this.stoneGeo, this.treeService.makesStone(height, position)])
			}
		}
	}

	makeTree = (height: number , position: THREE.Vector2) => {
		// To change the height of the tree
		const treeHeight = Math.random() * 1 + 1.25
		const tree_size = this.trees[this.tree_params.counter].tree.size
		const new_tree_size = ((tree_size - 0) / (100 - 0)) * (4 - 1) + 1;

		const geo = new THREE.CylinderGeometry(0, 1.5, new_tree_size, 3)
		geo.translate(position.x, height + new_tree_size * 0 + 1, position.y)

		const geo2 = new THREE.CylinderGeometry(0, 1.15, new_tree_size, 3)
		geo2.translate(position.x, height + new_tree_size * 0.6 + 1, position.y)

		const geo3 = new THREE.CylinderGeometry(0, 0.8, new_tree_size, 3)
		geo3.translate(position.x, height + new_tree_size * 1.25 + 1, position.y)

		this.tree_params.position.push({
			x: position.x,
			y: position.y,
			z: height,
			size: new_tree_size
		})
		this.tree_params.counter ++

		return mergeGeometries([geo, geo2, geo3])

	}
	
	createThreeJsBox = () => {
		
		const canvas = document.getElementById('canvas')
		if (!canvas){return }
		
		//Setup debug 
		const gui = new dat.GUI()
		gui.close();
		gui.hide()
		const gui_scene = gui.addFolder("Scene")
		const gui_light = gui_scene.addFolder("Lights")
		const gui_directional_light = gui_light.addFolder("Directional light")
		const gui_anbiant_light = gui_light.addFolder("Ambient light")
		const gui_camera = gui_scene.addFolder("Camera helper")
		const gui_look_at = gui_camera.addFolder("Look at")

		const gui_helper = gui.addFolder("Cursor Helpers")

		const parameters_scene = {
			bg_color: "#ffeecc",
			height_water: this.MAX_HEIGHT * 0.2,
			position_water: this.MAX_HEIGHT * 0.099,
		}

		// Textures Loader
		const loaddingManager = new THREE.LoadingManager(
			// Loaded
			() => {
				gsap.to(camera.position, {y:(31 * this.SIZE), z:(-35 * this.SIZE  ), duration: 3} )
			}, 
			// Progress
			() => {
			}
		)
		const textureLoader = new THREE.TextureLoader(loaddingManager)
		const textures = {
			dirt: textureLoader.load("/assets/map/1/dirt.png"),
			dirt2: textureLoader.load("/assets/map/1/dirt2.jpg"),
			grass: textureLoader.load("/assets/map/1/grass.jpg"),
			sand: textureLoader.load("/assets/map/1/sand.jpg"),
			water: textureLoader.load("/assets/map/1/water.jpg"),
			stone: textureLoader.load("/assets/map/1/stone.png"),
			target: textureLoader.load("/assets/target.png"),
			target_self: textureLoader.load("/assets/target_self.png")
		}
		
		// Set up Scene
		this.scene.background = new THREE.Color(parameters_scene.bg_color)
		gui_scene.addColor(parameters_scene, "bg_color").onChange((value: THREE.Color) => {
			// TODO: Maybe need to change
			this.scene.background = new THREE.Color(parameters_scene.bg_color)
		})

		const noise2D = createNoise2D();

		for (let i = (-10 * this.SIZE); i <= (10 * this.SIZE); i++){
			for (let j = (-10 * this.SIZE); j <= (10 * this.SIZE); j++){
				let position = this.tileToPosition(i, j)

				if (position.length() > (16 * this.SIZE)) continue

				// The noise to make the relief
				let noise = (noise2D(i * 0.1, j * 0.1) + 1) * 0.5
				noise = Math.pow(noise, 2)

				this.makeHex(noise * this.MAX_HEIGHT, position)
			}
		}

		const stoneMesh = this.treeService.hexMesh(this.stoneGeo, textures.stone)
		const grassMesh = this.treeService.hexMesh(this.grassGeo, textures.grass)
		const dirst2Mesh = this.treeService.hexMesh(this.dirst2Geo, textures.dirt2)
		const dirstMesh = this.treeService.hexMesh(this.dirstGeo, textures.dirt)
		const sandMesh = this.treeService.hexMesh(this.sandGeo, textures.sand)
		this.scene.add(stoneMesh, grassMesh, dirst2Mesh, dirstMesh, sandMesh)

		let target_color
		// Make the hitBox
		for (let box of this.tree_params.position){
			if(this.first_tree){
				target_color = textures.target_self
				this.first_tree = false
			}else{
				target_color = textures.target
			}
			
			const hitBox = new THREE.Mesh(
				new THREE.BoxGeometry( 2, 2, 2, 2 ),
				new THREE.MeshBasicMaterial( {
					color: 0xffffff,
					transparent: true,
					map: target_color
				} )
			)
			hitBox.position.set(box.x, box.z + box.size , box.y)
			this.tree_params.hit_box.push(hitBox)
			this.metadata[hitBox.uuid] = this.metaCounter
			this.metaCounter ++
			this.scene.add(hitBox)
		}



		// Add water
		const seaMesh = new THREE.Mesh(
			new THREE.CylinderGeometry((17 * this.SIZE), (17 * this.SIZE), parameters_scene.height_water, 50),
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
		this.scene.add(seaMesh)

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
		// const mapFloor = new THREE.Mesh(
		// 	new THREE.CylinderGeometry((18.5 * this.SIZE), (18.5 * this.SIZE), this.MAX_HEIGHT * 0.1, 50),
		// 	new THREE.MeshPhysicalMaterial({
		// 		map: textures.dirt2,
		// 		side: THREE.DoubleSide
		// 	})
		// )
		// mapFloor.receiveShadow = true
		// mapFloor.position.set(0, - this.MAX_HEIGHT * 0.05, 0)
		// scene.add(mapFloor)

		// Add clouds 
		const clouds = this.treeService.makeclouds(this.SIZE)
		this.scene.add(clouds)


		// Ambient light
		const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.15)
		gui_anbiant_light.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
		gui_anbiant_light.addColor(ambientLight, 'color')
		this.scene.add(ambientLight)
		
		// Directional light
		const directionalLight = new THREE.DirectionalLight('#ffcb8e', 0.5)
		directionalLight.position.set(10, 12, 10)

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
		this.scene.add(directionalLightCameraHelper)

		gui_directional_light.add(directionalLightCameraHelper, "visible")
		gui_directional_light.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
		gui_directional_light.add(directionalLight.position, 'x').min(-50).max(50).step(0.001)
		gui_directional_light.add(directionalLight.position, 'y').min(-50).max(50).step(0.001)
		gui_directional_light.add(directionalLight.position, 'z').min(-50).max(50).step(0.001)
		gui_directional_light.addColor(directionalLight, "color")
		this.scene.add(directionalLight)


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
		camera.position.set(-22, (60 * this.SIZE), (50 * (this.SIZE * 0.5)));
		// camera.position.set(50,50,50);
		gui_camera.add(camera.position, "x").min(-50).max(50).step(1)
		gui_camera.add(camera.position, "y").min(-20).max(50).step(1)
		gui_camera.add(camera.position, "z").min(-50).max(50).step(1)
		this.scene.add(camera)
		
		var arrowHelper = new THREE.ArrowHelper(new THREE.Vector3(), new THREE.Vector3(), 1, 0xffff00)
		arrowHelper.visible = false
		this.scene.add(arrowHelper)
		gui_helper.add(arrowHelper, 'visible')
		
		// Controls
		const controls = new OrbitControls(camera, canvas)
		controls.target.set(2, 1, 0)
		gui_look_at.add(controls.target, "x").min(-50).max(50).step(1)
		gui_look_at.add(controls.target, "y").min(-20).max(50).step(1)
		gui_look_at.add(controls.target, "z").min(-50).max(50).step(1)
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

		const mouse = new THREE.Vector2()
		let intersects = new Array()
		
		window.addEventListener('mousemove', (_event) => {
			
			mouse.x = (_event.clientX / renderer.domElement.clientWidth) * 2 - 1,
			mouse.y = -(_event.clientY / renderer.domElement.clientHeight) * 2 + 1,
			
			raycaster.setFromCamera(
				mouse,
				camera
			)
			
			intersects = raycaster.intersectObjects(this.tree_params.hit_box, false)
			const display_box = document.querySelector('.description')

			
			if (intersects.length > 0 ) {
				let n = new THREE.Vector3()
				n.copy(intersects[0].face.normal)
				n.transformDirection(intersects[0].object.matrixWorld)
				arrowHelper.setDirection(n)
				arrowHelper.position.copy(intersects[0].point)


				if (this.currentIntersect && this.currentIntersect.object !== intersects[0].object){
					if(this.currentIntersect){
						display_box?.classList.toggle("no_visible")
						this.currentIntersect.object.material.color.set("#ffffff")
					}
	
					this.currentIntersect = null
					this.currentTree_info = null
				}
		
				
				if(this.currentIntersect === null){
					display_box?.classList.toggle("no_visible")
					intersects[0].object.material.color.set("#000000")
					const tree_info = this.trees[this.metadata[intersects[0].object.uuid]]
					this.treeService.show_info_html(tree_info)
					
				}

				this.currentIntersect = intersects[0]
				this.currentTree_info = this.trees[this.metadata[intersects[0].object.uuid]]

				
			}else{
				if(this.currentIntersect){
					display_box?.classList.toggle("no_visible")
					this.currentIntersect.object.material.color.set("#ffffff")
				}

				this.currentIntersect = null
				this.currentTree_info = null
				
			}
			
		})
		window.addEventListener("click", () => {
			if (this.currentIntersect){
				this.router.navigate(['/profile', this.currentTree_info._id])
			}

		})
		
		const raycaster = new THREE.Raycaster()
		
		raycaster.setFromCamera(mouse, camera)
		
		
		/**
		 * Animate
		*/
		const clock = new THREE.Clock()

		const tick = () => {

			const elapsedTime = clock.getElapsedTime()
			
			// Make the hit box look at you 
			for (let hitBox of this.tree_params.hit_box){
				hitBox.lookAt(camera.position)
				
			}


			// Update controls
			controls.update()

			// Render
			renderer.render(this.scene, camera)
		
			// Call tick again on the next frame
			window.requestAnimationFrame(tick)

		}

		tick()
	}


	ngOnDestroy(): void {
		
	}



}
