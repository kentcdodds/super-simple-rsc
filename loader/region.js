import { fileURLToPath } from 'url'
import {
	resolve,
	load as reactLoad,
	getSource as getSourceImpl,
	transformSource as reactTransformSource,
} from 'react-server-dom-esm/node-loader'
import { build } from 'esbuild'

export { resolve }

async function textLoad(url, context, defaultLoad) {
	const { format } = context
	debugger
	const loaded = await defaultLoad(url, context)
	if (!loaded.source) return loaded

	const filePath = url.startsWith('file://') ? fileURLToPath(url) : url
	const code = loaded.source.toString()

	if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
		const result = await build({
			entryPoints: [filePath],
			bundle: false,
			write: false,
			minify: false,
			sourcemap: true,
			format: 'esm',
		})
		const code = result.outputFiles[0].text
		return {
			source: code,
			format: 'module',
		}
	} else {
		if (loaded.format === 'module') {
			if (typeof loaded.source === 'string') {
				return loaded
			}
			return {
				source: Buffer.from(loaded.source).toString('utf8'),
				format: 'module',
			}
		}
		return loaded
	}
}

export async function load(url, context, defaultLoad) {
	return await reactLoad(url, context, (u, c) => {
		return textLoad(u, c, defaultLoad)
	})
}
