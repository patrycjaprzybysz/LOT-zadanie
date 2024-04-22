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
  'New York': 'JFK',
  'Los Angeles': 'LAX',
  'Chicago': 'ORD',
  'San Francisco': 'SFO',
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
  'Vilnius': 'VNO',
  'Zagreb': 'ZAG',
  'Skopje': 'SKP',
  'Minsk': 'MSQ',
  'Edinburgh': 'EDI',
  'Manchester': 'MAN',
  'Glasgow': 'GLA',
  'Hamburg': 'HAM',
  'Nice': 'NCE',
  'Krakow': 'KRK',
  'Geneva': 'GVA',
  'Naples': 'NAP',
  'Marseille': 'MRS',
  'Luxembourg': 'LUX',
  'Moscow': 'SVO',
  'Saint Petersburg': 'LED',
  'Birmingham': 'BHX',
  'Brussels Charleroi': 'CRL',
  'Lyon': 'LYS',
  'Porto': 'OPO',
  'Mykonos': 'JMK',
  'Rhodes': 'RHO',
  'Thessaloniki': 'SKG',
  'Chania': 'CHQ',
  'Corfu': 'CFU',
  'Santorini': 'JTR',
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
  
};

exports.handler = async (event) => {
  const { httpMethod, queryStringParameters, body } = event;

  if (httpMethod === 'GET' && event.path === '/') {
    return {
      statusCode: 200,
      body: 'Serwer działa',
    };
  }

  if (httpMethod === 'GET' && event.path === '/searchFlights') {
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
      });

      let response2;

      if (returnDate !== '') {
        response2 = await amadeus.shopping.flightOffersSearch.get({
          originLocationCode: toAirport,
          destinationLocationCode: fromAirport,
          departureDate: returnDate,
          adults: adults,
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
  }

  return {
    statusCode: 404,
    body: 'Not Found',
  };
};
