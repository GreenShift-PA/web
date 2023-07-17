import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { TokenService } from '../token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserResponse } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  constructor(private http: HttpClient, private token: TokenService) {}

  getTreeDataFollow = () => {
    const token = this.token.getItemWithExpiry("token");
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<UserResponse>("http://localhost:3000/user/follow", { headers })
    } else {
      throw new Error("Token not found in local storage");
    }
  }

  getTreeDataWorld = () => {
    const token = this.token.getItemWithExpiry("token");
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<UserResponse>("http://localhost:3000/user/all", { headers })
    } else {
      throw new Error("Token not found in local storage");
    }
  }

  hexGeometry = (height: number, position: THREE.Vector2) => {
    let geo = new THREE.CylinderGeometry(1, 1, height, 6, 1, false);
    geo.translate(position.x, height * 0.5, position.y);

    return geo;
  };

  // TODO: Change any into a type
  hexMesh = (geo: any, map: any) => {
    const mat = new THREE.MeshPhysicalMaterial({
      map,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  };

  makesStone = (height: number, position: THREE.Vector2) => {
    const px = Math.random() * 0.4;
    const pz = Math.random() * 0.4;

    const geo = new THREE.SphereGeometry(Math.random() * 0.3 + 0.1, 7, 7);
    geo.translate(position.x + px, height, position.y + pz);

    return geo;
  };

  makeclouds = (SIZE: number) => {
    let geo: any = new THREE.SphereGeometry(0, 0, 0);
    let count = Math.floor(Math.pow(Math.random(), 0.45) * 4);
    count = count * SIZE;

    for (let i = 0; i < count; i++) {
      const puff1 = new THREE.SphereGeometry(1.2, 7, 7);
      const puff2 = new THREE.SphereGeometry(1.5, 7, 7);
      const puff3 = new THREE.SphereGeometry(0.9, 7, 7);

      puff1.translate(-1.85, Math.random() * 0.3, 0);
      puff2.translate(0, Math.random() * 0.3, 0);
      puff3.translate(1.85, Math.random() * 0.3, 0);

      const cloudGeo = mergeGeometries([puff1, puff2, puff3]);
      cloudGeo.translate(
        Math.random() * 20 - 10 * SIZE,
        Math.random() * 7 + 13,
        Math.random() * 20 - 10 * SIZE
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

    mesh.castShadow = true;

    return mesh;
  };

  show_info_html = (tree_info: any) => {
    const tree_name = document.getElementById('tree_name');
    // const image = document.getElementById("profile_image")
    const username = document.getElementById('user_name');
    const userImage = document.getElementById('user_image') as HTMLImageElement

    if (!tree_name || !username || !userImage) {
      return;
    }

    tree_name.innerHTML = `${tree_info.tree.name} : ${tree_info.tree.size}`;
    username.innerHTML = `${tree_info.login}`;
    userImage.src = `${tree_info.image}`
  };


  getTreeFakeData = () => {
    // Il faut appeller la route GET {{URL}}/user/all
    return [
      {
        follow: [],
        _id: "64b12696f4cba4ffd6d5aefc",
        login: "guest@mail.com",
        password: "",
        roles: [],
        tree: {
          _id: "64b12696f4cba4ffd6d5aef7",
          name: "First tree of guest",
          size: 0
        },
        posts: [],
        todoTask: [],
        adress: "C'est un tutilisateur de test",
        phone: "C'est un tutilisateur de test",
        skills: [
          "C'est un tutilisateur de test"
        ],
        hobbies: [
          "C'est un tutilisateur de test"
        ],
        job: "C'est un tutilisateur de test",
        aboutMe: "C'est un tutilisateur de test",
        workHistory: [
          "C'est un tutilisateur de test"
        ],
        joinDate: "2023-07-14T10:42:30.235Z",
        organization: "C'est un tutilisateur de test",
        dirthday: "2023-07-14T10:42:30.235Z",
        languages: [
          "C'est un tutilisateur de test"
        ]
      },
      {
        follow: [],
        _id: "64b12696f4cba4ffd6d5aefe",
        login: "admin@mail.com",
        password: "",
        roles: [],
        tree: {
          _id: "64b12696f4cba4ffd6d5aef6",
          name: "First tree of admin",
          size: 0
        },
        posts: [],
        todoTask: [],
        adress: "C'est un tutilisateur de test",
        phone: "C'est un tutilisateur de test",
        skills: [
          "C'est un tutilisateur de test"
        ],
        hobbies: [
          "C'est un tutilisateur de test"
        ],
        job: "C'est un tutilisateur de test",
        aboutMe: "C'est un tutilisateur de test",
        workHistory: [
          "C'est un tutilisateur de test"
        ],
        joinDate: "2023-07-14T10:42:30.240Z",
        organization: "C'est un tutilisateur de test",
        dirthday: "2023-07-14T10:42:30.240Z",
        languages: [
          "C'est un tutilisateur de test"
        ]
      },
      {
        follow: [],
        _id: "64b126b6f4cba4ffd6d5af03",
        login: "user1@mail.com",
        password: "",
        roles: [],
        tree: {
          _id: "64b126b6f4cba4ffd6d5af00",
          name: "Persistent optimal budgetary management",
          size: 0
        },
        posts: [],
        todoTask: [],
        adress: "68842 Jan Road",
        phone: "760-597-7117",
        skills: [
          "Robust monitor synergize Sleek",
          "monitor Legacy Strategist Accounts Implementation",
          "Rubber circuit synthesize Pennsylvania"
        ],
        hobbies: [
          "multi-byte",
          "open-source",
          "open-source"
        ],
        job: "Central Interactions Agent",
        aboutMe: "Qui explicabo porro. Voluptatem qui a possimus neque laudantium totam. Debitis incidunt nisi nam rerum. Et consectetur quasi.",
        workHistory: [
          "2",
          "Kuhic, Anderson and Tromp",
          "Larson LLC",
          "Durgan Inc"
        ],
        joinDate: "2022-08-28T11:49:45.000Z",
        organization: "Durgan Inc",
        dirthday: "2022-07-27T02:08:27.000Z",
        languages: [
          "Guinea",
          "Barbados",
          "Lesotho"
        ]
      },
      {
        _id: "64b185b52216de8857edede7",
        login: "user2@mail.com",
        password: "",
        roles: [],
        tree: {
          _id: "64b185b52216de8857edede5",
          name: "Enterprise-wide hybrid data-warehouse",
          size: 0
        },
        posts: [],
        todoTask: [],
        image: "http://placeimg.com/640/480/people",
        adress: "0740 Conn Island",
        phone: "277-405-6864",
        skills: [
          "Generic Utah blue",
          "Loan payment white",
          "Planner lime"
        ],
        hobbies: [
          "digital",
          "1080p",
          "back-end"
        ],
        job: "Principal Security Engineer",
        aboutMe: "Excepturi sint sequi. Dolorem voluptas recusandae qui. Debitis dolore suscipit laboriosam sunt quo tempora. Quas quibusdam qui exercitationem aspernatur magnam eveniet ut. Nihil dolor in delectus possimus rerum et.",
        workHistory: [
          "Rohan, Moore and Pagac",
          "Paucek Group",
          "Littel - Lubowitz"
        ],
        joinDate: "2023-07-10T12:29:46.000Z",
        organization: "Kub LLC",
        dirthday: "2022-10-13T20:47:40.000Z",
        languages: [
          "Estonia",
          "Tokelau",
          "Japan"
        ],
        follow: [
          "64b185b52216de8857edede7"
        ]
      }
    ]
    }
}
