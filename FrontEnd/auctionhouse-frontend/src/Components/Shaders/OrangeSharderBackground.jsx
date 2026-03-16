import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

const OrangeSharderBackground = () => {
  return (
    <div className="OrangeSharderBackground-shader-wrapper">
      <ShaderGradientCanvas>
        <ShaderGradient
          controls="off"
          animate="on"
          brightness={1.2}
          color1="#ff5005"
          color2="#dbba95"
          color3="#d0bce1"
          envPreset="city"
          grain="on"
          reflection={0.1}
          shader="defaults"
          type="plane"
          uAmplitude={1}
          uDensity={1.3}
          uFrequency={5.5}
          uSpeed={0.4}
          uStrength={4}
        />
      </ShaderGradientCanvas>
    </div>
  );
};

export default OrangeSharderBackground;
