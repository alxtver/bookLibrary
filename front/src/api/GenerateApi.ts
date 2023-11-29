import ky from 'ky'

class GenerateApi {
    private prefix = 'http://localhost:3000/scanning'
    public async generate(path: string): Promise<void> {
        await ky.get('scan', { searchParams: { path }, prefixUrl: this.prefix })
    }
}

export default new GenerateApi()
