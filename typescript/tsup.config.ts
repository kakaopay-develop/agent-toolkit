import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/modelcontextprotocol/index.ts'],
    outDir: 'modelcontextprotocol',
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
  },
  {
    entry: ['src/ai-sdk/index.ts'],
    outDir: 'ai-sdk',
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
  },
  {
    entry: ['src/openai/index.ts'],
    outDir: 'openai',
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
  },
  {
    entry: ['src/langchain/index.ts'],
    outDir: 'langchain',
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
  },
  {
    entry: ['src/bedrock/index.ts'],
    outDir: 'bedrock',
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
  },
]);
