import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";

const BOOK_IMAGE =
  "/assets/img_20260401_195946_382-019d49a7-f8ae-7526-8c26-7323bd656417.jpg";

function BookMesh() {
  const ref = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, BOOK_IMAGE);

  const backTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 720;
    const ctx = canvas.getContext("2d")!;

    // White/cream background
    ctx.fillStyle = "#fdf8f0";
    ctx.fillRect(0, 0, 512, 720);

    // Top gold border bar
    ctx.fillStyle = "#c8960c";
    ctx.fillRect(0, 0, 512, 10);
    ctx.fillRect(0, 710, 512, 10);

    // Inner purple border
    ctx.strokeStyle = "#5b21b6";
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 472, 680);

    // Decorative gold line
    ctx.strokeStyle = "#c8960c";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(28, 28, 456, 664);

    // Price tag — big bold
    ctx.fillStyle = "#3b0764";
    ctx.font = "bold 88px Arial";
    ctx.textAlign = "center";
    ctx.fillText("\u20B9149", 256, 120);

    // Gold underline below price
    ctx.strokeStyle = "#c8960c";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(80, 138);
    ctx.lineTo(432, 138);
    ctx.stroke();

    // Title
    ctx.fillStyle = "#3b0764";
    ctx.font = "bold 32px Arial";
    ctx.fillText("Master AI Tools in 2026", 256, 200);

    // Subtitle
    ctx.fillStyle = "#5b21b6";
    ctx.font = "bold 22px Arial";
    ctx.fillText("Learn ChatGPT, Claude,", 256, 250);
    ctx.fillText("Gemini & More", 256, 282);

    // Divider
    ctx.strokeStyle = "#c8960c";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, 310);
    ctx.lineTo(432, 310);
    ctx.stroke();

    // Description lines
    ctx.fillStyle = "#1e1b4b";
    ctx.font = "bold 20px Arial";
    ctx.fillText("50+ Practical Templates", 256, 360);
    ctx.fillText("150+ Pages of Knowledge", 256, 392);
    ctx.fillText("Step-by-Step Lessons", 256, 424);
    ctx.fillText("Real-World AI Projects", 256, 456);

    // Divider
    ctx.strokeStyle = "#c8960c";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, 490);
    ctx.lineTo(432, 490);
    ctx.stroke();

    // Tagline
    ctx.fillStyle = "#5b21b6";
    ctx.font = "bold 18px Arial";
    ctx.fillText("Perfect for beginners", 256, 540);
    ctx.fillText("and professionals alike", 256, 568);

    // Bottom branding
    ctx.fillStyle = "#3b0764";
    ctx.font = "bold 24px Arial";
    ctx.fillText("Prabha Ebook", 256, 660);

    // Small gold dots decoration
    ctx.fillStyle = "#c8960c";
    ctx.beginPath();
    ctx.arc(180, 660, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(332, 660, 4, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }, []);

  const spineTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 140;
    canvas.height = 720;
    const ctx = canvas.getContext("2d")!;

    // White/cream background
    ctx.fillStyle = "#fdf8f0";
    ctx.fillRect(0, 0, 140, 720);

    // Top gold bar
    ctx.fillStyle = "#c8960c";
    ctx.fillRect(0, 0, 140, 8);
    // Bottom gold bar
    ctx.fillRect(0, 712, 140, 8);

    // Thin gold vertical line along right edge
    ctx.strokeStyle = "#c8960c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(136, 0);
    ctx.lineTo(136, 720);
    ctx.stroke();

    // Rotate context to write text vertically (bottom to top)
    ctx.save();
    ctx.translate(70, 360);
    ctx.rotate(-Math.PI / 2);

    // Title text
    ctx.textAlign = "center";
    ctx.fillStyle = "#3b0764";
    ctx.font = "bold 26px Arial";
    ctx.fillText("Master AI Tools in 2026", 60, -16);

    // Subtitle / brand
    ctx.fillStyle = "#5b21b6";
    ctx.font = "bold 20px Arial";
    ctx.fillText("Prabha Ebook", 60, 14);

    // Price — positioned toward top of spine (negative offset in rotated space)
    ctx.fillStyle = "#c8960c";
    ctx.font = "bold 28px Arial";
    ctx.fillText("\u20B9149", -260, -2);

    ctx.restore();

    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.6;
      ref.current.rotation.x = Math.sin(Date.now() * 0.0007) * 0.12;
    }
  });

  const materials = [
    // right
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.25, 0.08, 0.55),
      emissive: new THREE.Color(0.15, 0.05, 0.3),
      emissiveIntensity: 0.5,
    }),
    // left (spine) — white paper
    new THREE.MeshStandardMaterial({
      map: spineTexture,
      roughness: 0.6,
      metalness: 0.0,
    }),
    // top
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.9, 0.65, 0.1),
      emissive: new THREE.Color(0.4, 0.25, 0.02),
      emissiveIntensity: 0.6,
    }),
    // bottom
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.9, 0.65, 0.1),
      emissive: new THREE.Color(0.4, 0.25, 0.02),
      emissiveIntensity: 0.6,
    }),
    // front (cover) — real book photo
    new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.3,
      metalness: 0.2,
    }),
    // back — white paper with price & description
    new THREE.MeshStandardMaterial({
      map: backTexture,
      roughness: 0.6,
      metalness: 0.0,
    }),
  ];

  return (
    <mesh ref={ref} material={materials}>
      <boxGeometry args={[1.2, 1.7, 0.24]} />
    </mesh>
  );
}

export default function Book3D() {
  return (
    <div style={{ width: "300px", height: "400px" }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight
          position={[3, 3, 3]}
          color={new THREE.Color(0.85, 0.52, 0.05)}
          intensity={3}
        />
        <pointLight
          position={[-2, -1, 2]}
          color={new THREE.Color(0.48, 0.18, 0.92)}
          intensity={2}
        />
        <BookMesh />
      </Canvas>
    </div>
  );
}
