import constants from '../constants';
import storage from '../../ext/storage';

export default {

    get(url) {
        const settings = storage.get(constants.SETTINGS_KEY)
        console.log(settings)
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': settings.api_key
            }
        }).then(resp => resp.json());
    },

    getVODs() {
        const settings = storage.get(constants.SETTINGS_KEY)
        const app_id = settings.app_id || ''
        const url = `https://ap-southeast-1-api.uiza.co/api/public/v4/media/entity?appId=${app_id}&limit=5&page=1`
        return this.get(url)
    }
}
