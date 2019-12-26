
var config=
{
    "fisco_bcos":{
        "host":"192.168.43.97",
        "port":"6001",
        "base":"/weid/api/invoke"
    }
}
config.fisco_bcos.url="http://"+config.fisco_bcos.host+(config.fisco_bcos.port?":"+config.fisco_bcos.port:"")+config.fisco_bcos.base;
export default config;