import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

const YellowShaderBackground = () => {
  return (
    <div className="YellowShaderBackground-shader-wrapper">
      <ShaderGradientCanvas>
        <ShaderGradient
          animate="on"
          axesHelper="on"
          brightness={1.1}
          cAzimuthAngle={0}
          cDistance={7.1}
          cPolarAngle={140}
          cameraZoom={11.2}
          color1="#ffffff"
          color2="#ffbb00"
          color3="#0700ff"
          destination="onCanvas"
          embedMode="off"
          envPreset="city"
          format="gif"
          fov={45}
          frameRate={10}
          gizmoHelper="hide"
          grain="off"
          lightType="3d"
          pixelDensity={0.9}
          positionX={0}
          positionY={0}
          positionZ={0}
          range="disabled"
          rangeEnd={40}
          rangeStart={0}
          reflection={0.1}
          rotationX={0}
          rotationY={0}
          rotationZ={0}
          shader="defaults"
          type="sphere"
          uAmplitude={4.7}
          uDensity={1.2}
          uFrequency={5.5}
          uSpeed={0.1}
          uStrength={2.6}
          uTime={0}
          wireframe={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
};

export default YellowShaderBackground;
