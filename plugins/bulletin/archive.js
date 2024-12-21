import fs from 'fs'
import path from 'path'
import Handlebars from 'handlebars'

export function bulletinArchivePlugin() {
    return {
        name: 'bulletin-archive',
        buildStart: async () => {
            // Read and compile the template
            const archiveTemplatePath = path.resolve('src/templates/bulletin/archive.hbs')
            const template = fs.readFileSync(archiveTemplatePath, 'utf8')
            const compiledTemplate = Handlebars.compile(template)

            // Scan bulletin directory
            const targetDir = path.resolve('src/bulletin')
            let files
            try {
                files = fs.readdirSync(targetDir)
            } catch (error) {
                console.error('Error reading bulletin directory:', error)
                return
            }

            // Filter and sort bulletins
            const bulletins = files
                .filter(file =>
                    !file.endsWith('.css') &&
                    !file.endsWith('index.html') &&
                    !file.endsWith('archive.html')
                )
                .reverse()

            // Write the archive page
            const archiveDestinationPath = path.join(targetDir, 'archive.html')
            fs.writeFileSync(archiveDestinationPath, compiledTemplate({ bulletins }))
            console.log('Bulletin archive page built successfully.')
        }
    }
}