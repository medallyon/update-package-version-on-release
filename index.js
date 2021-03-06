const core = require("@actions/core")
	, github = require("@actions/github")
	, fs = require("fs-extra");

// most @actions toolkit packages have async methods
async function run()
{
	try
	{
		const payload = github.context.payload;
		let tag = payload.release.tag_name;

		if (tag.startsWith("v"))
			tag = tag.replace("v", "");

		if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm.test(tag))
		{
			throw new Error("Release Tag does not match semantic versioning.");
		}

		const pkg = await fs.readJson("./package.json")
			, originalVersion = pkg.version;

		pkg.version = tag;
		await fs.outputJson("./package.json", pkg, {
			spaces: 2
		});

		core.info(`Modified version number in package.json from ${originalVersion.replace("v", "")} to ${pkg.version}`);
	}

	catch (error)
	{
		core.setFailed(error.message);
	}
}

run();
