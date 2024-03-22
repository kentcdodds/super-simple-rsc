// This is a server to host CDN distributed resources like module source files and SSR

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'
import http from 'node:http'
import compress from 'compression'
import chalk from 'chalk'
import express from 'express'
import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { createFromNodeStream } from 'react-server-dom-esm/client'
import { build } from 'esbuild'

const moduleBasePath = new URL('../src', import.meta.url).href

const app = express()

app.use(compress())

function request(options, body) {
	return new Promise((resolve, reject) => {
		const req = http.request(options, res => {
			resolve(res)
		})
		req.on('error', e => {
			reject(e)
		})
		body.pipe(req)
	})
}

app.all('/', async function (req, res, next) {
	// Proxy the request to the regional server.
	const proxiedHeaders = {
		'X-Forwarded-Host': req.hostname,
		'X-Forwarded-For': req.ips,
		'X-Forwarded-Port': 3000,
		'X-Forwarded-Proto': req.protocol,
	}
	// Proxy other headers as desired.
	if (req.get('rsc-action')) {
		proxiedHeaders['Content-type'] = req.get('Content-type')
		proxiedHeaders['rsc-action'] = req.get('rsc-action')
	} else if (req.get('Content-type')) {
		proxiedHeaders['Content-type'] = req.get('Content-type')
	}

	const promiseForData = request(
		{
			host: '127.0.0.1',
			port: 3001,
			method: req.method,
			path: req.url,
			headers: proxiedHeaders,
		},
		req,
	)

	if (req.accepts('text/html')) {
		try {
			const rscResponse = await promiseForData
			const moduleBaseURL = '/src'

			// For HTML, we're a "client" emulator that runs the client code,
			// so we start by consuming the RSC payload. This needs the local file path
			// to load the source files from as well as the URL path for preloads.

			let root
			function Root() {
				root ??= createFromNodeStream(
					rscResponse,
					moduleBasePath,
					moduleBaseURL,
				)
				return React.use(root)
			}
			// Render it into HTML by resolving the client components
			res.set('Content-type', 'text/html')
			const { pipe } = renderToPipeableStream(React.createElement(Root), {
				importMap: {
					imports: {
						react: 'https://esm.sh/react@experimental?pin=v124&dev',
						'react-dom': 'https://esm.sh/react-dom@experimental?pin=v124&dev',
						'react-dom/': 'https://esm.sh/react-dom@experimental&pin=v124&dev/',
						'react-error-boundary':
							'https://esm.sh/react-error-boundary@4.0.12?pin=124&dev',
						'spin-delay': 'https://esm.sh/spin-delay@1.2.0?pin=124&dev',
						'react-server-dom-esm/client':
							'/built_node_modules/react-server-dom-esm/esm/react-server-dom-esm-client.browser.development.js',
					},
				},
				bootstrapModules: ['/src/index.js'],
			})
			pipe(res)
		} catch (e) {
			console.error(`Failed to SSR: ${e.stack}`)
			res.statusCode = 500
			res.end()
		}
	} else {
		try {
			const rscResponse = await promiseForData

			// For other request, we pass-through the RSC payload.
			res.set('Content-type', 'text/x-component')
			rscResponse.on('data', data => {
				res.write(data)
				res.flush()
			})
			rscResponse.on('end', data => {
				res.end()
			})
		} catch (e) {
			console.error(`Failed to proxy request: ${e.stack}`)
			res.statusCode = 500
			res.end()
		}
	}
})

app.use(express.static('public'))
app.get('/src/*', async (req, res, next) => {
	if (req.url.includes('..')) {
		res.sendStatus(403)
		return
	}

	const filePath = path.join(
		fileURLToPath(moduleBasePath),
		req.url.replace('/src/', ''),
	)
	if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
		try {
			const result = await build({
				entryPoints: [filePath],
				bundle: false,
				write: false,
				minify: false,
				sourcemap: true,
				format: 'esm',
			})
			const code = result.outputFiles[0].text
			res.type('application/javascript')
			res.send(code)
		} catch (error) {
			console.error(`Failed to compile file: ${filePath}`, error.stack)
			res.sendStatus(500)
		}
	} else {
		try {
			const content = await fs.readFile(filePath, 'utf-8')
			res.type('application/javascript')
			res.send(content)
		} catch (error) {
			console.error(`Failed to read file: ${filePath}`, error.stack)
			res.sendStatus(500)
		}
	}
})
app.use('/built_node_modules', express.static('built_node_modules'))

app.listen(3000, () => {
	console.log('✅ SSR: http://localhost:3000')
})

app.on('error', function (error) {
	if (error.syscall !== 'listen') {
		throw error
	}

	switch (error.code) {
		case 'EACCES':
			console.error('port 3000 requires elevated privileges')
			process.exit(1)
			break
		case 'EADDRINUSE':
			console.error('Port 3000 is already in use')
			process.exit(1)
			break
		default:
			throw error
	}
})
