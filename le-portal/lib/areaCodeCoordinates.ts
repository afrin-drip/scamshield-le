export interface AreaCodeInfo {
  lat: number;
  lng: number;
  state: string;
  city: string;
}

export const areaCodeCoordinates: Record<string, AreaCodeInfo> = {
  // New York
  "212": { lat: 40.7128, lng: -74.0060, state: "NY", city: "New York" },
  "646": { lat: 40.7128, lng: -74.0060, state: "NY", city: "New York" },
  "917": { lat: 40.7128, lng: -74.0060, state: "NY", city: "New York" },
  "718": { lat: 40.6501, lng: -73.9496, state: "NY", city: "Brooklyn" },
  "347": { lat: 40.6501, lng: -73.9496, state: "NY", city: "Brooklyn" },
  "516": { lat: 40.7282, lng: -73.7949, state: "NY", city: "Long Island" },
  "631": { lat: 40.9176, lng: -72.8467, state: "NY", city: "Suffolk County" },
  "914": { lat: 41.1220, lng: -73.7949, state: "NY", city: "Westchester" },
  "845": { lat: 41.4015, lng: -74.0134, state: "NY", city: "Poughkeepsie" },
  "315": { lat: 43.0481, lng: -76.1474, state: "NY", city: "Syracuse" },
  "518": { lat: 42.6526, lng: -73.7562, state: "NY", city: "Albany" },
  "585": { lat: 43.1566, lng: -77.6088, state: "NY", city: "Rochester" },
  "716": { lat: 42.8864, lng: -78.8784, state: "NY", city: "Buffalo" },
  // California
  "213": { lat: 34.0522, lng: -118.2437, state: "CA", city: "Los Angeles" },
  "310": { lat: 34.0195, lng: -118.4912, state: "CA", city: "Santa Monica" },
  "323": { lat: 34.0522, lng: -118.2437, state: "CA", city: "Los Angeles" },
  "424": { lat: 34.0195, lng: -118.4912, state: "CA", city: "West LA" },
  "818": { lat: 34.1975, lng: -118.5795, state: "CA", city: "San Fernando Valley" },
  "626": { lat: 34.1478, lng: -118.1445, state: "CA", city: "Pasadena" },
  "562": { lat: 33.8958, lng: -118.2201, state: "CA", city: "Long Beach" },
  "714": { lat: 33.8953, lng: -117.8222, state: "CA", city: "Anaheim" },
  "949": { lat: 33.6846, lng: -117.7744, state: "CA", city: "Irvine" },
  "619": { lat: 32.7157, lng: -117.1611, state: "CA", city: "San Diego" },
  "858": { lat: 32.8328, lng: -117.2713, state: "CA", city: "North San Diego" },
  "760": { lat: 33.5427, lng: -117.1831, state: "CA", city: "Inland Empire" },
  "415": { lat: 37.7749, lng: -122.4194, state: "CA", city: "San Francisco" },
  "650": { lat: 37.5630, lng: -122.2872, state: "CA", city: "San Mateo" },
  "408": { lat: 37.3382, lng: -121.8863, state: "CA", city: "San Jose" },
  "510": { lat: 37.8044, lng: -122.2711, state: "CA", city: "Oakland" },
  "925": { lat: 37.8716, lng: -121.9000, state: "CA", city: "Concord" },
  "916": { lat: 38.5816, lng: -121.4944, state: "CA", city: "Sacramento" },
  "209": { lat: 37.9577, lng: -121.2908, state: "CA", city: "Stockton" },
  "559": { lat: 36.7378, lng: -119.7871, state: "CA", city: "Fresno" },
  "805": { lat: 34.4208, lng: -119.6982, state: "CA", city: "Santa Barbara" },
  "831": { lat: 36.6002, lng: -121.8947, state: "CA", city: "Monterey" },
  // Texas
  "214": { lat: 32.7767, lng: -96.7970, state: "TX", city: "Dallas" },
  "469": { lat: 32.7767, lng: -96.7970, state: "TX", city: "Dallas" },
  "972": { lat: 32.7767, lng: -96.7970, state: "TX", city: "Dallas" },
  "817": { lat: 32.7555, lng: -97.3308, state: "TX", city: "Fort Worth" },
  "682": { lat: 32.7555, lng: -97.3308, state: "TX", city: "Fort Worth" },
  "713": { lat: 29.7604, lng: -95.3698, state: "TX", city: "Houston" },
  "832": { lat: 29.7604, lng: -95.3698, state: "TX", city: "Houston" },
  "281": { lat: 29.7604, lng: -95.3698, state: "TX", city: "Houston Metro" },
  "346": { lat: 29.7604, lng: -95.3698, state: "TX", city: "Houston" },
  "512": { lat: 30.2672, lng: -97.7431, state: "TX", city: "Austin" },
  "737": { lat: 30.2672, lng: -97.7431, state: "TX", city: "Austin" },
  "210": { lat: 29.4241, lng: -98.4936, state: "TX", city: "San Antonio" },
  "726": { lat: 29.4241, lng: -98.4936, state: "TX", city: "San Antonio" },
  "915": { lat: 31.7619, lng: -106.4850, state: "TX", city: "El Paso" },
  "806": { lat: 33.5779, lng: -101.8552, state: "TX", city: "Lubbock" },
  "903": { lat: 33.2148, lng: -97.1331, state: "TX", city: "Tyler" },
  "956": { lat: 26.2034, lng: -98.2300, state: "TX", city: "Laredo" },
  // Florida
  "305": { lat: 25.7617, lng: -80.1918, state: "FL", city: "Miami" },
  "786": { lat: 25.7617, lng: -80.1918, state: "FL", city: "Miami" },
  "954": { lat: 26.1224, lng: -80.1373, state: "FL", city: "Fort Lauderdale" },
  "561": { lat: 26.7153, lng: -80.0534, state: "FL", city: "West Palm Beach" },
  "407": { lat: 28.5383, lng: -81.3792, state: "FL", city: "Orlando" },
  "321": { lat: 28.5383, lng: -81.3792, state: "FL", city: "Orlando" },
  "813": { lat: 27.9506, lng: -82.4572, state: "FL", city: "Tampa" },
  "727": { lat: 27.7676, lng: -82.6403, state: "FL", city: "St Petersburg" },
  "904": { lat: 30.3322, lng: -81.6557, state: "FL", city: "Jacksonville" },
  "850": { lat: 30.4213, lng: -84.2681, state: "FL", city: "Tallahassee" },
  "239": { lat: 26.1420, lng: -81.7948, state: "FL", city: "Naples" },
  "941": { lat: 27.3364, lng: -82.5307, state: "FL", city: "Sarasota" },
  "352": { lat: 29.6516, lng: -82.3248, state: "FL", city: "Gainesville" },
  // Illinois
  "312": { lat: 41.8781, lng: -87.6298, state: "IL", city: "Chicago" },
  "773": { lat: 41.8781, lng: -87.6298, state: "IL", city: "Chicago" },
  "872": { lat: 41.8781, lng: -87.6298, state: "IL", city: "Chicago" },
  "847": { lat: 42.0451, lng: -87.9073, state: "IL", city: "Evanston" },
  "630": { lat: 41.8500, lng: -88.0000, state: "IL", city: "DuPage County" },
  "708": { lat: 41.7376, lng: -87.8570, state: "IL", city: "Oak Park" },
  "815": { lat: 41.3114, lng: -88.2334, state: "IL", city: "Joliet" },
  "217": { lat: 39.7817, lng: -89.6501, state: "IL", city: "Springfield" },
  // Pennsylvania
  "215": { lat: 39.9526, lng: -75.1652, state: "PA", city: "Philadelphia" },
  "267": { lat: 39.9526, lng: -75.1652, state: "PA", city: "Philadelphia" },
  "610": { lat: 40.0343, lng: -75.3788, state: "PA", city: "Delaware County" },
  "412": { lat: 40.4406, lng: -79.9959, state: "PA", city: "Pittsburgh" },
  "724": { lat: 40.5601, lng: -80.2289, state: "PA", city: "Western PA" },
  "717": { lat: 40.2732, lng: -76.8867, state: "PA", city: "Harrisburg" },
  // Ohio
  "614": { lat: 39.9612, lng: -82.9988, state: "OH", city: "Columbus" },
  "216": { lat: 41.4993, lng: -81.6944, state: "OH", city: "Cleveland" },
  "440": { lat: 41.4887, lng: -82.0185, state: "OH", city: "Cleveland Suburbs" },
  "513": { lat: 39.1031, lng: -84.5120, state: "OH", city: "Cincinnati" },
  "937": { lat: 39.7589, lng: -84.1916, state: "OH", city: "Dayton" },
  "419": { lat: 41.6639, lng: -83.5552, state: "OH", city: "Toledo" },
  // Georgia
  "404": { lat: 33.7490, lng: -84.3880, state: "GA", city: "Atlanta" },
  "678": { lat: 33.7490, lng: -84.3880, state: "GA", city: "Atlanta" },
  "770": { lat: 33.7490, lng: -84.3880, state: "GA", city: "Atlanta Metro" },
  "470": { lat: 33.7490, lng: -84.3880, state: "GA", city: "Atlanta" },
  "912": { lat: 32.0809, lng: -81.0912, state: "GA", city: "Savannah" },
  // North Carolina
  "704": { lat: 35.2271, lng: -80.8431, state: "NC", city: "Charlotte" },
  "980": { lat: 35.2271, lng: -80.8431, state: "NC", city: "Charlotte" },
  "919": { lat: 35.7796, lng: -78.6382, state: "NC", city: "Raleigh" },
  "984": { lat: 35.7796, lng: -78.6382, state: "NC", city: "Raleigh" },
  "336": { lat: 36.0726, lng: -79.7920, state: "NC", city: "Greensboro" },
  "910": { lat: 34.2257, lng: -77.9447, state: "NC", city: "Wilmington" },
  // Michigan
  "313": { lat: 42.3314, lng: -83.0458, state: "MI", city: "Detroit" },
  "248": { lat: 42.4534, lng: -83.1763, state: "MI", city: "Oakland County" },
  "586": { lat: 42.5803, lng: -82.9374, state: "MI", city: "Macomb County" },
  "734": { lat: 42.2808, lng: -83.7430, state: "MI", city: "Ann Arbor" },
  "616": { lat: 42.9634, lng: -85.6681, state: "MI", city: "Grand Rapids" },
  "517": { lat: 42.7325, lng: -84.5555, state: "MI", city: "Lansing" },
  // New Jersey
  "201": { lat: 40.7357, lng: -74.1724, state: "NJ", city: "Jersey City" },
  "551": { lat: 40.7357, lng: -74.1724, state: "NJ", city: "Jersey City" },
  "973": { lat: 40.7357, lng: -74.1724, state: "NJ", city: "Newark" },
  "862": { lat: 40.7357, lng: -74.1724, state: "NJ", city: "Newark" },
  "732": { lat: 40.3573, lng: -74.1829, state: "NJ", city: "Middlesex" },
  "848": { lat: 40.3573, lng: -74.1829, state: "NJ", city: "Middlesex" },
  "609": { lat: 40.2206, lng: -74.7597, state: "NJ", city: "Trenton" },
  "856": { lat: 39.9209, lng: -75.1196, state: "NJ", city: "Camden" },
  // Virginia
  "703": { lat: 38.8816, lng: -77.0910, state: "VA", city: "Northern Virginia" },
  "571": { lat: 38.8816, lng: -77.0910, state: "VA", city: "Northern Virginia" },
  "804": { lat: 37.5407, lng: -77.4360, state: "VA", city: "Richmond" },
  "757": { lat: 36.8529, lng: -75.9780, state: "VA", city: "Virginia Beach" },
  // Washington
  "206": { lat: 47.6062, lng: -122.3321, state: "WA", city: "Seattle" },
  "253": { lat: 47.2529, lng: -122.4443, state: "WA", city: "Tacoma" },
  "425": { lat: 47.6740, lng: -122.1215, state: "WA", city: "Bellevue" },
  "360": { lat: 48.7519, lng: -122.4787, state: "WA", city: "Bellingham" },
  "509": { lat: 47.6588, lng: -117.4260, state: "WA", city: "Spokane" },
  // Arizona
  "480": { lat: 33.4152, lng: -111.8315, state: "AZ", city: "Scottsdale" },
  "602": { lat: 33.4484, lng: -112.0740, state: "AZ", city: "Phoenix" },
  "623": { lat: 33.5387, lng: -112.1860, state: "AZ", city: "Glendale AZ" },
  "520": { lat: 32.2226, lng: -110.9747, state: "AZ", city: "Tucson" },
  // Massachusetts
  "617": { lat: 42.3601, lng: -71.0589, state: "MA", city: "Boston" },
  "857": { lat: 42.3601, lng: -71.0589, state: "MA", city: "Boston" },
  "781": { lat: 42.4072, lng: -71.0575, state: "MA", city: "Boston Suburbs" },
  "978": { lat: 42.6334, lng: -71.3162, state: "MA", city: "Lowell" },
  "508": { lat: 42.1015, lng: -71.1924, state: "MA", city: "Worcester" },
  "413": { lat: 42.1015, lng: -72.5898, state: "MA", city: "Springfield MA" },
  // Colorado
  "303": { lat: 39.7392, lng: -104.9903, state: "CO", city: "Denver" },
  "720": { lat: 39.7392, lng: -104.9903, state: "CO", city: "Denver" },
  "719": { lat: 38.8339, lng: -104.8214, state: "CO", city: "Colorado Springs" },
  "970": { lat: 40.5853, lng: -105.0844, state: "CO", city: "Fort Collins" },
  // Tennessee
  "615": { lat: 36.1627, lng: -86.7816, state: "TN", city: "Nashville" },
  "629": { lat: 36.1627, lng: -86.7816, state: "TN", city: "Nashville" },
  "901": { lat: 35.1495, lng: -90.0490, state: "TN", city: "Memphis" },
  "865": { lat: 35.9606, lng: -83.9207, state: "TN", city: "Knoxville" },
  "423": { lat: 35.0456, lng: -85.3097, state: "TN", city: "Chattanooga" },
  // Indiana
  "317": { lat: 39.7684, lng: -86.1581, state: "IN", city: "Indianapolis" },
  "463": { lat: 39.7684, lng: -86.1581, state: "IN", city: "Indianapolis" },
  "219": { lat: 41.5868, lng: -87.3467, state: "IN", city: "Hammond" },
  "574": { lat: 41.6764, lng: -86.2520, state: "IN", city: "South Bend" },
  // Missouri
  "314": { lat: 38.6270, lng: -90.1994, state: "MO", city: "St Louis" },
  "636": { lat: 38.6270, lng: -90.7882, state: "MO", city: "St Louis Metro" },
  "816": { lat: 39.0997, lng: -94.5786, state: "MO", city: "Kansas City" },
  "417": { lat: 37.2090, lng: -93.2923, state: "MO", city: "Springfield MO" },
  // Maryland
  "410": { lat: 39.2904, lng: -76.6122, state: "MD", city: "Baltimore" },
  "443": { lat: 39.2904, lng: -76.6122, state: "MD", city: "Baltimore" },
  "667": { lat: 39.2904, lng: -76.6122, state: "MD", city: "Baltimore" },
  "301": { lat: 39.0840, lng: -77.1528, state: "MD", city: "Rockville" },
  "240": { lat: 39.0840, lng: -77.1528, state: "MD", city: "Montgomery County" },
  // Minnesota
  "612": { lat: 44.9778, lng: -93.2650, state: "MN", city: "Minneapolis" },
  "952": { lat: 44.8647, lng: -93.5530, state: "MN", city: "Bloomington" },
  "763": { lat: 45.0740, lng: -93.3750, state: "MN", city: "Brooklyn Park" },
  "651": { lat: 44.9537, lng: -93.0900, state: "MN", city: "St Paul" },
  "218": { lat: 46.7867, lng: -92.1005, state: "MN", city: "Duluth" },
  // Wisconsin
  "414": { lat: 43.0389, lng: -87.9065, state: "WI", city: "Milwaukee" },
  "262": { lat: 42.9849, lng: -88.2426, state: "WI", city: "Waukesha" },
  "608": { lat: 43.0731, lng: -89.4012, state: "WI", city: "Madison" },
  "920": { lat: 44.5133, lng: -88.0133, state: "WI", city: "Green Bay" },
  // Nevada
  "702": { lat: 36.1699, lng: -115.1398, state: "NV", city: "Las Vegas" },
  "725": { lat: 36.1699, lng: -115.1398, state: "NV", city: "Las Vegas" },
  "775": { lat: 39.5296, lng: -119.8138, state: "NV", city: "Reno" },
  // Oregon
  "503": { lat: 45.5051, lng: -122.6750, state: "OR", city: "Portland" },
  "971": { lat: 45.5051, lng: -122.6750, state: "OR", city: "Portland" },
  "541": { lat: 44.0521, lng: -123.0868, state: "OR", city: "Eugene" },
  // Connecticut
  "203": { lat: 41.3083, lng: -72.9279, state: "CT", city: "Bridgeport" },
  "475": { lat: 41.3083, lng: -72.9279, state: "CT", city: "Bridgeport" },
  "860": { lat: 41.7658, lng: -72.6851, state: "CT", city: "Hartford" },
  // Oklahoma
  "405": { lat: 35.4676, lng: -97.5164, state: "OK", city: "Oklahoma City" },
  "918": { lat: 36.1540, lng: -95.9928, state: "OK", city: "Tulsa" },
  // Louisiana
  "504": { lat: 29.9511, lng: -90.0715, state: "LA", city: "New Orleans" },
  "985": { lat: 30.3688, lng: -90.0715, state: "LA", city: "Metairie" },
  "318": { lat: 32.5252, lng: -92.1190, state: "LA", city: "Shreveport" },
  "225": { lat: 30.4515, lng: -91.1871, state: "LA", city: "Baton Rouge" },
  // Alabama
  "205": { lat: 33.5186, lng: -86.8104, state: "AL", city: "Birmingham" },
  "251": { lat: 30.6954, lng: -88.0399, state: "AL", city: "Mobile" },
  "256": { lat: 34.7304, lng: -86.5861, state: "AL", city: "Huntsville" },
  // Kentucky
  "502": { lat: 38.2527, lng: -85.7585, state: "KY", city: "Louisville" },
  "859": { lat: 38.0406, lng: -84.5037, state: "KY", city: "Lexington" },
  // South Carolina
  "803": { lat: 34.0007, lng: -81.0348, state: "SC", city: "Columbia SC" },
  "843": { lat: 32.7765, lng: -79.9311, state: "SC", city: "Charleston SC" },
  "864": { lat: 34.8526, lng: -82.3940, state: "SC", city: "Greenville SC" },
  // Iowa
  "515": { lat: 41.5868, lng: -93.6250, state: "IA", city: "Des Moines" },
  "319": { lat: 41.9612, lng: -91.5302, state: "IA", city: "Cedar Rapids" },
  "563": { lat: 42.5006, lng: -90.6646, state: "IA", city: "Dubuque" },
  // Kansas
  "316": { lat: 37.6872, lng: -97.3301, state: "KS", city: "Wichita" },
  "913": { lat: 39.0997, lng: -94.6780, state: "KS", city: "Kansas City KS" },
  // Utah
  "801": { lat: 40.7608, lng: -111.8910, state: "UT", city: "Salt Lake City" },
  "385": { lat: 40.7608, lng: -111.8910, state: "UT", city: "Salt Lake City" },
  "435": { lat: 37.0965, lng: -113.5684, state: "UT", city: "St George" },
  // Nebraska
  "402": { lat: 41.2565, lng: -95.9345, state: "NE", city: "Omaha" },
  "531": { lat: 41.2565, lng: -95.9345, state: "NE", city: "Omaha" },
  // Arkansas
  "501": { lat: 34.7465, lng: -92.2896, state: "AR", city: "Little Rock" },
  "479": { lat: 36.0822, lng: -94.1719, state: "AR", city: "Fayetteville" },
  // Mississippi
  "601": { lat: 32.2988, lng: -90.1848, state: "MS", city: "Jackson MS" },
  "228": { lat: 30.3674, lng: -89.0928, state: "MS", city: "Gulfport" },
  // West Virginia
  "304": { lat: 38.3498, lng: -81.6326, state: "WV", city: "Charleston WV" },
  // Hawaii
  "808": { lat: 21.3069, lng: -157.8583, state: "HI", city: "Honolulu" },
  // Alaska
  "907": { lat: 61.2181, lng: -149.9003, state: "AK", city: "Anchorage" },
  // DC
  "202": { lat: 38.9072, lng: -77.0369, state: "DC", city: "Washington DC" },
  // New Mexico
  "505": { lat: 35.0844, lng: -106.6504, state: "NM", city: "Albuquerque" },
  "575": { lat: 32.3199, lng: -106.7637, state: "NM", city: "Las Cruces" },
  // Idaho
  "208": { lat: 43.6150, lng: -116.2023, state: "ID", city: "Boise" },
  // Montana
  "406": { lat: 46.5958, lng: -112.0270, state: "MT", city: "Helena" },
  // Wyoming
  "307": { lat: 41.1399, lng: -104.8202, state: "WY", city: "Cheyenne" },
  // North Dakota
  "701": { lat: 46.8083, lng: -100.7837, state: "ND", city: "Bismarck" },
  // South Dakota
  "605": { lat: 44.3683, lng: -100.3510, state: "SD", city: "Pierre" },
  // Rhode Island
  "401": { lat: 41.8240, lng: -71.4128, state: "RI", city: "Providence" },
  // Delaware
  "302": { lat: 39.7391, lng: -75.5398, state: "DE", city: "Wilmington DE" },
  // Vermont
  "802": { lat: 44.2601, lng: -72.5754, state: "VT", city: "Montpelier" },
  // Maine
  "207": { lat: 43.6615, lng: -70.2553, state: "ME", city: "Portland ME" },
  // New Hampshire
  "603": { lat: 43.0045, lng: -71.5136, state: "NH", city: "Manchester" },
};
