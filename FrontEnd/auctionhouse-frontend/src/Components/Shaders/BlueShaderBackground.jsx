import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

const BlueShaderBackground = () => {
  return (
    <div className="BlueSharderBackground-shader-wrapper">
      <ShaderGradientCanvas>
        <ShaderGradient
          control="off"
          animate="on"
          axesHelper="off"
          brightness={1.5}
          cAzimuthAngle={250}
          cDistance={1.5}
          cPolarAngle={140}
          cameraZoom={16.11}
          color1="#809bd6"
          color2="#910aff"
          color3="#af38ff"
          destination="onCanvas"
          embedMode="off"
          envPreset="city"
          format="gif"
          fov={45}
          frameRate={10}
          gizmoHelper="hide"
          grain="on"
          lightType="3d"
          pixelDensity={1}
          positionX={0}
          positionY={0}
          positionZ={0}
          range="disabled"
          rangeEnd={40}
          rangeStart={0}
          reflection={0.5}
          rotationX={0}
          rotationY={0}
          rotationZ={140}
          shader="defaults"
          type="sphere"
          uAmplitude={7}
          uDensity={1.1}
          uFrequency={5.5}
          uSpeed={0.3}
          uStrength={0.4}
          uTime={0}
          wireframe={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
};

export default BlueShaderBackground;
