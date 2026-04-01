import { useFrame, useThree } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

function Starfield() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.015;
      ref.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={new THREE.Color(0.7, 0.5, 1.0)}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function IcosahedronWireframe() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.12;
      ref.current.rotation.x += delta * 0.07;
    }
  });
  return (
    <mesh ref={ref} position={[4, 1, -8]}>
      <icosahedronGeometry args={[2.5, 1]} />
      <meshBasicMaterial
        color={new THREE.Color(0.48, 0.18, 0.92)}
        wireframe
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

const EDGE_PAIRS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

const EDGE_KEYS_3 = EDGE_PAIRS.map((_, i) => `outer-${i}`);
const EDGE_KEYS_1_5 = EDGE_PAIRS.map((_, i) => `inner-${i}`);

function makeEdgeMeshes(size: number, keys: string[]) {
  const h = size / 2;
  const pts: [number, number, number][] = [
    [-h, -h, -h],
    [h, -h, -h],
    [h, h, -h],
    [-h, h, -h],
    [-h, -h, h],
    [h, -h, h],
    [h, h, h],
    [-h, h, h],
  ];
  return EDGE_PAIRS.map(([a, b], i) => {
    const pa = new THREE.Vector3(...pts[a]);
    const pb = new THREE.Vector3(...pts[b]);
    const dir = pb.clone().sub(pa);
    const len = dir.length();
    const mid = pa.clone().add(pb).multiplyScalar(0.5);
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.normalize(),
    );
    return (
      <mesh key={keys[i]} position={[mid.x, mid.y, mid.z]} quaternion={q}>
        <cylinderGeometry args={[0.015, 0.015, len, 4]} />
        <meshBasicMaterial
          color={new THREE.Color(0.2, 0.75, 0.9)}
          transparent
          opacity={0.5}
        />
      </mesh>
    );
  });
}

function Hypercube() {
  const outerRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (outerRef.current) outerRef.current.rotation.y += delta * 0.2;
    if (innerRef.current) {
      innerRef.current.rotation.x += delta * 0.3;
      innerRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={outerRef} position={[-5, -1, -10]}>
      {makeEdgeMeshes(3, EDGE_KEYS_3)}
      <group ref={innerRef}>{makeEdgeMeshes(1.5, EDGE_KEYS_1_5)}</group>
    </group>
  );
}

function FloatingOrb({
  position,
  color,
  speed,
  phase,
  orbKey,
}: {
  position: [number, number, number];
  color: THREE.Color;
  speed: number;
  phase: number;
  orbKey: string;
}) {
  // orbKey is just for external key prop usage
  void orbKey;
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(phase);
  useFrame((_, delta) => {
    t.current += delta * speed;
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t.current) * 0.4;
      ref.current.rotation.y += delta * 0.5;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function MouseParallax() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useFrame((_, delta) => {
    camera.position.x +=
      (mouse.current.x * 0.5 - camera.position.x) * delta * 1.5;
    camera.position.y +=
      (mouse.current.y * 0.3 - camera.position.y) * delta * 1.5;
  });

  return null;
}

const ORB_DATA = [
  {
    orbKey: "orb-0",
    position: [3, 1, -3] as [number, number, number],
    color: new THREE.Color(0.48, 0.18, 0.92),
    speed: 0.8,
    phase: 0,
  },
  {
    orbKey: "orb-1",
    position: [-4, 0.5, -5] as [number, number, number],
    color: new THREE.Color(0.02, 0.72, 0.83),
    speed: 1.1,
    phase: 1,
  },
  {
    orbKey: "orb-2",
    position: [6, -1, -7] as [number, number, number],
    color: new THREE.Color(0.85, 0.52, 0.05),
    speed: 0.6,
    phase: 2,
  },
  {
    orbKey: "orb-3",
    position: [-2, 2, -4] as [number, number, number],
    color: new THREE.Color(0.48, 0.18, 0.92),
    speed: 0.9,
    phase: 0.5,
  },
  {
    orbKey: "orb-4",
    position: [1, -2, -6] as [number, number, number],
    color: new THREE.Color(0.58, 0.12, 0.78),
    speed: 0.7,
    phase: 3,
  },
  {
    orbKey: "orb-5",
    position: [-6, -0.5, -9] as [number, number, number],
    color: new THREE.Color(0.02, 0.72, 0.83),
    speed: 1.3,
    phase: 1.5,
  },
];

function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight
        position={[0, 0, 2]}
        color={new THREE.Color(0.48, 0.18, 0.92)}
        intensity={1}
      />
      <Starfield />
      <IcosahedronWireframe />
      <Hypercube />
      {ORB_DATA.map((orb) => (
        <FloatingOrb key={orb.orbKey} {...orb} />
      ))}
      <MouseParallax />
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        background: "oklch(0.08 0.03 270)",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
