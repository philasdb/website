import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'
import { glob } from 'glob'
import path from 'path'
import { bulletinArchivePlugin } from './plugins/bulletin/archive.js'

export default defineConfig({
    root: 'src',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: Object.fromEntries(
                glob.sync('src/**/*.html').map(file => [
                    path.relative('src', file.slice(0, file.length - path.extname(file).length)),
                    file
                ])
            )
        }
    },
    plugins: [
        handlebars({
            partialDirectory: path.resolve(__dirname, 'src/partials'),
        }),
        bulletinArchivePlugin()
    ]
})