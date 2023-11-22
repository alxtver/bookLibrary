import ky from 'ky'

class GenerateApi {
    private prefix = 'http://localhost:3000/scanning'
    public async generate(): Promise<void> {
        await ky.get('scan', { prefixUrl: this.prefix })
    }
}

export default new GenerateApi()
