"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Cell3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    const size = 320;
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Luz (sutil) — mesmo com MeshBasic, deixo preparado caso troque material
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    const geometry = new THREE.PlaneGeometry(3, 3);

    const texture = new THREE.TextureLoader().load("/images/celula.png");
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    let frameId = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // “efeito real”: vai e volta entre -90° e +90° (180° total)
      const t = Date.now() * 0.001;
      plane.rotation.y = Math.sin(t) * (Math.PI / 2);

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      // mantém 1:1, só ajusta nitidez
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frameId);

      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div ref={mountRef} aria-label="Modelo 3D da célula" />
    </div>
  );
}