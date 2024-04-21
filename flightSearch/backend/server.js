express = require('express');
const Amadeus = require('amadeus');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const port = 3000;

const amadeus = new Amadeus({
  clientId: 'Ey2oSYNJmpgtD5q8JKJiItIJ8lkrcmH2',
  clientSecret: 'iAzEFe9LwMAlblCe',
  
});

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Mapa miast do skrótów lotnisk
const cityToAirport = {
  'New York': 'JFK',
  'Los Angeles': 'LAX',
  'Chicago': 'ORD',
  'Dallas': 'DFW',
  'Denver': 'DEN',
  'San Francisco': 'SFO',
  'Seattle': 'SEA',
  'Atlanta': 'ATL',
  'Miami': 'MIA',
  'Las Vegas': 'LAS',
  'Boston': 'BOS',
  'Phoenix': 'PHX',
  'Orlando': 'MCO',
  'Charlotte': 'CLT',
  'Minneapolis': 'MSP',
  'Detroit': 'DTW',
  'Houston': 'IAH',
  'Philadelphia': 'PHL',
  'Newark': 'EWR',
  'New York LaGuardia': 'LGA',
  'San Diego': 'SAN',
  'Fort Lauderdale': 'FLL',
  'Baltimore': 'BWI',
  'Tampa': 'TPA',
  'Salt Lake City': 'SLC',
  'Portland': 'PDX',
  'Dallas (Love Field)': 'DAL',
  'Austin': 'AUS',
  'Honolulu': 'HNL',
  'Raleigh/Durham': 'RDU',
  'New Orleans': 'MSY',
  'San Jose': 'SJC',
  'Sacramento': 'SMF',
  'Indianapolis': 'IND',
  'Pittsburgh': 'PIT',
  'Cleveland': 'CLE',
  'Jacksonville': 'JAX',
  'Santa Ana': 'SNA',
  'Fort Myers': 'RSW',
  'Louisville': 'SDF',
  'Kansas City': 'MCI',
  'Burbank': 'BUR',
  'San Antonio': 'SAT',
  'London': 'LHR',
  'Paris': 'CDG',
  'Frankfurt': 'FRA',
  'Amsterdam': 'AMS',
  'Madrid': 'MAD',
  'Barcelona': 'BCN',
  'Istanbul': 'IST',
  'Munich': 'MUC',
  'Rome': 'FCO',
  'Copenhagen': 'CPH',
  'Zurich': 'ZRH',
  'Dublin': 'DUB',
  'Prague': 'PRG',
  'Warsaw': 'WAW',
  'Vienna': 'VIE',
  'Athens': 'ATH',
  'Brussels': 'BRU',
  'Stockholm': 'STO',
  'Oslo': 'OSL',
  'Milan': 'MXP',
  'Lisbon': 'LIS',
  'Berlin': 'BER',
  'Helsinki': 'HEL',
  'Budapest': 'BUD',
  'Bucharest': 'OTP',
  'Riga': 'RIX',
  'Tallinn': 'TLL',
  'Vilnius': 'VNO',
  'Sofia': 'SOF',
  'Ljubljana': 'LJU',
  'Zagreb': 'ZAG',
  'Skopje': 'SKP',
  'Pristina': 'PRN',
  'Tbilisi': 'TBS',
  'Belgrade': 'BEG',
  'Minsk': 'MSQ',
  'Chisinau': 'KIV',
  'Edinburgh': 'EDI',
  'Manchester': 'MAN',
  'Glasgow': 'GLA',
  'Hamburg': 'HAM',
  'Düsseldorf': 'DUS',
  'Palma de Mallorca': 'PMI',
  'Nice': 'NCE',
  'Alicante': 'ALC',
  'Krakow': 'KRK',
  'Geneva': 'GVA',
  'Naples': 'NAP',
  'Marseille': 'MRS',
  'Luxembourg': 'LUX',
  'Moscow': 'SVO',
  'Saint Petersburg': 'LED',
  'Birmingham': 'BHX',
  'London Gatwick': 'LGW',
  'Brussels Charleroi': 'CRL',
  'Lyon': 'LYS',
  'Porto': 'OPO',
  'Moscow Domodedovo': 'DME',
  'Moscow Vnukovo': 'VKO',
  'Mykonos': 'JMK',
  'Rhodes': 'RHO',
  'Thessaloniki': 'SKG',
  'Chania': 'CHQ',
  'Heraklion': 'HER',
  'Corfu': 'CFU',
  'Santorini': 'JTR',
  'Lamezia Terme': 'SUF',
  'Palermo': 'PMO',
  'Florence': 'FLR',
  'Bari': 'BRI',
  'Catania': 'CTA',
  'Genoa': 'GOA',
  'Bologna': 'BLQ',
  'Turin': 'TRN',
  'Pisa': 'PSA',
  'Verona': 'VRN',
  'Tirana': 'TIA',
  'Gdansk': 'GDN',
  'Wroclaw': 'WRO',
  'Poznan': 'POZ',
  'Sarajevo': 'SJJ',
  'Dubrovnik': 'DBV',
  
};

