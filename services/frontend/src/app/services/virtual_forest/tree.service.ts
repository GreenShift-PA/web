import { Injectable } from '@angular/core';
import * as THREE from "three"
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

@Injectable({
  providedIn: 'root'
})
export class TreeService {

  constructor() { }

  hexGeometry = (height: number, position: THREE.Vector2) => {
		let geo = new THREE.CylinderGeometry(1, 1, height, 6, 1 , false)
		geo.translate(position.x, height * 0.5, position.y)

		return geo
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

  makesStone = (height:number, position:THREE.Vector2) => {
		const px = Math.random() * 0.4
		const pz = Math.random() * 0.4

		const geo = new THREE.SphereGeometry(Math.random() * 0.3 + 0.1, 7, 7)
		geo.translate(position.x + px, height, position.y + pz)

		return geo
	}

  makeclouds = (SIZE:number) => {
		let geo:any = new THREE.SphereGeometry(0, 0, 0); 
		let count = Math.floor(Math.pow(Math.random(), 0.45) * 4);
		count = (count * SIZE)
	  
		for(let i = 0; i < count; i++) {
		  const puff1 = new THREE.SphereGeometry(1.2, 7, 7);
		  const puff2 = new THREE.SphereGeometry(1.5, 7, 7);
		  const puff3 = new THREE.SphereGeometry(0.9, 7, 7);
		 
		  puff1.translate(-1.85, Math.random() * 0.3, 0);
		  puff2.translate(0,     Math.random() * 0.3, 0);
		  puff3.translate(1.85,  Math.random() * 0.3, 0);
	  
		  const cloudGeo = mergeGeometries([puff1, puff2, puff3]);
		  cloudGeo.translate( 
			(Math.random() * 20 - 10 * SIZE), 
			Math.random() * 7 + 13 , 
			(Math.random() * 20 - 10 * SIZE), 
		  );
		  cloudGeo.rotateY(Math.random() * Math.PI * 2);
	  
		  geo = mergeGeometries([geo, cloudGeo]);
		}
		
		const mesh = new THREE.Mesh(
		  geo,
		  new THREE.MeshStandardMaterial({
			envMapIntensity: 0.75, 
			flatShading: true,
			// transparent: true,
			// opacity: 0.85,
		  })
		);

		mesh.castShadow = true
	  
		return mesh
	}

  show_info_html = (tree_info:any) => {
		const tree_name = document.getElementById("tree_name")
		// const image = document.getElementById("profile_image")
		const username = document.getElementById("user_name")

		if(!tree_name || !username ){
			return 
		}

		tree_name.innerHTML = tree_info.name 
		username.innerHTML = `id : ${tree_info.id}`

	}	
}
