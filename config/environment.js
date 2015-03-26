module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return {
                database: "mongodb://msddev:PWj4zOt_qX9oRRDH8cwiUqadb@10.200.0.213:27017/MSDdev",
                amazonBucket: "msddev-test",
                pushServerAddress: "https://notif.qualitance.com",
                elasticServer: "10.200.0.221",
                elasticPORT: "9004",
                mandrillKey: "PJSTlj3uhLNKivUM1mr9jw"
            };

        case 'staging':
            return {
                database: "mongodb://msddev:PWj4zOt_qX9oRRDH8cwiUqadb@10.200.0.213:27017/MSDdev",
                amazonBucket: "msddev-test",
                pushServerAddress: "https://notif.qualitance.com",
                elasticServer: "10.200.0.221",
                elasticPORT: "9004",
                mandrillKey: "PJSTlj3uhLNKivUM1mr9jw"
            };

        case 'production':
            return {
                database: "mongodb://msdprod:PWj4zOt_qX9oRRDH8cwiUqadb@81.196.104.4:2941/MSDQualitance",
                amazonBucket: "msd-prod",
                pushServerAddress: "https://notif.qualitance.com",
                elasticServer: "127.0.0.1",
                elasticPORT: "9004",
                mandrillKey: "PJSTlj3uhLNKivUM1mr9jw"
            };

        default:
            return {};
    }
};