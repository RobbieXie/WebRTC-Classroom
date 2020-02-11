import Tpl from "./ClientList.html"

const ClientList = Vue.component("client-list", {
    template: Tpl,

    data() {
        return {
            clients: []
        };
    },

    methods: {
        setClients(clients) {
            this.clients.length = 0;
            this.clients.push(...clients);
        }
    }
});

export default ClientList;