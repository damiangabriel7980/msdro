module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return {
                amazonBucket: "msddev-test",
                pushServerAddress: "https://notif.qualitance.com",
                elasticServer: "10.200.0.221",
                elasticPORT: "9004",
                mandrillKey: "PJSTlj3uhLNKivUM1mr9jw"
            };

        case 'production':
            return {
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