const request = require('sync-request');
const jq = require('node-jq');
const stats = require("stats-lite")
const fs = require('fs');
const _ = require('lodash');


//////////////////////
// Put your search term here
let searchTerm = 'maschine mk3';

//////////////////////
// Put an array of words to exclude from the title here
let excluded = ['Mikro', 'Cover', 'Case', 'korg', 'reel', 'komplete'];

// Create the output directory if it doesn't already exist
if (!fs.existsSync('output/')){fs.mkdirSync('output/');}
// Clear out any old data if it does
for (let old of fs.readdirSync('output/')){fs.unlinkSync('output/' + old);}


const config = [
    {
        name: 'Guitar Center',
        slug: 'guitar-center',
        api:{
            method: 'GET',url: 'https://www.guitarcenter.com/cartridges/ajax/leftNavJSON.jsp',
            options: {qs: {pageName: 'used-page', Ntt: 'maschine mk3',recsPerPage: 100}}
        },
        jq:  {
            query: '.products[] | {name: .name, price: .price, condition: .skuCondition}',
            options: {input: 'json', output: 'compact'}
        },
        term: {
            type: 'set',
            target: 'api.options.qs.Ntt'
        }
    },
    {
        name: 'Reverb',
        slug: 'reverb',
        api: {
            method: 'POST',
            url: 'https://rql.reverb.com/graphql',
            options: {
                headers: {'content-type': 'application/json', 'X-Shipping-Region': 'US_CON'},
                json: {
                    "operationName": "MarketplaceSearch",
                    "variables": {
                        "query": "maschine mk3",
                        "limit": 100,
                        "offset": 0,
                        "aggs": [],"brandSlugs": [],"collectionType": "Category","categorySlugs": [],"conditionSlugs": [],"shippingRegionCode": [],"bumpCount": 4,"loggedOut": true,"traitValues": [],"itemState": [],"itemCity": [],"excludeCategories": true,"skipCollectionHeader": true,"curatedSetSlugs": [],"saleSlugs": []
                    },
                    "query": "query MarketplaceSearch($query: String, $currency: String, $priceMax: String, $priceMin: String, $decades: [String], $yearMax: String, $yearMin: String, $sortSlug: String, $limit: Int, $offset: Int, $categorySlugs: [String], $brandSlugs: [String], $aggs: [reverb_search_ListingsSearchRequest_Aggregation], $conditionSlugs: [String], $onSale: Boolean, $handmade: Boolean, $freeShipping: Boolean, $freeExpeditedShipping: Boolean, $acceptsOffers: Boolean, $acceptsGiftCards: Boolean, $preferredSeller: Boolean, $acceptsPaymentPlans: Boolean, $itemRegion: String, $shippingRegionCode: [String], $showOnlySold: Boolean, $showSold: Boolean, $loggedOut: Boolean!, $traitValues: [String], $itemState: [String], $itemCity: [String], $bumpCount: Int, $excludeCategories: Boolean, $excludeBrands: Boolean, $collectionType: core_apimessages_CollectionHeader_CollectionType, $collectionSlug: String, $skipCollectionHeader: Boolean!, $shopSlug: String, $curatedSetSlugs: [String], $saleSlugs: [String]) {\n  listingsSearch(input: {query: $query, currency: $currency, priceMax: $priceMax, priceMin: $priceMin, decades: $decades, yearMax: $yearMax, yearMin: $yearMin, sortSlug: $sortSlug, traitValues: $traitValues, limit: $limit, offset: $offset, categorySlugs: $categorySlugs, brandSlugs: $brandSlugs, withAggregations: $aggs, conditionSlugs: $conditionSlugs, onSale: $onSale, handmade: $handmade, freeShipping: $freeShipping, freeExpeditedShipping: $freeExpeditedShipping, acceptsOffers: $acceptsOffers, acceptsGiftCards: $acceptsGiftCards, preferredSeller: $preferredSeller, acceptsPaymentPlans: $acceptsPaymentPlans, itemRegion: $itemRegion, shippingRegionCodes: $shippingRegionCode, bumpCount: $bumpCount, showOnlySold: $showOnlySold, showSold: $showSold, itemState: $itemState, itemCity: $itemCity, withPageMetadata: {excludeBrands: $excludeBrands, excludeCategories: $excludeCategories}, shopSlug: $shopSlug, curatedSetSlugs: $curatedSetSlugs, saleSlugs: $saleSlugs}) {\n    total\n    offset\n    limit\n    metadata {\n      mainClause\n      prefixClause\n      hasSubjectClause\n      fallbackSubject\n      inPreposition\n      collectionClause\n      __typename\n    }\n    filters {\n      ...NestedFilter\n      __typename\n    }\n    listings {\n      ...ListingsCollection\n      ...LoggedInFields @skip(if: $loggedOut)\n      __typename\n    }\n    bumpedListings {\n      ...ListingsCollection\n      ...LoggedInFields @skip(if: $loggedOut)\n      __typename\n    }\n    __typename\n  }\n  collectionHeader(input: {collectionType: $collectionType, collectionSlug: $collectionSlug}) @skip(if: $skipCollectionHeader) {\n    ...CollectionInfo\n    __typename\n  }\n}\n\nfragment ListingsCollection on Listing {\n  _id\n  id\n  categoryUuids\n  slug\n  title\n  description\n  listingType\n  condition {\n    displayName\n    conditionSlug\n    __typename\n  }\n  price {\n    amountCents\n    display\n    __typename\n  }\n  pricing {\n    buyerPrice {\n      display\n      currency\n      amountCents\n      __typename\n    }\n    originalPrice {\n      display\n      __typename\n    }\n    ribbon {\n      display\n      __typename\n    }\n    __typename\n  }\n  images(input: {transform: \"card_square\", count: 3, scope: \"photos\", type: \"Product\"}) {\n    source\n    __typename\n  }\n  state\n  stateDescription\n  shipping {\n    shippingPrices {\n      shippingMethod\n      rate {\n        amountCents\n        currency\n        display\n        __typename\n      }\n      __typename\n    }\n    freeExpeditedShipping\n    localPickupOnly\n    __typename\n  }\n  ...mParticleListingFields\n  __typename\n}\n\nfragment mParticleListingFields on Listing {\n  id\n  _id\n  title\n  brandSlug\n  categoryRootUuid\n  make\n  categoryUuids\n  condition {\n    conditionUuid\n    __typename\n  }\n  categories {\n    slug\n    rootSlug\n    __typename\n  }\n  csp {\n    slug\n    brand {\n      slug\n      __typename\n    }\n    __typename\n  }\n  pricing {\n    buyerPrice {\n      amount\n      currency\n      __typename\n    }\n    __typename\n  }\n  sale {\n    code\n    buyerIneligibilityReason\n    __typename\n  }\n  __typename\n}\n\nfragment LoggedInFields on Listing {\n  watching\n  __typename\n}\n\nfragment NestedFilter on reverb_search_Filter {\n  name\n  aggregationName\n  widgetType\n  options {\n    count {\n      value\n      __typename\n    }\n    name\n    selected\n    paramName\n    setValues\n    unsetValues\n    all\n    optionValue\n    subFilter {\n      widgetType\n      options {\n        count {\n          value\n          __typename\n        }\n        name\n        selected\n        paramName\n        setValues\n        unsetValues\n        all\n        optionValue\n        subFilter {\n          widgetType\n          options {\n            count {\n              value\n              __typename\n            }\n            name\n            selected\n            paramName\n            setValues\n            unsetValues\n            all\n            optionValue\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment CollectionInfo on CollectionHeader {\n  title\n  metaTitle\n  collectionId\n  collectionType\n  description\n  fullBleedImage {\n    source\n    __typename\n  }\n  __typename\n}\n"
                }
            }
        },
        jq:  {
            query: '.data.listingsSearch.listings[] | {name: .title, condition: .condition.conditionSlug, price: .pricing.buyerPrice.amount}',
            options: {input: 'json', output: 'compact'}
        },
        term: {
            type: 'set',
            target: 'api.options.json.variables.json'
        }
        
    },
    {
    name: 'Sweetwater Used Gear',
    slug: 'sweetwater',
    api: {
        method: 'POST',
        url: 'https://jo2iddbevv-dsn.algolia.net/1/indexes/*/queries',
        options: {
            qs: {
                'x-algolia-agent': 'Algolia for vanilla JavaScript (lite) 3.25.1;JS Helper 2.24.0;vue-instantsearch 1.5.2',
                'x-algolia-application-id': 'JO2IDDBEVV',
                'x-algolia-api-key': '9357afb85208bfb6add88cd15e1b0aab'
            },
            json: {
                "requests": [
                        {
                        "indexName": 
                            "production_listings",
                            "params": "query=###QUERYVALUE###&page=0"
                        }
                    ]
                }
            }
    },
    jq: {
        query: '.results[0].hits[] | {name: .title, condition: .condition, price: .price}',
        options: {input: 'json', output: 'compact'}
    },
    term: {
        type: 'replace',
        target: 'api.options.json.requests[0].params',
        key: '###QUERYVALUE###'
    }
}
];



