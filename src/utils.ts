export const session_options = {
    executionProviders: [
        {
            name: "ml" in navigator ? "webnn" : "webgpu",
            deviceType: "gpu",
            powerPreference: "default",
        },
    ],
    logSeverityLevel: 0,
}