module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return {
                database: "mongodb://localhost:27017/msd",
                amazonBucket: "msdqa",
                amazonPrefix: "https://s3-eu-west-1.amazonaws.com/",
                pushServerAddress: "https://notification:Qual1tanc3@notif.qualitance.com",
                pushServerPrefix: "MSD_test",
                elasticServer: "10.200.0.221",
                elasticPORT: "9004",
                mandrillKey: "PJSTlj3uhLNKivUM1mr9jw",
                GA_code: "UA-61695877-1",
                disablePatients: false,
                dpocAppLink: "unavailable",
                publicFolder: "public",
                tokenSecret: "d0nt3ventry2takeMyTooKEn0rillWhoopYoAss",
                newsletter: {
                    scheduleInterval: 'everyMinute',
                    batch: {
                        size: 5,
                        secondsBetween: 5
                    },
                    unsubcribe: "http://localhost:8080/unsubscribe",
                    statistics:{
                        scheduleInterval: 'everyMinute',
                        scheduleLockDays: 6
                    }
                },
                user: {
                    noProofDomain: "mailinator.com"
                },
                usersAllowedLogin: [],
                dev_mode: {
                    isEnabled: false,
                    loggedInWith: "qqq@mailinator.com"
                },
                elearning: {
                    maxScore: 18
                },
                events: {
                    overwriteApiResponses: false
                }
            };

        case 'qa':
            return {
                database: "mongodb://msddev:PWj4zOt_qX9oRRDH8cwiUqadb@10.200.0.213:27017/MSDdev",
                amazonBucket: "msdqa",
                amazonPrefix: "https://s3-eu-west-1.amazonaws.com/",
                pushServerAddress: "https://notification:Qual1tanc3@notif.qualitance.com",
                pushServerPrefix: "MSD_test",
                elasticServer: "10.200.0.221",
                elasticPORT: "9004",
                mandrillKey: "PJSTlj3uhLNKivUM1mr9jw",
                GA_code: "UA-61695877-1",
                disablePatients: false,
                dpocAppLink: "unavailable",
                publicFolder: "public",
                tokenSecret: "d0nt3ventry2takeMyTooKEn0rillWhoopYoAss",
                newsletter: {
                    scheduleInterval: 'everyMinute',
                    batch: {
                        size: 5,
                        secondsBetween: 5
                    },
                    unsubcribe: "http://10.200.0.250:9001/unsubscribe",
                    statistics:{
                        scheduleInterval: 'everyMinute',
                        scheduleLockDays: 6
                    }
                },
                user: {
                    noProofDomain: "mailinator.com"
                },
                usersAllowedLogin: [],
                elearning: {
                    maxScore: 18
                },
                events: {
                    overwriteApiResponses: false
                }
            };

        case 'devshared':
            return {
                database: "mongodb://msddevshared:PWj4zOt_qX9oRRDH8cwiUqadb@10.200.0.213:27017/MSDdevshared",
                amazonBucket: "msddevshared",
                amazonPrefix: "https://s3-eu-west-1.amazonaws.com/",
                pushServerAddress: "https://notification:Qual1tanc3@notif.qualitance.com",
                pushServerPrefix: "MSD_dev_shared",
                elasticServer: "10.200.0.221",
                elasticPORT: "9004",
                mandrillKey: "PJSTlj3uhLNKivUM1mr9jw",
                GA_code: "UA-61695877-1",
                disablePatients: false,
                dpocAppLink: "unavailable",
                publicFolder: "public",
                tokenSecret: "d0nt3ventry2takeMyTooKEn0rillWhoopYoAss",
                newsletter: {
                    scheduleInterval: 'everyMinute',
                    batch: {
                        size: 5,
                        secondsBetween: 5
                    },
                    //TODO: change unsubscribe route once we find out deployment address
                    unsubcribe: "http://10.200.0.250:9001/unsubscribe",
                    statistics:{
                        scheduleInterval: 'everyMinute',
                        scheduleLockDays: 6
                    }
                },
                user: {
                    noProofDomain: "mailinator.com"
                },
                usersAllowedLogin: [],
                elearning: {
                    maxScore: 18
                },
                events: {
                    overwriteApiResponses: false
                }
            };

        case 'devshared':
            return {
                database: "mongodb://msddevshared:PWj4zOt_qX9oRRDH8cwiUqadb@10.200.0.213:27017/MSDdevshared",
                amazonBucket: "msddevshared",
                amazonPrefix: "https://s3-eu-west-1.amazonaws.com/",
                pushServerAddress: "https://notification:Qual1tanc3@notif.qualitance.com",
                pushServerPrefix: "MSD_dev_shared",
                elasticServer: "10.200.0.221",
                elasticPORT: "9004",
                mandrillKey: "PJSTlj3uhLNKivUM1mr9jw",
                GA_code: "UA-61695877-1",
                disablePatients: false,
                dpocAppLink: "unavailable",
                publicFolder: "public",
                tokenSecret: "d0nt3ventry2takeMyTooKEn0rillWhoopYoAss",
                newsletter: {
                    scheduleInterval: 'everyMinute',
                    batch: {
                        size: 5,
                        secondsBetween: 5
                    },
                    //TODO: change unsubscribe route once we find out deployment address
                    unsubcribe: "http://10.200.0.250:9001/unsubscribe",
                    statistics:{
                        scheduleInterval: 'everyMinute',
                        scheduleLockDays: 6
                    }
                },
                user: {
                    noProofDomain: "mailinator.com"
                },
                elearning: {
                    maxScore: 18
                }
            };

        case 'staging':
            return {
                database: "mongodb://msdStaging:PWj4zOt_qX9oRRDH8cwiUqadb@10.200.0.213:27017/msdStaging",
                amazonBucket: "msddev-test",
                amazonPrefix: "https://s3-eu-west-1.amazonaws.com/",
                pushServerAddress: "https://notification:Qual1tanc3@notif.qualitance.com",
                pushServerPrefix: "MSD_test",
                elasticServer: "10.200.0.221",
                elasticPORT: "9004",
                mandrillKey: "PJSTlj3uhLNKivUM1mr9jw",
                GA_code: "UA-61695877-1",
                disablePatients: false,
                dpocAppLink: "unavailable",
                publicFolder: "public_min",
                tokenSecret: "d0nt3ventry2takeMyTooKEn0rillWhoopYoAss",
                newsletter: {
                    scheduleInterval: 'everyMinute',
                    batch: {
                        size: 50,
                        secondsBetween: 60 * 10
                    },
                    unsubcribe: "https://staging.staywell.ro/unsubscribe",
                    statistics:{
                        scheduleInterval: 'everyHour',
                        scheduleLockDays: 30
                    }
                },
                user: {
                    noProofDomain: "merck.com"
                },
                usersAllowedLogin: [],
                elearning: {
                    maxScore: 18
                },
                events: {
                    overwriteApiResponses: false
                }
            };

        case 'production':
            return {
                database: "mongodb://msdprod:PWj4zOt_qX9oRRDH8cwiUqadb@188.166.46.88:9050/MSDQualitance",
                amazonBucket: "msd-prod",
                amazonPrefix: "https://s3-eu-west-1.amazonaws.com/",
                pushServerAddress: "https://notification:Qual1tanc3@notif.qualitance.com",
                pushServerPrefix: "MSD",
                elasticServer: "127.0.0.1",
                elasticPORT: "9004",
                mandrillKey: "PJSTlj3uhLNKivUM1mr9jw",
                GA_code: "UA-62113963-1",
                disablePatients: true,
                dpocAppLink: "https://msd-ios-distribution.s3.amazonaws.com/MSD_dpoc_InHouse/index.html",
                publicFolder: "public_min",
                tokenSecret: "d0nt3ventry2takeMyTooKEn0rillWhoopYoAss",
                newsletter: {
                    scheduleInterval: 'everyHour',
                    batch: {
                        size: 50,
                        secondsBetween: 60 * 10
                    },
                    unsubcribe: "https://staywell.ro/unsubscribe",
                    statistics:{
                        scheduleInterval: 'everyHour',
                        scheduleLockDays: 30
                    }
                },
                user: {
                    noProofDomain: "merck.com"
                },
                usersAllowedLogin: [],
                elearning: {
                    maxScore: 18
                },
                events: {
                    overwriteApiResponses: false
                }
            };

        default:
            return {};
    }
};