String.prototype.formatCondition = function() {
    str = this.toLowerCase().replace(/-/g, ' ').trim();
    if (str == ''){
        str = 'No Condition Listed';
    }
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
        function($1){
            return $1.toUpperCase();
        });
}

async function query(configs, excludeTerms){
    let results = [];
    for (let conf of configs){
        let current = [];
        current.count = 0;

        var data = request(conf.api.method, conf.api.url, conf.api.options);
        data = JSON.parse(data.getBody('utf8'));
        fs.writeFileSync(`output/json-response-${conf.slug}.json`, JSON.stringify(data));

        await jq.run(conf.jq.query, data, conf.jq.options)
            .then((out) => {
                for (let l of out.split("\n")){
                    listing = JSON.parse(l);
                    let skip = false;
                    for (let ex of excludeTerms){
                        if (listing.name.toLowerCase().includes(ex.toLowerCase())){
                            skip = true;
                        }
                    }
                    if (skip){continue;}
                    current.count++;
                    listing.condition = listing.condition.formatCondition();
                    if (current[listing.condition] == null){
                        current[listing.condition] = {store: conf.name, prices: [], median: 0, mean: 0, count: 1};
                    } else {
                        current[listing.condition].count++;
                    }
                    if (typeof listing.price == 'string'){
                        listing.price = Number(listing.price.replace('$', ''));
                    }
                    current[listing.condition].prices.push(listing.price);
                    console.log(`${listing.name} - ${listing.price}`);
                    fs.appendFileSync('output/price-list.txt', ` ${listing.name} - ${listing.price} - ${conf.name} -${listing.condition}\n`);
                }
                for (let rank in current){
                    current[rank].median = stats.median(current[rank].prices).toFixed(2);
                    current[rank].mean = stats.mean(current[rank].prices).toFixed(2);
                }
                results[conf.name] = current;    
                current.name = conf.slug;   
                return current;                         
            })

    }
    
    
    fs.writeFileSync('output/high-level.csv', `Store,Quality,# Listings,Median Price,Mean Price\n`);
    for (let k in results){
        for (let p in results[k]){
            if (['count', 'name'].includes(p)){continue;}
            let entry = `${k},${p},${results[k][p].count},$${results[k][p].median},$${results[k][p].mean}\n`;
            fs.appendFileSync('output/high-level.csv', entry);
        }
    }
}

function search(searchTerm, excludeTerms){
    for (let key in config){
        current = config[key];
        switch (current.term.type){
            case 'key' : 
                _.set(config[key], current.term.target, searchTerm); 
            break;
            case 'replace' : 
                let template = _.get(current, current.term.target);
                _.set(
                    config[key], 
                    current.term.target, 
                    template.replace(current.term.key, searchTerm)
                );
            break;
            default:break;

        }
    }
    // console.log(JSON.stringify(config, true));
    query(config, excludeTerms);
}

//Run the search
search(searchTerm, excluded);