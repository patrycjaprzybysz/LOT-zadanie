const Amadeus = require('amadeus');
const morgan = require('morgan');
const cors = require('cors');

const amadeus = new Amadeus({
  clientId: 'Ey2oSYNJmpgtD5q8JKJiItIJ8lkrcmH2',
  clientSecret: 'iAzEFe9LwMAlblCe',
});

// Initialize middleware
const morganMiddleware = morgan('dev');
const corsMiddleware = cors();
const jsonMiddleware = require('body-parser').json();
const urlEncodedMiddleware = require('body-parser').urlencoded({ extended: true });


function formatFlightData(response) {
  const formattedData = response.data.map(flight => {
      const itinerary = flight.itineraries[0];
      const segments = itinerary.segments;
      const departureTime = segments[0].departure.at;
      const arrivalTime = segments[segments.length - 1].arrival.at;
      const duration = itinerary.duration;
      const price = flight.price.total;

      const fullRoute = segments.map((segment, index) => {
          const stopover = index < segments.length - 1 ? segments[index + 1].departure.iataCode : null;
          const stopoverTime = index < segments.length - 1 ? segments[index + 1].departure.at : null;
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

  return formattedData;
}

const cityToAirport = {
  'new york': 'JFK',
  'los angeles': 'LAX',
  'chicago': 'ORD',
  'san francisco': 'SFO',
  'london': 'LHR',
  'paris': 'CDG',
  'frankfurt': 'FRA',
  'amsterdam': 'AMS',
  'madrid': 'MAD',
  'barcelona': 'BCN',
  'istanbul': 'IST',
  'munich': 'MUC',
  'rome': 'FCO',
  'copenhagen': 'CPH',
  'zurich': 'ZRH',
  'dublin': 'DUB',
  'prague': 'PRG',
  'warsaw': 'WAW',
  'vienna': 'VIE',
  'athens': 'ATH',
  'brussels': 'BRU',
  'stockholm': 'STO',
  'oslo': 'OSL',
  'milan': 'MXP',
  'lisbon': 'LIS',
  'berlin': 'BER',
  'helsinki': 'HEL',
  'budapest': 'BUD',
  'bucharest': 'OTP',
  'riga': 'RIX',
  'vilnius': 'VNO',
  'zagreb': 'ZAG',
  'skopje': 'SKP',
  'minsk': 'MSQ',
  'edinburgh': 'EDI',
  'manchester': 'MAN',
  'glasgow': 'GLA',
  'hamburg': 'HAM',
  'nice': 'NCE',
  'krakow': 'KRK',
  'geneva': 'GVA',
  'naples': 'NAP',
  'marseille': 'MRS',
  'luxembourg': 'LUX',
  'moscow': 'SVO',
  'saint petersburg': 'LED',
  'birmingham': 'BHX',
  'brussels charleroi': 'CRL',
  'lyon': 'LYS',
  'porto': 'OPO',
  'mykonos': 'JMK',
  'rhodes': 'RHO',
  'thessaloniki': 'SKG',
  'chania': 'CHQ',
  'corfu': 'CFU',
  'santorini': 'JTR',
  'palermo': 'PMO',
  'florence': 'FLR',
  'bari': 'BRI',
  'catania': 'CTA',
  'genoa': 'GOA',
  'bologna': 'BLQ',
  'turin': 'TRN',
  'pisa': 'PSA',
  'verona': 'VRN',
  'tirana': 'TIA',
  'gdansk': 'GDN',
  'wroclaw': 'WRO',
  'poznan': 'POZ',
  
};

exports.handler = async (event) => {
  const { httpMethod, queryStringParameters, body } = event;
  console.log(httpMethod, event.path, queryStringParameters, body);
  
    const searchData = queryStringParameters;

    const fromAirport = cityToAirport[searchData.originLocationCode];
    const toAirport = cityToAirport[searchData.destinationLocationCode];
    const date = searchData.departureDate;
    const returnDate = searchData.returnDate;
    const adults = searchData.adults;

    if (!fromAirport || !toAirport || !date || !adults) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Brak wymaganych parametrów' }),
      };
    }

    try {
      const response = await amadeus.shopping.flightOffersSearch.get({
        originLocationCode: fromAirport,
        destinationLocationCode: toAirport,
        departureDate: date,
        adults: adults,
        max:20,
      });

      let response2;

      if (returnDate !== '') {
        response2 = await amadeus.shopping.flightOffersSearch.get({
          originLocationCode: toAirport,
          destinationLocationCode: fromAirport,
          departureDate: returnDate,
          adults: adults,
          max:20,
        });
      }

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Nieprawidłowa odpowiedź z Amadeus API');
      }

      const formattedData = formatFlightData(response);
      let formattedData2;

      if (returnDate !== '') {
        formattedData2 = formatFlightData(response2);
      }

      const responseData = {
        pure: response.data,
        flightData: formattedData,
        searchData: searchData,
        flightData2: formattedData2,
      };

      if (returnDate !== '') {
        responseData.pure2 = response2.data;
      }

      return {
        statusCode: 200,
        body: JSON.stringify(responseData),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Wystąpił błąd podczas wyszukiwania lotów', errorMes: error.message }),
      };
    }

  return {
    statusCode: 404,
    body: 'Not Found',
  };
};
