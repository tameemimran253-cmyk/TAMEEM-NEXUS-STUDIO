import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface NexusWebGLSceneProps {
  scrollProgress?: number;
  activeSectionIndex?: number;
}

export const NexusWebGLScene: React.FC<NexusWebGLSceneProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect mobile or touch device to adaptively scale fidelity for 60-120fps
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isMobile = window.innerWidth < 768 || (isTouch && window.innerWidth < 1024);
    const maxPixelRatio = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);

    // 1. Scene & Depth Fog Setup (Dark Obsidian Base with Purple Horizon)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040308, isMobile ? 0.05 : 0.04);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.2);

    // 2. High-Fidelity Hardware-Accelerated WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      });
    } catch (e) {
      console.warn('WebGL initialization skipped:', e);
      return;
    }
    renderer.setPixelRatio(maxPixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 3. Cinematic Lighting System (Curated for performance)
    const ambientLight = new THREE.AmbientLight(0x100824, 2.2);
    scene.add(ambientLight);

    const keySpot = new THREE.SpotLight(0xa855f7, 6.0, 30, Math.PI / 3, 0.4, 1.2);
    keySpot.position.set(5, 7, 6);
    scene.add(keySpot);

    const rimCyanLight = new THREE.PointLight(0x38bdf8, 4.0, 20);
    rimCyanLight.position.set(-5, -3, -2);
    scene.add(rimCyanLight);

    const fillMagenta = new THREE.PointLight(0xe879f9, 3.5, 18);
    fillMagenta.position.set(4, -5, 2);
    scene.add(fillMagenta);

    const coreLight = new THREE.PointLight(0xd8b4fe, 4.5, 10);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // 4. Main Root Organism Group
    const organismGroup = new THREE.Group();
    scene.add(organismGroup);

    // Adaptive materials: Standard materials offer high gloss without costly GPU transmission passes
    const chromeObsidianMat = new THREE.MeshStandardMaterial({
      color: 0x070510,
      emissive: 0x240a3d,
      emissiveIntensity: 0.6,
      roughness: 0.12,
      metalness: 0.92,
    });

    const glassRefractMat = new THREE.MeshStandardMaterial({
      color: 0x0f0a22,
      emissive: 0x4a0974,
      emissiveIntensity: 0.5,
      roughness: 0.15,
      metalness: 0.85,
    });

    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: 0x3b0764,
      emissive: 0xa855f7,
      emissiveIntensity: 1.8,
      roughness: 0.1,
      metalness: 0.8,
    });

    // Outer Sweeping Petals
    const outerPetalsGroup = new THREE.Group();
    organismGroup.add(outerPetalsGroup);
    const outerPetals: THREE.Mesh[] = [];
    const outerPetalCount = isMobile ? 8 : 12;
    const outerKnotRadial = isMobile ? 36 : 56;
    const outerKnotTubular = isMobile ? 12 : 16;

    for (let i = 0; i < outerPetalCount; i++) {
      const angle = (i / outerPetalCount) * Math.PI * 2;
      const geo = new THREE.TorusKnotGeometry(0.7, 0.13, outerKnotRadial, outerKnotTubular, 2, 3);
      const mesh = new THREE.Mesh(geo, chromeObsidianMat);

      mesh.position.set(Math.cos(angle) * 1.3, Math.sin(angle) * 1.3, 0);
      mesh.rotation.set(0.4, angle, Math.PI / 4);
      mesh.scale.set(0.65, 0.65, 1.4);

      outerPetalsGroup.add(mesh);
      outerPetals.push(mesh);
    }

    // Mid-tier Crystalline Petals
    const midPetalsGroup = new THREE.Group();
    organismGroup.add(midPetalsGroup);
    const midPetals: THREE.Mesh[] = [];
    const midPetalCount = isMobile ? 8 : 14;
    const midKnotRadial = isMobile ? 32 : 48;
    const midKnotTubular = isMobile ? 10 : 14;

    for (let i = 0; i < midPetalCount; i++) {
      const angle = (i / midPetalCount) * Math.PI * 2 + Math.PI / midPetalCount;
      const geo = new THREE.TorusKnotGeometry(0.5, 0.1, midKnotRadial, midKnotTubular, 3, 4);
      const mesh = new THREE.Mesh(geo, glassRefractMat);

      mesh.position.set(Math.cos(angle) * 0.9, Math.sin(angle) * 0.9, 0.2);
      mesh.rotation.set(0.6, angle, -Math.PI / 3);
      mesh.scale.set(0.55, 0.55, 1.2);

      midPetalsGroup.add(mesh);
      midPetals.push(mesh);
    }

    // Inner Radiant Stamens
    const stamenGroup = new THREE.Group();
    organismGroup.add(stamenGroup);
    const stamens: THREE.Mesh[] = [];
    const stamenCount = isMobile ? 10 : 16;

    for (let i = 0; i < stamenCount; i++) {
      const angle = (i / stamenCount) * Math.PI * 2;
      const geo = new THREE.ConeGeometry(0.08, 1.5, 8);
      geo.translate(0, 0.75, 0);
      const mesh = new THREE.Mesh(geo, chromeObsidianMat);

      mesh.rotation.z = angle;
      mesh.rotation.x = Math.PI / 2.5;
      mesh.scale.set(0.65, 0.65, 0.65);

      stamenGroup.add(mesh);
      stamens.push(mesh);
    }

    // Central Bioluminescent Nucleus
    const nucleusGeo = new THREE.IcosahedronGeometry(0.8, 2);
    const nucleusMesh = new THREE.Mesh(nucleusGeo, innerCoreMat);
    organismGroup.add(nucleusMesh);

    // Inner Glowing Geometric Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.0, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    organismGroup.add(cageMesh);

    // Dynamic Purple Nebula Powder Cloud (Optimized GPU instance)
    const powderGroup = new THREE.Group();
    organismGroup.add(powderGroup);

    const powderCount = isMobile ? 350 : 600;
    const powderGeo = new THREE.BufferGeometry();
    const powderPositions = new Float32Array(powderCount * 3);

    for (let i = 0; i < powderCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 0.8 + Math.random() * 2.8;

      powderPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      powderPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      powderPositions[i * 3 + 2] = r * Math.cos(phi);
    }

    powderGeo.setAttribute('position', new THREE.BufferAttribute(powderPositions, 3));
    const powderMat = new THREE.PointsMaterial({
      color: 0xc084fc,
      size: isMobile ? 0.045 : 0.05,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const powderPoints = new THREE.Points(powderGeo, powderMat);
    powderGroup.add(powderPoints);

    // Tentacles (Desktop only or low-segment on tablet)
    const tentacleGroup = new THREE.Group();
    if (!isMobile) {
      organismGroup.add(tentacleGroup);
      const tentacleCount = 6;
      for (let i = 0; i < tentacleCount; i++) {
        const angle = (i / tentacleCount) * Math.PI * 2;
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, -0.5, 0),
          new THREE.Vector3(Math.cos(angle) * 1.1, -1.5, Math.sin(angle) * 0.7),
          new THREE.Vector3(Math.cos(angle + 0.5) * 1.8, -2.8, Math.sin(angle) * 1.2),
          new THREE.Vector3(Math.cos(angle + 1.0) * 1.4, -3.8, Math.sin(angle) * 0.4),
        ]);

        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.05, 6, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, chromeObsidianMat);
        tentacleGroup.add(tubeMesh);
      }
    }

    // Mouse Tracking (Only on desktop non-touch pointers)
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 1.5;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 1.5;
    };
    if (!isTouch) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // Resize Handler with Debouncing
    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }, 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Smooth Animation Loop reading scroll directly without React re-renders
    let animationFrameId: number;
    let isVisible = true;
    const clock = new THREE.Clock();
    let currentScroll = 0;

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Directly compute scroll without React reconciliation
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const targetScroll = totalScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / totalScroll)) : 0;
      currentScroll += (targetScroll - currentScroll) * 0.1;

      // Mouse Smooth Inertia (Desktop only)
      if (!isTouch) {
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
      }

      // Rotation & Wobble
      organismGroup.rotation.y = elapsedTime * 0.12 + mouse.x * 0.35 + currentScroll * Math.PI * 2.0;
      organismGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.12 + mouse.y * 0.25;
      organismGroup.rotation.z = Math.cos(elapsedTime * 0.15) * 0.08;

      // Bloom Amount
      const bloom = Math.min(1.0, currentScroll * 2.0) + Math.sin(elapsedTime * 1.0) * 0.05;

      // Animate Outer Petals
      for (let idx = 0; idx < outerPetals.length; idx++) {
        const petal = outerPetals[idx];
        const angle = (idx / outerPetalCount) * Math.PI * 2;
        const spreadRadius = 1.1 + bloom * 1.25;
        petal.position.x = Math.cos(angle) * spreadRadius;
        petal.position.y = Math.sin(angle) * spreadRadius;
        petal.position.z = Math.sin(elapsedTime * 0.7 + idx) * 0.2 - bloom * 0.35;
        petal.rotation.x = 0.3 + bloom * 0.75;
      }

      // Animate Mid Petals
      for (let idx = 0; idx < midPetals.length; idx++) {
        const petal = midPetals[idx];
        const angle = (idx / midPetalCount) * Math.PI * 2;
        const spreadRadius = 0.75 + bloom * 0.85;
        petal.position.x = Math.cos(angle) * spreadRadius;
        petal.position.y = Math.sin(angle) * spreadRadius;
        petal.position.z = 0.2 + Math.cos(elapsedTime * 0.8 + idx) * 0.15;
      }

      // Animate Inner Stamens
      for (let idx = 0; idx < stamens.length; idx++) {
        const stamen = stamens[idx];
        const angle = (idx / stamenCount) * Math.PI * 2;
        const flare = 0.4 + bloom * 0.7;
        stamen.rotation.z = angle + elapsedTime * 0.04;
        stamen.rotation.x = (Math.PI / 2) * (1 - flare * 0.35);
      }

      // Core pulsation
      const corePulse = 1.0 + Math.sin(elapsedTime * 2.0) * 0.08;
      nucleusMesh.scale.setScalar(corePulse);
      cageMesh.rotation.x = -elapsedTime * 0.25;
      cageMesh.rotation.y = elapsedTime * 0.3;
      coreLight.intensity = 4.0 + Math.sin(elapsedTime * 2.5) * 1.5;

      // Rotate powder cloud via GPU transform matrix (zero CPU buffer upload cost)
      powderGroup.rotation.y = elapsedTime * 0.08;
      powderGroup.rotation.x = Math.sin(elapsedTime * 0.1) * 0.15;
      const powderExpand = 1.0 + bloom * 0.4;
      powderGroup.scale.set(powderExpand, powderExpand, powderExpand);

      // Camera Fluid Positioning along Scroll
      const targetCamZ = currentScroll < 0.25 ? 7.2 : currentScroll < 0.6 ? 6.5 : 7.6;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimer);
      if (!isTouch) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    />
  );
};
