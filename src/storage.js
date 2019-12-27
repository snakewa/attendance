var store = {
    set(key, value) {
        if (typeof value != "string")
            value = JSON.stringify(value);
        localStorage.setItem(key, value);
    },
    get(key) {
        let value = localStorage.getItem(key);
        try { value = JSON.parse(value) } catch (e) { }
        return value;
    },
    putUser(weId, value) {
        let users = this.get("users");
        if (users == undefined) users = {}

        users[weId] = value;
        this.set("users", users);
    },
    getUser(weId) {
        let users = this.get("users");
        if (users == undefined) users = {}

        return users[weId];
    },
    getCredentials(weId) {
        let credentials = this.get("credentials");
        if (credentials == undefined) credentials = {};
        if(weId==undefined) return credentials;
        return credentials[weId];
    },
    putCredential(credential) {
        let credentials = this.get("credentials");
        if (credentials == undefined) credentials = {};
        if (credentials[credential.claim.receiver] == undefined) credentials[credential.claim.receiver] = [];
        credentials[credential.claim.receiver].push(credential);
        console.log({credentials})
        this.set("credentials", credentials);
    },
    getAllUsers() {
        let users = this.get("users");
        let arr = [];
        for (let weId in users) {
            users[weId].name = users[weId].name.replace("_" + weId.substr(45), "");
            arr.push(users[weId]);
        }
        return arr;
    },
    getAdmin() {
        let users = this.get("users");
        for (let weId in users)
            if (users[weId].name == "admin") return users[weId];
        return null;
    },
    getAllOrganization() {
        let users = this.get("users");
        let arr = [];
        for (let weId in users) {
            if (users[weId].userType == "organization") {
                users[weId].name = users[weId].name.replace("_" + weId.substr(45), "");
                arr.push(users[weId]);
            }
        }
        return arr;
    },
    getAllPureUser() {
        let users = this.get("users");
        let arr = [];
        for (let weId in users) {
            if (users[weId].userType == "user") {
                users[weId].name = users[weId].name.replace("_" + weId.substr(45), "");
                arr.push(users[weId]);
            }
        }
        return arr;
    },
    getAuthCredentials(orgWeId){
        let authCredentials = this.get("authCredentials");
        if (authCredentials == undefined) authCredentials = {};
        return authCredentials[orgWeId];
    },
    putAuthCredentials(orgWeId,credential){
        let authCredentials = this.get("authCredentials");
        if (authCredentials == undefined) authCredentials = {};
        if (authCredentials[orgWeId] == undefined ) authCredentials[orgWeId] = [];
        authCredentials[orgWeId].push(credential);
        this.set("authCredentials",authCredentials)
    }
}
export default store;