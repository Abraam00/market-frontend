module.exports = {
	packagerConfig: {
		asar: true,
	},
	rebuildConfig: {},
	makers: [
		{
			name: "@electron-forge/maker-squirrel",
			config: {
				config: {
					name: "Market",
					authors: "Eimo",
					exe: "Market.exe",
					setupExe: "MarketSetup.exe",
				},
			},
		},
		{
			name: "@electron-forge/maker-zip",
			platforms: ["darwin", "win32"],
		},
		{
			name: "@electron-forge/maker-deb",
			config: {},
		},
		{
			name: "@electron-forge/maker-rpm",
			config: {},
		},
	],
	plugins: [
		{
			name: "@electron-forge/plugin-auto-unpack-natives",
			config: {},
		},
	],
};
