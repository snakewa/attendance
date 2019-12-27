
var config=
{
    "fisco_bcos":{
        "host":"127.0.0.1",
        "port":"6001",
        "base":"/weid/api/invoke",
        "jsonrpc_url":false
    }
}
config.fisco_bcos.url="http://"+config.fisco_bcos.host+(config.fisco_bcos.port?":"+config.fisco_bcos.port:"")+config.fisco_bcos.base;
export default config;