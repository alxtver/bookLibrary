import type { SearchDto } from '../components/searchfield/types'
import ky from 'ky'
import { serverUrl } from '../api/ApiSettings'
class GlobalSearchApi {
    private url: string = '/global-search'

    public async search(pattern: string): Promise<SearchDto> {
        const response = await ky.get('', {
            prefixUrl: `${serverUrl}${this.url}`,
            searchParams: { pattern }
        })
        return response.json()
    }
}
export default new GlobalSearchApi()
