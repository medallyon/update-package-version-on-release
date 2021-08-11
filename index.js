const core = require("@actions/core")
	, github = require("@actions/github")
	, fs = require("fs-extra");

// most @actions toolkit packages have async methods
async function run()
{
	try
	{
		const payload = github.context.payload
			, tag = payload.release.tag_name;

		const pkg = await fs.readJson("./package.json")
			, originalVersion = pkg.version;

		pkg.version = tag.replace("v", "");
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
