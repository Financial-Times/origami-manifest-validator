import {promises as fs} from "fs"

export default async function checkIsFile (path: string) {
	return fs.stat(path)
	// hmm, this might be unclear if it fails and there is
	// a non-file file at this point
		.then(entry => entry.isFile())
		.catch(() => false)
}
