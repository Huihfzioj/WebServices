import { ServiceLocation, GovernmentService } from "@/types/establishment";

const GRAPHQL_ENDPOINT = '/graphql';

async function graphqlQuery<T>(query: string, variables?: Record<string, any>): Promise<T> {
  try {
    console.log(`[GraphQL] Query:`, query);
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    console.log(`[GraphQL Response] ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      const errorMsg = `GraphQL Error: ${response.status} - ${errorText}`;
      console.error('[GraphQL Error]', errorMsg);
      throw new Error(errorMsg);
    }

    const result = await response.json();
    console.log('[GraphQL Success]', result);
    
    if (result.errors) {
      throw new Error(`GraphQL Errors: ${JSON.stringify(result.errors)}`);
    }
    
    return result.data;
  } catch (error) {
    console.error('[GraphQL Fetch Error]', error);
    throw error;
  }
}

export const publicServicesService = {
  // Service Location queries
  async getAllLocations(): Promise<ServiceLocation[]> {
    const query = `
      query {
        getAllLocations {
          id
          locationCode
          name
          address
          city
          state
          zipCode
          phone
          mail
          website
          operatingHours
          coordinates {
            latitude
            longitude
          }
          availableServiceIds
        }
      }
    `;
    const data = await graphqlQuery<{ getAllLocations: ServiceLocation[] }>(query);
    return data.getAllLocations;
  },

  async getLocationById(id: string): Promise<ServiceLocation> {
    const query = `
      query($id: ID!) {
        getLocationById(id: $id) {
          id
          locationCode
          name
          address
          city
          state
          zipCode
          phone
          mail
          website
          operatingHours
          coordinates {
            latitude
            longitude
          }
          availableServiceIds
        }
      }
    `;
    const data = await graphqlQuery<{ getLocationById: ServiceLocation }>(query, { id });
    return data.getLocationById;
  },

  async getLocationsByCity(city: string): Promise<ServiceLocation[]> {
    const query = `
      query($city: String!) {
        getLocationsByCity(city: $city) {
          id
          locationCode
          name
          address
          city
          state
          zipCode
          phone
          mail
          website
          operatingHours
          coordinates {
            latitude
            longitude
          }
          availableServiceIds
        }
      }
    `;
    const data = await graphqlQuery<{ getLocationsByCity: ServiceLocation[] }>(query, { city });
    return data.getLocationsByCity;
  },

  // Government Service queries
  async getAllServices(): Promise<GovernmentService[]> {
    const query = `
      query {
        getAllServices {
          id
          serviceCode
          name
          description
          detailedDescription
          type
          category
          requiredDocuments
          processingTimeDays
          fees
          eligibilityCriteria
          availableOnline
          onlinePortalUrl
          isActive
          createdDate
          lastUpdated
        }
      }
    `;
    const data = await graphqlQuery<{ getAllServices: GovernmentService[] }>(query);
    return data.getAllServices;
  },

  async getServiceById(id: string): Promise<GovernmentService> {
    const query = `
      query($id: ID!) {
        getServiceById(id: $id) {
          id
          serviceCode
          name
          description
          detailedDescription
          type
          category
          requiredDocuments
          processingTimeDays
          fees
          eligibilityCriteria
          availableOnline
          onlinePortalUrl
          isActive
          createdDate
          lastUpdated
        }
      }
    `;
    const data = await graphqlQuery<{ getServiceById: GovernmentService }>(query, { id });
    return data.getServiceById;
  },

  async getServicesByCategory(category: string): Promise<GovernmentService[]> {
    const query = `
      query($category: ServiceCategory!) {
        getServicesByCategory(category: $category) {
          id
          serviceCode
          name
          description
          type
          category
          fees
          availableOnline
          isActive
        }
      }
    `;
    const data = await graphqlQuery<{ getServicesByCategory: GovernmentService[] }>(query, { category });
    return data.getServicesByCategory;
  },
};
