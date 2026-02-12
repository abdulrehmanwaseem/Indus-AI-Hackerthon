import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputSvg = "public/logo.svg";
const outputDir = "public";

const sizes = [
  { size: 192, name: "logo-pwa-192x192.png" },
  { size: 512, name: "logo-pwa-512x512.png" },
];

const maskableSize = 512;
const maskableName = "logo-maskable-icon-512x512.png";

async function generateIcons() {
  try {
    const svgBuffer = fs.readFileSync(inputSvg);

    // Generate standard icons
    for (const { size, name } of sizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, name));
      console.log(`Generated ${name}`);
    }

    // Generate maskable icon
    // For maskable, we need to ensure the logo is within the safe zone (80% of the center)
    // We'll create a background and composite the logo on top.
    const logoSize = Math.floor(maskableSize * 0.7); // 70% of the icon size
    const logoBuffer = await sharp(svgBuffer)
      .resize(logoSize, logoSize)
      .toBuffer();

    await sharp({
      create: {
        width: maskableSize,
        height: maskableSize,
        channels: 4,
        background: { r: 13, g: 148, b: 136, alpha: 1 }, // #0D9488
      },
    })
      .composite([{ input: logoBuffer, gravity: "center" }])
      .png()
      .toFile(path.join(outputDir, maskableName));
    console.log(`Generated ${maskableName}`);

    console.log("All icons generated successfully!");
  } catch (error) {
    console.error("Error generating icons:", error);
  }
}

generateIcons();