app.get('/', (req, res) => {
  res.send('Serwer działa');
});


app.get('/searchFlights', async (req, res) => {
  const searchData = req.query;

  const fromAirport = cityToAirport[searchData.originLocationCode];
  const toAirport = cityToAirport[searchData.destinationLocationCode];
  const date = searchData.departureDate;
  const returnDate= searchData.returnDate;
  const adults = searchData.adults;

  console.log("searchdata",searchData)
  // Prosta walidacja zapytania
  if (!fromAirport || !toAirport || !date || !adults) {
    console.log(fromAirport, toAirport, date, adults);
    return res.status(400).json({ message: 'Brak wymaganych parametrów' });
  }

  try {
    console.log('Wysyłane zapytanie do Amadeus:', {
      originLocationCode: fromAirport,
      destinationLocationCode: toAirport,
      departureDate: searchData.departureDate,
      adults: searchData.adults
    });
    
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: fromAirport,
      destinationLocationCode: toAirport,
      departureDate: searchData.departureDate,
      adults: searchData.adults
    });

    const response2 = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: toAirport,
      destinationLocationCode: fromAirport,
      departureDate: searchData.returnDate,
      adults: searchData.adults
    });

    //console.log('Odpowiedź z Amadeus:', response.data);
    console.log('Otrzymane dane:', searchData);

    // Sprawdzenie, czy odpowiedź jest poprawna
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Nieprawidłowa odpowiedź z Amadeus API');
    }

    const formattedData = response.data.map(flight => {
      const itinerary = flight.itineraries[0];
      const segments = itinerary.segments;
      const departureTime = segments[0].departure.at;
      const arrivalTime = segments[segments.length - 1].arrival.at;
      const duration = itinerary.duration;
      const price = flight.price.total;
    
      const fullRoute = segments.map((segment, index) => {
        const stopover = index < segments.length - 1 ? segments[index + 1].departure.iataCode : null;
        const stopoverTime = index < segments.length - 1 ? segments[index + 1].departure.at : null; // Godzina przesiadki
    
        // Godzina przylotu do miejsca przesiadki
        const stopoverArrivalTime = index < segments.length - 1 ? segments[index + 1].arrival.at : null;
    
        return {
          from: segment.departure.iataCode,
          to: segment.arrival.iataCode,
          duration: segment.duration,
          stopover,
          stopoverTime,
          stopoverArrivalTime
        };
      });
    
      // Miejsce wylotu i miejsce docelowe dla całej trasy lotu
      const overallRoute = {
        from: segments[0].departure.iataCode,
        to: segments[segments.length - 1].arrival.iataCode
      };
    
      return {
        departureTime,
        arrivalTime,
        duration,
        price,
        fullRoute,
        overallRoute
      };
    });
    

    const responseData = {
      pure: response.data,
      flightData: formattedData,
      searchData: searchData
    };
    

    res.json(responseData);
   

  } catch (error) {
    console.error('Błąd podczas przetwarzania zapytania do Amadeus:', error.stack);
    res.status(500).json({ message: 'Wystąpił błąd podczas wyszukiwania lotów' });
  }
});

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});