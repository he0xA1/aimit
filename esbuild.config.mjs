import { build } from "esbuild";

const isProduction = process.env.NODE_ENV === "production";

// Get external dependencies (native modules that can't be bundled)
const getExternalDependencies = () => {
  // Native modules that must be external (they have native bindings)
  return [
    "node-llama-cpp",
    // Add other native modules here if needed
  ];
};

const buildConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  outdir: "dist",
  platform: "node",
  target: "nodenext",
  format: "esm",
  sourcemap: !isProduction,
  minify: isProduction,
  external: getExternalDependencies(),
  tsconfig: "tsconfig.json",
  logLevel: "info",
};

// Build function
async function buildProject() {
  try {
    await build(buildConfig);
    console.log("✓ Build completed successfully");
  } catch (error) {
    console.error("✗ Build failed:", error);
    process.exit(1);
  }
}

// Watch function
async function watchProject() {
  const ctx = await build({
    ...buildConfig,
    watch: {
      onRebuild(error, result) {
        if (error) {
          console.error("✗ Watch build failed:", error);
        } else {
          console.log("✓ Watch build succeeded");
        }
      },
    },
  });
  console.log("👀 Watching for changes...");
}

// CLI
const command = process.argv[2];

if (command === "watch") {
  watchProject();
} else {
  buildProject();
}
