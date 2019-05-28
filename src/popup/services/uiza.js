import constants from '../constants';
import storage from '../../ext/storage';

var settings = storage.get(constants.SETTINGS_KEY)

export default {

    isConfigured() {
        return settings || false;
    },

    get(url) {
        settings = storage.get(constants.SETTINGS_KEY)
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': settings.api_key
            }
        }).then(resp => resp.json());
    },

    checkCredentials(appId, apiToken) {
        const url = `https://ap-southeast-1-api.uiza.co/api/public/v4/media/entity?appId=${appId}&limit=0`
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiToken
            }
        }).then(resp => {
            console.log('resp', resp);
            if (resp.status !== 200) {
                throw new Error(resp.status)
            }
            return resp;
        }).then(resp => resp.json())
        .catch(err => {
            return Promise.reject(err)
        });
    },

    getSingleVOD(id) {
        const app_id = settings.app_id || ''
        const url = `https://ap-southeast-1-api.uiza.co/api/public/v4/media/entity?appId=${app_id}&id=${id}`
        return this.get(url)
    },

    getVODs() {
        const app_id = settings.app_id || ''
        const url = `https://ap-southeast-1-api.uiza.co/api/public/v4/media/entity?appId=${app_id}&limit=1000`
        return this.get(url)
    },

    getLiveStreamings() {
        const app_id = settings.app_id || ''
        const url = `https://ap-southeast-1-api.uiza.co/api/public/v4/live/entity?appId=${app_id}&limit=1000`
        return this.get(url)
    },

    getLive(id) {
        const app_id = settings.app_id || ''
        const url = `https://ap-southeast-1-api.uiza.co/api/public/v4/live/entity?appId=${app_id}&id=${id}`
        return this.get(url)
    }
    // eslint-disable-next-line eol-last
}