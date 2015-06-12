module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return {
                database: "mongodb://msddev:PWj4zOt_qX9oRRDH8cwiUqadb@10.200.0.213:27017/MSDdev",
                amazonBucket: "msddev-test",
                amazonPrefix: "https://s3-eu-west-1.amazonaws.com/",
                pushServerAddress: "https://notif.qualitance.com",
                elasticServer: "10.200.0.221",
                elasticPORT: "9004",
                mandrillKey: "PJSTlj3uhLNKivUM1mr9jw",
                GA_code: "UA-61695877-1",
                disablePatients: false,
                dpocAppLink: "unavailable",
                publicFolder: "public",
                tokenSecret: "d0nt3ventry2takeMyTooKEn0rillWhoopYoAss"
            };

        case 'staging':
            return {
                database: "mongodb://msdStaging:PWj4zOt_qX9oRRDH8cwiUqadb@10.200.0.213:27017/msdStaging",
                amazonBucket: "msddev-test",
                amazonPrefix: "https://s3-eu-west-1.amazonaws.com/",
                pushServerAddress: "https://notif.qualitance.com",
                elasticServer: "10.200.0.221",
                elasticPORT: "9004",
                mandrillKey: "PJSTlj3uhLNKivUM1mr9jw",
                GA_code: "UA-61695877-1",
                disablePatients: false,
                dpocAppLink: "unavailable",
                publicFolder: "public_min",
                tokenSecret: "d0nt3ventry2takeMyTooKEn0rillWhoopYoAss"
            };

        case 'production':
            return {
                database: "mongodb://msdprod:PWj4zOt_qX9oRRDH8cwiUqadb@188.166.46.88:9050/MSDQualitance",
                amazonBucket: "msd-prod",
                amazonPrefix: "https://s3-eu-west-1.amazonaws.com/",
                pushServerAddress: "https://notif.qualitance.com",
                elasticServer: "127.0.0.1",
                elasticPORT: "9004",
                mandrillKey: "PJSTlj3uhLNKivUM1mr9jw",
                GA_code: "UA-62113963-1",
                disablePatients: true,
                dpocAppLink: "https://msd-ios-distribution.s3.amazonaws.com/MSD_dpoc_InHouse/index.html",
                publicFolder: "public_min",
                tokenSecret: "d0nt3ventry2takeMyTooKEn0rillWhoopYoAss"
            };

        default:
            return {};
    }
};
