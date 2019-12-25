var store={
    set(key,value){
        if (typeof value != "string")
            value=JSON.stringify(value);
        localStorage.setItem(key,value);
    },
    get(key){
        let value=localStorage.getItem(key);
        try{value=JSON.parse(value)}catch(e){}
        return value;
    },
    putUser(name,value){
        let users=this.get("users");
        if(users==undefined){
            users={}
        }
        users[name]=value;
        this.set("users",users);
    },
    getUser(name){
        let users=this.get("users");
        if(users==undefined){
            users={}
        }
        return users[name];
    },
    getAllUsers(){
        let users=this.get("users");
        let arr=[];
        for(let name in users)
            arr.push({name,...users[name]});
        return arr;
    }
}
export default store;