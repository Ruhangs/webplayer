const { version } = await import("../package.json");
const __VERSION__: string = "v" + version
export default __VERSION__