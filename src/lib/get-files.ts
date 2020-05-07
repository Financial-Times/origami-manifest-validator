import {promises as fs} from "fs"

// filter out directories so recursive fields can use subdirs
export default async function getFiles(path: string) {
	return (await fs.readdir(path, {
		encoding: "utf-8",
		withFileTypes: true
	})).reduce(function (files, dirent) {
		if (dirent.isFile()) {
			files.push(dirent.name)
		}
		return files
	}, [])
}
