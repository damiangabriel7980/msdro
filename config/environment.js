module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return {
                amazonBucket: "msddev-test",
                pushServerAddress: "https://notif.qualitance.com",
                elasticServer: "10.200.0.221",
                elasticPORT: "9004",
                elasticUser: "qdev",
                elasticPass: "quuhohF%i9ahsh@u*egi",
                mandrillKey: "PJSTlj3uhLNKivUM1mr9jw"
            };

        case 'production':
            return {
                amazonBucket: "msd-prod",
                pushServerAddress: "https://notif.qualitance.com",
                elasticServer: "81.196.104.2",
                elasticPORT: "9004",
                elasticUser: "qdev",
                elasticPass: "quuhohF%i9ahsh@u*egi",
                mandrillKey: "PJSTlj3uhLNKivUM1mr9jw"
            };

        default:
            return {};
    }
};