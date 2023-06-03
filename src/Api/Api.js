import { va } from "../settings/var_ambiente.js";
import axios from 'axios';


export class Api {
    static async ricercaProdotto(product) {
        // lista prodotti
        const params = `?name=${product.name.toLowerCase()}`;
        const url = `${va.URL}/api/app_spesa/prodotto/get_prodotti/${params}`;
        return await axios.get(url);
    }

    static async salvaProdotto(product) {
        // creazione o update
        const params = `?name=${product.name.toLowerCase()}&id=${product.id}`;
        const url = `${va.URL}/api/app_spesa/prodotto/save_prodotto/${params}`;
        return await axios.get(url);
    }

    static async listaSpeseAperte(nameSpesa) {
        // lista spese aperte
        const params = `?search=${nameSpesa.toLowerCase()}`;
        const url = `${va.URL}/api/app_spesa/spesa/lista_spese_aperte/${params}`;
        return await axios.get(url);
    }
    static async getSpesaAperta(idSpesa) {
        // recupera spesa aperta per ID (con tutti i carrelli e i prodotti collegati)
        const params = `?id=${idSpesa}`;
        const url = `${va.URL}/api/app_spesa/spesa/get_spesa_aperta/${params}`;
        return await axios.get(url);
    }

    /// TODO
    static async salvaSpesa(product) {
        // creazione o update
        const params = `?name=${product.name.toLowerCase()}&id=${product.id}`;
        const url = `${va.URL}/api/app_spesa/prodotto/save_prodotto/${params}`;
        return await axios.get(url);
    }
    /// TODO
    static async eliminaSpesa(product) {
        // cancellazione
        const params = `?name=${product.name.toLowerCase()}&id=${product.id}`;
        const url = `${va.URL}/api/app_spesa/prodotto/save_prodotto/${params}`;
        return await axios.get(url);
    }
    /// TODO
    static async salvaCarrello(product) {
        // creazione o update
        const params = `?name=${product.name.toLowerCase()}&id=${product.id}`;
        const url = `${va.URL}/api/app_spesa/prodotto/save_prodotto/${params}`;
        return await axios.get(url);
    }
    /// TODO
    static async eliminaCarrello(product) {
        // cancellazione
        const params = `?name=${product.name.toLowerCase()}&id=${product.id}`;
        const url = `${va.URL}/api/app_spesa/prodotto/save_prodotto/${params}`;
        return await axios.get(url);
    }
};